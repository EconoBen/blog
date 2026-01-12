#!/usr/bin/env node

/**
 * Fetch GitHub Gists and generate workshop configuration
 * 
 * Gist Description Format:
 * [workshop] category:shell tags:bash,productivity - Title here
 * Note: We still use [workshop] tag for backwards compatibility
 */

const https = require('https');
const fs = require('fs-extra');
const path = require('path');

// Configuration
const GITHUB_USERNAME = 'econoben'; // Your GitHub username
const GIST_TAG = '[workshop]'; // Tag to identify workshop gists
const OUTPUT_FILE = path.join(__dirname, '../app/config/workshopGists.ts');
const CACHE_FILE = path.join(__dirname, '../.gist-cache.json');

// Category mapping
const CATEGORY_MAP = {
  'shell': { id: 'shell', label: 'Shell', icon: '🐚' },
  'python': { id: 'python', label: 'Python', icon: '🐍' },
  'git': { id: 'git', label: 'Git', icon: '📦' },
  'data-science': { id: 'data-science', label: 'Data Science', icon: '📊' },
  'devops': { id: 'devops', label: 'DevOps', icon: '🚀' },
  'productivity': { id: 'productivity', label: 'Productivity', icon: '⚡' },
};

/**
 * Fetch gists from GitHub API
 */
async function fetchGists(username) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/users/${username}/gists?per_page=100`,
      headers: {
        'User-Agent': 'workshop-gist-fetcher',
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

/**
 * Fetch individual gist with full file contents
 */
async function fetchGistDetails(gistId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/gists/${gistId}`,
      headers: {
        'User-Agent': 'workshop-gist-fetcher',
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

/**
 * Parse gist description for metadata
 */
function parseGistMetadata(description) {
  if (!description || !description.includes(GIST_TAG)) {
    return null;
  }

  // Remove [workshop] tag
  const content = description.replace(GIST_TAG, '').trim();
  
  // Parse format: category:shell tags:bash,zsh - Title
  const metadataRegex = /category:(\S+)\s+tags:(\S+)\s*-\s*(.+)/;
  const match = content.match(metadataRegex);
  
  if (!match) {
    // Fallback: just use description as title
    return {
      category: 'general',
      tags: [],
      title: content
    };
  }

  const [, category, tagString, title] = match;
  const tags = tagString.split(',').map(t => t.trim());

  return {
    category: category || 'general',
    tags,
    title: title.trim()
  };
}

/**
 * Get the primary language from gist files
 */
function getGistLanguage(files) {
  const fileList = Object.values(files);
  if (fileList.length === 0) return 'text';
  
  const language = fileList[0].language;
  if (!language) return 'text';
  
  // Map GitHub languages to our categories
  const languageMap = {
    'Shell': 'bash',
    'Python': 'python',
    'JavaScript': 'javascript',
    'TypeScript': 'typescript',
  };
  
  return languageMap[language] || language.toLowerCase();
}

/**
 * Load cached AI improvements
 */
function loadCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('Error loading cache:', e.message);
  }
  return {};
}

/**
 * Save cached AI improvements
 */
function saveCache(cache) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch (e) {
    console.error('Error saving cache:', e.message);
  }
}

/**
 * Call OpenAI API to improve title and description
 */
