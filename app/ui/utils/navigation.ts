import { NavigationResult } from "./types";
import { getTextContentSection, createTextWalker } from "./dom";
import {
  splitter,
  getCursorContext,
  getCurrentLinePosition,
  buildLineMap,
  findCrossTagNode,
  getForwardTargetOffset,
  getCharType,
  isWhitespace,
} from "./calculations";

export const navigateRight = (): NavigationResult => {
  const context = getCursorContext();
  if (!context) return { success: false };

  const { currentPosition, totalLength } = context;

  if (currentPosition + 1 >= totalLength) {
    return { success: false, atBoundary: "end" };
  }

  return {
    success: true,
    newOffset: currentPosition + 1
  };
};

export const navigateLeft = (): NavigationResult => {
  const context = getCursorContext();
  if (!context) return { success: false };

  const { currentPosition } = context;

  if (currentPosition === 0) {
    return { success: false, atBoundary: "start" };
  }

  return {
    success: true,
    newOffset: currentPosition - 1,
  };
};

export const navigateToFirstChar = (): NavigationResult => {
  const context = getCursorContext();
  if (!context) return { success: false };

  return {
    success: true,
    newOffset: 0
  };
};

export const navigateToLastChar = (): NavigationResult => {
  const context = getCursorContext();
  if (!context) return { success: false };

  const lastOffset = Math.max(0, context.totalLength - 1);
  return {
    success: true,
    newOffset: lastOffset
  };
};

export const navigateToFirstTextNode = (): NavigationResult => {
  const contentElement = getTextContentSection();
  if (!contentElement) return { success: false, atBoundary: 'start' };

  const walker = createTextWalker(contentElement);
  const firstTextNode = walker.nextNode() as Text | null;

  if (!firstTextNode || !firstTextNode.textContent || firstTextNode.textContent.length === 0) {
    return { success: false, atBoundary: 'start' };
  }

  const context = getCursorContext();
  if (context) {
    const cursorInFirstNode = (context.cursorSpan.parentNode === firstTextNode.parentNode)
    if (cursorInFirstNode) {
      return { success: false };
    }
    return {
      success: true,
      newOffset: 0,
      crossTag: true,
      targetTextNode: firstTextNode
    };
  }

  return { success: false };
};

export const navigateToLastTextNode = (): NavigationResult => {
  const contentElement = getTextContentSection();
  if (!contentElement) return { success: false, atBoundary: 'end' };

  const walker = createTextWalker(contentElement);

  let lastValidNode: Text | null = null;
  let currentNode = walker.nextNode() as Text | null;

  while (currentNode) {
    if (currentNode.textContent && currentNode.textContent.trim().length > 0) {
      lastValidNode = currentNode;
    }
    currentNode = walker.nextNode() as Text | null;
  }

  if (!lastValidNode) {
    return { success: false, atBoundary: 'end' };
  }

  const context = getCursorContext();
  if (context) {
    const cursorInLastNode = (context.cursorSpan.parentNode === lastValidNode.parentNode)
    if (cursorInLastNode) {
      return { success: false };
    }
    return {
      success: true,
      newOffset: 0,
      crossTag: true,
      targetTextNode: lastValidNode
    };
  }

  return { success: false };
};

export const navigateWordForward = (): NavigationResult => {
  const context = getCursorContext();
  if (!context) return { success: false };

  let offset = context.currentPosition;
  const text = context.mergedGraphemes;

  if (offset >= text.length) {
    return { success: false, atBoundary: 'end' };
  }

  const currentChar = text[offset];
  const currentType = getCharType(currentChar);

  while (offset < text.length && getCharType(text[offset]) === currentType) {
    offset++;
  }

  while (offset < text.length && isWhitespace(text[offset])) {
    offset++;
  }

  if (offset < text.length) {
    return {
      success: true,
      newOffset: offset
    };
  }

  const nextTextNode = findCrossTagNode('forward', context.cursorSpan);
  if (nextTextNode) {
    const targetOffset = getForwardTargetOffset(nextTextNode.textContent!);
    return {
      success: true,
      newOffset: targetOffset,
      crossTag: true,
      targetTextNode: nextTextNode
    };
  }

  return { success: false, atBoundary: 'end' };
};

export const navigateWordBackward = (): NavigationResult => {
  const context = getCursorContext();
  if (!context) return { success: false };

  let offset = context.currentPosition;
  const text = context.mergedGraphemes;

  if (offset <= 0) {
    const prevTextNode = findCrossTagNode('backward', context.cursorSpan);
    if (prevTextNode) {
      const prevTextGraphemes = splitter.splitGraphemes(prevTextNode.textContent || "");
      return {
        success: true,
        newOffset: prevTextGraphemes.length - 1,
        crossTag: true,
        targetTextNode: prevTextNode
      };
    }
    return { success: false, atBoundary: 'start' };
  }

  offset--;

  while (offset >= 0 && isWhitespace(text[offset])) {
    offset--;
  }

  if (offset >= 0) {
    const currentType = getCharType(text[offset]);

    while (offset >= 0 && getCharType(text[offset]) === currentType) {
      offset--;
    }

    offset++;
  }

  if (offset < 0) {
    offset = 0;
  }

  return {
    success: true,
    newOffset: offset
  };
};

