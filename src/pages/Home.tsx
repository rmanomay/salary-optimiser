import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeaturedDish from '../components/FeaturedDish';
import Footer from '../components/Footer';
import BookingModal from '../components/BookingModal';

const Home: React.FC = () => {
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    return (
        <div className="bg-white min-h-screen">
            <Navbar onOpenBooking={() => setIsBookingModalOpen(true)} />
            <Hero onOpenBooking={() => setIsBookingModalOpen(true)} />
            <FeaturedDish />
            <Footer />
            <BookingModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} />
        </div>
    );
};

export default Home;
