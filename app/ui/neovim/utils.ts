import { getTextContentSection } from "@/app/ui/utils/dom"

export const calculateLines = () => {
  const content = getTextContentSection()!
  const styles = getComputedStyle(content)
  const lineHeight = parseInt(styles.lineHeight);
  return content.scrollHeight / lineHeight
}
