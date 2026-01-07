import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-charcoal text-white pt-20 pb-10">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl font-serif mb-8 text-gold-400">AURUM</h2>

                <div className="flex justify-center space-x-8 mb-12">
                    {['Home', 'Menu', 'About', 'Reservations', 'Contact'].map((item) => (
                        <a key={item} href="#" className="text-gray-400 hover:text-gold-400 transition-colors uppercase text-sm tracking-widest">
                            {item}
                        </a>
                    ))}
                </div>

                <div className="flex justify-center space-x-6 mb-12">
                    {[Facebook, Instagram, Twitter].map((Icon, index) => (
                        <a key={index} href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:border-gold-400 hover:text-gold-400 transition-all">
                            <Icon size={18} />
                        </a>
                    ))}
                </div>

                <div className="border-t border-gray-800 pt-8 text-gray-500 text-sm font-light">
                    <p className="mb-2">123 Culinary Avenue, New York, NY 10012</p>
                    <p>&copy; {new Date().getFullYear()} Aurum Restaurant. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
