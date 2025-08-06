'use client';

import React, { useState } from 'react';

interface CodeBlockProps {
  filename: string;
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ filename, code }) => {
  const [copyButtonText, setCopyButtonText] = useState<string>('Copy');

  // Split code into lines, ensuring no empty lines at the end cause layout issues
  const codeLines = code.trimEnd().split('\n');

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(code);
      // Visual feedback
      setCopyButtonText('Copied!');

      // Reset after 2 seconds
      setTimeout(() => {
        setCopyButtonText('Copy');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setCopyButtonText('Failed to copy');

      setTimeout(() => {
        setCopyButtonText('Copy');
      }, 2000);
    }
  };

  return (
    <div className="code-block">
      <div className="code-header">
        <div className="code-filename">{filename}</div>
        <div className="code-actions">
          <button
            className="code-action"
            onClick={handleCopy}
            type="button"
            aria-label={`Copy code from ${filename}`}
          >
            {copyButtonText}
          </button>
        </div>
      </div>
      <div className="code-container">
        <pre className="code-pre">
          <table className="code-table">
            <tbody>
              {codeLines.map((line, index) => (
                <tr key={index} className="code-row">
                  <td className="line-number">{index + 1}</td>
                  <td className="code-line">{line || ' '}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;