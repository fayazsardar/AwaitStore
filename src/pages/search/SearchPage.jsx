import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useGetFeaturedProductsQuery } from '../home/api/productHomeApi'
import { ProductCard } from '../../features/products/components/ProductCard'
import { ProductCardShimmer } from '../../features/products/components/skeletons/ProductCardShimmer'
import NoDataFoundBox from '../../components/common/NoDataFoundBox'

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = (searchParams.get('q') || '').trim();
    const [input, setInput] = useState(query);
    const [shownQuery, setShownQuery] = useState(query);
    if (query !== shownQuery) {
        // A new search came from the navbar while this page was open
        setShownQuery(query);
        setInput(query);
    }
    const { data, isLoading } = useGetFeaturedProductsQuery();

    const term = query.toLowerCase();
    const results = (data?.data?.products || []).filter((p) =>
        [p.name, p.brand?.name ?? p.brand, p.category?.name]
            .some((field) => typeof field === 'string' && field.toLowerCase().includes(term))
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    setSearchParams(input.trim() ? { q: input.trim() } : {});
                }}
                className="mb-6"
            >
                <input
                    type="search"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Search products, brands…"
                    aria-label="Search products"
                    className="w-full rounded-2xl border px-4 py-2.5 outline-none focus:ring-2"
                    autoFocus={!query}
                />
            </form>

            <h1 className="text-2xl font-bold mb-6">
                {query ? `Results for "${query}"` : 'All products'}
            </h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1">
                {isLoading ? (
                    <>
                        <ProductCardShimmer />
                        <ProductCardShimmer />
                        <ProductCardShimmer />
                    </>
                ) : results.length > 0 ? (
                    results.map((p) => <ProductCard key={p._id} product={p} />)
                ) : (
                    <div className="col-span-full flex justify-center items-center min-h-[200px]">
                        <NoDataFoundBox />
                    </div>
                )}
            </div>
        </div>
    )
}

export default SearchPage
