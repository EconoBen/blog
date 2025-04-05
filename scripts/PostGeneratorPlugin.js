/**
 * Webpack plugin to automatically regenerate PostService.ts when markdown files change
 */
const fs = require('fs');
const path = require('path');
const { generatePostService } = require('./generate-post-imports');

class PostGeneratorPlugin {
  constructor() {
    // Track last generation time to debounce rapid executions
    this.lastGenerationTime = 0;
    this.debounceTime = 2000; // 2 seconds
  }

  shouldGenerate() {
    const now = Date.now();
    // If more than debounceTime has passed since last generation
    if (now - this.lastGenerationTime > this.debounceTime) {
      this.lastGenerationTime = now;
      return true;
    }
    return false;
  }

  apply(compiler) {
    // Hook into the emit phase
    compiler.hooks.emit.tapAsync('PostGeneratorPlugin', (compilation, callback) => {
      // Check if any markdown files changed
      const changedFiles = Array.from(compilation.fileDependencies)
        .filter(file => file.endsWith('.md') && file.includes('/posts/'));

      if (changedFiles.length > 0 && this.shouldGenerate()) {
        console.log('Markdown files changed, regenerating PostService.ts...');

        try {
          // Regenerate the post service
          generatePostService();
          console.log('PostService.ts regenerated successfully.');
        } catch (error) {
          console.error('Failed to regenerate PostService.ts:', error);
        }
      }

      callback();
    });

    // Also run once at the start
    compiler.hooks.beforeCompile.tapAsync('PostGeneratorPlugin', (compilation, callback) => {
      if (this.shouldGenerate()) {
        console.log('Initial generation of PostService.ts...');

        try {
          generatePostService();
          console.log('PostService.ts generated successfully.');
        } catch (error) {
          console.error('Failed to generate PostService.ts:', error);
        }
      }

      callback();
    });
  }
}

module.exports = PostGeneratorPlugin;