export const navigateUp = (): NavigationResult => {
  const current = getCurrentLinePosition();
  if (!current) return { success: false };

  const context = getCursorContext();
  if (!context) return { success: false };

  const lineMap = buildLineMap(context.mergedGraphemes, current.metrics.maxCharactersPerLine);

  const currentLine = lineMap.lines[current.line];

  if (current.line > 0) {
    const targetLine = lineMap.lines[current.line - 1];
    const prevLineStartWithSpace = context.mergedGraphemes[targetLine.startOffset] === ' '

    const currentLineFirstChar = context.mergedGraphemes[currentLine.startOffset];
    const currentStartsWithSpace = currentLineFirstChar === ' ';

    const lineLength = targetLine.endOffset - targetLine.startOffset + 1;
    const maxColumn = lineLength - 1;
    let targetColumn = current.column;

    if (prevLineStartWithSpace) {
      targetColumn = targetColumn + 1;
    }

    if (currentStartsWithSpace) {
      targetColumn = targetColumn - 1;
    }

    targetColumn = Math.min(targetColumn, maxColumn);

    let targetOffset = targetLine.startOffset + targetColumn;

    targetOffset = Math.max(targetLine.startOffset, Math.min(targetOffset, targetLine.endOffset));

    return { success: true, newOffset: targetOffset };
  } else {
    const prevTextNode = findCrossTagNode('backward', context.cursorSpan);
    if (!prevTextNode) return { success: false, atBoundary: 'start' };

    const prevGraphemes = splitter.splitGraphemes(prevTextNode.textContent || "")
    const prevLineMap = buildLineMap(prevGraphemes, current.metrics.maxCharactersPerLine);

    if (prevLineMap.lines.length > 0) {
      const lastLine = prevLineMap.lines[prevLineMap.lines.length - 1];
      const prevLineStartWithSpace = prevGraphemes[lastLine.startOffset] === ' '

      const lineLength = lastLine.endOffset - lastLine.startOffset + 1;
      const maxColumn = lineLength - 1;
      const targetColumn = Math.min(current.column, maxColumn);
      let targetOffset = lastLine.startOffset + targetColumn;

      if (prevLineStartWithSpace) targetOffset++
      return {
        success: true,
        newOffset: targetOffset,
        crossTag: true,
        targetTextNode: prevTextNode
      };
    }

    return { success: false, atBoundary: 'start' };
  }
};

export const navigateDown = (): NavigationResult => {
  const current = getCurrentLinePosition();
  if (!current) return { success: false };

  const context = getCursorContext();
  if (!context) return { success: false };

  const lineMap = buildLineMap(context.mergedGraphemes, current.metrics.maxCharactersPerLine);

  const currentLine = lineMap.lines[current.line];
  if (current.line < lineMap.lines.length - 1) {
    const targetLine = lineMap.lines[current.line + 1];

    const currentStartsWithSpace = context.mergedGraphemes[currentLine.startOffset] === ' '

    const targetLineFirstChar = context.mergedGraphemes[targetLine.startOffset];
    const targetStartsWithSpace = targetLineFirstChar === ' ';

    let targetColumn = current.column;

    if (targetStartsWithSpace) {
      targetColumn = targetColumn + 1;
    }

    if (currentStartsWithSpace) {
      targetColumn = targetColumn - 1;
    }

    const targetOffset = targetLine.startOffset + targetColumn;

    if (targetOffset > targetLine.endOffset) {
      return { success: true, newOffset: targetLine.endOffset };
    }

    return { success: true, newOffset: targetOffset };
  } else {
    const nextTextNode = findCrossTagNode('forward', context.cursorSpan);
    if (!nextTextNode) return { success: false, atBoundary: 'end' };

    const nextGraphemes = splitter.splitGraphemes(nextTextNode.textContent || "")
    const nextLineMap = buildLineMap(nextGraphemes, current.metrics.maxCharactersPerLine);

    if (nextLineMap.lines.length > 0) {
      const firstLine = nextLineMap.lines[0];

      const lineLength = firstLine.endOffset - firstLine.startOffset + 1;
      const maxColumn = lineLength - 1;
      const targetColumn = Math.min(current.column, maxColumn);

      let targetOffset = firstLine.startOffset + targetColumn;
      if (context.mergedGraphemes[currentLine.startOffset] === ' ') targetOffset--

      return {
        success: true,
        newOffset: targetOffset,
        crossTag: true,
        targetTextNode: nextTextNode
      };
    }

    return { success: false, atBoundary: 'end' };
  }
};
