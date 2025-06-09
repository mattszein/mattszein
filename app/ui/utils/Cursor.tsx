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

interface LayoutMetrics {
  characterWidth: number;
  containerWidth: number;
  maxCharactersPerLine: number;
}

interface LinePosition {
  line: number;
  column: number;
  metrics: LayoutMetrics;
}

// Add these new interfaces to your existing ones
interface LineInfo {
  startOffset: number;
  endOffset: number;
  lineNumber: number;
}

interface LineMap {
  lines: LineInfo[];
  maxCharsPerLine: number;
}

/**
 * Gets the main content container element where cursor navigation should takes place
 */
export const getContentSection = () => document.getElementById(NVIM_CONTENT)

/**
 * Retrieves the current cursor element from the DOM
 * @returns The cursor span element or null if not found
 */
export const getCursorElement = (): HTMLSpanElement | null =>
  document.getElementById(CURRENT_CURSOR) as HTMLSpanElement | null;

/**
 * Creates a new cursor wrapper span element with the specific content
 * Used to visually represent the cursor position in the terminal
 * @param content - The character content to display in the cursor
 * @returns A new HTML span element styled as a cursor
 */
export const createCursorWrapper = (content: string) => {
  const span: HTMLSpanElement = document.createElement("span");
  span.id = CURRENT_CURSOR;
  span.className = "animate-cursor";
  span.textContent = content;
  return span
}

/**
 * Determines if a character is a word character (alphanumeric)
 * Used for vim-style word movement navigation
 * @param char - The character to test
 * @returns True if the character is part of a word
 */
const isWordChar = (char: string): boolean => {
  return /[a-zA-Z0-9_]/.test(char);
};

/**
 * Determines if a character is whitespace (spaces, tabs, newlines, etc.)
 * @param char - The character to test
 * @returns True if the character is whitespace
 */
const isWhitespace = (char: string): boolean => {
  return /\s/.test(char);
};

/**
 * Categorizes a character into one of three types for navigation logic
 * This categorization is used in vim-style word movement
 * @param char - The character to categorize
 * @returns 'word' for alphanumeric+underscore, 'whitespace' for spaces/tabs, 'special' for symbols
 */
const getCharType = (char: string): 'word' | 'special' | 'whitespace' => {
  if (isWhitespace(char)) return 'whitespace';
  if (isWordChar(char)) return 'word';
  return 'special';
};

/**
 * Creates a TreeWalker for navigate/walk text nodes in the content area
 * Filters out empty text nodes and cursor span content to focus on navigable text
 * @param rootElement - The root element to traverse
 * @returns A TreeWalker configured to visit only meaningful text nodes
 */
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

/**
 * Retrieves information about the current cursor position and its context
 * Used as the foundation for most navigation calculations
 * @returns CursorContext object with position and text information (adjacent siblings, merged text content, and position), or null if cursor not found
 */
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

/**
 * Finds the next or previous text node across HTML tag boundaries
 * Used when cursor movement needs to cross from one HTML element to another
 * Skips empty or whitespace-only nodes to find meaningful content
 * @param direction - 'forward' to find next node, 'backward' to find previous
 * @param cursorSpan - The current cursor element to navigate from
 * @returns The target text node or null if no suitable node found
 */
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

/**
 * Calculates the optimal cursor position when moving forward into a new text node
 * Skips whitespaces to position cursor at the first word character
 * @param text - The text content of the target node
 * @returns The offset position where cursor should be placed
 */
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

/**
 * Calculates layout metrics for vertical navigation (up/down movement)
 * Uses the cursor element's width to determine character width in mono font
 * Essential for accurate line wrapping and column position calculations
 * @returns LayoutMetrics with character width, container width, and max characters per line
 * @throws Error if required elements (content section or cursor) are not found
 */
const calculateLayoutMetrics = (): LayoutMetrics => {
  const contentSection = getContentSection();
  const cursorSpan = getCursorElement();

  if (!contentSection || !cursorSpan) {
    throw new Error('Required elements not found');
  }

  // Use cursor span width directly - perfect for monospace measurement!
  const characterWidth = cursorSpan.getBoundingClientRect().width;
  const containerWidth = contentSection.getBoundingClientRect().width;
  const maxCharactersPerLine = Math.floor(containerWidth / characterWidth);

  return {
    characterWidth,
    containerWidth,
    maxCharactersPerLine
  };
};

/**
 * Builds a map of line boundaries within text content for vertical navigation
 * Handles word wrapping and leading spaces
 * @param text - The text content to analyze
 * @param maxCharsPerLine - Maximum characters that fit on one line
 * @returns LineMap with array of line info (start/end offsets) and metadata
 */
