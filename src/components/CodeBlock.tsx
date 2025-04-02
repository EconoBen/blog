import React, { useState } from 'react';

/**
 * Props for the CodeBlock component
 *
 * @interface CodeBlockProps
 * @property {string} filename - The name of the file being displayed
 * @property {string} code - The code content to display
 */
interface CodeBlockProps {
  filename: string;
  code: string;
}

/**
 * CodeBlock component for displaying code with syntax highlighting and copy button
 *
 * @param {CodeBlockProps} props - Component properties
 * @returns {JSX.Element} The rendered CodeBlock component
 */
const CodeBlock: React.FC<CodeBlockProps> = ({ filename, code }) => {
  const [copyButtonText, setCopyButtonText] = useState<string>('Copy');

  // Split code into lines
  const codeLines = code.split('\n');

  /**
   * Handles copying the code to clipboard
   */
  const handleCopy = (): void => {
    navigator.clipboard.writeText(code).then(() => {
      // Visual feedback
      setCopyButtonText('Copied!');

      // Reset after 2 seconds
      setTimeout(() => {
        setCopyButtonText('Copy');
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <div className="code-block">
      <div className="code-header">
        <div className="code-filename">{filename}</div>
        <div className="code-actions">
          <div className="code-action" onClick={handleCopy}>{copyButtonText}</div>
        </div>
      </div>
      <div className="code-container">
        <div className="line-numbers">
          {codeLines.map((_, index) => (
            <span key={index}>{index + 1}</span>
          ))}
        </div>
        <div className="code-content">
          {codeLines.map((line, index) => (
            <div className="code-line" key={index}>
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CodeBlock;
