import React from 'react';
import { motion } from 'framer-motion';

const FeaturedDish: React.FC = () => {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    {/* Image Side */}
                    <div className="w-full md:w-1/2 relative">
                        <div className="absolute top-4 left-4 w-full h-full border border-gold-400/30 -z-10 translate-x-4 translate-y-4" />
                        <motion.img
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            src="https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                            alt="Signature Dish"
                            className="w-full h-[500px] object-cover shadow-xl"
                        />
                    </div>

                    {/* Text Side */}
                    <div className="w-full md:w-1/2 md:pl-12 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-gold-500 tracking-widest text-sm font-bold uppercase mb-4">Signature Dish</h3>
                            <h2 className="text-4xl lg:text-5xl font-serif text-charcoal mb-6">Pan Seared Scallops</h2>
                            <p className="text-gray-600 mb-8 leading-relaxed font-light">
                                Hand-dived scallops served with a delicate cauliflower purée, crispy pancetta, and a drizzle of truffle oil.
                                A harmonious blend of textures and flavors that defines our culinary philosophy of simplicity and elegance.
                            </p>
                            <div className="flex items-center justify-center md:justify-start gap-6">
                                <span className="text-3xl font-serif text-gold-500">$42</span>
                                <button className="px-8 py-3 bg-charcoal text-white hover:bg-gold-500 transition-colors duration-300">
                                    View Full Menu
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedDish;
