import React, { memo, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();

    const inStock = Number(product?.stock) > 0;

    // ⭐ Safe numeric rating (supports decimals)
    const averageRating = useMemo(() => {
        return Number(product?.ratings?.average) || 0;
    }, [product?.ratings?.average]);

    const reviewCount = product?.ratings?.count || 0;

    // 💰 Price formatting
    const formattedPrice = useMemo(() => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(Number(product?.price) || 0);
    }, [product?.price]);

    const formattedOriginalPrice = useMemo(() => {
        if (!product?.originalPrice) return null;

        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(Number(product?.originalPrice));
    }, [product?.originalPrice]);

    // 🎯 Discount logic
    const hasDiscount =
        product?.originalPrice &&
        Number(product?.originalPrice) > Number(product?.price);

    const discountPercentage = useMemo(() => {
        if (!hasDiscount) return 0;

        const discount =
            ((product?.originalPrice - product?.price) /
                product?.originalPrice) *
            100;

        return Math.round(discount);
    }, [hasDiscount, product?.originalPrice, product?.price]);

    // 🖼 Image fallback logic
    const imageUrl =
        product?.images?.[0]?.url ||
        product?.images?.[0] ||
        product?.image ||
        null;

    // 🛒 Add to Cart
    const handleAddToCart = useCallback(() => {
        if (!inStock) {
            toast.error('Out of stock');
            return;
        }

        dispatch(addToCart({ ...product, quantity: 1 }));
        toast.success(`${product?.name} added to cart`);
    }, [dispatch, product, inStock]);

    // ⭐ Render stars (supports decimals like 4.3)
    const renderStars = (rating) => {
        const safeRating = Number(rating) || 0;

        return (
            <div className="flex items-center text-yellow-400 text-sm">
                {[1, 2, 3, 4, 5].map((star) => {
                    if (safeRating >= star) {
                        return <span key={star}>★</span>;
                    } else if (safeRating >= star - 0.5) {
                        return <span key={star}>☆</span>; // Optional: replace with half-star SVG if needed
                    } else {
                        return <span key={star}>☆</span>;
                    }
                })}
            </div>
        );
    };

    if (!product) return null;

    return (
        <div className="card group hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden bg-white">

            {/* Image Section */}
            <Link
                to={`/product/${product._id}`}
                className="block relative aspect-square bg-gray-100 overflow-hidden"
            >
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src =
                                'https://via.placeholder.com/300?text=No+Image';
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                    </div>
                )}

                {/* Category Badge */}
                {product.category && (
                    <span className="absolute top-2 left-2 bg-white/90 px-2 py-1 text-xs font-medium rounded-full shadow">
                        {product.category}
                    </span>
                )}

                {/* Discount Badge */}
                {hasDiscount && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                        -{discountPercentage}%
                    </span>
                )}

                {/* Out of Stock Overlay */}
                {!inStock && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
                        <span className="bg-red-500 text-white px-4 py-1 text-sm font-bold rounded shadow transform -rotate-12">
                            OUT OF STOCK
                        </span>
                    </div>
                )}
            </Link>

            {/* Info Section */}
            <div className="p-4">
                <Link to={`/product/${product._id}`}>
                    <h3 className="text-lg font-semibold mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors">
                        {product.name}
                    </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-2">
                    {renderStars(averageRating)}
                    <span className="text-xs text-gray-500">
                        ({reviewCount})
                    </span>
                </div>

                {/* Price */}
                <div className="flex justify-between items-end mt-4">
                    <div>
                        <span className="text-xl font-bold text-primary-600">
                            {formattedPrice}
                        </span>

                        {hasDiscount && (
                            <span className="text-sm text-gray-400 line-through ml-2">
                                {formattedOriginalPrice}
                            </span>
                        )}
                    </div>

                    {/* Cart Button */}
                    <button
                        onClick={handleAddToCart}
                        disabled={!inStock}
                        className={`p-2 rounded-lg transition-all duration-200 
                        ${inStock
                                ? 'bg-primary-50 text-primary-600 hover:bg-primary-600 hover:text-white'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                        title={inStock ? 'Add to Cart' : 'Out of Stock'}
                    >
                        🛒
                    </button>
                </div>
            </div>
        </div>
    );
};

export default memo(ProductCard);
