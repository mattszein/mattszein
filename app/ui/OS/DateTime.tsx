'use client'

import { useEffect, useState } from "react"

const DateTime = () => {
  const [dateTime, setDateTime] = useState<Date | null>(null)
  useEffect(() => {
    setDateTime(new Date())
    setInterval(() => setDateTime(new Date()))
  }, [])
  return (
    <p className="flex gap-2 hover:bg-zinc-700 hover:rounded-2xl py-1 px-3 m-1 cursor-default">
      {dateTime ? (<>
        <span>{new Intl.DateTimeFormat("en-US", {
          month: "long",
          day: "numeric",
        }).format(dateTime)}
        </span>
        <span>{new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          minute: "numeric"
        }).format(dateTime)}
        </span></>) :
        ("")}
    </p>
  )
}

export default DateTime;
