import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderById, cancelOrder } from '../store/slices/orderSlice';
import toast from 'react-hot-toast';

const OrderDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { order, isLoading, isError, message } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(getOrderById(id));
    }, [dispatch, id]);

    const handleCancel = async () => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            const reason = window.prompt('Please provide a reason for cancellation:', 'Changed my mind');
            if (reason) {
                const result = await dispatch(cancelOrder({ id: order._id, reason }));
                if (!result.error) {
                    toast.success('Order cancelled successfully');
                    dispatch(getOrderById(id)); // Refresh data
                } else {
                    toast.error(result.payload || 'Failed to cancel order');
                }
            }
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
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="text-gray-600">{message}</p>
                    <Link to="/orders" className="btn btn-primary mt-4">
                        My Orders
                    </Link>
                </div>
            </div>
        );
    }

    if (!order) {
        return null;
    }

    return (
        <div className="section">
            <div className="container-custom">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-display font-bold mb-1">Order Details</h1>
                        <p className="text-gray-500">Order ID: {order._id}</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-sm text-gray-500 mb-2">Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${order.orderStatus === 'Cancelled'
                                ? 'bg-red-100 text-red-800'
                                : order.isDelivered
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {order.orderStatus === 'Cancelled' ? 'Cancelled' : (order.isDelivered ? 'Delivered' : (order.orderStatus || 'Processing'))}
                            </span>

                            {(order.orderStatus === 'Pending' || order.orderStatus === 'Processing') && (
                                <button
                                    onClick={handleCancel}
                                    className="text-red-600 hover:text-red-800 text-sm font-medium border border-red-200 px-3 py-1 rounded bg-red-50 hover:bg-red-100 transition-colors"
                                >
                                    Cancel Order
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Shipping Info */}
                    <div className="card p-6 bg-white shadow-sm border">
                        <h2 className="text-lg font-bold mb-4 border-b pb-2">Shipping Information</h2>
                        <p className="font-medium">{order.user?.name}</p>
                        <p>{order.shippingAddress?.address}</p>
                        <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
                        <p>{order.shippingAddress?.country}</p>
                        <div className="mt-4 pt-4 border-t">
                            <span className={`block w-full text-center py-2 rounded font-medium ${order.isDelivered ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                }`}>
                                {order.isDelivered ? `Delivered at ${new Date(order.deliveredAt).toLocaleString()}` : 'Not Delivered'}
                            </span>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="card p-6 bg-white shadow-sm border">
                        <h2 className="text-lg font-bold mb-4 border-b pb-2">Payment Method</h2>
                        <p className="font-medium mb-2">{order.paymentMethod}</p>
                        <div className="mt-4 pt-4 border-t">
                            <span className={`block w-full text-center py-2 rounded font-medium ${order.isPaid
                                ? 'bg-green-50 text-green-700'
                                : order.paymentMethod === 'COD'
                                    ? 'bg-yellow-50 text-yellow-700'
                                    : 'bg-red-50 text-red-700'
                                }`}>
                                {order.isPaid
                                    ? `Paid at ${new Date(order.paidAt).toLocaleString()}`
                                    : order.paymentMethod === 'COD'
                                        ? 'Pay on Delivery'
                                        : 'Not Paid'}
                            </span>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="card p-6 bg-white shadow-sm border md:col-span-3 lg:col-span-1">
                        <h2 className="text-lg font-bold mb-4 border-b pb-2">Order Summary</h2>
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Items Price</span>
                            <span>₹{(Number(order.itemsPrice) || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Shipping</span>
                            <span>₹{(Number(order.shippingPrice) || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Tax</span>
                            <span>₹{(Number(order.taxPrice) || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
                            <span>Total</span>
                            <span>₹{(Number(order.totalPrice) || 0).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Items List */}
                <div className="card bg-white shadow-sm border overflow-hidden">
                    <h2 className="text-lg font-bold p-6 border-b bg-gray-50">Order Items</h2>
                    <div className="divide-y">
                        {order.orderItems?.map((item, index) => (
                            <div key={index} className="flex items-center p-6 hover:bg-gray-50 transition-colors">
                                <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden mr-4">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">?</div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <Link to={`/product/${item.product}`} className="font-medium text-gray-900 hover:text-primary-600">
                                        {item.name}
                                    </Link>
                                </div>
                                <div className="text-right">
                                    <div className="font-medium">{item.quantity} x ₹{item.price}</div>
                                    <div className="text-sm text-gray-500">= ₹{((item.quantity || 0) * (item.price || 0)).toFixed(2)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
