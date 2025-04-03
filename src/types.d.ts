/**
 * Declaration file for custom module types
 */

/**
 * Declaration for importing markdown files
 * This allows TypeScript to understand imports for .md files
 */
declare module '*.md' {
  const content: string;
  export default content;
}

/**
 * Declaration for template files
 * This helps TypeScript ignore template placeholders
 */
declare module '*.template.ts' {
  const content: any;
  export default content;
}
