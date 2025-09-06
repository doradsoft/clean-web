/**
 * Main entry point for the clean-web extension
 */

const { ImageFilter } = require('./imageFilter');

// Initialize the image filter
const imageFilter = new ImageFilter();

// Export the main functionality
module.exports = {
  ImageFilter,
  imageFilter
};