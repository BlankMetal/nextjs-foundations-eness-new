'use client'
 
import { useState } from 'react'
 
export function ClientEnvDisplay() {
  const [clicks, setClicks] = useState(0)
  
  const handleClick = () => setClicks(clicks + 1)
  
  return (
    <div className="rounded border p-4">
      <h3 className="font-bold">Client Component</h3>
      <p>Public: {process.env.NEXT_PUBLIC_APP_NAME}</p>
      <p>Server-only: {process.env.INTERNAL_CONFIG || 'undefined'}</p>
      <button
        type="button"
        onClick={handleClick}
        className="mt-2 rounded bg-primary px-3 py-1 text-primary-foreground hover:bg-primary/80"
      >
        Clicked {clicks} times
      </button>
    </div>
  )
}