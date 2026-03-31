import { NVIM_CONTENT, NVIM_TEXT_CONTENT, CURRENT_CURSOR } from "./types";

export const calculateLines = () => {
  const content = getTextContentSection()!
  const styles = getComputedStyle(content)
  const lineHeight = parseInt(styles.lineHeight);
  return content.scrollHeight / lineHeight
}

export const getContentSection = () => document.getElementById(NVIM_CONTENT)

/**
 * Gets the main content container element where cursor navigation should takes place
 */
export const getTextContentSection = () => document.getElementById(NVIM_TEXT_CONTENT)

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
 * Creates a TreeWalker for navigate/walk text nodes in the content area
 * Filters out empty text nodes and cursor span content to focus on navigable text
 * @param rootElement - The root element to traverse
 * @returns A TreeWalker configured to visit only meaningful text nodes
 */
export const createTextWalker = (rootElement: HTMLElement): TreeWalker => {
  return document.createTreeWalker(
    rootElement,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node: Node): number => {
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

export const isElementVisibleInScrollableDiv = (element: HTMLElement, container: HTMLElement) => {
  const elementRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  return (
    elementRect.top >= containerRect.top &&
    elementRect.left >= containerRect.left &&
    elementRect.bottom <= containerRect.bottom &&
    elementRect.right <= containerRect.right
  );
}
