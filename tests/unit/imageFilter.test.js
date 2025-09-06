const { ImageFilter } = require('../../src/imageFilter');

describe('ImageFilter', () => {
  let imageFilter;

  beforeEach(() => {
    imageFilter = new ImageFilter();
  });

  describe('constructor', () => {
    test('should initialize with empty sets', () => {
      expect(imageFilter.blockedImages.size).toBe(0);
      expect(imageFilter.allowedImages.size).toBe(0);
    });
  });

  describe('shouldBlockImage', () => {
    test('should return false for invalid inputs', () => {
      expect(imageFilter.shouldBlockImage()).toBe(false);
      expect(imageFilter.shouldBlockImage(null)).toBe(false);
      expect(imageFilter.shouldBlockImage('')).toBe(false);
      expect(imageFilter.shouldBlockImage(123)).toBe(false);
    });

    test('should return true for blocked images', () => {
      const imageSrc = 'https://example.com/blocked-image.jpg';
      imageFilter.blockImage(imageSrc);
      expect(imageFilter.shouldBlockImage(imageSrc)).toBe(true);
    });

    test('should return false for allowed images', () => {
      const imageSrc = 'https://example.com/allowed-image.jpg';
      imageFilter.allowImage(imageSrc);
      expect(imageFilter.shouldBlockImage(imageSrc)).toBe(false);
    });

    test('should return false for unknown images by default', () => {
      const imageSrc = 'https://example.com/unknown-image.jpg';
      expect(imageFilter.shouldBlockImage(imageSrc)).toBe(false);
    });
  });

  describe('blockImage', () => {
    test('should add image to blocked list', () => {
      const imageSrc = 'https://example.com/test-image.jpg';
      imageFilter.blockImage(imageSrc);
      expect(imageFilter.blockedImages.has(imageSrc)).toBe(true);
    });

    test('should remove image from allowed list when blocked', () => {
      const imageSrc = 'https://example.com/test-image.jpg';
      imageFilter.allowImage(imageSrc);
      imageFilter.blockImage(imageSrc);
      expect(imageFilter.allowedImages.has(imageSrc)).toBe(false);
      expect(imageFilter.blockedImages.has(imageSrc)).toBe(true);
    });

    test('should handle invalid inputs gracefully', () => {
      imageFilter.blockImage();
      imageFilter.blockImage(null);
      imageFilter.blockImage('');
      imageFilter.blockImage(123);
      expect(imageFilter.blockedImages.size).toBe(0);
    });
  });

  describe('allowImage', () => {
    test('should add image to allowed list', () => {
      const imageSrc = 'https://example.com/test-image.jpg';
      imageFilter.allowImage(imageSrc);
      expect(imageFilter.allowedImages.has(imageSrc)).toBe(true);
    });

    test('should remove image from blocked list when allowed', () => {
      const imageSrc = 'https://example.com/test-image.jpg';
      imageFilter.blockImage(imageSrc);
      imageFilter.allowImage(imageSrc);
      expect(imageFilter.blockedImages.has(imageSrc)).toBe(false);
      expect(imageFilter.allowedImages.has(imageSrc)).toBe(true);
    });

    test('should handle invalid inputs gracefully', () => {
      imageFilter.allowImage();
      imageFilter.allowImage(null);
      imageFilter.allowImage('');
      imageFilter.allowImage(123);
      expect(imageFilter.allowedImages.size).toBe(0);
    });
  });

  describe('getStats', () => {
    test('should return correct statistics', () => {
      imageFilter.blockImage('https://example.com/blocked1.jpg');
      imageFilter.blockImage('https://example.com/blocked2.jpg');
      imageFilter.allowImage('https://example.com/allowed1.jpg');

      const stats = imageFilter.getStats();
      expect(stats.blocked).toBe(2);
      expect(stats.allowed).toBe(1);
      expect(stats.total).toBe(3);
    });

    test('should return zero stats for empty filter', () => {
      const stats = imageFilter.getStats();
      expect(stats.blocked).toBe(0);
      expect(stats.allowed).toBe(0);
      expect(stats.total).toBe(0);
    });
  });

  describe('reset', () => {
    test('should clear all filters', () => {
      imageFilter.blockImage('https://example.com/blocked.jpg');
      imageFilter.allowImage('https://example.com/allowed.jpg');
      
      imageFilter.reset();
      
      expect(imageFilter.blockedImages.size).toBe(0);
      expect(imageFilter.allowedImages.size).toBe(0);
      
      const stats = imageFilter.getStats();
      expect(stats.total).toBe(0);
    });
  });
});