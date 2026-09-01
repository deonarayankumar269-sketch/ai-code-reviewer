const { z } = require('zod');

const SUPPORTED_LANGUAGES = [
  'javascript', 'typescript', 'python', 'java', 'c', 'cpp',
  'csharp', 'go', 'rust', 'php', 'ruby',
];

const createReviewSchema = z.object({
  body: z.object({
    language: z.enum(SUPPORTED_LANGUAGES, {
      errorMap: () => ({ message: `Language must be one of: ${SUPPORTED_LANGUAGES.join(', ')}` }),
    }),
    code: z
      .string()
      .min(10, 'Code snippet is too short to analyze')
      .max(50000, 'Code snippet exceeds the 50,000 character limit'),
  }),
});

const paginationSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
  }),
});

module.exports = { createReviewSchema, paginationSchema, SUPPORTED_LANGUAGES };