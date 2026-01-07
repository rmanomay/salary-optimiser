import React from 'react';
import { motion } from 'framer-motion';

interface HeroProps {
    onOpenBooking: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1514362545857-3bc16549766b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                    alt="Fine Dining"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="block text-gold-400 tracking-[0.2em] mb-4 text-sm font-sans uppercase">
                        Fine Dining Experience
                    </span>
                    <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight">
                        The Art of <br />
                        <span className="italic text-gold-100">Exquisite Taste</span>
                    </h1>
                    <p className="text-gray-200 mb-10 text-lg md:text-xl font-light max-w-2xl mx-auto">
                        Immerse yourself in a culinary journey where tradition meets innovation.
                        Every plate is a canvas, every bite a masterpiece.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <button
                            onClick={onOpenBooking}
                            className="px-8 py-3 bg-gradient-gold text-white font-bold tracking-wide rounded hover:scale-105 transition-transform duration-300"
                        >
                            Reserve Your Table
                        </button>
                        <button className="px-8 py-3 border border-white/30 hover:bg-white/10 backdrop-blur-sm text-white font-medium rounded transition-colors duration-300">
                            View Menu
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
            >
                <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white to-transparent" />
            </motion.div>
        </section>
    );
};

export default Hero;