const buildLineMap = (text: string, maxCharsPerLine: number): LineMap => {
  const lines: LineInfo[] = [];
  let currentLineStart = 0;
  let currentLineNumber = 0;
  let spacesAtFirst = 0
  let lastPos = 0

  // Handle empty text
  if (text.length === 0) {
    return { lines: [], maxCharsPerLine };
  }

  while (currentLineStart < text.length) {
    // Calculate theoretical line end (exclusive - points to first char of next line)
    let lineEnd = Math.min(currentLineStart + maxCharsPerLine, text.length);
    if (text[currentLineStart] === ' ') lineEnd++

    // If we're not at the end of the text and we're breaking inside a word
    if (lineEnd < text.length) {
      const charAtBreak = text[lineEnd];
      const charBeforeBreak = text[lineEnd - 1];

      // Check if we're breaking in the middle of a word
      if (isWordChar(charAtBreak) && isWordChar(charBeforeBreak)) {
        // Scan backwards to find the start of the word
        let wordStart = lineEnd - 1;
        while (wordStart > currentLineStart && isWordChar(text[wordStart - 1])) {
          wordStart--;
        }

        // If the word starts at the beginning of the line, we can't wrap it
        if (wordStart === currentLineStart) {
          // Keep the original lineEnd (break the word)
          lineEnd = Math.min(currentLineStart + maxCharsPerLine, text.length);
        } else {
          // Wrap at the word boundary
          lineEnd = wordStart;
        }
      }
    }
    let endOffset = lineEnd - 1
    let startOffset = currentLineStart
    lastPos = endOffset
    // The last character of this line is at lineEnd - 1
    lines.push({
      startOffset: startOffset,
      endOffset: endOffset,
      lineNumber: currentLineNumber
    });
    currentLineStart = lineEnd;
    currentLineNumber++;
  }

  return { lines, maxCharsPerLine };
};

/**
 * Determines the current line and column position of the cursor
 * Uses layout metrics and line mapping to calculate exact position for vertical navigation
 * @returns LinePosition with line number, column, and layout metrics, or null if cursor not found
 */
