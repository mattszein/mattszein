import GraphemeSplitter from "grapheme-splitter";
import { CursorContext, LayoutMetrics, LinePosition, LineInfo, LineMap } from "./types";
import { getCursorElement, getTextContentSection, createTextWalker } from "./dom";

export const splitter = new GraphemeSplitter();

export const isWordChar = (char: string): boolean => {
  return /[a-zA-Z0-9_]/.test(char);
};

export const isWhitespace = (char: string): boolean => {
  return /\s/.test(char);
};

export const getCharType = (char: string): 'word' | 'special' | 'whitespace' => {
  if (isWhitespace(char)) return 'whitespace';
  if (isWordChar(char)) return 'word';
  return 'special';
};

export const getCursorContext = (): CursorContext | null => {
  const cursorSpan = getCursorElement();
  if (!cursorSpan) return null;

  const prevSibling = cursorSpan.previousSibling;
  const nextSibling = cursorSpan.nextSibling;
  const cursorChar = cursorSpan.textContent || '';

  let mergedText = '';
  if (prevSibling && prevSibling.nodeType === Node.TEXT_NODE) {
    mergedText += prevSibling.textContent || '';
  }
  mergedText += cursorChar;
  if (nextSibling && nextSibling.nodeType === Node.TEXT_NODE) {
    mergedText += nextSibling.textContent || '';
  }

  const mergedGraphemes = splitter.splitGraphemes(mergedText);

  let currentPosition = 0;
  if (prevSibling && prevSibling.nodeType === Node.TEXT_NODE) {
    const prevText = prevSibling.textContent || '';
    currentPosition = splitter.splitGraphemes(prevText).length;
  }

  const totalLength = mergedGraphemes.length;

  return {
    cursorSpan,
    prevSibling,
    nextSibling,
    cursorChar,
    currentPosition,
    mergedText,
    mergedGraphemes,
    totalLength
  };
};

export const findCrossTagNode = (direction: 'forward' | 'backward', cursorSpan: HTMLSpanElement): Text | null => {
  const contentElement = getTextContentSection();
  if (!contentElement) return null;

  const walker = createTextWalker(contentElement);
  walker.currentNode = cursorSpan;

  let targetNode = direction === 'forward'
    ? walker.nextNode() as Text | null
    : walker.previousNode() as Text | null;

  if (targetNode?.parentNode === cursorSpan.parentNode) {
    targetNode = direction === 'forward'
      ? walker.nextNode() as Text | null
      : walker.previousNode() as Text | null;
  }

  while (targetNode) {
    if (targetNode.textContent && targetNode.textContent.trim().length > 0) {
      return targetNode;
    }
    targetNode = direction === 'forward'
      ? walker.nextNode() as Text | null
      : walker.previousNode() as Text | null;
  }

  return null;
};

export const getForwardTargetOffset = (text: string): number => {
  const graphemes = splitter.splitGraphemes(text);
  let targetOffset = 0;
  while (targetOffset < graphemes.length && isWhitespace(graphemes[targetOffset])) {
    targetOffset++;
  }
  if (targetOffset >= graphemes.length) {
    return Math.max(0, graphemes.length - 1);
  }
  return targetOffset;
};

export const calculateLayoutMetrics = (): LayoutMetrics => {
  const contentSection = getTextContentSection();
  const cursorSpan = getCursorElement();

  if (!contentSection || !cursorSpan) {
    throw new Error('Required elements not found');
  }

  const measureSpan = document.createElement('span');
  measureSpan.style.visibility = 'hidden';
  measureSpan.style.position = 'absolute';
  measureSpan.style.whiteSpace = 'pre';

  const computedStyle = window.getComputedStyle(contentSection);
  measureSpan.style.fontFamily = computedStyle.fontFamily;
  measureSpan.style.fontSize = computedStyle.fontSize;
  measureSpan.style.fontWeight = computedStyle.fontWeight;

  measureSpan.textContent = 'A';
  contentSection.appendChild(measureSpan);

  const characterWidth = measureSpan.getBoundingClientRect().width;
  contentSection.removeChild(measureSpan);

  const containerWidth = contentSection.getBoundingClientRect().width;
  const maxCharactersPerLine = Math.floor(containerWidth / characterWidth);

  return {
    characterWidth,
    containerWidth,
    maxCharactersPerLine
  };
};

export const buildLineMap = (
  text: string[] | string,
  maxCharsPerLine: number
): LineMap => {
  const graphemes = Array.isArray(text) ? text : splitter.splitGraphemes(text);
  const lines: LineInfo[] = [];
  let currentLineStart = 0;
  let currentLineNumber = 0;

  if (graphemes.length === 0) {
    return { lines: [], maxCharsPerLine };
  }

  while (currentLineStart < graphemes.length) {
    let lineEnd = Math.min(currentLineStart + maxCharsPerLine, graphemes.length);

    if (graphemes[currentLineStart] === " ") lineEnd++;

    if (lineEnd < graphemes.length) {
      const charAtBreak = graphemes[lineEnd];
      const charBeforeBreak = graphemes[lineEnd - 1];

      if (isWordChar(charAtBreak) && isWordChar(charBeforeBreak)) {
        let wordStart = lineEnd - 1;
        while (
          wordStart > currentLineStart &&
          isWordChar(graphemes[wordStart - 1])
        ) {
          wordStart--;
        }

        if (wordStart !== currentLineStart) {
          lineEnd = wordStart;
        }
      }
    }

    lines.push({
      startOffset: currentLineStart,
      endOffset: lineEnd - 1,
      lineNumber: currentLineNumber,
    });

    currentLineStart = lineEnd;
    currentLineNumber++;
  }

  return { lines, maxCharsPerLine };
};

export const getCurrentLinePosition = (): LinePosition | null => {
  const context = getCursorContext();
  if (!context) return null;

  const metrics = calculateLayoutMetrics();
  const currentOffset = context.currentPosition;

  const lineMap = buildLineMap(context.mergedGraphemes, metrics.maxCharactersPerLine);

  let currentLine = 0;
  let column = 0;

  for (const line of lineMap.lines) {
    if (currentOffset >= line.startOffset && currentOffset <= line.endOffset) {
      currentLine = line.lineNumber;
      column = currentOffset - line.startOffset;
      break;
    }
  }

  return {
    line: currentLine,
    column,
    metrics
  };
};
