import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SearchX } from 'lucide-react'
import { useGetFeaturedProductsQuery, useGetSubCategoriesQuery } from '../home/api/productHomeApi'
import ProductGrid from '../../features/products/components/ProductGrid'
import SortSelect from '../../features/products/components/SortSelect'
import { sortProducts } from '../../features/products/utils/sortProducts'
import useDocumentTitle from '../../utils/useDocumentTitle'

const chip = (active) =>
    `whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${active ? 'border-brand-700 bg-brand-700 text-white' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = (searchParams.get('q') || '').trim();
    const categoryId = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || 'popular';
    const [input, setInput] = useState(query);
    const [shownQuery, setShownQuery] = useState(query);
    if (query !== shownQuery) {
        // A new search came from the navbar while this page was open
        setShownQuery(query);
        setInput(query);
    }
    useDocumentTitle(query ? `“${query}”` : 'All products');

    const { data, isLoading } = useGetFeaturedProductsQuery();
    const { data: categoryData } = useGetSubCategoriesQuery();
    const categories = categoryData?.categories || [];

    const setParam = (key, value) => {
        const next = new URLSearchParams(searchParams);
        if (value) next.set(key, value);
        else next.delete(key);
        setSearchParams(next, { replace: key !== 'q' });
    };

    const term = query.toLowerCase();
    const matches = (data?.data?.products || []).filter((p) =>
        (!categoryId || p.category?._id === categoryId) &&
        (!term || [p.name, p.brand?.name ?? p.brand, p.category?.name, p.tag]
            .some((field) => typeof field === 'string' && field.toLowerCase().includes(term)))
    );
    const results = sortProducts(matches, sort);

    return (
        <div className="page py-4 sm:py-6">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    setParam('q', input.trim());
                }}
                role="search"
                className="mb-5"
            >
                <label className="relative block">
                    <span className="sr-only">Search products</span>
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                        type="search"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Search protein, vitamins, creatine…"
                        className="h-12 w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-4 text-base shadow-card outline-none focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
                        autoFocus={!query}
                    />
                </label>
            </form>

            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight">
                        {query ? `Results for “${query}”` : 'All products'}
                    </h1>
                    <p className="mt-1 h-5 text-sm text-gray-500">
                        {!isLoading && `${results.length} product${results.length === 1 ? '' : 's'}`}
                    </p>
                </div>
                <SortSelect value={sort} onChange={(v) => setParam('sort', v === 'popular' ? '' : v)} />
            </div>

            <div className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 scrollbar-hide sm:mx-0 sm:flex-wrap sm:px-0">
                <button className={chip(!categoryId)} onClick={() => setParam('category', '')}>All</button>
                {categories.map((c) => (
                    <button key={c._id} className={chip(categoryId === c._id)} onClick={() => setParam('category', c._id)}>
                        {c.name}
                    </button>
                ))}
            </div>

            <h2 className="sr-only">Products</h2>
            <ProductGrid
                products={results}
                isLoading={isLoading}
                skeletons={5}
                eagerCount={4}
                empty={
                    <div className="flex flex-col items-center rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
                        <SearchX className="h-10 w-10 text-gray-400" />
                        <p className="mt-3 font-semibold">No products match your search</p>
                        <p className="mt-1 text-sm text-gray-500">Try another word, or browse all products.</p>
                        <button
                            onClick={() => {
                                setInput('');
                                setSearchParams({});
                            }}
                            className="mt-5 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800"
                        >
                            Clear search
                        </button>
                    </div>
                }
            />
        </div>
    )
}

export default SearchPage
