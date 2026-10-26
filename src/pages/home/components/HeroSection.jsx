import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star } from 'lucide-react'

// Text renders instantly (it is the largest paint); product images fill a fixed box when data arrives.
const HeroSection = ({ products = [] }) => {
  const showcase = products.slice(0, 3)

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-950 via-brand-900 to-brand-700 text-white">
      <div aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl" />

      <div className="relative grid items-center gap-8 px-6 py-8 sm:px-10 sm:py-10 md:grid-cols-2 md:py-14 lg:px-14">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-brand-100 ring-1 ring-white/15">
            <Star className="h-3.5 w-3.5 fill-accent-500 text-accent-500" />
            Rated 4.6 by 20,000+ customers
          </p>
          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
            Fuel your fitness,{' '}
            <span className="text-accent-500">naturally.</span>
          </h1>
          <p className="mt-4 max-w-md text-base text-brand-100 sm:text-lg">
            Lab-tested protein, vitamins and performance supplements, delivered free to your door.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/search"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-900 shadow-lg shadow-brand-950/30 transition hover:bg-brand-50"
            >
              Shop all products <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/categories/cat-protein"
              className="inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/10"
            >
              Explore protein
            </Link>
          </div>
        </div>

        {/* Fixed-size showcase so nothing shifts while products load */}
        <div className="relative hidden h-72 md:block lg:h-80" aria-hidden="true">
          <div className="absolute inset-x-8 bottom-0 h-16 rounded-[50%] bg-black/20 blur-2xl" />
          {showcase.map((p, i) => (
            <img
              key={p._id}
              src={p.defaultThumbnail}
              alt=""
              width="400"
              height="400"
              className={`absolute bottom-0 drop-shadow-2xl ${
                i === 0
                  ? 'left-1/2 z-10 h-full -translate-x-1/2'
                  : i === 1
                    ? 'left-0 h-3/4 -rotate-6'
                    : 'right-0 h-3/4 rotate-6'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeroSection
