import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getMyOrders, reset, cancelOrder } from '../store/slices/orderSlice';
import toast from 'react-hot-toast';

const Orders = () => {
    const dispatch = useDispatch();
    const { orders, isLoading, isError, message } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(getMyOrders());

        return () => {
            dispatch(reset());
        };
    }, [dispatch]);

    return (
        <div className="section">
            <div className="container-custom">
                <h1 className="text-3xl font-display font-bold mb-8">My Orders</h1>

                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
                    </div>
                ) : isError ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
                        {message}
                    </div>
                ) : (
                    <>
                        {orders && orders.length > 0 ? (
                            <div className="overflow-x-auto bg-white rounded-lg shadow-sm border">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b text-gray-500 font-medium text-sm">
                                            <th className="p-4">ORDER ID</th>
                                            <th className="p-4">DATE</th>
                                            <th className="p-4">TOTAL</th>
                                            <th className="p-4">PAID STATUS</th>
                                            <th className="p-4">STATUS</th>
                                            <th className="p-4">ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order._id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                                                <td className="p-4 font-mono text-sm">{order._id}</td>
                                                <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                                                <td className="p-4 font-medium text-gray-900">₹{order.totalPrice.toFixed(2)}</td>
                                                <td className="p-4">
                                                    {order.isPaid ? (
                                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">Paid</span>
                                                    ) : order.paymentMethod === 'COD' ? (
                                                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">Pay on Delivery</span>
                                                    ) : (
                                                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">Not Paid</span>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex flex-col gap-2">
                                                        {order.orderStatus === 'Cancelled' ? (
                                                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium w-fit">Cancelled</span>
                                                        ) : order.isDelivered ? (
                                                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium w-fit">Delivered</span>
                                                        ) : (
                                                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium w-fit">{order.orderStatus || 'Processing'}</span>
                                                        )}

                                                        {(order.orderStatus === 'Pending' || order.orderStatus === 'Processing' || !order.orderStatus) && (
                                                            <button
                                                                onClick={() => {
                                                                    if (window.confirm('Are you sure you want to cancel this order?')) {
                                                                        const reason = window.prompt('Please provide a reason for cancellation:', 'Changed my mind');
                                                                        if (reason) {
                                                                            dispatch(cancelOrder({ id: order._id, reason }))
                                                                                .unwrap()
                                                                                .then(() => {
                                                                                    toast.success('Order cancelled successfully');
                                                                                    dispatch(getMyOrders());
                                                                                })
                                                                                .catch((err) => toast.error(err || 'Failed to cancel order'));
                                                                        }
                                                                    }
                                                                }}
                                                                className="text-red-600 hover:text-red-800 text-xs font-medium border border-red-200 px-2 py-1 rounded bg-red-50 hover:bg-red-100 transition-colors w-fit"
                                                            >
                                                                Cancel
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <Link to={`/order/${order._id}`} className="btn btn-outline py-1 px-3 text-sm">
                                                        Details
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-gray-50 rounded-lg">
                                <h2 className="text-xl font-medium text-gray-900 mb-2">No orders found</h2>
                                <p className="text-gray-500 mb-6">Looks like you haven't placed any orders yet.</p>
                                <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Orders;
