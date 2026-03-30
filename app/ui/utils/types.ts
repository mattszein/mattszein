export const NVIM_CONTENT = 'nvim-content'
export const NVIM_TEXT_CONTENT = 'nvim-text-content'
export const CURRENT_CURSOR = 'cursor-text'

// Types
export interface CursorPosition {
  textNode: Text;
  offset: number;
}

export interface NavigationResult {
  success: boolean;
  newOffset?: number;
  atBoundary?: 'start' | 'end';
  crossTag?: boolean;
  targetTextNode?: Text;
}

export interface CursorContext {
  cursorSpan: HTMLSpanElement;
  prevSibling: Node | null;
  nextSibling: Node | null;
  cursorChar: string;
  currentPosition: number;
  mergedText: string;
  mergedGraphemes: string[];    // grapheme array (new)
  totalLength: number;
}

export interface LayoutMetrics {
  characterWidth: number;
  containerWidth: number;
  maxCharactersPerLine: number;
}

export interface LinePosition {
  line: number;
  column: number;
  metrics: LayoutMetrics;
}

// Add these new interfaces to your existing ones
export interface LineInfo {
  startOffset: number;
  endOffset: number;
  lineNumber: number;
}

export interface LineMap {
  lines: LineInfo[];
  maxCharsPerLine: number;
}
