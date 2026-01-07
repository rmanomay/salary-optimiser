import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';

interface NavbarProps {
    onOpenBooking: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className={`text-2xl font-serif font-bold tracking-widest ${isScrolled ? 'text-charcoal' : 'text-white'}`}>
                    AURUM
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    <a href="tel:+15551234567" className={`flex items-center gap-2 text-sm tracking-wide font-medium transition-colors hover:text-gold-400 ${isScrolled ? 'text-gray-600' : 'text-gray-300'}`}>
                        <Phone size={16} />
                        <span>+1 (555) 123-4567</span>
                    </a>

                    <div className={`h-4 w-[1px] ${isScrolled ? 'bg-gray-300' : 'bg-white/30'}`} />

                    {['Home', 'Menu', 'Our Story'].map((item) => (
                        <Link
                            key={item}
                            to={`/${item.toLowerCase().replace(' ', '-')}`}
                            className={`text-sm tracking-wide uppercase font-medium transition-colors hover:text-gold-400 ${isScrolled ? 'text-gray-800' : 'text-gray-200'}`}
                        >
                            {item}
                        </Link>
                    ))}
                    <button
                        onClick={onOpenBooking}
                        className={`px-6 py-2 border transition-all duration-300 ${isScrolled ? 'border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-white' : 'border-white text-white hover:bg-white hover:text-charcoal'}`}
                    >
                        Book Table
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-gold-400"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-8 flex flex-col items-center space-y-6">
                    <a href="tel:+15551234567" className="flex items-center gap-2 text-gold-500 font-medium">
                        <Phone size={18} />
                        <span>+1 (555) 123-4567</span>
                    </a>
                    {['Home', 'Menu', 'Our Story', 'Contact'].map((item) => (
                        <Link
                            key={item}
                            to={`/${item.toLowerCase().replace(' ', '-')}`}
                            className="text-charcoal text-lg font-serif hover:text-gold-400"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {item}
                        </Link>
                    ))}
                    <button
                        onClick={() => {
                            setIsMobileMenuOpen(false);
                            onOpenBooking();
                        }}
                        className="px-8 py-2 bg-charcoal text-white rounded hover:bg-gold-500 transition-colors"
                    >
                        Book Table
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
