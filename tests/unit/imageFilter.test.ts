import { ImageFilter } from '../../src/business-logic/ImageFilter';
import { FilterSettings, ImageElement, ImageAnalysis } from '../../src/types';

describe('ImageFilter', () => {
  let imageFilter: ImageFilter;
  let mockSettings: FilterSettings;
  let mockImageElement: ImageElement;
  let mockAnalysis: ImageAnalysis;

  beforeEach(() => {
    mockSettings = {
      nudityThreshold: 5,
      strictMode: false,
      allowList: [],
      blockList: [],
    };
    imageFilter = new ImageFilter(mockSettings);
    
    mockImageElement = {
      element: document.createElement('img') as HTMLImageElement,
      src: 'https://example.com/test-image.jpg',
      type: 'img',
    };

    mockAnalysis = {
      nudityLevel: 3,
      isProblematic: false,
      confidence: 0.8,
      reasons: ['Test classification'],
    };
  });

  describe('constructor', () => {
    test('should initialize with provided settings', () => {
      expect(imageFilter).toBeInstanceOf(ImageFilter);
    });
  });

  describe('applyFilter', () => {
    test('should not hide image when not problematic', () => {
      const hideSpy = jest.spyOn(imageFilter as any, 'hideImage');
      const showSpy = jest.spyOn(imageFilter as any, 'showImage');
      
      imageFilter.applyFilter(mockImageElement, mockAnalysis);
      
      expect(hideSpy).not.toHaveBeenCalled();
      expect(showSpy).toHaveBeenCalledWith(mockImageElement);
    });

    test('should hide image when problematic', () => {
      const hideSpy = jest.spyOn(imageFilter as any, 'hideImage');
      mockAnalysis.isProblematic = true;
      
      imageFilter.applyFilter(mockImageElement, mockAnalysis);
      
      expect(hideSpy).toHaveBeenCalledWith(mockImageElement);
    });

    test('should not hide image when in allow list', () => {
      mockSettings.allowList = ['example.com'];
      imageFilter = new ImageFilter(mockSettings);
      const showSpy = jest.spyOn(imageFilter as any, 'showImage');
      
      mockAnalysis.isProblematic = true;
      imageFilter.applyFilter(mockImageElement, mockAnalysis);
      
      expect(showSpy).toHaveBeenCalledWith(mockImageElement);
    });

    test('should hide image when in block list', () => {
      mockSettings.blockList = ['example.com'];
      imageFilter = new ImageFilter(mockSettings);
      const hideSpy = jest.spyOn(imageFilter as any, 'hideImage');
      
      mockAnalysis.isProblematic = false;
      imageFilter.applyFilter(mockImageElement, mockAnalysis);
      
      expect(hideSpy).toHaveBeenCalledWith(mockImageElement);
    });
  });

  describe('hideAllImages', () => {
    test('should hide all images on the page', () => {
      // Add some images to the document for testing
      const img1 = document.createElement('img');
      const img2 = document.createElement('img');
      document.body.appendChild(img1);
      document.body.appendChild(img2);
      
      imageFilter.hideAllImages();
      
      const stats = imageFilter.getStats();
      expect(stats.hiddenCount).toBeGreaterThan(0);
      
      // Clean up
      document.body.removeChild(img1);
      document.body.removeChild(img2);
    });
  });

  describe('clearAll', () => {
    test('should restore all hidden images', () => {
      // Add an image to the document
      const img = document.createElement('img');
      document.body.appendChild(img);
      
      // Hide all images first
      imageFilter.hideAllImages();
      expect(imageFilter.getStats().hiddenCount).toBeGreaterThan(0);
      
      // Then clear all
      imageFilter.clearAll();
      expect(imageFilter.getStats().hiddenCount).toBe(0);
      
      // Clean up
      document.body.removeChild(img);
    });
  });

  describe('getStats', () => {
    test('should return correct statistics', () => {
      const stats = imageFilter.getStats();
      
      expect(stats).toHaveProperty('hiddenCount');
      expect(stats).toHaveProperty('totalProcessed');
      expect(stats.hiddenCount).toBe(0);
      expect(stats.totalProcessed).toBe(0);
    });
  });

  describe('updateSettings', () => {
    test('should update settings correctly', () => {
      const newSettings = { nudityThreshold: 8 };
      imageFilter.updateSettings(newSettings);
      
      const currentSettings = imageFilter.getSettings();
      expect(currentSettings.nudityThreshold).toBe(8);
    });
  });

  describe('getSettings', () => {
    test('should return current settings', () => {
      const settings = imageFilter.getSettings();
      expect(settings.nudityThreshold).toBe(mockSettings.nudityThreshold);
      expect(settings.strictMode).toBe(mockSettings.strictMode);
    });
  });
});