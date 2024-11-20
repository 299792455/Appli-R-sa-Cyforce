import React, { useState, useEffect, useContext } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from "react-modal";
import BookingForm from "./BookingForm";
import { fetchBookings, deleteBooking } from "../services/bookingService";
import { AuthContext } from "../context/AuthContext"; // Importer le contexte d'authentification

Modal.setAppElement("#root"); // Nécessaire pour éviter les erreurs d'accessibilité

const localizer = momentLocalizer(moment);

const BookingCalendar = () => {
  const { user } = useContext(AuthContext); // Accéder aux informations de l'utilisateur connecté
  const [bookings, setBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "create" pour créer, "details" pour détails
  const [selectedSlot, setSelectedSlot] = useState(null); // Créneau sélectionné
  const [selectedBooking, setSelectedBooking] = useState(null); // Réservation sélectionnée

  useEffect(() => {
    fetchBookings()
      .then((data) => {
        const formattedBookings = data.map((booking) => ({
          id: booking._id,
          start: new Date(booking.starts_on),
          end: new Date(booking.ends_on),
          title: booking.horse
            ? `Réservé : ${booking.horse.name}`
            : "Réservation sans cheval",
          userId: booking.userId, // Inclure l'utilisateur propriétaire
        }));
        setBookings(formattedBookings);
      })
      .catch((err) =>
        console.error("Erreur lors du chargement des réservations :", err)
      );
  }, []);

  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot(slotInfo); // Stocker le créneau sélectionné
    setSelectedBooking(null); // Réinitialiser la réservation sélectionnée
    setModalType("create"); // Définir le type de modale
    setIsModalOpen(true); // Ouvrir la modale
  };

  const handleEventClick = (event) => {
    setSelectedBooking(event); // Stocker les détails de la réservation cliquée
    setSelectedSlot(null); // Réinitialiser le créneau sélectionné
    setModalType("details"); // Définir le type de modale
    setIsModalOpen(true); // Ouvrir la modale
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
    setSelectedBooking(null);
    setModalType("");
  };

  const handleDelete = async () => {
    if (!selectedBooking) return;

    try {
      await deleteBooking(selectedBooking.id); // Appel à l'API pour supprimer
      alert("Réservation supprimée avec succès !");
      setBookings((prev) =>
        prev.filter((booking) => booking.id !== selectedBooking.id)
      );
      closeModal();
    } catch (error) {
      console.error("Erreur lors de la suppression de la réservation :", error);
      alert("Erreur lors de la suppression.");
    }
  };

  return (
    <div>
      <h1>Calendrier de réservation</h1>
      <Calendar
        localizer={localizer}
        events={bookings}
        selectable
        onSelectSlot={handleSelectSlot} // Clic sur un créneau disponible
        onSelectEvent={handleEventClick} // Clic sur une réservation existante
        style={{ height: 700, margin: "20px auto", maxWidth: "1024px" }}
        min={new Date(1970, 1, 1, 6, 0, 0)}
        max={new Date(1970, 1, 1, 22, 0, 0)}
        defaultView="week"
        step={30}
        timeslots={1}
      />

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
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
              onClose={closeModal}
            />
          </>
        )}

        {modalType === "details" && selectedBooking && (
          <>
            {console.log('selectedBooking.userId:', selectedBooking.userId)}
            {console.log('user.id:', user && user.id)}
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
            {/* Afficher le propriétaire correctement */}
            <p>
              <strong>Propriétaire :</strong>{" "}
              {selectedBooking.userId._id === (user && user.id) ? "Vous" : "Autre utilisateur"}
            </p>

            {selectedBooking.userId._id === (user && user.id) && (
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
            )}
          </>
        )}

        <button
          onClick={closeModal}
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
    </div>
  );
};

export default BookingCalendar;
