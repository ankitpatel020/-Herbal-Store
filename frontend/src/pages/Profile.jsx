import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, reset } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('personal');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });

    const [addressData, setAddressData] = useState({
        street: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
    });

    const { name, email, phone, password, confirmPassword } = formData;
    const { street, city, state, pincode, country } = addressData;

    const dispatch = useDispatch();
    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (user) {
            setFormData((prevState) => ({
                ...prevState,
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
            }));
            setAddressData({
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
        }

        if (isSuccess) {
            toast.success('Profile updated successfully');
        }

        dispatch(reset());
    }, [isError, isSuccess, message, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onAddressChange = (e) => {
        setAddressData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmitPersonal = (e) => {
        e.preventDefault();

        if (password && password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        const userData = {
            name,
            email,
            phone,
            password: password || undefined,
        };

        dispatch(updateProfile(userData));
    };

    const onSubmitAddress = (e) => {
        e.preventDefault();

        const userData = {
            address: addressData,
        };

        dispatch(updateProfile(userData));
    };

    if (!user) {
        return <div className="section text-center">Loading user data...</div>;
    }

    return (
        <div className="section">
            <div className="container-custom">
                <h1 className="text-4xl font-display font-bold mb-8">My Profile</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="col-span-1">
                        <div className="card p-6 text-center sticky top-24">
                            <div className="w-32 h-32 mx-auto bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-4xl font-bold mb-4">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <h2 className="text-xl font-bold mb-1">{user.name}</h2>
                            <p className="text-gray-600 mb-4">{user.email}</p>

                            <div className="bg-gray-50 rounded-lg p-4 text-left">
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-gray-500">Role</span>
                                    <span className="text-sm font-medium capitalize">{user.role}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-gray-500">Phone</span>
                                    <span className="text-sm font-medium">{user.phone || 'Not set'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Member Since</span>
                                    <span className="text-sm font-medium">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Update Form */}
                    <div className="col-span-1 md:col-span-2">
                        {/* Tabs */}
                        <div className="flex border-b mb-6">
                            <button
                                className={`px-6 py-3 font-medium ${activeTab === 'personal' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500'}`}
                                onClick={() => setActiveTab('personal')}
                            >
                                Personal Details
                            </button>
                            <button
                                className={`px-6 py-3 font-medium ${activeTab === 'address' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500'}`}
                                onClick={() => setActiveTab('address')}
                            >
                                Address
                            </button>
                        </div>

                        {/* Personal Details Tab */}
                        {activeTab === 'personal' && (
                            <div className="card p-8">
                                <h3 className="text-xl font-bold mb-6">Update Personal Details</h3>
                                <form onSubmit={onSubmitPersonal}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={name}
                                                onChange={onChange}
                                                className="input"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={email}
                                                onChange={onChange}
                                                className="input"
                                                disabled
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Email cannot be changed directly.</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={phone}
                                                onChange={onChange}
                                                className="input"
                                                placeholder="+91 9876543210"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                            <input
                                                type="password"
                                                name="password"
                                                value={password}
                                                onChange={onChange}
                                                className="input"
                                                placeholder="Leave blank to keep current"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={confirmPassword}
                                                onChange={onChange}
                                                className="input"
                                                placeholder="Leave blank to keep current"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end">
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Updating...' : 'Update Profile'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Address Tab */}
                        {activeTab === 'address' && (
                            <div className="card p-8">
                                <h3 className="text-xl font-bold mb-6">Address Details</h3>
                                <form onSubmit={onSubmitAddress}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                            <input
                                                type="text"
                                                name="street"
                                                value={street}
                                                onChange={onAddressChange}
                                                className="input"
                                                placeholder="123 Main St, Apartment 4B"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={city}
                                                    onChange={onAddressChange}
                                                    className="input"
                                                    placeholder="Mumbai"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                                <input
                                                    type="text"
                                                    name="state"
                                                    value={state}
                                                    onChange={onAddressChange}
                                                    className="input"
                                                    placeholder="Maharashtra"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                                                <input
                                                    type="text"
                                                    name="pincode"
                                                    value={pincode}
                                                    onChange={onAddressChange}
                                                    className="input"
                                                    placeholder="400001"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                                <input
                                                    type="text"
                                                    name="country"
                                                    value={country}
                                                    onChange={onAddressChange}
                                                    className="input"
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end">
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Updating...' : 'Update Address'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
