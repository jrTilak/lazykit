"use client"

import { useRef } from "react"
import useInnerSize from "."

const InnerSizeExample = () => {
  const windowSize = useInnerSize()
  const boxRef = useRef(null)
  const boxSize = useInnerSize(boxRef)
  return (
    <div className="w-full h-full flex items-center justify-center gap-4 text-center p-6 flex-col">
      <span className="text-destructive">Try Resizing the window!</span>
      <div
        className="flex flex-col"
      >
        <span>Window Size</span>
        <span>Height - {windowSize.height}px, Width - {windowSize.width}px</span>
      </div>
      <div
        ref={boxRef}
        className="w-3/4 border-muted-foreground h-16 flex items-center justify-center flex-col border rounded-md p-4"
      >
        <span>Bix Size</span>
        <span>Height - {boxSize.height}px, Width - {boxSize.width}px</span>
      </div>
    </div>
  )
}
export default InnerSizeExample