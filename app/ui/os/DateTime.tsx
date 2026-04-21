'use client'

import { useDateTime } from "@/app/ui/utils/useDateTime"

const DateTime = () => {
  const dateTime = useDateTime()
  return (
    <span className="basis-1/3 cursor-default rounded-[5px] bg-black px-2 py-0.5 text-[#8caaee] text-center">
      {dateTime
        ? `${String(dateTime.getDate()).padStart(2, "0")} - ${String(dateTime.getHours()).padStart(2, "0")}:${String(dateTime.getMinutes()).padStart(2, "0")}`
        : ""}
    </span>
  )
}

export default DateTime;
