import { CursorPosition } from "./types";
import {
  getCursorElement,
  createCursorWrapper,
  getContentSection,
  getTextContentSection,
  createTextWalker,
  isElementVisibleInScrollableDiv,
} from "./dom";
import { splitter } from "./calculations";
import {
  navigateRight,
  navigateLeft,
  navigateUp,
  navigateDown,
  navigateWordForward,
  navigateWordBackward,
  navigateToFirstChar,
  navigateToLastChar,
  navigateToFirstTextNode,
  navigateToLastTextNode,
} from "./navigation";

/**
 * Removes the current cursor from the DOM and merges its character back into the text
 */
const cleanCursor = () => {
  const existingCursor = getCursorElement();
  if (!existingCursor) return;

  const parent = existingCursor.parentNode;
  if (!parent) return;

  const cursorChar = existingCursor.textContent || '';
  const prevSibling = existingCursor.previousSibling;
  const nextSibling = existingCursor.nextSibling;

  // Merge cursor character back into text flow
  if (prevSibling && prevSibling.nodeType === Node.TEXT_NODE) {
    prevSibling.textContent += cursorChar;
    if (nextSibling && nextSibling.nodeType === Node.TEXT_NODE) {
      prevSibling.textContent += nextSibling.textContent || '';
      parent.removeChild(nextSibling);
    }
  } else if (nextSibling && nextSibling.nodeType === Node.TEXT_NODE) {
    nextSibling.textContent = cursorChar + nextSibling.textContent;
  }

  parent.removeChild(existingCursor);
}

/**
 * Applies the cursor to a specific position within a text node
 * Splits the text node at the cursor position and inserts the cursor span
 * Also adds styling to the parent element to highlight the current line
 * @param position - Object containing the target text node and character offset
 */
export const applyCursorPosition = (position: CursorPosition): void => {
  const { textNode, offset } = position;
  const text = textNode.textContent || '';

  cleanCursor();
  const graphemes = splitter.splitGraphemes(text);
  if (graphemes.length === 0) return;
  if (offset < 0 || offset >= graphemes.length) return;

  const beforeText = graphemes.slice(0, offset).join("");
  const cursorChar = graphemes[offset];
  const afterText = graphemes.slice(offset + 1).join("");

  const cursorSpan = createCursorWrapper(cursorChar);
  const beforeTextNode = document.createTextNode(beforeText);
  const afterTextNode = document.createTextNode(afterText);

  const parent = textNode.parentNode!;
  (parent as Element).classList.add("bg-zinc-700")
  parent.insertBefore(beforeTextNode, textNode);
  parent.insertBefore(cursorSpan, textNode);
  parent.insertBefore(afterTextNode, textNode);
  parent.removeChild(textNode);
  const isVisible = isElementVisibleInScrollableDiv(cursorSpan, getContentSection() as HTMLElement)
  if (!isVisible) cursorSpan.scrollIntoView({ block: "end" })
};

/**
 * Handles cursor movement across different HTML elements (cross-tag movement)
 * First cleans up the current cursor position by merging text fragments
 * Then applies the cursor to the new target text node at the specified offset
 * @param targetTextNode - The destination text node for the cursor
 * @param newOffset - The character position within the target node
 */
const applyCursorCrossTag = (targetTextNode: Text, newOffset: number): void => {
  const cursorSpan = getCursorElement();
  if (cursorSpan && cursorSpan.parentNode) {
    const parent = cursorSpan.parentNode;
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

    if (prevSibling && prevSibling.nodeType === Node.TEXT_NODE) {
      parent.removeChild(prevSibling);
    }
    if (nextSibling && nextSibling.nodeType === Node.TEXT_NODE) {
      parent.removeChild(nextSibling);
    }
    parent.removeChild(cursorSpan);

    if (mergedText) {
      const restoredTextNode = document.createTextNode(mergedText);
      parent.appendChild(restoredTextNode);
      (parent as Element).classList.remove("bg-zinc-700")
    }
  }

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

  let mergedText = '';
  if (prevSibling && prevSibling.nodeType === Node.TEXT_NODE) {
    mergedText += prevSibling.textContent || '';
  }
  mergedText += cursorChar;
  if (nextSibling && nextSibling.nodeType === Node.TEXT_NODE) {
    mergedText += nextSibling.textContent || '';
  }

  if (prevSibling && prevSibling.nodeType === Node.TEXT_NODE) {
    parent.removeChild(prevSibling);
  }
  if (nextSibling && nextSibling.nodeType === Node.TEXT_NODE) {
    parent.removeChild(nextSibling);
  }
  parent.removeChild(cursorSpan);

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
  const contentElement = getTextContentSection();
  if (!contentElement) {
    console.warn("nvim-text-content element not found");
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

/**
 * Applies a NavigationResult to the DOM by moving the cursor accordingly
 * Handles both same-parent and cross-tag movements
 * @param result - The navigation result to apply
 */
const applyNavigationResult = (result: ReturnType<typeof navigateRight>): void => {
  if (result.success && result.newOffset !== undefined) {
    if (result.crossTag && result.targetTextNode) {
      applyCursorCrossTag(result.targetTextNode, result.newOffset);
    } else {
      applyCursorWithMergedText(result.newOffset);
    }
  }
};

export const moveRight = (): void => {
  applyNavigationResult(navigateRight());
};

export const moveLeft = (): void => {
  applyNavigationResult(navigateLeft());
};

export const moveToFirstChar = (): void => {
  applyNavigationResult(navigateToFirstChar());
};

export const moveToLastChar = (): void => {
  applyNavigationResult(navigateToLastChar());
};

export const moveToFirstTextNode = (): void => {
  applyNavigationResult(navigateToFirstTextNode());
};

export const moveToLastTextNode = (): void => {
  applyNavigationResult(navigateToLastTextNode());
};

export const moveWordForward = (): void => {
  applyNavigationResult(navigateWordForward());
};

export const moveWordBackward = (): void => {
  applyNavigationResult(navigateWordBackward());
};

export const moveUp = (): void => {
  applyNavigationResult(navigateUp());
};

export const moveDown = (): void => {
  applyNavigationResult(navigateDown());
};
