"use client"

import { useEffect, useState } from "react"

type TestTimerProps = {
  seconds: number
}

export function TestTimer({ seconds }: TestTimerProps) {
  const [formattedTime, setFormattedTime] = useState("")

  useEffect(() => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    let timeString = ""

    if (hours > 0) {
      timeString += `${hours}h `
    }

    timeString += `${minutes.toString().padStart(2, "0")}m `
    timeString += `${secs.toString().padStart(2, "0")}s`

    setFormattedTime(timeString)
  }, [seconds])

  return (
    <div className={`text-2xl font-bold tabular-nums ${seconds < 300 ? "text-destructive" : ""}`}>{formattedTime}</div>
  )
}

