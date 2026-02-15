import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder, reset } from '../store/slices/orderSlice';
import { clearCart } from '../store/slices/cartSlice';
import { validateCoupon, removeCoupon } from '../store/slices/couponSlice';
import toast from 'react-hot-toast';
import axios from 'axios';

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { cartItems, totalPrice } = useSelector((state) => state.cart);
    const { isError, message } = useSelector((state) => state.orders);
    const { user, token } = useSelector((state) => state.auth);
    const { appliedCoupon: coupon, isLoading: isCouponLoading } = useSelector((state) => state.coupons);

    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [couponCode, setCouponCode] = useState('');

    const [shippingAddress, setShippingAddress] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        pincode: user?.address?.pincode || '',
        country: user?.address?.country || 'India',
    });

    // 🔥 Centralized discount calculation
    const discountAmount = coupon?.discountAmount || 0;
    const finalTotal = totalPrice - discountAmount;

    useEffect(() => {
        if (user) {
            setShippingAddress({
                name: user.name || '',
                phone: user.phone || '',
                street: user.address?.street || '',
                city: user.address?.city || '',
                state: user.address?.state || '',
                pincode: user.address?.pincode || '',
                country: user.address?.country || 'India',
            });
        }
    }, [user]);

    useEffect(() => {
        if (isError) {
            toast.error(message);
            dispatch(reset());
        }
    }, [isError, message, dispatch]);

    const handleChange = (e) => {
        setShippingAddress({
            ...shippingAddress,
            [e.target.name]: e.target.value,
        });
    };

    const handleApplyCoupon = () => {
        if (!couponCode.trim()) {
            toast.error('Please enter a coupon code');
            return;
        }

        dispatch(validateCoupon({ code: couponCode, orderAmount: totalPrice }))
            .unwrap()
            .then(() => {
                toast.success('Coupon applied successfully!');
                setCouponCode('');
            })
            .catch((err) => {
                toast.error(err || 'Failed to apply coupon');
                setCouponCode('');
            });
    };

    const handleRemoveCoupon = () => {
        dispatch(removeCoupon());
        setCouponCode('');
        toast.success('Coupon removed');
    };

    const handleOnlinePayment = async (orderData) => {
        try {
            const { data: { key } } = await axios.get('/api/payment/getkey', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const { data: { order } } = await axios.post('/api/payment/checkout', {
                amount: orderData.totalPrice
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const options = {
                key,
                amount: order.amount,
                currency: "INR",
                name: "LCIT Herbal Store",
                description: "Order Payment",
                order_id: order.id,
                handler: async function (response) {
                    try {
                        const verifyData = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            order_id: orderData._id
                        };

                        const { data } = await axios.post('/api/payment/verification', verifyData, {
                            headers: { Authorization: `Bearer ${token}` }
                        });

                        if (data.success) {
                            toast.success('Payment Successful');
                            dispatch(clearCart());
                            dispatch(reset());
                            navigate(`/order/${orderData._id}`);
                        } else {
                            toast.error('Payment Verification Failed');
                        }
                    } catch {
                        toast.error('Payment Verification Error');
                        navigate(`/order/${orderData._id}`);
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: shippingAddress.phone
                },
                theme: {
                    color: "#22c55e"
                }
            };

            const razor = new window.Razorpay(options);
            razor.open();

        } catch (error) {
            toast.error('Online payment initialization failed.');
            navigate(`/order/${orderData._id}`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        const orderData = {
            orderItems: cartItems.map((item) => ({
                product: item._id,
                name: item.name,
                image: item.images?.[0]?.url || '',
                price: item.price,
                quantity: item.quantity,
            })),
            shippingAddress,
            paymentMethod,
            itemsPrice: totalPrice,
            taxPrice: 0,
            shippingPrice: 0,
            discountPrice: discountAmount,
            totalPrice: finalTotal,
            coupon: coupon ? coupon.code : null,
        };

        try {
            const resultAction = await dispatch(createOrder(orderData));

            if (createOrder.fulfilled.match(resultAction)) {
                const newOrder = resultAction.payload.data;

                if (paymentMethod === 'Razorpay') {
                    await handleOnlinePayment(newOrder);
                } else {
                    toast.success('Order placed successfully!');
                    dispatch(clearCart());
                    dispatch(reset());
                    navigate(`/order/${newOrder._id}`);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="section">
            <div className="container-custom">
                <h1 className="text-3xl font-display font-bold mb-8">Checkout</h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-12">

                    {/* Shipping */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold">Shipping Details</h2>
                        {Object.keys(shippingAddress).map((key) => (
                            <input
                                key={key}
                                type="text"
                                name={key}
                                value={shippingAddress[key]}
                                onChange={handleChange}
                                required
                                className="input"
                                placeholder={key}
                            />
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                        {cartItems.map((item) => (
                            <div key={item._id} className="flex justify-between text-sm mb-2">
                                <span>{item.quantity} x {item.name}</span>
                                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}

                        {/* Coupon */}
                        <div className="my-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    className="input"
                                    placeholder="Coupon Code"
                                    disabled={!!coupon}
                                />
                                {coupon ? (
                                    <button type="button" onClick={handleRemoveCoupon} className="btn bg-red-100 text-red-600">
                                        Remove
                                    </button>
                                ) : (
                                    <button type="button" onClick={handleApplyCoupon} className="btn btn-outline">
                                        {isCouponLoading ? 'Applying...' : 'Apply'}
                                    </button>
                                )}
                            </div>

                            {coupon && (
                                <div className="text-green-600 text-sm mt-2">
                                    Coupon "{coupon.code}" applied (-₹{discountAmount.toFixed(2)})
                                </div>
                            )}
                        </div>

                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>₹{totalPrice.toFixed(2)}</span>
                            </div>

                            {coupon && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount</span>
                                    <span>-₹{discountAmount.toFixed(2)}</span>
                                </div>
                            )}

                            <div className="flex justify-between font-bold text-lg border-t pt-2">
                                <span>Total</span>
                                <span className="text-primary-600">
                                    ₹{finalTotal.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="mt-6 space-y-2">
                            <label>
                                <input
                                    type="radio"
                                    value="COD"
                                    checked={paymentMethod === 'COD'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                /> COD
                            </label>

                            <label className="ml-4">
                                <input
                                    type="radio"
                                    value="Razorpay"
                                    checked={paymentMethod === 'Razorpay'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                /> Razorpay
                            </label>
                        </div>

                        <button type="submit" className="btn btn-primary w-full mt-6">
                            {paymentMethod === 'Razorpay' ? 'Proceed to Pay' : 'Place Order'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default Checkout;
