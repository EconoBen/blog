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

/**
 * Interface for a talk/presentation
 */
export interface Talk {
  /** Unique identifier for the talk */
  id: string;
  /** Title of the talk */
  title: string;
  /** Brief description of the talk */
  description: string;
  /** Date when the talk was given (ISO string) */
  date: string;
  /** YouTube video ID */
  youtubeId: string;
  /** Event or conference name */
  event: string;
  /** Array of topics/tags related to the talk */
  topics: string[];
  /** Optional thumbnail URL (if not using default YouTube thumbnail) */
  thumbnail?: string;
}

/**
 * Interface for a publication
 */
export interface Publication {
  /** Unique identifier for the publication */
  id: string;
  /** Publication title */
  title: string;
  /** Publication type: 'book', 'journal', 'conference', 'workshop', 'report', etc. */
  type: string;
  /** Complete list of authors (formatted string) */
  authors: string;
  /** Publication venue (journal name, conference name, publisher) */
  venue: string;
  /** Publication date (ISO string) */
  date: string;
  /** Abstract or brief description */
  abstract: string;
  /** URL to publication page */
  url?: string;
  /** Digital Object Identifier */
  doi?: string;
  /** URL to PDF or download */
  pdfUrl?: string;
  /** Cover image or thumbnail */
  coverImage?: string;
  /** Citation count if available */
  citations?: number;
  /** Is this a featured publication */
  featured?: boolean;
  /** Array of topics/keywords */
  topics: string[];
  /** BibTeX citation */
  bibtex?: string;
}
