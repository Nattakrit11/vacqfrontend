import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { FaCalendarAlt, FaSpa, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

function Reserve() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [massageShops, setMassageShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate('/login');
      toast.error('Please log in to make reservations');
      return;
    }

    // Fetch massage shops from API
    // For now using mock data, but this should be an API call
    fetchMassageShops();
  }, [user, navigate]);

  const fetchMassageShops = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setMassageShops([
        {
          id: 1,
          name: "Relax Spa",
          address: "123 Wellness St.",
          telephone: "123-456-7890",
          hours: "9:00 AM - 9:00 PM",
        },
        {
          id: 2,
          name: "Serenity Massage",
          address: "456 Peace Rd.",
          telephone: "987-654-3210",
          hours: "10:00 AM - 8:00 PM",
        },
        {
          id: 3,
          name: "Tranquil Touch",
          address: "789 Calm Blvd.",
          telephone: "555-123-4567",
          hours: "11:00 AM - 7:00 PM",
        },
        {
          id: 4,
          name: "Healing Hands",
          address: "321 Therapy Ave.",
          telephone: "222-333-4444",
          hours: "8:00 AM - 6:00 PM",
        },
      ]);
      setIsLoading(false);
    }, 800);
  };

  const handleShopSelect = (shop) => {
    setSelectedShop(shop);
    // Scroll to reservation form
    setTimeout(() => {
      document.getElementById('reservation-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleReservation = (e) => {
    e.preventDefault();
    
    if (selectedDate === "") {
      toast.error("Please select a date.");
      return;
    }

    if (reservations.length >= 3) {
      toast.error("You can only reserve up to 3 queues.");
      return;
    }

    // Check if the date is valid (not in the past)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const reserveDate = new Date(selectedDate);
    
    if (reserveDate < today) {
      toast.error("Cannot reserve for a date in the past.");
      return;
    }

    // Check for duplicate reservations
    const isDuplicate = reservations.some(
      reservation => 
        reservation.shop.id === selectedShop.id && 
        reservation.date === selectedDate
    );

    if (isDuplicate) {
      toast.error("You already have a reservation at this shop on this date.");
      return;
    }

    // Add the reservation
    const newReservation = { 
      id: Date.now(), // generate a unique id
      shop: selectedShop, 
      date: selectedDate,
      status: "Pending"
    };
    
    setReservations([...reservations, newReservation]);
    toast.success("Reservation created successfully!");
    
    // Reset form
    setSelectedShop(null);
    setSelectedDate("");
  };

  const handleDeleteReservation = (id) => {
    setReservations(reservations.filter(reservation => reservation.id !== id));
    toast.info("Reservation cancelled.");
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="loadingSpinnerContainer">
        <div className="loadingSpinner"></div>
      </div>
    );
  }

  return (
    <>
      <section className="heading">
        <h1>
          <FaSpa /> Massage Reservation
        </h1>
        <p>Reserve up to 3 massage appointments</p>
      </section>

      {/* Reservation Counter */}
      <div className="reservation-counter" style={{ marginBottom: "20px" }}>
        <p style={{ fontSize: "18px", fontWeight: "bold" }}>
          You have {reservations.length} of 3 possible reservations
        </p>
        <div className="progress" style={{ 
          height: "10px", 
          backgroundColor: "#e0e0e0", 
          borderRadius: "5px",
          overflow: "hidden"
        }}>
          <div style={{ 
            width: `${(reservations.length / 3) * 100}%`, 
            backgroundColor: reservations.length === 3 ? "#ff4d4d" : "#4caf50",
            height: "100%" 
          }}></div>
        </div>
      </div>

      {/* Massage Shop List */}
      <section className="shops-section">
        <h2 style={{ marginBottom: "15px", fontSize: "1.5rem" }}>Select a Massage Shop</h2>
        <div className="boxes">
          {massageShops.map((shop) => (
            <div key={shop.id} style={{ 
              padding: "20px", 
              border: "1px solid #e6e6e6", 
              borderRadius: "10px",
              transition: "transform 0.2s",
              cursor: "pointer",
              backgroundColor: selectedShop?.id === shop.id ? "#f0f7ff" : "white"
            }}
            onClick={() => handleShopSelect(shop)}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{shop.name}</h3>
              <p><strong>Address:</strong> {shop.address}</p>
              <p><strong>Phone:</strong> {shop.telephone}</p>
              <p><strong>Hours:</strong> {shop.hours}</p>
              <button 
                className="btn btn-sm"
                style={{ marginTop: "10px" }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleShopSelect(shop);
                }}
              >
                Select
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Reservation Form */}
      {selectedShop && (
        <section id="reservation-form" className="form" style={{ marginTop: "30px" }}>
          <h2>Reserve at {selectedShop.name}</h2>
          <form onSubmit={handleReservation}>
            <div className="form-group">
              <label htmlFor="date">Select Date:</label>
              <input
                type="date"
                id="date"
                name="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]} // Ensure date is not in the past
                required
              />
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-block">
                <FaCalendarAlt /> Reserve Appointment
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Current Reservations */}
      <section className="my-reservations" style={{ marginTop: "40px" }}>
        <h2 style={{ marginBottom: "15px", fontSize: "1.5rem" }}>Your Reservations</h2>
        {reservations.length > 0 ? (
          <div>
            {reservations.map((reservation) => (
              <div key={reservation.id} style={{ 
                border: "1px solid #e6e6e6", 
                borderRadius: "10px", 
                padding: "15px",
                marginBottom: "15px",
                backgroundColor: "#f9f9f9" 
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ fontWeight: "bold" }}>{reservation.shop.name}</h3>
                    <p><strong>Date:</strong> {formatDate(reservation.date)}</p>
                    <p><strong>Address:</strong> {reservation.shop.address}</p>
                    <p><strong>Contact:</strong> {reservation.shop.telephone}</p>
                    <p><strong>Status:</strong> <span style={{ 
                      color: reservation.status === "Confirmed" ? "green" : "#f39c12"
                    }}>{reservation.status}</span></p>
                  </div>
                  <button 
                    onClick={() => handleDeleteReservation(reservation.id)} 
                    className="btn btn-danger"
                    style={{ minWidth: "120px" }}
                  >
                    <FaTrash /> Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>You have no reservations yet. Select a massage shop and date to make a reservation.</p>
        )}
      </section>

      {/* Back Button */}
      <div style={{ marginTop: "30px", marginBottom: "30px" }}>
        <Link to="/" className="btn btn-reverse">
          Back to Home
        </Link>
      </div>
    </>
  );
}

export default Reserve;