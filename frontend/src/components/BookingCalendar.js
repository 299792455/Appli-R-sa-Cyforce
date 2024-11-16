// BookingCalendar.js
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { fetchBookings } from '../services/bookingService';
import '../styles/bookingCalendar.scss';

const localizer = momentLocalizer(moment);

function BookingCalendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await fetchBookings();
        const formattedEvents = data.map((booking) => ({
          id: booking._id,
          title: `Réservé pour ${booking.horse.name} par ${booking.customer_name}`,
          start: new Date(booking.starts_on),
          end: new Date(booking.ends_on),
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Erreur lors du chargement des réservations :', error);
        // Gérer l'erreur, par exemple en affichant un message à l'utilisateur
      }
    };

    loadBookings();
  }, []);

  return (
    <div style={{ height: '500px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={['month', 'week', 'day']}
        defaultView="week"
        selectable
      />
    </div>
  );
}

export default BookingCalendar;
