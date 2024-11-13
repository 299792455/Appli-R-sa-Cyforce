import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { fetchAvailableSlots, bookItem, deleteBooking, fetchHorses } from '../services/bookingService';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import fr from 'date-fns/locale/fr';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';

const locales = {
  fr: fr,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function BookingCalendar() {
  const [events, setEvents] = useState([]);
  const [horses, setHorses] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false); // Pour le dialog de suppression
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [selectedHorse, setSelectedHorse] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null); // Pour la suppression

  useEffect(() => {
    const loadSlots = async () => {
      try {
        const slots = await fetchAvailableSlots();
        const eventsData = slots.map((slot) => {
          const startDate = new Date(slot.from_datetime);
          const endDate = new Date(slot.to_datetime);

          if (isNaN(startDate) || isNaN(endDate)) {
            console.error('Date invalide dans le créneau :', slot);
            return null;
          }

          return {
            id: slot.id, // Assurez-vous que l'ID est présent
            title: slot.customer ? `Réservé par ${slot.customer} - ${slot.horse.name}` : 'Disponible',
            start: startDate,
            end: endDate,
            allDay: false,
            customer: slot.customer,
            horse: slot.horse, // Inclure les détails du cheval
          };
        }).filter(event => event !== null);
        setEvents(eventsData);
      } catch (error) {
        console.error('Erreur lors de la récupération des créneaux :', error.response ? error.response.data : error.message);
        setEvents([]);
      }
    };

    const loadHorses = async () => {
      try {
        const fetchedHorses = await fetchHorses();
        setHorses(fetchedHorses);
      } catch (error) {
        console.error('Erreur lors de la récupération des chevaux :', error.response ? error.response.data : error.message);
        setHorses([]);
      }
    };

    loadSlots();
    loadHorses();
  }, []);

  const isSlotAvailable = (slot) => {
    return !events.some(
      (event) => slot.start < event.end && slot.end > event.start
    );
  };

  const handleSelectSlot = ({ start, end }) => {
    const slot = { start, end };
    if (!isSlotAvailable(slot)) {
      alert('Ce créneau est déjà réservé.');
      return;
    }
    setSelectedSlot(slot);
    setOpen(true);
  };

  const handleReservation = async () => {
    if (!customerName || !customerEmail || !selectedHorse) return;

    const bookingData = {
      horse_id: selectedHorse,
      from_datetime: selectedSlot.start.toISOString(),
      to_datetime: selectedSlot.end.toISOString(),
      customer: customerName,
      customerEmail: customerEmail,
    };

    try {
      const response = await bookItem(bookingData);
      alert('Réservation réussie !');
      setEvents([
        ...events,
        {
          id: response.data.data._id, // Utiliser l'ID renvoyé par le backend
          title: `Réservé par ${customerName} - ${horses.find(h => h._id === selectedHorse)?.name}`,
          start: selectedSlot.start,
          end: selectedSlot.end,
          allDay: false,
          customer: customerName,
          horse: horses.find(h => h._id === selectedHorse),
        },
      ]);
      setCustomerName('');
      setCustomerEmail('');
      setSelectedHorse('');
      setOpen(false);
    } catch (error) {
      alert('Erreur lors de la réservation.');
      console.error(error);
    }
  };

  const handleSelectEvent = (event) => {
    if (event.title.startsWith('Réservé')) {
      setSelectedEvent(event);
      setDeleteOpen(true);
    }
  };

  const handleDeleteBooking = async () => {
    if (!selectedEvent) return;

    try {
      await deleteBooking(selectedEvent.id);
      alert('Réservation supprimée avec succès !');
      setEvents(events.filter(event => event.id !== selectedEvent.id));
      setSelectedEvent(null);
      setDeleteOpen(false);
    } catch (error) {
      alert('Erreur lors de la suppression de la réservation.');
      console.error(error);
    }
  };

  return (
    <div style={{ height: '600px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        defaultView="week"
        views={['week', 'day', 'agenda']}
        step={30}
        timeslots={1}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent} // Ajout de la gestion des événements sélectionnés
        eventPropGetter={(event) => {
          let backgroundColor =
            event.title.startsWith('Réservé') ? '#FF0000' : '#00FF00';
          return {
            style: {
              backgroundColor,
            },
          };
        }}
        messages={{
          week: 'Semaine',
          day: 'Jour',
          agenda: 'Agenda',
          today: "Aujourd'hui",
          previous: 'Précédent',
          next: 'Suivant',
        }}
        min={new Date(1970, 1, 1, 8, 0, 0)}
        max={new Date(1970, 1, 1, 20, 0, 0)}
        components={{
          event: ({ event }) => <div>{event.title}</div>,
        }}
      />

      {/* Modal de réservation */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirmer la réservation</DialogTitle>
        <DialogContent>
          <p>
            Voulez-vous réserver le{' '}
            {selectedSlot?.start
              ? format(selectedSlot.start, 'PPPPp', { locale: fr })
              : '...'}{' '}
            ?
          </p>
          <TextField
            label="Votre nom"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Votre e-mail"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="select-horse-label">Choisir un cheval</InputLabel>
            <Select
              labelId="select-horse-label"
              value={selectedHorse}
              label="Choisir un cheval"
              onChange={(e) => setSelectedHorse(e.target.value)}
            >
              {horses.map((horse) => (
                <MenuItem key={horse._id} value={horse._id}>
                  {horse.name} ({horse.breed})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button
            onClick={handleReservation}
            disabled={!customerName || !customerEmail || !selectedHorse}
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de suppression */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Supprimer la réservation</DialogTitle>
        <DialogContent>
          <p>
            Voulez-vous vraiment supprimer la réservation de{' '}
            {selectedEvent?.customer} pour le{' '}
            {selectedEvent?.start
              ? format(selectedEvent.start, 'PPPPp', { locale: fr })
              : '...'}{' '}
            ?
          </p>
          <p>Cheval: {selectedEvent?.horse?.name} ({selectedEvent?.horse?.breed})</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Annuler</Button>
          <Button onClick={handleDeleteBooking} color="error">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default BookingCalendar;
