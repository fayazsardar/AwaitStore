import React from 'react'

// Same box as ProductCard, so content does not jump when products arrive
export const ProductCardShimmer = () => {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white" aria-hidden="true">
      <div className="skeleton aspect-square" />
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="skeleton h-4 w-16 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-2/3 rounded" />
        <div className="mt-2 flex items-end justify-between">
          <div className="skeleton h-5 w-20 rounded" />
          <div className="skeleton h-9 w-9 rounded-full" />
        </div>
      </div>
    </div>
  )
}
