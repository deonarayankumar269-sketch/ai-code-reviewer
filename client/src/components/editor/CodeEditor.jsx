import { memo } from 'react';
import Editor from '@monaco-editor/react';

const SUPPORTED_LANGUAGES = [
  'javascript', 'typescript', 'python', 'java', 'c', 'cpp',
  'csharp', 'go', 'rust', 'php', 'ruby',
];

function CodeEditor({ code, language, onCodeChange, onLanguageChange, disabled }) {
  return (
    <div>
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          disabled={disabled}
          aria-label="Select programming language"
          className="bg-slate-800 text-white text-sm rounded-md px-2.5 py-1.5 outline-none border border-slate-700 focus:ring-2 focus:ring-indigo-500"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
        <span className="text-xs text-slate-500">{code.length} / 50000</span>
      </div>
      <Editor
        height="480px"
        language={language === 'cpp' ? 'cpp' : language}
        value={code}
        onChange={(value) => onCodeChange(value ?? '')}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          readOnly: disabled,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}

export default memo(CodeEditor);