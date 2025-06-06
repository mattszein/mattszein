'use client'
import { useEffect, useState } from "react";
import { getContentSection } from "../utils/Cursor"

const Line = () => {
  const [linesCount, setLinesCount] = useState(0)
  const items = Array.from({ length: linesCount }, (_, index) => (
    <p key={index}>{index + 1}</p>
  ));

  useEffect(() => {
    const content = getContentSection()!
    const styles = getComputedStyle(content)
    const lineHeight = parseInt(styles.lineHeight);
    const lines = content.getBoundingClientRect().height / lineHeight
    setLinesCount(lines)
  }, [])

  return <div className="w-8 h-full text-right overflow-auto no-scrollbar snap-align-none">
    {items}
  </div>
}

export default Line
