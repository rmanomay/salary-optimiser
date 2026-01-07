import React, { useState } from 'react';
import { X, Check, Star, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type SeatType = 'premium' | 'mid-premium' | null;

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
    const [selectedSeat, setSelectedSeat] = useState<SeatType>(null);
    const [step, setStep] = useState(1);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white w-full max-w-3xl rounded-sm shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-8 border-b border-gray-100/50 bg-cream/30">
                        <div>
                            <h2 className="text-3xl font-serif text-charcoal mb-1">Reserve Your Table</h2>
                            <p className="text-sm text-gray-500 font-light">Select your preferred dining experience</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-charcoal transition-colors p-2 hover:bg-black/5 rounded-full">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-8 md:p-10">
                        {step === 1 ? (
                            <div className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Premium Option */}
                                    <button
                                        onClick={() => setSelectedSeat('premium')}
                                        className={`relative p-8 border hover:shadow-lg transition-all duration-300 text-left group overflow-hidden ${selectedSeat === 'premium' ? 'border-gold-400 bg-gold-400/5 shadow-md' : 'border-gray-200 bg-white hover:border-gold-400/40'}`}
                                    >
                                        {/* Decorative background element */}
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gold-400/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150" />

                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-6">
                                                <span className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-gold-500">
                                                    <Star size={14} fill="currentColor" />
                                                    Premium
                                                </span>
                                                {selectedSeat === 'premium' && (
                                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} >
                                                        <Check size={20} className="text-gold-500" />
                                                    </motion.div>
                                                )}
                                            </div>
                                            <h3 className="text-2xl font-serif mb-3 text-charcoal group-hover:text-gold-600 transition-colors">Window & View</h3>
                                            <p className="text-sm text-gray-500 leading-relaxed font-light">
                                                Exclusive window-side tables with panoramic city views. The ultimate choice for romantic dinners throughout the evening.
                                            </p>
                                        </div>
                                    </button>

                                    {/* Mid-Premium Option */}
                                    <button
                                        onClick={() => setSelectedSeat('mid-premium')}
                                        className={`relative p-8 border hover:shadow-lg transition-all duration-300 text-left group overflow-hidden ${selectedSeat === 'mid-premium' ? 'border-charcoal bg-gray-50 shadow-md' : 'border-gray-200 bg-white hover:border-charcoal/40'}`}
                                    >
                                        {/* Decorative background element - now improved */}
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-charcoal/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150" />

                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-6">
                                                <span className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-gray-500 group-hover:text-charcoal transition-colors">
                                                    <Users size={14} />
                                                    Dining Hall
                                                </span>
                                                {selectedSeat === 'mid-premium' && (
                                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} >
                                                        <Check size={20} className="text-charcoal" />
                                                    </motion.div>
                                                )}
                                            </div>
                                            <h3 className="text-2xl font-serif mb-3 text-charcoal">Main Hall</h3>
                                            <p className="text-sm text-gray-500 leading-relaxed font-light">
                                                Immerse yourself in the vibrant, elegant atmosphere of the main hall. An architectural masterpiece featuring high ceilings and ambient music.
                                            </p>
                                        </div>
                                    </button>
                                </div>

                                <div className="mt-8 flex justify-end pt-6 border-t border-gray-100">
                                    <button
                                        disabled={!selectedSeat}
                                        onClick={() => setStep(2)}
                                        className={`px-10 py-4 font-bold tracking-wide transition-all duration-300 text-sm uppercase ${selectedSeat ? 'bg-charcoal text-white hover:bg-gold-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
                                    >
                                        Continue to Details
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: 'spring', bounce: 0.5 }}
                                    className="w-20 h-20 bg-gold-400/10 text-gold-500 rounded-full flex items-center justify-center mx-auto mb-8"
                                >
                                    <Check size={40} />
                                </motion.div>
                                <h3 className="text-3xl font-serif mb-4 text-charcoal">Request Confirmed</h3>
                                <p className="text-gray-500 mb-10 max-w-md mx-auto leading-relaxed font-light">
                                    We have successfully noted your preference for our <span className="font-bold text-gold-500 capitalize">{selectedSeat?.replace('-', ' ')}</span> seating.
                                    <br />A confirmation SMS has been sent to your device.
                                </p>
                                <button
                                    onClick={onClose}
                                    className="px-10 py-4 border border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-all duration-300 text-sm uppercase tracking-widest font-bold"
                                >
                                    Return to Home
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default BookingModal;