const getCurrentLinePosition = (): LinePosition | null => {
  const context = getCursorContext();
  if (!context) return null;

  const metrics = calculateLayoutMetrics();
  const currentOffset = context.currentPosition;

  // Build accurate line map
  const lineMap = buildLineMap(context.mergedText, metrics.maxCharactersPerLine);

  // Find which line the cursor is on
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

/**
 * Removes the current cursor from the DOM and merges its character back into the text
 */
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

/**
 * Applies the cursor to a specific position within a text node
 * Splits the text node at the cursor position and inserts the cursor span
 * Also adds styling to the parent element to highlight the current line
 * @param position - Object containing the target text node and character offset
 */
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

/**
 * Handles cursor movement across different HTML elements (cross-tag movement)
 * First cleans up the current cursor position by merging text fragments
 * Then applies the cursor to the new target text node at the specified offset
 * @param targetTextNode - The destination text node for the cursor
 * @param newOffset - The character position within the target node
 */
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

/**
 * Applies cursor position within the same parent element
 * Used for navigation within the same HTML tag
 * Merges all text nodes and cursor content, then repositions cursor at new offset
 * @param newOffset - The new character position within the merged text
 */
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

/**
 * Initializes the cursor by positioning it at the first character of the content
 */
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

// =============================================================================
// NAVIGATION FUNCTIONS
// =============================================================================

/**
 * Calculates rightward cursor movement by one character
 * Only moves within the current parent element (same HTML tag)
 * Can't cross tags
 * @returns NavigationResult indicating success and new offset, or boundary hit
 */
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

/**
 * Calculates leftward cursor movement by one character
 * Only moves within the current parent element (same HTML tag)
 * Can't cross tags
 * @returns NavigationResult indicating success and new offset, or boundary hit
 */
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

/**
 * Calculates movement to the first character of the current element
 * @returns NavigationResult with offset 0 (always succeeds)
 */
export const navigateToFirstChar = (): NavigationResult => {
  const context = getCursorContext();
  if (!context) return { success: false };

  // Always succeeds - move to beginning of current tag
  return {
    success: true,
    newOffset: 0
  };
};

/**
 * Calculates movement to the last character of the current element
 * @returns NavigationResult with last valid offset (always succeeds)
 */
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

/**
 * Calculates movement to the first text node from current position
 * @returns NavigationResult with cross-tag movement to first node, or failure if already there
 */
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

export const navigateUp = (): NavigationResult => {
  const current = getCurrentLinePosition();
  if (!current) return { success: false };

  const context = getCursorContext();
  if (!context) return { success: false };

  // Build line map for current text
  const lineMap = buildLineMap(context.mergedText, current.metrics.maxCharactersPerLine);

  const currentLine = lineMap.lines[current.line];

  if (current.line > 0) {
    // Case A: Move up within current tag
    const targetLine = lineMap.lines[current.line - 1];
    const prevLineStartWithSpace = context.mergedText[targetLine.startOffset] === ' '

    // Check if current line starts with a space
    const currentLineFirstChar = context.mergedText[currentLine.startOffset];
    const currentStartsWithSpace = currentLineFirstChar === ' ';

    // Calculate the actual line length (endOffset - startOffset + 1)
    const lineLength = targetLine.endOffset - targetLine.startOffset + 1;
    const maxColumn = lineLength - 1;
    let targetColumn = current.column;

    // If target line starts with space, adjust column since the space won't be visible
    if (prevLineStartWithSpace) {
      targetColumn = targetColumn + 1;
    }

    // If current line starts with space, adjust column since the space won't be visible
    if (currentStartsWithSpace) {
      targetColumn = targetColumn - 1;
    }

    targetColumn = Math.min(targetColumn, maxColumn);

    let targetOffset = targetLine.startOffset + targetColumn;

    // Ensure we don't go out of bounds
    targetOffset = Math.max(targetLine.startOffset, Math.min(targetOffset, targetLine.endOffset));

    return { success: true, newOffset: targetOffset };
  } else {
    // Case B: Move to previous tag
    const prevTextNode = findCrossTagNode('backward', context.cursorSpan);
    if (!prevTextNode) return { success: false, atBoundary: 'start' };

    // Build line map for previous tag
    const prevText = prevTextNode.textContent!;
    const prevLineMap = buildLineMap(prevText, current.metrics.maxCharactersPerLine);

    if (prevLineMap.lines.length > 0) {
      // Move to last line of previous tag
      const lastLine = prevLineMap.lines[prevLineMap.lines.length - 1];
      const prevLineStartWithSpace = prevText[lastLine.startOffset] === ' '

      // Calculate the actual line length
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

  // Build line map for current text
  const lineMap = buildLineMap(context.mergedText, current.metrics.maxCharactersPerLine);

  const currentLine = lineMap.lines[current.line];
  if (current.line < lineMap.lines.length - 1) {
    // Case A: Move down within current tag
    const targetLine = lineMap.lines[current.line + 1];

    // Check if current line has a word break (doesn't use full width)
    const currentStartsWithSpace = context.mergedText[currentLine.startOffset] === ' '

    // Check if target line starts with a space
    const targetLineFirstChar = context.mergedText[targetLine.startOffset];
    const targetStartsWithSpace = targetLineFirstChar === ' ';

    // When moving from a full-width line, we need to be careful about the offset calculation
    let targetColumn = current.column;

    // If target line starts with space, adjust column since the space won't be visible
    if (targetStartsWithSpace) {
      targetColumn = targetColumn + 1;
    }

    if (currentStartsWithSpace) {
      targetColumn = targetColumn - 1;
    }

    let targetOffset = targetLine.startOffset + targetColumn;

    // Additional validation to ensure we're within bounds
    if (targetOffset > targetLine.endOffset) {
      return { success: true, newOffset: targetLine.endOffset };
    }

    return { success: true, newOffset: targetOffset };
  } else {
    // Case B: Move to next tag
    const nextTextNode = findCrossTagNode('forward', context.cursorSpan);
    if (!nextTextNode) return { success: false, atBoundary: 'end' };

    // Build line map for next tag
    const nextText = nextTextNode.textContent!;
    const nextLineMap = buildLineMap(nextText, current.metrics.maxCharactersPerLine);

    if (nextLineMap.lines.length > 0) {
      // Move to first line of next tag
      const firstLine = nextLineMap.lines[0];

      // Calculate the actual line length
      const lineLength = firstLine.endOffset - firstLine.startOffset + 1;
      const maxColumn = lineLength - 1;
      const targetColumn = Math.min(current.column, maxColumn);

      let targetOffset = firstLine.startOffset + targetColumn;
      if (context.mergedText[currentLine.startOffset] === ' ') targetOffset--

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

export const moveUp = (): void => {
  const result = navigateUp();
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

export const moveDown = (): void => {
  const result = navigateDown();
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
