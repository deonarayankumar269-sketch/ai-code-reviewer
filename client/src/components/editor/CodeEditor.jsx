import { memo } from 'react';
import Editor from '@monaco-editor/react';
import { useTheme } from '../../context/ThemeContext';

const SUPPORTED_LANGUAGES = [
  'javascript', 'typescript', 'python', 'java', 'c', 'cpp',
  'csharp', 'go', 'rust', 'php', 'ruby',
];

function CodeEditor({ code, language, onCodeChange, onLanguageChange, disabled }) {
  const { tokens } = useTheme();

  return (
    <div>
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{
          background: tokens.editorHeaderBg,
          borderBottom: `1px solid ${tokens.lineColor}`,
        }}
      >
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          disabled={disabled}
          aria-label="Select programming language"
          className="text-sm rounded-lg px-3 py-1.5 outline-none transition-shadow"
          style={{
            backgroundColor: tokens.editorSelectBg,
            color: tokens.textPrimary,
            border: `1px solid ${tokens.inputBorder}`,
          }}
          onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 2px ${tokens.accent}55`)}
          onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
        <span className="text-xs tabular-nums" style={{ color: tokens.textMuted }}>
          {code.length} / 50000
        </span>
      </div>
      <Editor
        height="480px"
        language={language === 'cpp' ? 'cpp' : language}
        value={code}
        onChange={(value) => onCodeChange(value ?? '')}
        theme={tokens.monacoTheme}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          readOnly: disabled,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 16 },
        }}
      />
    </div>
  );
}

export default memo(CodeEditor);