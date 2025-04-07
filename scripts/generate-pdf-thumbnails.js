/**
 * Script to generate thumbnail images from the first page of PDFs
 *
 * This script scans the public/posts directory for PDF files,
 * extracts the first page of each PDF as an image, and saves
 * it as a thumbnail image in the thumbnails directory.
 *
 * Usage: node generate-pdf-thumbnails.js
 *
 * Required packages:
 *   - fs-extra: Enhanced file system operations
 *   - glob: For file pattern matching
 *
 * Install dependencies:
 *   npm install fs-extra glob
 *
 * System requirements:
 *   - poppler-utils (contains pdftoppm, pdftocairo)
 *     Install with:
 *       macOS: brew install poppler
 *       Ubuntu/Debian: apt-get install poppler-utils
 */

const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const { execSync } = require('child_process');

/**
 * Check if running in Vercel environment
 *
 * @returns {boolean} True if running in Vercel
 */
function isVercelEnvironment() {
  return process.env.VERCEL === '1' || process.env.NOW_REGION || process.env.VERCEL_REGION;
}

/**
 * Converts the first page of a PDF to an image thumbnail using pdftoppm
 *
 * @param {string} pdfPath - Path to the PDF file
 * @param {string} outputPath - Path to save the thumbnail image
 * @returns {Promise<void>}
 */
async function convertFirstPageToThumbnail(pdfPath, outputPath) {
  try {
    // Get the output directory and base name
    const outputDir = path.dirname(outputPath);
    const outputBaseName = path.basename(outputPath, '.png');
    const tempOutputPath = path.join(outputDir, outputBaseName + '-temp');

    // Use pdftoppm to convert first page to png
    console.log(`Executing pdftoppm to convert ${pdfPath} to image...`);
    execSync(`pdftoppm -png -singlefile -f 1 -l 1 -scale-to 800 "${pdfPath}" "${tempOutputPath}"`, {
      stdio: 'inherit' // Show output for debugging
    });

    // The output file will be tempOutputPath.png
    const tempFilePath = `${tempOutputPath}.png`;

    // Check if the file was created
    if (fs.existsSync(tempFilePath)) {
      // Move the file to the desired location
      await fs.move(tempFilePath, outputPath, { overwrite: true });
      console.log(`Successfully converted PDF to image at ${outputPath}`);
    } else {
      throw new Error(`pdftoppm did not create the expected output file: ${tempFilePath}`);
    }
  } catch (error) {
    console.error(`Error converting PDF to image: ${error.message}`);
    throw error;
  }
}

/**
 * Main function to generate thumbnails
 */
async function generatePdfThumbnails() {
  // Skip PDF processing in Vercel environment
  if (isVercelEnvironment()) {
    console.log('Running in Vercel environment, skipping PDF thumbnail generation.');
    return;
  }

  // Find all PDF files in public/posts directory
  const publicDir = path.join(__dirname, '../public');
  const postsDir = path.join(publicDir, 'posts');
  const thumbnailsDir = path.join(postsDir, 'thumbnails');
  const pdfFiles = glob.sync(path.join(postsDir, '*.pdf'));

  console.log(`Found ${pdfFiles.length} PDF files in ${postsDir}`);

  // Create thumbnails directory if it doesn't exist
  await fs.ensureDir(thumbnailsDir);

  // Process each PDF file
  for (const pdfFile of pdfFiles) {
    const filename = path.basename(pdfFile);
    const fileBaseName = path.basename(pdfFile, '.pdf');
    const thumbnailPath = path.join(thumbnailsDir, `${fileBaseName}.png`);

    // Force regenerate
    if (await fs.pathExists(thumbnailPath)) {
      console.log(`Removing existing thumbnail for ${filename}...`);
      await fs.remove(thumbnailPath);
    }

    try {
      console.log(`Generating thumbnail for ${filename}...`);
      await convertFirstPageToThumbnail(pdfFile, thumbnailPath);
      console.log(`Created thumbnail at ${thumbnailPath}`);
    } catch (error) {
      console.error(`Failed to generate thumbnail for ${filename}: ${error.message}`);
    }
  }

  console.log('Thumbnail generation complete.');
}

// Execute the main function
generatePdfThumbnails()
  .then(() => {
    console.log('All thumbnails generated successfully.');
  })
  .catch((error) => {
    console.error('Error generating thumbnails:', error);
    process.exit(1);
  });
