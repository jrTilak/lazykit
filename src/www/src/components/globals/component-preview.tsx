import React, { Suspense } from 'react'
import Loading from '../loaders/loading'
type Props = {
  children: React.ReactNode
}

export const ComponentPreview = ({ children }: Props) => {
  return (
    <Suspense fallback={<Loading className='w-full h-32 shadow-inner border rounded-lg bg-muted/40 p-4' />}>
      <div className="w-full h-fit shadow-inner border rounded-lg bg-muted/40 p-4">
        {children}
      </div>
    </Suspense>

  )
}