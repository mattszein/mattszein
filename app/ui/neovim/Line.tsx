'use client'
import { useEffect, useState } from "react";
import { getTextContentSection } from "../utils/Cursor"

const Line = () => {
  const [linesCount, setLinesCount] = useState(0)
  const items = Array.from({ length: linesCount }, (_, index) => (
    <p key={index}>{index + 1}</p>
  ));

  useEffect(() => {
    const content = getTextContentSection()!
    const styles = getComputedStyle(content)
    const lineHeight = parseInt(styles.lineHeight);
    const lines = content.scrollHeight / lineHeight
    setLinesCount(lines)
  }, [])

  return <div className="w-32 h-full text-right  snap-align-none">
    {items}
  </div>
}

export default Line
