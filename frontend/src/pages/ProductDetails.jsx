import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct, reset } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import {
    getProductReviews,
    reset as resetReviews
} from '../store/slices/reviewSlice';
import { getMyOrders } from '../store/slices/orderSlice';
import ProductReviews from '../components/ProductReviews';
import toast from 'react-hot-toast';

const ProductDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const { product, isLoading, isError, message } = useSelector(
        (state) => state.products
    );

    const { user } = useSelector((state) => state.auth);
    const { reviews: productReviews } = useSelector((state) => state.reviews);
    const { orders } = useSelector((state) => state.orders);

    const [qty, setQty] = useState(1);
    const [selectedImage, setSelectedImage] = useState('');
    const [canReview, setCanReview] = useState(false);
    const [activeTab, setActiveTab] = useState('description');

    // 🔹 Load product + reviews
    useEffect(() => {
        dispatch(getProduct(id));
        dispatch(getProductReviews(id));

        if (user) {
            dispatch(getMyOrders());
        }

        return () => {
            dispatch(reset());
            dispatch(resetReviews());
        };
    }, [dispatch, id, user]);

    // 🔹 Safe image handling
    useEffect(() => {
        if (product?.images?.length > 0) {
            const firstImage =
                product.images[0]?.url || product.images[0];
            setSelectedImage(firstImage);
        }
    }, [product]);

    // 🔹 Check review eligibility
    useEffect(() => {
        if (!user || !orders?.length) {
            setCanReview(false);
            return;
        }

        const hasPurchased = orders.some((order) =>
            order.orderStatus === 'Delivered' &&
            order.orderItems.some((item) =>
                (item.product?._id || item.product) === id
            )
        );

        setCanReview(hasPurchased);
    }, [user, orders, id]);

    // ⭐ Safe numeric rating
    const averageRating = useMemo(() => {
        return Number(product?.ratings?.average) || 0;
    }, [product?.ratings?.average]);

    const reviewCount = product?.ratings?.count || 0;

    const renderStars = (rating) => {
        const safeRating = Number(rating) || 0;

        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        className={`w-5 h-5 ${star <= Math.round(safeRating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={star <= Math.round(safeRating) ? 0 : 2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                    </svg>
                ))}
            </div>
        );
    };

    const handleAddToCart = () => {
        if (product?.stock > 0) {
            dispatch(addToCart({ ...product, quantity: Number(qty) }));
            toast.success('Added to cart');
        } else {
            toast.error('Out of stock');
        }
    };

    if (isLoading) {
        return (
            <div className="section">
                <div className="container-custom flex justify-center items-center h-[50vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="section">
                <div className="container-custom text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">
                        Error
                    </h2>
                    <p>{message}</p>
                    <Link to="/shop" className="btn btn-primary mt-4">
                        Back to Shop
                    </Link>
                </div>
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="section">
            <div className="container-custom">

                {/* Back Button */}
                <Link
                    to="/shop"
                    className="text-gray-500 hover:text-primary-600 mb-8 inline-flex items-center"
                >
                    ← Back to Shop
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                    {/* 🖼 Image Section */}
                    <div>
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
                            {selectedImage ? (
                                <img
                                    src={selectedImage}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                    No Image
                                </div>
                            )}
                        </div>

                        {product?.images?.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto">
                                {product.images.map((img, index) => {
                                    const imgUrl = img?.url || img;
                                    return (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                setSelectedImage(imgUrl)
                                            }
                                            className={`w-20 h-20 rounded-md overflow-hidden border-2 ${selectedImage === imgUrl
                                                ? 'border-primary-600'
                                                : 'border-transparent'
                                                }`}
                                        >
                                            <img
                                                src={imgUrl}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* 📦 Product Info */}
                    <div>
                        <h1 className="text-3xl font-bold mb-4">
                            {product.name}
                        </h1>

                        <div className="flex items-center mb-6">
                            {renderStars(averageRating)}
                            <span className="ml-2 text-sm text-gray-500">
                                ({reviewCount} reviews)
                            </span>
                        </div>

                        <div className="mb-6">
                            <span className="text-3xl font-bold text-primary-600">
                                ₹{product.price}
                            </span>

                            {product.originalPrice &&
                                product.originalPrice > product.price && (
                                    <span className="ml-3 text-gray-400 line-through">
                                        ₹{product.originalPrice}
                                    </span>
                                )}
                        </div>

                        <p className="text-gray-600 mb-8">
                            {product.description}
                        </p>

                        {/* Stock */}
                        <div className="mb-6">
                            {product.stock > 0 ? (
                                <span className="text-green-600 font-medium">
                                    In Stock ({product.stock} available)
                                </span>
                            ) : (
                                <span className="text-red-600 font-medium">
                                    Out of Stock
                                </span>
                            )}
                        </div>

                        {/* Quantity */}
                        {product.stock > 0 && (
                            <div className="flex items-center mb-6">
                                <button
                                    onClick={() =>
                                        setQty(Math.max(1, qty - 1))
                                    }
                                    className="px-3 py-1 border"
                                >
                                    -
                                </button>

                                <span className="px-4">{qty}</span>

                                <button
                                    onClick={() =>
                                        setQty(
                                            Math.min(product.stock, qty + 1)
                                        )
                                    }
                                    className="px-3 py-1 border"
                                >
                                    +
                                </button>
                            </div>
                        )}

                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className={`w-full py-3 rounded-lg font-bold ${product.stock > 0
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-200 text-gray-400'
                                }`}
                        >
                            {product.stock > 0
                                ? 'Add to Cart'
                                : 'Out of Stock'}
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mt-20">
                    <div className="border-b mb-6 flex gap-8">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`pb-3 ${activeTab === 'description'
                                ? 'border-b-2 border-primary-600 text-primary-600'
                                : 'text-gray-500'
                                }`}
                        >
                            Description
                        </button>

                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`pb-3 ${activeTab === 'reviews'
                                ? 'border-b-2 border-primary-600 text-primary-600'
                                : 'text-gray-500'
                                }`}
                        >
                            Reviews ({productReviews?.length || 0})
                        </button>
                    </div>

                    {activeTab === 'description' ? (
                        <p className="text-gray-600">
                            {product.description}
                        </p>
                    ) : (
                        <ProductReviews
                            productId={id}
                            reviews={productReviews}
                            canReview={canReview}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
