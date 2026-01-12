'use client';

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  filename: string;
  code: string;
}

// Map common language aliases to Prism language names
const languageMap: Record<string, string> = {
  'js': 'javascript',
  'ts': 'typescript',
  'py': 'python',
  'rb': 'ruby',
  'sh': 'bash',
  'shell': 'bash',
  'zsh': 'bash',
  'yml': 'yaml',
  'dockerfile': 'docker',
  'text': 'plaintext',
  'txt': 'plaintext',
  'code': 'plaintext',
};

const CodeBlock: React.FC<CodeBlockProps> = ({ filename, code }) => {
  const [copyButtonText, setCopyButtonText] = useState<string>('Copy');

  // Normalize the language name
  const language = languageMap[filename.toLowerCase()] || filename.toLowerCase();

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyButtonText('Copied!');
      setTimeout(() => setCopyButtonText('Copy'), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setCopyButtonText('Failed');
      setTimeout(() => setCopyButtonText('Copy'), 2000);
    }
  };

  // Get a display-friendly language name
  const getDisplayLanguage = (lang: string): string => {
    const displayNames: Record<string, string> = {
      'javascript': 'JavaScript',
      'typescript': 'TypeScript',
      'python': 'Python',
      'bash': 'Bash',
      'shell': 'Shell',
      'json': 'JSON',
      'yaml': 'YAML',
      'markdown': 'Markdown',
      'css': 'CSS',
      'html': 'HTML',
      'sql': 'SQL',
      'go': 'Go',
      'rust': 'Rust',
      'java': 'Java',
      'csharp': 'C#',
      'cpp': 'C++',
      'c': 'C',
      'ruby': 'Ruby',
      'php': 'PHP',
      'swift': 'Swift',
      'kotlin': 'Kotlin',
      'docker': 'Dockerfile',
      'plaintext': 'Text',
      'toml': 'TOML',
      'ini': 'INI',
      'nginx': 'Nginx',
      'jsx': 'JSX',
      'tsx': 'TSX',
    };
    return displayNames[lang] || lang.charAt(0).toUpperCase() + lang.slice(1);
  };

  return (
    <div className="code-block">
      <div className="code-header">
        <div className="code-filename">{getDisplayLanguage(language)}</div>
        <div className="code-actions">
          <button
            className="code-action"
            onClick={handleCopy}
            type="button"
            aria-label="Copy code"
          >
            {copyButtonText}
          </button>
        </div>
      </div>
      <div className="code-container">
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          showLineNumbers
          wrapLines
          lineNumberStyle={{
            minWidth: '3em',
            paddingRight: '1em',
            textAlign: 'right',
            userSelect: 'none',
            opacity: 0.5,
          }}
          customStyle={{
            margin: 0,
            padding: '1rem',
            fontSize: '0.875rem',
            lineHeight: '1.6',
            borderRadius: '0 0 8px 8px',
            background: '#282c34',
          }}
          codeTagProps={{
            style: {
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace",
            }
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeBlock;
