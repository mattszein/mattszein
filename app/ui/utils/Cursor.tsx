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

  if (!cursorChar) return;

  const cursorSpan = createCursorWrapper(cursorChar);
  const beforeTextNode = document.createTextNode(beforeText);
  const afterTextNode = document.createTextNode(afterText);

  const parent = textNode.parentNode!;
  parent.insertBefore(beforeTextNode, textNode);
  parent.insertBefore(cursorSpan, textNode);
  parent.insertBefore(afterTextNode, textNode);
  parent.removeChild(textNode);
};

// Function cross-tag movement
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
    }
  }

  // Now apply cursor in target text node
  applyCursorPosition({
    textNode: targetTextNode,
    offset: newOffset
  });
};

// Apply cursor in same tag
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

// Navigation functions - refactored with new merge + offset approach
export const navigateRight = (): NavigationResult => {
  const cursorSpan = getCursorElement();
  if (!cursorSpan) return { success: false };

  const prevSibling = cursorSpan.previousSibling;
  const nextSibling = cursorSpan.nextSibling;

  // Calculate current absolute position in merged text
  let currentPosition = 0;
  if (prevSibling && prevSibling.nodeType === Node.TEXT_NODE) {
    currentPosition += (prevSibling.textContent?.length || 0);
  }
  // Current position is where cursor character is

  // Calculate total text length
  let totalLength = currentPosition + 1; // +1 for cursor char
  if (nextSibling && nextSibling.nodeType === Node.TEXT_NODE) {
    totalLength += (nextSibling.textContent?.length || 0);
  }

  // Validation: Can we move right within current parent?
  if (currentPosition + 1 >= totalLength) {
    return { success: false, atBoundary: 'end' };
  }

  // Case A: Move right by 1 within same parent
  const newOffset = currentPosition + 1;
  return {
    success: true,
    newOffset: newOffset
  };
};

export const navigateLeft = (): NavigationResult => {
  const cursorSpan = getCursorElement();
  if (!cursorSpan) return { success: false };

  const prevSibling = cursorSpan.previousSibling;

  // Calculate current absolute position in merged text
  let currentPosition = 0;
  if (prevSibling && prevSibling.nodeType === Node.TEXT_NODE) {
    currentPosition += (prevSibling.textContent?.length || 0);
  }
  // Current position is where cursor character is

  // Validation: Can we move left within current parent?
  if (currentPosition <= 0) {
    return { success: false, atBoundary: 'start' };
  }

  // Case A: Move left by 1 within same parent
  const newOffset = currentPosition - 1;
  return {
    success: true,
    newOffset: newOffset
  };
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
  const cursorSpan = getCursorElement();
  if (!cursorSpan) return { success: false };

  const prevSibling = cursorSpan.previousSibling;
  const nextSibling = cursorSpan.nextSibling;
  const cursorChar = cursorSpan.textContent || '';

  // Build merged text for current parent
  let mergedText = '';
  if (prevSibling && prevSibling.nodeType === Node.TEXT_NODE) {
    mergedText += prevSibling.textContent || '';
  }
  mergedText += cursorChar;
  if (nextSibling && nextSibling.nodeType === Node.TEXT_NODE) {
    mergedText += nextSibling.textContent || '';
  }

  // Calculate current position in merged text
  let currentPosition = 0;
  if (prevSibling && prevSibling.nodeType === Node.TEXT_NODE) {
    currentPosition += (prevSibling.textContent?.length || 0);
  }

  // Apply vim word movement logic to merged text
  let offset = currentPosition;
  const text = mergedText;

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
  const contentElement = getContentSection();
  if (!contentElement) return { success: false, atBoundary: 'end' };

  // Use TreeWalker starting from cursor span
  const walker = createTextWalker(contentElement);
  walker.currentNode = cursorSpan;

  // Iterate through next nodes until we find one with text content
  let nextTextNode = walker.nextNode() as Text | null;
  if (nextTextNode?.parentNode === cursorSpan.parentNode)
    nextTextNode = walker.nextNode() as Text | null;
  while (nextTextNode) {
    if (nextTextNode.textContent && nextTextNode.textContent.trim().length > 0) {
      // Skip whitespace at the beginning and find first non-whitespace character
      const nextText = nextTextNode.textContent;
      let targetOffset = 0;

      // Skip whitespace at the beginning
      while (targetOffset < nextText.length && isWhitespace(nextText[targetOffset])) {
        targetOffset++;
      }

      // Make sure we found a valid character
      if (targetOffset >= nextText.length) {
        targetOffset = nextText.length - 1;
      }

      // Found next tag with text - jump to first non-whitespace character
      return {
        success: true,
        newOffset: targetOffset,
        crossTag: true,
        targetTextNode: nextTextNode
      };
    }

    // This node was empty, try the next one
    nextTextNode = walker.nextNode() as Text | null;
  }

  return { success: false, atBoundary: 'end' };
};

export const navigateWordBackward = (): NavigationResult => {
  const cursorSpan = getCursorElement();
  if (!cursorSpan) return { success: false };

  const prevSibling = cursorSpan.previousSibling;
  const nextSibling = cursorSpan.nextSibling;
  const cursorChar = cursorSpan.textContent || '';

  // Build merged text for current parent
  let mergedText = '';
  if (prevSibling && prevSibling.nodeType === Node.TEXT_NODE) {
    mergedText += prevSibling.textContent || '';
  }
  mergedText += cursorChar;
  if (nextSibling && nextSibling.nodeType === Node.TEXT_NODE) {
    mergedText += nextSibling.textContent || '';
  }

  // Calculate current position in merged text
  let currentPosition = 0;
  if (prevSibling && prevSibling.nodeType === Node.TEXT_NODE) {
    currentPosition += (prevSibling.textContent?.length || 0);
  }

  // Apply vim word backward logic to merged text
  let offset = currentPosition;
  const text = mergedText;

  if (offset <= 0) {
    // Case B: Try to move to previous tag
    const contentElement = getContentSection();
    if (!contentElement) return { success: false, atBoundary: 'start' };

    // Use TreeWalker starting from cursor span
    const walker = createTextWalker(contentElement);
    walker.currentNode = cursorSpan;

    // Iterate through previous nodes until we find one with text content
    let prevTextNode = walker.previousNode() as Text | null;
    if (prevTextNode?.parentNode === cursorSpan.parentNode)
      prevTextNode = walker.previousNode() as Text | null;
    while (prevTextNode) {
      if (prevTextNode.textContent && prevTextNode.textContent.trim().length > 0) {
        // Found previous tag with text - jump to end
        return {
          success: true,
          newOffset: prevTextNode.textContent.length - 1,
          crossTag: true,
          targetTextNode: prevTextNode
        };
      }

      // This node was empty, try the previous one
      prevTextNode = walker.previousNode() as Text | null;
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

// Movement functions - refactored to use new approach
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
