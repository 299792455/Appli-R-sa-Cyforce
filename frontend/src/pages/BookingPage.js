import React from 'react';
import Header from '../components/Header';
import BookingForm from '../components/BookingForm';
import BookingCalendar from '../components/BookingCalendar';
import Footer from '../components/Footer';

function BookingPage() {
  return (
    <div>
      <Header />
      <main>
        <h1>Réservez un créneau pour vos chevaux</h1>
        <BookingForm />
        <BookingCalendar />
      </main>
      <Footer />
    </div>
  );
}

export default BookingPage;
