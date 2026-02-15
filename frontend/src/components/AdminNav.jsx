import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminNav = () => {
    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard' },
        { name: 'Products', path: '/admin/products' },
        { name: 'Orders', path: '/admin/orders' },
        { name: 'Users', path: '/admin/users' },
        { name: 'Reviews', path: '/admin/reviews' },
        { name: 'Coupons', path: '/admin/coupons' },
    ];

    return (
        <div className="bg-white shadow-sm border-b mb-8">
            <div className="container-custom">
                <div className="flex space-x-8 overflow-x-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${isActive
                                    ? 'border-primary-600 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`
                            }
                        >
                            {item.name}
                        </NavLink>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminNav;
