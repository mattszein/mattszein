export const NVIM_CONTENT = 'terminal-content'
export const CURRENT_CURSOR = 'cursor-text'

// Types
interface CursorPosition {
  textNode: Text;
  offset: number;
}

interface NavigationResult {
  success: boolean;
  newOffset?: number;
  atBoundary?: 'start' | 'end';
  crossTag?: boolean;
  targetTextNode?: Text;
}

interface CursorContext {
  cursorSpan: HTMLSpanElement;
  prevSibling: Node | null;
  nextSibling: Node | null;
  cursorChar: string;
  currentPosition: number;
  mergedText: string;
  totalLength: number;
}

export const getContentSection = () => document.getElementById(NVIM_CONTENT)

export const getCursorElement = (): HTMLSpanElement | null =>
  document.getElementById(CURRENT_CURSOR) as HTMLSpanElement | null;

export const createCursorWrapper = (content: string) => {
  const span: HTMLSpanElement = document.createElement("span");
  span.id = CURRENT_CURSOR;
  span.className = "animate-cursor";
  span.textContent = content;
  return span
}

// TreeWalker utilities
const createTextWalker = (rootElement: HTMLElement): TreeWalker => {
  return document.createTreeWalker(
    rootElement,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node: Node): number => {
        // Accept text nodes with content, skip the cursor span content
        if (node.parentNode && (node.parentNode as Element).id === CURRENT_CURSOR) {
          return NodeFilter.FILTER_REJECT;
        }
        return node.textContent && node.textContent.length > 0
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      }
    }
  );
};

// Utility Functions - Extracted to reduce DRY

// Get complete cursor context (position, siblings, merged text)
const getCursorContext = (): CursorContext | null => {
  const cursorSpan = getCursorElement();
  if (!cursorSpan) return null;

  const prevSibling = cursorSpan.previousSibling;
  const nextSibling = cursorSpan.nextSibling;
  const cursorChar = cursorSpan.textContent || '';

  // Calculate current position in merged text
  let currentPosition = 0;
  if (prevSibling && prevSibling.nodeType === Node.TEXT_NODE) {
    currentPosition += (prevSibling.textContent?.length || 0);
  }

  // Build merged text for current parent
  let mergedText = '';
  if (prevSibling && prevSibling.nodeType === Node.TEXT_NODE) {
    mergedText += prevSibling.textContent || '';
  }
  mergedText += cursorChar;
  if (nextSibling && nextSibling.nodeType === Node.TEXT_NODE) {
    mergedText += nextSibling.textContent || '';
  }

  const totalLength = mergedText.length;

  return {
    cursorSpan,
    prevSibling,
    nextSibling,
    cursorChar,
    currentPosition,
    mergedText,
    totalLength
  };
};

