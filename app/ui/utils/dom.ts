import { NVIM_CONTENT, NVIM_TEXT_CONTENT, CURRENT_CURSOR } from "./types";

export const getContentSection = () => document.getElementById(NVIM_CONTENT)

export const getTextContentSection = () => document.getElementById(NVIM_TEXT_CONTENT)

export const getCursorElement = (): HTMLSpanElement | null =>
  document.getElementById(CURRENT_CURSOR) as HTMLSpanElement | null;

export const createCursorWrapper = (content: string) => {
  const span: HTMLSpanElement = document.createElement("span");
  span.id = CURRENT_CURSOR;
  span.className = "animate-cursor";
  span.textContent = content;
  return span
}

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
