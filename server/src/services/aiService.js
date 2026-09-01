const axios = require('axios');
const crypto = require('crypto');
const env = require('../config/env');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

const SYSTEM_PROMPT = `You are a strict, senior static-analysis code review engine.
You ONLY respond with a single valid JSON object — no markdown fences, no prose,
no explanation outside the JSON.

Analyze the submitted code snippet and return an object with this EXACT shape:

{
  "findings": [
    {
      "type": "security" | "bug" | "performance" | "style" | "complexity",
      "severity": "critical" | "high" | "medium" | "low" | "info",
      "line": number | null,
      "title": string (max 200 chars),
      "description": string (max 2000 chars),
      "suggestion": string (max 2000 chars)
    }
  ],
  "timeComplexity": string (Big-O notation, e.g. "O(n log n)"),
  "spaceComplexity": string (Big-O notation, e.g. "O(n)"),
  "summary": string (max 3000 chars, a concise overview of code quality),
  "overallScore": number (0-100, where 100 is flawless production-grade code)
}

Rules:
- Identify concrete security flaws (injection, unsafe deserialization, secrets in code,
  broken auth, unsanitized input, insecure randomness, etc.) if present.
- Identify actual bugs (off-by-one, null/undefined handling, race conditions, incorrect logic).
- Identify performance bottlenecks (unnecessary loops, N+1 patterns, blocking I/O, unbounded recursion).
- Always compute time and space complexity of the dominant algorithm in the snippet.
- If the code has no issues in a category, do not fabricate findings for it.
- Never include markdown, backticks, or commentary — output raw JSON only.
- Cap findings at 25 items, prioritizing the most severe first.`;

const AI_TIMEOUT_MS = 30000;
const MAX_RETRIES = 2;

function hashCode(code) {
  return crypto.createHash('sha256').update(code).digest('hex');
}

function buildUserPrompt(language, code) {
  return `Language: ${language}\n\nCode:\n${code}`;
}

function extractJson(rawText) {
  const trimmed = rawText.trim();
  const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  const candidate = fenceMatch ? fenceMatch[1] : trimmed;

  try {
    return JSON.parse(candidate);
  } catch (err) {
    throw ApiError.internal('AI service returned a malformed response');
  }
}

function validateAiShape(parsed) {
  if (!parsed || typeof parsed !== 'object') {
    throw ApiError.internal('AI response was not a valid object');
  }
  if (!Array.isArray(parsed.findings)) {
    throw ApiError.internal('AI response missing findings array');
  }
  const validTypes = new Set(['security', 'bug', 'performance', 'style', 'complexity']);
  const validSeverities = new Set(['critical', 'high', 'medium', 'low', 'info']);

  const sanitizedFindings = parsed.findings
    .filter((f) => f && validTypes.has(f.type) && validSeverities.has(f.severity))
    .slice(0, 25)
    .map((f) => ({
      type: f.type,
      severity: f.severity,
      line: typeof f.line === 'number' ? f.line : null,
      title: String(f.title || '').slice(0, 200),
      description: String(f.description || '').slice(0, 2000),
      suggestion: String(f.suggestion || '').slice(0, 2000),
    }));

  return {
    findings: sanitizedFindings,
    timeComplexity: String(parsed.timeComplexity || 'N/A').slice(0, 100),
    spaceComplexity: String(parsed.spaceComplexity || 'N/A').slice(0, 100),
    summary: String(parsed.summary || '').slice(0, 3000),
    overallScore: Math.min(100, Math.max(0, Number(parsed.overallScore) || 0)),
  };
}

async function callWithRetry(payload, attempt = 1) {
  try {
    // Gemini authenticates via a `key` query param, not a Bearer header
    const response = await axios.post(
      `${env.aiApiUrl}?key=${env.aiApiKey}`,
      payload,
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: AI_TIMEOUT_MS,
      }
    );
    return response.data;
  } catch (err) {
    const isRetryable = !err.response || err.response.status >= 500 || err.code === 'ECONNABORTED';
    if (isRetryable && attempt <= MAX_RETRIES) {
      const backoffMs = 500 * 2 ** (attempt - 1);
      logger.warn(`AI call failed (attempt ${attempt}), retrying in ${backoffMs}ms`);
      await new Promise((resolve) => setTimeout(resolve, backoffMs));
      return callWithRetry(payload, attempt + 1);
    }
    if (err.response) {
      logger.error(`AI service HTTP ${err.response.status}: ${JSON.stringify(err.response.data)}`);
    }
    throw err;
  }
}

async function analyzeCode(language, code) {
  // Gemini's request shape: system_instruction + contents[].parts[].text
  const payload = {
    system_instruction: {
      parts: [{ text: SYSTEM_PROMPT }],
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: buildUserPrompt(language, code) }],
      },
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 4000,
      responseMimeType: 'application/json',
    },
  };

  let raw;
  try {
    raw = await callWithRetry(payload);
  } catch (err) {
    logger.error(`AI service call failed: ${err.message}`);
    throw ApiError.internal('AI analysis service is currently unavailable');
  }

  const textBlock = raw?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textBlock) {
    throw ApiError.internal('AI response contained no analyzable content');
  }

  const parsed = extractJson(textBlock);
  return validateAiShape(parsed);
}

module.exports = { analyzeCode, hashCode };