import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useFetchProductsByCategoryQuery } from '../api/categoryPageApi'
import { useGetSubCategoriesQuery } from '../../home/api/productHomeApi'
import ProductGrid from '../../../features/products/components/ProductGrid'
import SortSelect from '../../../features/products/components/SortSelect'
import { sortProducts } from '../../../features/products/utils/sortProducts'
import useDocumentTitle from '../../../utils/useDocumentTitle'

export const CategoryPage = () => {
    const { id } = useParams();
    const [sort, setSort] = useState('popular');

    const { data: productsByCategory, isLoading: loadingProducts } = useFetchProductsByCategoryQuery(id);
    const { data: categoryData } = useGetSubCategoriesQuery();
    const category = categoryData?.categories?.find((c) => c._id === id);
    const products = sortProducts(productsByCategory?.data || [], sort);
    useDocumentTitle(category?.name);

    return (
        <div className="page py-4 sm:py-6">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1 text-sm text-gray-500">
                <Link to="/" className="hover:text-gray-900">Home</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="font-medium text-gray-900">{category?.name || 'Category'}</span>
            </nav>

            {/* Header (fixed height: no layout shift when the name/count arrive) */}
            <div
                className="relative mb-6 flex min-h-32 items-center overflow-hidden rounded-3xl px-6 py-6 sm:px-10"
                style={{ backgroundColor: category?.tint || 'var(--color-brand-50)' }}
            >
                <div className="relative z-10">
                    <h1 className="text-2xl font-extrabold tracking-tight sm:text-4xl">{category?.name || ' '}</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        {loadingProducts ? ' ' : `${products.length} product${products.length === 1 ? '' : 's'}`}
                    </p>
                </div>
                {category?.thumbnail && (
                    <img
                        src={category.thumbnail}
                        alt=""
                        width="400"
                        height="400"
                        className="absolute -bottom-6 right-2 h-40 w-40 object-contain opacity-90 sm:right-10 sm:h-44 sm:w-44"
                    />
                )}
            </div>

            <div className="mb-4 flex items-center justify-end">
                <SortSelect value={sort} onChange={setSort} />
            </div>

            <h2 className="sr-only">Products</h2>
            <ProductGrid products={products} isLoading={loadingProducts} skeletons={5} eagerCount={4} />
        </div>
    )
}
