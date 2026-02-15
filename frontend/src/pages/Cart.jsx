import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateQuantity, removeFromCart } from '../store/slices/cartSlice';

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems, totalItems, totalPrice } = useSelector((state) => state.cart);

    const handleQtyChange = (id, newQty) => {
        if (newQty < 1) return;
        dispatch(updateQuantity({ id, quantity: newQty }));
    };

    const handleRemove = (id) => {
        dispatch(removeFromCart(id));
    };

    const handleCheckout = () => {
        navigate('/checkout'); // Placeholder route
    };

    if (cartItems.length === 0) {
        return (
            <div className="section">
                <div className="container-custom py-20 text-center">
                    <svg className="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven't added any herbal products to your cart yet.</p>
                    <Link to="/shop" className="btn btn-primary px-8 py-3 text-lg">
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="section">
            <div className="container-custom">
                <h1 className="text-3xl md:text-4xl font-display font-bold mb-8">Shopping Cart</h1>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Cart Items */}
                    <div className="lg:w-2/3">
                        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b font-medium text-gray-500 text-sm">
                                <div className="col-span-6">PRODUCT</div>
                                <div className="col-span-2 text-center">PRICE</div>
                                <div className="col-span-2 text-center">QUANTITY</div>
                                <div className="col-span-2 text-right">TOTAL</div>
                            </div>

                            {cartItems.map((item) => (
                                <div key={item._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 border-b last:border-0 items-center">
                                    <div className="col-span-12 md:col-span-6 flex items-center gap-4">
                                        <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden relative">
                                            {item.images && item.images.length > 0 ? (
                                                <img src={item.images[0].url} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <Link to={`/product/${item._id}`} className="font-bold text-gray-900 hover:text-primary-600 transition-colors line-clamp-1">
                                                {item.name}
                                            </Link>
                                            <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                                            <button
                                                onClick={() => handleRemove(item._id)}
                                                className="text-red-500 hover:text-red-700 text-xs font-medium mt-2 flex items-center"
                                            >
                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Remove
                                            </button>
                                        </div>
                                    </div>

                                    <div className="col-span-6 md:col-span-2 flex md:justify-center items-center">
                                        <span className="md:hidden text-gray-500 mr-2 text-sm">Price:</span>
                                        <span className="font-medium text-gray-900">₹{(Number(item.price) || 0)}</span>
                                    </div>

                                    <div className="col-span-6 md:col-span-2 flex md:justify-center items-center">
                                        <span className="md:hidden text-gray-500 mr-2 text-sm">Qty:</span>
                                        <div className="flex items-center border rounded">
                                            <button
                                                onClick={() => handleQtyChange(item._id, (Number(item.quantity) || 1) - 1)}
                                                className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                                            >
                                                -
                                            </button>
                                            <span className="px-2 py-1 text-sm font-medium w-8 text-center">{(Number(item.quantity) || 0)}</span>
                                            <button
                                                onClick={() => handleQtyChange(item._id, (Number(item.quantity) || 1) + 1)}
                                                className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <div className="col-span-12 md:col-span-2 text-right flex justify-between md:block items-center border-t md:border-t-0 pt-4 md:pt-0 mt-4 md:mt-0">
                                        <span className="md:hidden font-medium text-gray-900">Total:</span>
                                        <span className="font-bold text-primary-600">₹{((Number(item.price) || 0) * (Number(item.quantity) || 0)).toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-24">
                            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                            <div className="flex justify-between mb-4 text-gray-600">
                                <span>Subtotal ({(Number(totalItems) || 0)} items)</span>
                                <span>₹{(Number(totalPrice) || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mb-4 text-gray-600">
                                <span>Shipping</span>
                                <span className="text-green-600 font-medium">Free</span>
                            </div>
                            <div className="flex justify-between mb-6 text-gray-600">
                                <span>Tax (Estimate)</span>
                                <span>₹0.00</span>
                            </div>

                            <div className="border-t pt-4 mb-8">
                                <div className="flex justify-between items-end">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <span className="text-2xl font-bold text-primary-600">₹{(Number(totalPrice) || 0).toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="btn btn-primary w-full py-4 text-lg font-bold shadow-lg shadow-primary-500/30 mb-4"
                            >
                                Proceed to Checkout
                            </button>

                            <Link to="/shop" className="btn btn-outline w-full text-center block">
                                Continue Shopping
                            </Link>

                            <div className="mt-6 flex justify-center space-x-2 text-gray-400">
                                {/* Payment Icons placeholders */}
                                <div className="w-8 h-5 bg-gray-200 rounded"></div>
                                <div className="w-8 h-5 bg-gray-200 rounded"></div>
                                <div className="w-8 h-5 bg-gray-200 rounded"></div>
                                <div className="w-8 h-5 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
