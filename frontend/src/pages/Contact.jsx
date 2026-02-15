import React from 'react';

const Contact = () => {
    return (
        <div className="section">
            <div className="container-custom">
                <h1 className="text-4xl font-display font-bold mb-8 text-center">Contact Us</h1>
                <div className="max-w-2xl mx-auto">
                    <div className="card p-8">
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Email</h3>
                                <p className="text-gray-600">info@lcitherbal.com</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Phone</h3>
                                <p className="text-gray-600">+91 1234567890</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Address</h3>
                                <p className="text-gray-600">LCIT Campus, Gujarat, India</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