// Generic cross-tag navigation
const findCrossTagNode = (direction: 'forward' | 'backward', cursorSpan: HTMLSpanElement): Text | null => {
  const contentElement = getContentSection();
  if (!contentElement) return null;

  const walker = createTextWalker(contentElement);
  walker.currentNode = cursorSpan;

  // Get next/previous node based on direction
  let targetNode = direction === 'forward'
    ? walker.nextNode() as Text | null
    : walker.previousNode() as Text | null;

  // Skip nodes in same parent
  if (targetNode?.parentNode === cursorSpan.parentNode) {
    targetNode = direction === 'forward'
      ? walker.nextNode() as Text | null
      : walker.previousNode() as Text | null;
  }

  // Iterate until we find a node with actual content
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

// Calculate target offset for cross-tag forward movement (skip whitespace)
const getForwardTargetOffset = (text: string): number => {
  let targetOffset = 0;
  // Skip whitespace at the beginning
  while (targetOffset < text.length && isWhitespace(text[targetOffset])) {
    targetOffset++;
  }
  // Make sure we found a valid character
  if (targetOffset >= text.length) {
    targetOffset = text.length - 1;
  }
  return targetOffset;
};

const cleanCursor = () => {
  // Remove existing cursor
  const existingCursor = getCursorElement();
  if (existingCursor) {
    const cursorChar = existingCursor.textContent || '';
    const parent = existingCursor.parentNode;

    if (parent) {
      // Merge cursor character back into text flow
      const prevSibling = existingCursor.previousSibling;
      const nextSibling = existingCursor.nextSibling;

      if (prevSibling && prevSibling.nodeType === Node.TEXT_NODE) {
        prevSibling.textContent += cursorChar;
      } else if (nextSibling && nextSibling.nodeType === Node.TEXT_NODE) {
        nextSibling.textContent = cursorChar + nextSibling.textContent;
      }

      parent.removeChild(existingCursor);
    }
  }
}

// Apply the cursor position to the DOM
export const applyCursorPosition = (position: CursorPosition): void => {
  const { textNode, offset } = position;
  const text = textNode.textContent!;

  cleanCursor();

  // Create new cursor at target position
  const beforeText = text.substring(0, offset);
  const cursorChar = text.charAt(offset);
  const afterText = text.substring(offset + 1);

  if (!cursorChar) return; // Safety check

  const cursorSpan = createCursorWrapper(cursorChar);
  const beforeTextNode = document.createTextNode(beforeText);
  const afterTextNode = document.createTextNode(afterText);

  const parent = textNode.parentNode!;
  (parent as Element).classList.add("bg-zinc-700")
  parent.insertBefore(beforeTextNode, textNode);
  parent.insertBefore(cursorSpan, textNode);
  parent.insertBefore(afterTextNode, textNode);
  parent.removeChild(textNode);
};

// function for cross-tag movement
const applyCursorCrossTag = (targetTextNode: Text, newOffset: number): void => {
  // First, clean up current position by merging text in current parent
  const cursorSpan = getCursorElement();
  if (cursorSpan && cursorSpan.parentNode) {
    const parent = cursorSpan.parentNode;
    const prevSibling = cursorSpan.previousSibling;
    const nextSibling = cursorSpan.nextSibling;
    const cursorChar = cursorSpan.textContent || '';

    // Merge all text in current parent back together
    let mergedText = '';
    if (prevSibling && prevSibling.nodeType === Node.TEXT_NODE) {
      mergedText += prevSibling.textContent || '';
    }
    mergedText += cursorChar;
    if (nextSibling && nextSibling.nodeType === Node.TEXT_NODE) {
      mergedText += nextSibling.textContent || '';
    }

    // Clean up current parent - remove all fragments and cursor
    if (prevSibling && prevSibling.nodeType === Node.TEXT_NODE) {
      parent.removeChild(prevSibling);
    }
    if (nextSibling && nextSibling.nodeType === Node.TEXT_NODE) {
      parent.removeChild(nextSibling);
    }
    parent.removeChild(cursorSpan);

    // Restore merged text in current parent
    if (mergedText) {
      const restoredTextNode = document.createTextNode(mergedText);
      parent.appendChild(restoredTextNode);
      (parent as Element).classList.remove("bg-zinc-700")
    }
  }

  // Now apply cursor in target text node
  applyCursorPosition({
    textNode: targetTextNode,
    offset: newOffset
  });
};

// Helper function for Case A: merge text and apply cursor at new offset
const applyCursorWithMergedText = (newOffset: number): void => {
  const cursorSpan = getCursorElement();
  if (!cursorSpan || !cursorSpan.parentNode) return;

  const parent = cursorSpan.parentNode;
  const prevSibling = cursorSpan.previousSibling;
  const nextSibling = cursorSpan.nextSibling;
  const cursorChar = cursorSpan.textContent || '';

  // Merge all text in current parent
  let mergedText = '';
  if (prevSibling && prevSibling.nodeType === Node.TEXT_NODE) {
    mergedText += prevSibling.textContent || '';
  }
  mergedText += cursorChar;
  if (nextSibling && nextSibling.nodeType === Node.TEXT_NODE) {
    mergedText += nextSibling.textContent || '';
  }

  // Clean up existing nodes
  if (prevSibling && prevSibling.nodeType === Node.TEXT_NODE) {
    parent.removeChild(prevSibling);
  }
  if (nextSibling && nextSibling.nodeType === Node.TEXT_NODE) {
    parent.removeChild(nextSibling);
  }
  parent.removeChild(cursorSpan);

  // Create merged text node and apply cursor at new offset
  const mergedTextNode = document.createTextNode(mergedText);
  parent.appendChild(mergedTextNode);

  applyCursorPosition({
    textNode: mergedTextNode,
    offset: newOffset
  });
};

export const wrapFirstLetter = (): void => {
  const contentElement = getContentSection();
  if (!contentElement) {
    console.log("Element with id 'terminal-content' not found");
    return;
  }
  const walker = createTextWalker(contentElement);
  const firstTextNode = walker.nextNode() as Text | null;

  if (firstTextNode && firstTextNode.textContent) {
    applyCursorPosition({
      textNode: firstTextNode,
      offset: 0
    });
  } else {
    console.warn('No text content found to initialize cursor');
  }
}

// Navigation functions - Simplified using utility functions
export const navigateRight = (): NavigationResult => {
  const context = getCursorContext();
  if (!context) return { success: false };

  // Validation: Can we move right within current parent?
  if (context.currentPosition + 1 >= context.totalLength) {
    return { success: false, atBoundary: 'end' };
  }

  // Case A: Move right by 1 within same parent
  return {
    success: true,
    newOffset: context.currentPosition + 1
  };
};

export const navigateLeft = (): NavigationResult => {
  const context = getCursorContext();
  if (!context) return { success: false };

  // Validation: Can we move left within current parent?
  if (context.currentPosition <= 0) {
    return { success: false, atBoundary: 'start' };
  }

  // Case A: Move left by 1 within same parent
  return {
    success: true,
    newOffset: context.currentPosition - 1
  };
};

export const navigateToFirstChar = (): NavigationResult => {
  const context = getCursorContext();
  if (!context) return { success: false };

  // Always succeeds - move to beginning of current tag
  return {
    success: true,
    newOffset: 0
  };
};

export const navigateToLastChar = (): NavigationResult => {
  const context = getCursorContext();
  if (!context) return { success: false };

  // Always succeeds - move to end of current tag
  const lastOffset = Math.max(0, context.totalLength - 1);
  return {
    success: true,
    newOffset: lastOffset
  };
};

export const navigateToFirstTextNode = (): NavigationResult => {
  const contentElement = getContentSection();
  if (!contentElement) return { success: false, atBoundary: 'start' };

  // Use TreeWalker to find the very first text node in document
  const walker = createTextWalker(contentElement);
  const firstTextNode = walker.nextNode() as Text | null;

  if (!firstTextNode || !firstTextNode.textContent || firstTextNode.textContent.length === 0) {
    return { success: false, atBoundary: 'start' };
  }

  // Check if we're already at the target position
  const context = getCursorContext();
  if (context) {
    // Check if cursor is already in the first text node at offset 0
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
  const contentElement = getContentSection();
  if (!contentElement) return { success: false, atBoundary: 'end' };

  // Use TreeWalker to find the very last text node in document
  const walker = createTextWalker(contentElement);

  // Navigate to the very end of the document
  let lastValidNode: Text | null = null;
  let currentNode = walker.nextNode() as Text | null;

  while (currentNode) {
    // Check if this node has actual content (not just whitespace)
    if (currentNode.textContent && currentNode.textContent.trim().length > 0) {
      lastValidNode = currentNode;
    }
    currentNode = walker.nextNode() as Text | null;
  }

  if (!lastValidNode) {
    return { success: false, atBoundary: 'end' };
  }

  // Check if we're already at the target position
  const context = getCursorContext();
  if (context) {
    // Check if cursor is already in the last text node
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

// Helper functions for word movement
const isWordChar = (char: string): boolean => {
  return /[a-zA-Z0-9_]/.test(char);
};

const isWhitespace = (char: string): boolean => {
  return /\s/.test(char);
};

const getCharType = (char: string): 'word' | 'special' | 'whitespace' => {
  if (isWhitespace(char)) return 'whitespace';
  if (isWordChar(char)) return 'word';
  return 'special';
};

export const navigateWordForward = (): NavigationResult => {
  const context = getCursorContext();
  if (!context) return { success: false };

  // Apply vim word movement logic to merged text
  let offset = context.currentPosition;
  const text = context.mergedText;

  if (offset >= text.length) {
    return { success: false, atBoundary: 'end' };
  }

  const currentChar = text[offset];
  const currentType = getCharType(currentChar);

  // Step 1: Skip current word (all chars of same type)
  while (offset < text.length && getCharType(text[offset]) === currentType) {
    offset++;
  }

  // Step 2: Skip whitespace
  while (offset < text.length && isWhitespace(text[offset])) {
    offset++;
  }

  // Case A: Movement within current parent
  if (offset < text.length) {
    return {
      success: true,
      newOffset: offset
    };
  }

  // Case B: Try to move to next tag
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

  // Apply vim word backward logic to merged text
  let offset = context.currentPosition;
  const text = context.mergedText;

  if (offset <= 0) {
    // Case B: Try to move to previous tag
    const prevTextNode = findCrossTagNode('backward', context.cursorSpan);
    if (prevTextNode) {
      return {
        success: true,
        newOffset: prevTextNode.textContent!.length - 1,
        crossTag: true,
        targetTextNode: prevTextNode
      };
    }
    return { success: false, atBoundary: 'start' };
  }

  // Move back one position to start scanning
  offset--;

  // Step 1: Skip whitespace backwards
  while (offset >= 0 && isWhitespace(text[offset])) {
    offset--;
  }

  // Step 2: Find the beginning of current word (scan backwards until type changes)
  if (offset >= 0) {
    const currentChar = text[offset];
    const currentType = getCharType(currentChar);

    // Scan backwards while characters are of same type
    while (offset >= 0 && getCharType(text[offset]) === currentType) {
      offset--;
    }

    // Move forward one position to start of word
    offset++;
  }

  // Ensure we don't go below 0
  if (offset < 0) {
    offset = 0;
  }

  // Case A: Movement within current parent
  return {
    success: true,
    newOffset: offset
  };
};

// Movement functions - Simplified using utility functions
export const moveRight = (): void => {
  const result = navigateRight();
  if (result.success && result.newOffset !== undefined) {
    applyCursorWithMergedText(result.newOffset);
  } else if (result.atBoundary) {
    console.log('Reached end of document');
  }
};

export const moveLeft = (): void => {
  const result = navigateLeft();
  if (result.success && result.newOffset !== undefined) {
    applyCursorWithMergedText(result.newOffset);
  } else if (result.atBoundary) {
    console.log('Reached start of document');
  }
};

export const moveToFirstChar = (): void => {
  const result = navigateToFirstChar();
  if (result.success && result.newOffset !== undefined) {
    applyCursorWithMergedText(result.newOffset);
  }
};

export const moveToLastChar = (): void => {
  const result = navigateToLastChar();
  if (result.success && result.newOffset !== undefined) {
    applyCursorWithMergedText(result.newOffset);
  }
};

export const moveToFirstTextNode = (): void => {
  const result = navigateToFirstTextNode();
  if (result.success && result.newOffset !== undefined) {
    if (result.crossTag && result.targetTextNode) {
      // Case B: Cross-tag movement to first text node
      applyCursorCrossTag(result.targetTextNode, result.newOffset);
    }
  } else if (result.atBoundary) {
    console.log('No text content found in document');
  }
};

export const moveToLastTextNode = (): void => {
  const result = navigateToLastTextNode();
  if (result.success && result.newOffset !== undefined) {
    if (result.crossTag && result.targetTextNode) {
      // Case B: Cross-tag movement to last text node
      applyCursorCrossTag(result.targetTextNode, result.newOffset);
    }
  } else if (result.atBoundary) {
    console.log('No text content found in document');
  }
};

export const moveWordForward = (): void => {
  const result = navigateWordForward();
  if (result.success && result.newOffset !== undefined) {
    if (result.crossTag && result.targetTextNode) {
      // Case B: Cross-tag movement
      applyCursorCrossTag(result.targetTextNode, result.newOffset);
    } else {
      // Case A: Same parent movement
      applyCursorWithMergedText(result.newOffset);
    }
  } else if (result.atBoundary) {
    console.log('Reached end of document');
  }
};

export const moveWordBackward = (): void => {
  const result = navigateWordBackward();
  if (result.success && result.newOffset !== undefined) {
    if (result.crossTag && result.targetTextNode) {
      // Case B: Cross-tag movement
      applyCursorCrossTag(result.targetTextNode, result.newOffset);
    } else {
      // Case A: Same parent movement
      applyCursorWithMergedText(result.newOffset);
    }
  } else if (result.atBoundary) {
    console.log('Reached start of document');
  }
};
