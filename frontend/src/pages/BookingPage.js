import React from 'react';
import BookingForm from '../components/BookingForm';
import BookingCalendar from '../components/BookingCalendar';

function BookingPage() {
  return (
    <div>
      <h1>Réservez votre créneau</h1>
      <BookingForm />
      <BookingCalendar />
    </div>
  );
}

export default BookingPage;
