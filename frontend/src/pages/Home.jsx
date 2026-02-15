import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary-600 to-green-500 text-white section">
                <div className="container-custom">
                    <div className="max-w-3xl mx-auto text-center animate-fade-in">
                        <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
                            Welcome to LCIT Herbal Store
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-white/90">
                            Discover the power of nature with our premium herbal products
                        </p>
                        <Link to="/shop" className="btn bg-white text-primary-600 hover:bg-gray-100 inline-block">
                            Shop Now
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="section bg-white">
                <div className="container-custom">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
                        Why Choose Us
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="card p-8 text-center">
                            <div className="text-primary-600 text-5xl mb-4">🌿</div>
                            <h3 className="text-xl font-semibold mb-3">100% Natural</h3>
                            <p className="text-gray-600">
                                All our products are made from pure, natural ingredients
                            </p>
                        </div>
                        <div className="card p-8 text-center">
                            <div className="text-primary-600 text-5xl mb-4">✓</div>
                            <h3 className="text-xl font-semibold mb-3">Quality Assured</h3>
                            <p className="text-gray-600">
                                Rigorous quality checks ensure the best products
                            </p>
                        </div>
                        <div className="card p-8 text-center">
                            <div className="text-primary-600 text-5xl mb-4">🚚</div>
                            <h3 className="text-xl font-semibold mb-3">Fast Delivery</h3>
                            <p className="text-gray-600">
                                Quick and reliable delivery to your doorstep
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section bg-gray-50">
                <div className="container-custom text-center">
                    <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                        Ready to Start Your Wellness Journey?
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Browse our collection of premium herbal products and find the perfect solution for your needs
                    </p>
                    <Link to="/shop" className="btn btn-primary">
                        Explore Products
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
