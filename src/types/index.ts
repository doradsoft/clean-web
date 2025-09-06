export interface ImageAnalysis {
  nudityLevel: number; // 0-10 scale
  isProblematic: boolean;
  confidence: number; // 0-1 scale
  reasons: string[];
}

export interface FilterSettings {
  nudityThreshold: number;
  strictMode: boolean;
  allowList: string[];
  blockList: string[];
}

export interface ImageElement {
  element: HTMLElement;
  src: string;
  type: 'img' | 'background' | 'video';
}