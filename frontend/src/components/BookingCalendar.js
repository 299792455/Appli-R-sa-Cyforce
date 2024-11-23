// BookingCalendar.js

import React, { useState, useEffect, useContext } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from "react-modal";
import BookingForm from "./BookingForm";
import HorseCreationModal from "./HorseCreationModal";
import { fetchBookings, deleteBooking, fetchHorses } from "../services/bookingService";
import { AuthContext } from "../context/AuthContext";
import "../styles/bookingCalendar.scss";

// Configurer moment.js en français
import "moment/locale/fr";
moment.locale("fr");

Modal.setAppElement("#root");

const localizer = momentLocalizer(moment);

const BookingCalendar = () => {
  const { user, loading } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [horses, setHorses] = useState([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isHorseModalOpen, setIsHorseModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Fonction pour récupérer et formater les réservations
  const fetchAndSetBookings = async () => {
    try {
      const data = await fetchBookings();
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

      const formattedBookings = data.map((booking) => {
        const bookingStart = new Date(booking.starts_on);
        const bookingEnd = new Date(booking.ends_on);

        let eventClass = "future-event";
        if (bookingEnd < now) {
          eventClass = "past-event";
        } else if (bookingStart >= todayStart && bookingStart < todayEnd) {
          eventClass = "today-event";
        }

        return {
          id: booking._id,
          start: bookingStart,
          end: bookingEnd,
          title: booking.horse
            ? `Réservé : ${booking.horse.name}`
            : "Réservation sans cheval",
          userId: booking.userId,
          className: eventClass,
        };
      });

      setBookings(formattedBookings);
    } catch (err) {
      console.error("Erreur lors du chargement des réservations :", err);
    }
  };

  // Fonction pour récupérer et définir les chevaux
  const fetchAndSetHorses = async () => {
    try {
      const data = await fetchHorses();
      setHorses(data);
    } catch (err) {
      console.error("Erreur lors du chargement des chevaux :", err);
    }
  };

  // Charger les réservations et les chevaux au montage du composant
  useEffect(() => {
    fetchAndSetBookings();
    fetchAndSetHorses();
  }, []);

  // Fonction appelée après la création d'une réservation
  const handleBookingCreated = () => {
    fetchAndSetBookings();
  };

  // Fonction appelée après la création d'un cheval
  const handleHorseCreated = () => {
    fetchAndSetHorses();
  };

  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot(slotInfo);
    setSelectedBooking(null);
    setModalType("create");
    setIsBookingModalOpen(true);
  };

  const handleEventClick = (event) => {
    setSelectedBooking(event);
    setSelectedSlot(null);
    setModalType("details");
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedSlot(null);
    setSelectedBooking(null);
    setModalType("");
  };

  const handleDelete = async () => {
    if (!selectedBooking) return;

    try {
      await deleteBooking(selectedBooking.id);
      alert("Réservation supprimée avec succès !");
      setBookings((prev) => prev.filter((booking) => booking.id !== selectedBooking.id));
      closeBookingModal();
    } catch (error) {
      console.error("Erreur lors de la suppression de la réservation :", error);
      alert("Erreur lors de la suppression.");
    }
  };

  // Fonction pour ouvrir la modale d'ajout de cheval
  const openHorseModal = () => setIsHorseModalOpen(true);

  // Fonction pour fermer la modale d'ajout de cheval
  const closeHorseModal = () => setIsHorseModalOpen(false);

  // Rendu conditionnel basé sur le chargement
  if (loading) {
    return <p>Chargement des informations utilisateur...</p>;
  }

  return (
    <div>
      <h1>Calendrier de réservation</h1>
      <button onClick={openHorseModal} style={{ marginBottom: "20px" }}>
        Ajouter un cheval
      </button>
      <Calendar
        localizer={localizer}
        events={bookings}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleEventClick}
        eventPropGetter={(event) => {
          const backgroundColor =
            event.className === "future-event"
              ? "#76c7f0"
              : event.className === "today-event"
              ? "#f78fb3"
              : event.className === "past-event"
              ? "#f78fb3"
              : "#ffffff";

          return {
            style: {
              backgroundColor,
              color: "#fff",
              border: "none",
              boxShadow: "none",
            },
            className: event.className,
          };
        }}
        messages={{
          today: "Aujourd'hui",
          previous: "Précédent",
          next: "Suivant",
          month: "Mois",
          week: "Semaine",
          day: "Jour",
          agenda: "Agenda",
          date: "Date",
          time: "Heure",
          event: "Événement",
          noEventsInRange: "Aucun événement dans cette période.",
        }}
        style={{ height: 600, margin: "20px auto", maxWidth: "1024px" }}
        defaultView="week"
        step={30}
        timeslots={1}
        min={new Date(1970, 1, 1, 8, 0, 0)}
        max={new Date(1970, 1, 1, 20, 0, 0)}
      />

      {/* Modale de réservation */}
      <Modal
        isOpen={isBookingModalOpen}
        onRequestClose={closeBookingModal}
        style={{
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
          content: {
            width: "500px",
            margin: "auto",
            borderRadius: "10px",
            padding: "20px",
          },
        }}
      >
        {modalType === "create" && selectedSlot && (
          <>
            <h2>Réserver un créneau</h2>
            <p>
              Début : {moment(selectedSlot.start).format("DD/MM/YYYY HH:mm")}
            </p>
            <p>
              Fin : {moment(selectedSlot.end).format("DD/MM/YYYY HH:mm")}
            </p>
            <BookingForm
              start={selectedSlot.start}
              end={selectedSlot.end}
              onClose={closeBookingModal}
              onBookingCreated={handleBookingCreated} // Passer le callback
              horses={horses} // Passer la liste des chevaux
            />
          </>
        )}

        {modalType === "details" && selectedBooking && (
          <>
            <h2>Détails de la réservation</h2>
            <p>
              <strong>Cheval :</strong>{" "}
              {selectedBooking.title.split(": ")[1]}
            </p>
            <p>
              <strong>Début :</strong>{" "}
              {moment(selectedBooking.start).format("DD/MM/YYYY HH:mm")}
            </p>
            <p>
              <strong>Fin :</strong>{" "}
              {moment(selectedBooking.end).format("DD/MM/YYYY HH:mm")}
            </p>
            <p>
              <strong>Propriétaire :</strong>{" "}
              {selectedBooking.userId === user.id ||
              selectedBooking.userId?._id === user.id
                ? "Vous"
                : "Autre utilisateur"}
            </p>

            {selectedBooking.userId === user.id ||
            selectedBooking.userId?._id === user.id ? (
              <button
                onClick={handleDelete}
                style={{
                  marginTop: "10px",
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  cursor: "pointer",
                }}
              >
                Supprimer la réservation
              </button>
            ) : null}
          </>
        )}

        <button
          onClick={closeBookingModal}
          style={{
            marginTop: "10px",
            backgroundColor: "gray",
            color: "white",
            border: "none",
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Fermer
        </button>
      </Modal>

      {/* Modale d'ajout de cheval */}
      <Modal
        isOpen={isHorseModalOpen}
        onRequestClose={closeHorseModal}
        style={{
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
          content: {
            width: "400px",
            margin: "auto",
            borderRadius: "10px",
            padding: "20px",
          },
        }}
      >
        <HorseCreationModal
          onClose={closeHorseModal}
          onHorseCreated={handleHorseCreated}
        />
      </Modal>
    </div>
  );
};

export default BookingCalendar;
