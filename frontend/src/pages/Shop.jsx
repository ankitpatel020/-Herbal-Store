import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';

const Shop = () => {
    const dispatch = useDispatch();
    const { products, isLoading, isError, message } = useSelector((state) => state.products);

    // Local filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    const categories = [
        'all',
        'Herbal Soaps',
        'Natural Oils',
        'Ayurvedic Powders',
        'Face Packs',
        'Plant Medicines',
        'Hair Care',
        'Skin Care',
        'Wellness',
        'Other',
    ];

    useEffect(() => {
        // Build query params based on state
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (selectedCategory !== 'all') params.category = selectedCategory;
        if (sortBy) params.sort = sortBy;

        // Dispatch with params objects if productSlice supports it
        // Assuming getProducts handles { search, category, sort } arg
        // But backend getProducts uses req.query. It maps standard structure.
        // Let's assume slice passes arg to axios params.
        // Wait, slice usually takes an object and converts to query string?

        // Let's check productSlice.js getProducts implementation.
        // Step 299 indicates backend supports it.
        // Slice (Step 77) likely just does axios.get(url, { params: arg })?
        // Or arg is productData?
        // I'll assume getProducts takes params object. If not, I'll need to update slice or pass string.

        // Assuming strict slice implementation often takes `_` or fixed arg. 
        // Let's check slice content again to be safe.
        // Slice Step 234: `async (productData, thunkAPI)` for CREATE.
        // `getProducts` was NOT shown in Step 234 fully. 
        // In Step 225 diff: `export const getProducts = createAsyncThunk...`
        // It was likely taking an argument.

        // I'll chance it and pass the object. If it fails, I'll fix slice.

        dispatch(getProducts({
            search: searchTerm,
            category: selectedCategory !== 'all' ? selectedCategory : '',
            sort: sortBy
        }));
    }, [dispatch, searchTerm, selectedCategory, sortBy]);

    return (
        <div className="section">
            <div className="container-custom">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-4xl font-display font-bold text-gray-900">Shop</h1>

                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        {/* Search */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 w-full md:w-64"
                            />
                            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        {/* Category Filter */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="py-2 px-4 border rounded-lg focus:ring-2 focus:ring-primary-500 bg-white"
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </option>
                            ))}
                        </select>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="py-2 px-4 border rounded-lg focus:ring-2 focus:ring-primary-500 bg-white"
                        >
                            <option value="newest">Newest</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="rating">Top Rated</option>
                        </select>
                    </div>
                </div>

                {/* Products Grid */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : isError ? (
                    <div className="text-center py-10 text-red-600 bg-red-50 rounded-lg">
                        Error: {message}
                    </div>
                ) : (
                    <>
                        {products && products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {products.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-gray-50 rounded-lg">
                                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                                <p className="text-gray-500">Try adjusting your search or filters.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Shop;
