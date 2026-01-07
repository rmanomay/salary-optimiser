import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookingModal from '../components/BookingModal';
import { motion } from 'framer-motion';

const dishes = [
    {
        id: 1,
        name: 'Truffle Mushroom Pasta',
        description: 'Hand-made tagliatelle tossed in a rich truffle cream sauce with wild mushrooms and aged parmesan.',
        price: '₹1,450',
        image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    },
    {
        id: 2,
        name: 'Gourmet Mushroom Sandwich',
        description: 'Toasted artisan sourdough filled with sautéed exotic mushrooms, gruyère cheese, and truffle aioli.',
        price: '₹950',
        // Switched to a more reliable sandwich image
        image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    },
    {
        id: 3,
        name: 'Gold-Dusted Waffles',
        description: 'Crispy Belgian waffles topped with fresh berries, maple syrup, and a shimmer of edible gold dust.',
        price: '₹850',
        image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    },
    {
        id: 4,
        name: 'Royal Dal Makhani Rice',
        description: 'Slow-cooked black lentils simmered overnight with cream and spices, served with aromatic Basmati rice.',
        price: '₹1,150',
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    }
];

const Menu: React.FC = () => {
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    return (
        <div className="bg-white min-h-screen">
            <Navbar onOpenBooking={() => setIsBookingModalOpen(true)} />

            {/* Header */}
            <div className="pt-32 pb-16 bg-cream text-center">
                <h1 className="text-5xl font-serif text-charcoal mb-4">Our Collection</h1>
                <p className="text-gray-500 font-light max-w-xl mx-auto">A curated selection of culinary masterpieces, crafted with passion and precision.</p>
            </div>

            {/* Menu Grid */}
            <div className="container mx-auto px-6 py-16">
                <div className="grid md:grid-cols-2 gap-12">
                    {dishes.map((dish, index) => (
                        <motion.div
                            key={dish.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="group"
                        >
                            <div className="relative overflow-hidden h-64 mb-6 rounded-sm shadow-sm group-hover:shadow-md transition-all duration-500">
                                <img
                                    src={dish.image}
                                    alt={dish.name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
                            </div>

                            <div className="flex justify-between items-baseline mb-2">
                                <h3 className="text-2xl font-serif text-charcoal group-hover:text-gold-500 transition-colors">{dish.name}</h3>
                                <span className="text-xl font-serif text-gold-500">{dish.price}</span>
                            </div>
                            <p className="text-gray-500 font-light leading-relaxed mb-4">{dish.description}</p>
                            <button className="text-sm uppercase tracking-widest text-charcoal border-b border-charcoal/30 hover:border-gold-500 hover:text-gold-500 transition-all pb-1">
                                Order Now
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>

            <Footer />
            <BookingModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} />
        </div>
    );
};

export default Menu;