async function improveWithAI(content, filename, currentTitle, gistId) {
  // Check cache first
  const cache = loadCache();
  if (cache[gistId]) {
    console.log(`  Using cached AI content for: "${cache[gistId].title}"`);
    return cache[gistId];
  }
  if (!process.env.OPENAI_TOKEN) {
    console.log('  No OPENAI_TOKEN found, using original title and description');
    return { title: currentTitle, description: currentTitle };
  }

  const prompt = `Given this code snippet from file "${filename}":

${content}

Generate:
1. A concise, descriptive title (max 50 chars)
2. A one-sentence description explaining what this code does and when to use it

Format your response as JSON:
{"title": "...", "description": "..."}`;

  const requestData = JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a technical writer who creates clear, concise titles and descriptions for code snippets.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.3,
    max_tokens: 150
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.openai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_TOKEN}`,
        'Content-Length': Buffer.byteLength(requestData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.error) {
            console.error('  OpenAI API error:', response.error.message);
            resolve({ title: currentTitle, description: currentTitle });
            return;
          }
          
          let content = response.choices[0].message.content;
          
          // Remove markdown code block formatting if present
          content = content.replace(/^```json\s*\n?/, '').replace(/\n?```\s*$/, '');
          
          const result = JSON.parse(content);
          console.log(`  AI generated: "${result.title}"`);
          
          // Save to cache
          const cache = loadCache();
          cache[gistId] = result;
          saveCache(cache);
          
          resolve(result);
        } catch (e) {
          console.error('  Error parsing OpenAI response:', e.message);
          resolve({ title: currentTitle, description: currentTitle });
        }
      });
    });

    req.on('error', (e) => {
      console.error('  OpenAI request error:', e.message);
      resolve({ title: currentTitle, description: currentTitle });
    });

    req.write(requestData);
    req.end();
  });
}

/**
 * Convert gist to workshop item
 */
async function gistToWorkshopItem(gist) {
  const metadata = parseGistMetadata(gist.description);
  if (!metadata) return null;

  // Get the first file's content
  const files = Object.values(gist.files);
  if (files.length === 0) return null;
  
  const primaryFile = files[0];
  const language = getGistLanguage(gist.files);

  // Get AI-improved title and description
  const aiContent = await improveWithAI(
    primaryFile.content, 
    primaryFile.filename,
    metadata.title,
    gist.id
  );

  return {
    id: `gist-${gist.id}`,
    title: aiContent.title,
    description: aiContent.description,
    category: metadata.category,
    tags: metadata.tags,
    language: language,
    content: primaryFile.content,
    date: new Date(gist.created_at),
    gistUrl: gist.html_url,
    gistId: gist.id,
    filename: primaryFile.filename
  };
}

/**
 * Generate TypeScript configuration file
 */
async function generateConfig(items) {
  const validItems = items.filter(Boolean);
  
  const content = `/**
 * Auto-generated from GitHub Gists
 * 
 * To add a new snippet:
 * 1. Create a gist with description format:
 *    [workshop] category:shell tags:bash,productivity - Your title here
 * 2. Run: npm run fetch-gists
 */

export interface WorkshopItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  language?: string;
  content: string;
  date: Date;
  featured?: boolean;
  gistUrl?: string;
  gistId?: string;
  filename?: string;
}

export const gistItems: WorkshopItem[] = ${JSON.stringify(validItems, null, 2)
    .replace(/"date":\s*"([^"]+)"/g, '"date": new Date("$1")')};

export const gistCategories = ${JSON.stringify(Array.from(new Set(validItems.map(item => item.category))).map(cat => CATEGORY_MAP[cat] || { id: cat, label: cat, icon: '📝' }), null, 2)};
`;

  await fs.writeFile(OUTPUT_FILE, content);
  console.log(`✅ Generated ${OUTPUT_FILE} with ${validItems.length} workshop items`);
}

/**
 * Main function
 */
async function main() {
  try {
    console.log(`Fetching gists for ${GITHUB_USERNAME}...`);
    const gists = await fetchGists(GITHUB_USERNAME);
    
    console.log(`Found ${gists.length} total gists`);
    
    // Filter workshop gists
    const workshopGists = gists.filter(gist => 
      gist.description && gist.description.includes(GIST_TAG)
    );
    
    console.log(`Found ${workshopGists.length} workshop gists`);
    
    // Fetch full details for each workshop gist
    const workshopItems = [];
    for (const gist of workshopGists) {
      console.log(`Fetching details for: ${gist.description}`);
      const fullGist = await fetchGistDetails(gist.id);
      const item = await gistToWorkshopItem(fullGist);
      if (item) {
        workshopItems.push(item);
      }
    }
    
    await generateConfig(workshopItems);
    
    // Log categories found
    const categories = new Set(workshopItems.map(item => item.category));
    console.log('Categories found:', Array.from(categories).join(', '));
    
  } catch (error) {
    console.error('Error fetching gists:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}