import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEdit, FaTrash, FaCalendarAlt, FaSpa } from "react-icons/fa";
import { toast } from "react-toastify";

function Tickets() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [massageShops, setMassageShops] = useState([]);
  
  // For editing reservation
  const [isEditing, setIsEditing] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate('/login');
      toast.error('Please log in to view your reservations');
      return;
    }

    // Fetch data
    fetchReservations();
    fetchMassageShops();
  }, [user, navigate]);

  const fetchReservations = () => {
    // This would be an API call in a real application
    // For demo purposes, using mock data
    setIsLoading(true);
    setTimeout(() => {
      setReservations([
        {
          id: 1,
          shopId: 1,
          shop: {
            id: 1,
            name: "Relax Spa",
            address: "123 Wellness St.",
            telephone: "123-456-7890",
            hours: "9:00 AM - 9:00 PM",
          },
          date: "2025-05-01",
          status: "Confirmed",
          userId: user
        },
        {
          id: 2,
          shopId: 3,
          shop: {
            id: 3,
            name: "Tranquil Touch",
            address: "789 Calm Blvd.",
            telephone: "555-123-4567",
            hours: "11:00 AM - 7:00 PM",
          },
          date: "2025-05-15",
          status: "Pending",
          userId: user
        }
      ]);
      setIsLoading(false);
    }, 800);
  };

  const fetchMassageShops = () => {
    // Again, this would be an API call
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
    }, 600);
  };

  const handleView = (reservation) => {
    // In a real app, you might navigate to a details page
    // For now, just show a toast with details
    toast.info(`
      Reservation at ${reservation.shop.name}
      Date: ${formatDate(reservation.date)}
      Status: ${reservation.status}
    `);
  };

  const handleEdit = (reservation) => {
    setIsEditing(true);
    setEditingReservation(reservation);
    setSelectedShop(massageShops.find(shop => shop.id === reservation.shop.id));
    setSelectedDate(reservation.date);
    
    // Scroll to edit form
    setTimeout(() => {
      document.getElementById('edit-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleDelete = (id) => {
    // Confirmation before deleting
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      // This would be an API call in a real app
      setReservations(reservations.filter(reservation => reservation.id !== id));
      toast.success("Reservation cancelled successfully");
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedShop) {
      toast.error("Please select both a date and a massage shop");
      return;
    }

    // Check if the date is valid (not in the past)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const reserveDate = new Date(selectedDate);
    
    if (reserveDate < today) {
      toast.error("Cannot reserve for a date in the past");
      return;
    }

    // Update the reservation
    const updatedReservations = reservations.map(reservation => {
      if (reservation.id === editingReservation.id) {
        return {
          ...reservation,
          shop: selectedShop,
          shopId: selectedShop.id,
          date: selectedDate,
          status: "Pending" // Reset status to pending when edited
        };
      }
      return reservation;
    });

    setReservations(updatedReservations);
    toast.success("Reservation updated successfully");
    
    // Reset the form
    setIsEditing(false);
    setEditingReservation(null);
    setSelectedShop(null);
    setSelectedDate("");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingReservation(null);
    setSelectedShop(null);
    setSelectedDate("");
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return { color: '#2ecc71' };
      case 'pending':
        return { color: '#f39c12' };
      case 'cancelled':
        return { color: '#e74c3c' };
      default:
        return { color: '#333' };
    }
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
          <FaCalendarAlt /> My Massage Appointments
        </h1>
        <p>View and manage your massage reservations</p>
      </section>

      {/* Reservations List */}
      <section className="ticket-list">
        <h2 style={{ marginBottom: "20px" }}>Your Reservations</h2>
        
        {reservations.length === 0 ? (
          <div className="ticket-empty">
            <p>You don't have any reservations yet.</p>
            <Link to="/reserve" className="btn btn-block">
              <FaSpa /> Make New Reservation
            </Link>
          </div>
        ) : (
          <div>
            {reservations.map(reservation => (
              <div key={reservation.id} className="ticket" style={{
                display: "block",
                textAlign: "left",
                padding: "20px",
                marginBottom: "20px",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}>
                <div className="ticket-header" style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px"
                }}>
                  <h3>{reservation.shop.name}</h3>
                  <div className="status" style={getStatusStyle(reservation.status)}>
                    {reservation.status}
                  </div>
                </div>
                
                <div className="ticket-details">
                  <p><strong>Date:</strong> {formatDate(reservation.date)}</p>
                  <p><strong>Address:</strong> {reservation.shop.address}</p>
                  <p><strong>Contact:</strong> {reservation.shop.telephone}</p>
                </div>
                
                <div className="ticket-actions" style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "15px"
                }}>
                  <button 
                    onClick={() => handleView(reservation)} 
                    className="btn btn-sm"
                  >
                    <FaEye /> View
                  </button>
                  <button 
                    onClick={() => handleEdit(reservation)} 
                    className="btn btn-sm"
                    style={{ backgroundColor: "#3498db" }}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(reservation.id)} 
                    className="btn btn-sm btn-danger"
                  >
                    <FaTrash /> Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Edit Form */}
      {isEditing && editingReservation && (
        <section id="edit-form" className="form" style={{ 
          marginTop: "40px", 
          border: "1px solid #e6e6e6",
          padding: "20px",
          borderRadius: "8px" 
        }}>
          <h2>Edit Reservation</h2>
          <p>Updating reservation at {editingReservation.shop.name}</p>
          
          <form onSubmit={handleEditSubmit}>
            <div className="form-group">
              <label htmlFor="date">Date:</label>
              <input
                type="date"
                id="date"
                name="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="shop">Massage Shop:</label>
              <select
                id="shop"
                name="shop"
                value={selectedShop?.id || ""}
                onChange={(e) => {
                  const shopId = parseInt(e.target.value);
                  setSelectedShop(massageShops.find(shop => shop.id === shopId));
                }}
                required
              >
                <option value="">-- Select a massage shop --</option>
                {massageShops.map(shop => (
                  <option key={shop.id} value={shop.id}>
                    {shop.name} - {shop.address}
                  </option>
                ))}
              </select>
            </div>

            {selectedShop && (
              <div className="shop-details" style={{ 
                backgroundColor: "#f8f9fa", 
                padding: "10px", 
                borderRadius: "5px",
                marginBottom: "20px"
              }}>
                <p><strong>Hours:</strong> {selectedShop.hours}</p>
                <p><strong>Contact:</strong> {selectedShop.telephone}</p>
              </div>
            )}

            <div className="form-group-buttons" style={{ display: "flex", gap: "10px" }}>
              <button type="submit" className="btn btn-block" style={{ flex: 1 }}>
                <FaEdit /> Update Reservation
              </button>
              <button 
                type="button" 
                onClick={handleCancelEdit} 
                className="btn btn-block btn-reverse" 
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Back Button */}
      <div style={{ marginTop: "30px", marginBottom: "30px" }}>
        <Link to="/" className="btn btn-reverse">
          Back to Home
        </Link>
        <Link to="/reserve" className="btn" style={{ marginLeft: "10px" }}>
          <FaSpa /> Make New Reservation
        </Link>
      </div>
    </>
  );
}

export default Tickets;