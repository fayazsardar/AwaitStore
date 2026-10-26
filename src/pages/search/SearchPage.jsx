import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { useGetFeaturedProductsQuery } from '../home/api/productHomeApi'
import { ProductCard } from '../../features/products/components/ProductCard'
import { ProductCardShimmer } from '../../features/products/components/skeletons/ProductCardShimmer'
import NoDataFoundBox from '../../components/common/NoDataFoundBox'

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = (searchParams.get('q') || '').trim();
    const { data, isLoading } = useGetFeaturedProductsQuery();

    const term = query.toLowerCase();
    const results = (data?.data?.products || []).filter((p) =>
        [p.name, p.brand?.name ?? p.brand, p.category?.name]
            .some((field) => typeof field === 'string' && field.toLowerCase().includes(term))
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-6">
                Results for "{query}"
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
