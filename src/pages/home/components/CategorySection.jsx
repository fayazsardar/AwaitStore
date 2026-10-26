import React from 'react'
import { Link } from 'react-router-dom'
import { LayoutGrid } from 'lucide-react'

const tile = 'group flex w-24 shrink-0 flex-col items-center gap-2 text-center sm:w-auto'
const circle = 'flex aspect-square w-full items-center justify-center overflow-hidden rounded-full ring-1 ring-black/5 transition duration-200 group-hover:-translate-y-1 group-hover:shadow-lift'

const CategorySection = ({ CategorySectionData = [], isLoading }) => {
  return (
    <section aria-labelledby="categories-heading">
      <div className="mb-4 flex items-end justify-between">
        <h2 id="categories-heading" className="text-xl font-bold tracking-tight sm:text-2xl">Shop by category</h2>
      </div>

      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide sm:mx-0 sm:grid sm:grid-cols-6 sm:gap-6 sm:overflow-visible sm:px-0">
        <Link to="/search" className={tile}>
          <span className={`${circle} bg-brand-700 text-white`}>
            <LayoutGrid className="h-8 w-8" />
          </span>
          <span className="text-sm font-medium text-gray-800">All products</span>
        </Link>

        {isLoading
          ? Array.from({ length: 5 }, (_, i) => (
              <div key={i} className={tile} aria-hidden="true">
                <span className={`${circle} skeleton`} />
                <span className="skeleton h-4 w-16 rounded" />
              </div>
            ))
          : CategorySectionData.map((c) => (
              <Link key={c._id} to={`/categories/${c._id}`} className={tile}>
                <span className={circle} style={{ backgroundColor: c.tint || '#f3f4f6' }}>
                  <img src={c.thumbnail} alt="" width="400" height="400" loading="lazy" decoding="async" className="h-4/5 w-4/5 object-contain" />
                </span>
                <span className="text-sm font-medium text-gray-800">{c.name}</span>
              </Link>
            ))}
      </div>
    </section>
  )
}

export default CategorySection
