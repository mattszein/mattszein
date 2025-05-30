export const NVIM_CONTENT = 'terminal-content'
export const CURRENT_CURSOR = 'cursor-text'

export const getContentSection = () => document.getElementById(NVIM_CONTENT)

export const findFirstTextNode = (element: HTMLElement): Text | null => {
  const walker: TreeWalker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function (node: Node): number {
        // Only accept text nodes that have non-whitespace content
        return node.textContent?.trim().length && node.textContent.trim().length > 0 ?
          NodeFilter.FILTER_ACCEPT :
          NodeFilter.FILTER_REJECT;
      }
    }
  );

  return walker.nextNode() as Text | null;
}

export const createCursorWrapper = (content: string) => {
  const span: HTMLSpanElement = document.createElement("span");
  span.id = CURRENT_CURSOR;
  span.className = "animate-cursor";
  span.textContent = content;
  return span
}

export const wrapFirstLetter = (): void => {
  const contentElement = getContentSection();
  if (!contentElement) {
    console.log("Element with id 'terminal-content' not found");
    return;
  }

  const firstTextNode: Text | null = findFirstTextNode(contentElement);
  if (!firstTextNode || !firstTextNode.textContent) {
    console.log("No text content found");
    return;
  }

  const text: string = firstTextNode.textContent;
  const firstChar: string = text.charAt(0);
  const remainingText: string = text.substring(1);

  const cursorWrapper = createCursorWrapper(firstChar)
  const remainingTextNode: Text = document.createTextNode(remainingText);

  // Replace the original text node
  const parent: Node | null = firstTextNode.parentNode;
  if (parent) {
    parent.insertBefore(cursorWrapper, firstTextNode);
    parent.insertBefore(remainingTextNode, firstTextNode);
    parent.removeChild(firstTextNode);
  }
}
