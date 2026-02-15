import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../../store/slices/authSlice';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { totalItems } = useSelector((state) => state.cart);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="container-custom">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="text-2xl font-display font-bold gradient-text">
                        LCIT Herbal Store
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors">
                            Home
                        </Link>
                        <Link to="/shop" className="text-gray-700 hover:text-primary-600 transition-colors">
                            Shop
                        </Link>
                        <Link to="/about" className="text-gray-700 hover:text-primary-600 transition-colors">
                            About
                        </Link>
                        <Link to="/contact" className="text-gray-700 hover:text-primary-600 transition-colors">
                            Contact
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link to="/cart" className="relative text-gray-700 hover:text-primary-600 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="flex items-center space-x-4">
                                <Link to="/profile" className="text-gray-700 hover:text-primary-600 transition-colors">
                                    Profile
                                </Link>
                                <Link to="/orders" className="text-gray-700 hover:text-primary-600 transition-colors">
                                    My Orders
                                </Link>
                                {user.role === 'admin' && (
                                    <Link to="/admin/dashboard" className="text-gray-700 hover:text-primary-600 transition-colors">
                                        Admin
                                    </Link>
                                )}
                                {user.role === 'agent' && (
                                    <Link to="/agent/dashboard" className="text-gray-700 hover:text-primary-600 transition-colors">
                                        Agent
                                    </Link>
                                )}
                                <button
                                    onClick={onLogout}
                                    className="text-gray-700 hover:text-red-600 transition-colors font-medium ml-2"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-primary">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
