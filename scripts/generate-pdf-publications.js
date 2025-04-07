/**
 * Script to automatically generate publication entries for PDF files
 *
 * This script scans the public/posts directory for PDF files,
 * generates publication entries, and merges them with the
 * existing publications in publicationsConfig.ts.
 *
 * Usage: node generate-pdf-publications.js
 *
 * Required packages:
 *   - fs-extra: Enhanced file system operations
 *   - glob: For file pattern matching
 *   - path: For file path manipulation
 *
 * Install dependencies:
 *   npm install fs-extra glob
 */

const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

/**
 * Main function to generate PDF publication entries
 */
async function generatePdfPublications() {
  // Find all PDF files in public/posts directory
  const publicDir = path.join(__dirname, '../public');
  const postsDir = path.join(publicDir, 'posts');
  const pdfFiles = glob.sync(path.join(postsDir, '*.pdf'));

  console.log(`Found ${pdfFiles.length} PDF files in ${postsDir}`);

  // Path to the publications config file
  const configPath = path.join(__dirname, '../src/config/publicationsConfig.ts');

  // Read the current publications config
  let configContent = await fs.readFile(configPath, 'utf8');

  // Extract the existing publications array
  const publicationsMatch = configContent.match(/publications:\s*\[([\s\S]*?)(\s*\]\s*as\s*Publication\[\])/);

  if (!publicationsMatch) {
    console.error('Could not find publications array in config file');
    return;
  }

  // Extract the content of the publications array and the closing bracket
  const existingPublications = publicationsMatch[1];
  const closingBracket = publicationsMatch[2];

  // Generate new publication entries
  const newPublications = [];

  for (const pdfFile of pdfFiles) {
    const filename = path.basename(pdfFile);
    const fileBaseName = path.basename(pdfFile, '.pdf');

    // Skip if this PDF is already in the config (check by filename)
    const pdfUrlPattern = new RegExp(`pdfUrl:\\s*["']/posts/${filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`);
    if (pdfUrlPattern.test(configContent)) {
      console.log(`Publication for ${filename} already exists, skipping...`);
      continue;
    }

    // Generate ID from filename
    const id = fileBaseName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Format title from filename
    const title = fileBaseName
      .replace(/[-_]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Check if thumbnail exists
    const thumbnailPath = `/posts/thumbnails/${fileBaseName}.png`;
    const thumbnailExists = await fs.pathExists(path.join(publicDir, thumbnailPath.substring(1)));

    // Get file creation or modification date
    const stats = await fs.stat(pdfFile);
    const date = stats.mtime || stats.ctime || new Date();
    const formattedDate = date.toISOString().split('T')[0];

    // Generate publication entry
    const publicationEntry = {
      id,
      type: 'report',
      title,
      authors: 'Benjamin Labaschin',
      venue: 'Self-published',
      date: formattedDate,
      abstract: `Report on ${title.toLowerCase()}.`,
      pdfUrl: `/posts/${filename}`,
      ...(thumbnailExists ? { coverImage: thumbnailPath } : {}),
      topics: ['Report', title.split(' ')[0]],
      featured: false
    };

    newPublications.push(publicationEntry);
    console.log(`Generated publication entry for ${filename}`);
  }

  if (newPublications.length === 0) {
    console.log('No new PDF publications to add');
    return;
  }

  // Format new entries as JSON with proper indentation
  const formattedEntries = newPublications.map(entry => {
    return `    {
      id: "${entry.id}",
      type: "${entry.type}",
      title: "${entry.title}",
      authors: "${entry.authors}",
      venue: "${entry.venue}",
      date: "${entry.date}",
      abstract: "${entry.abstract}",
      pdfUrl: "${entry.pdfUrl}",
      ${entry.coverImage ? `coverImage: "${entry.coverImage}",` : ''}
      topics: ${JSON.stringify(entry.topics)},
      featured: ${entry.featured}
    }`;
  }).join(',\n');

  // Combine existing and new publications
  let updatedConfig;
  if (existingPublications.trim().endsWith(',')) {
    // If existing publications end with a comma, just append
    updatedConfig = configContent.replace(
      publicationsMatch[0],
      `publications: [${existingPublications}\n${formattedEntries}${closingBracket}`
    );
  } else if (existingPublications.trim()) {
    // If there are existing publications but no trailing comma, add one
    updatedConfig = configContent.replace(
      publicationsMatch[0],
      `publications: [${existingPublications},\n${formattedEntries}${closingBracket}`
    );
  } else {
    // If publications array is empty
    updatedConfig = configContent.replace(
      publicationsMatch[0],
      `publications: [\n${formattedEntries}${closingBracket}`
    );
  }

  // Write the updated config back to the file
  await fs.writeFile(configPath, updatedConfig, 'utf8');
  console.log(`Added ${newPublications.length} new publications to config`);
}

// Execute the main function
generatePdfPublications()
  .then(() => {
    console.log('Publication generation complete!');
  })
  .catch((error) => {
    console.error('Error generating publications:', error);
    process.exit(1);
  });
