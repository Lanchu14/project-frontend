// AdminBookings.js
import { useEffect, useState } from "react";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/bookings");
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  return (
    <div>
      <div className="section-header">
        <h2>Bookings Management</h2>
        <div className="section-accent"></div>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>User Name</th>
              <th>Provider Name</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.user_name}</td>
                <td>{b.provider_name}</td>
                <td>{new Date(b.booking_date).toLocaleString()}</td>
                <td>
                  <span className={`status-badge status-${b.status}`}>
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && (
          <div className="no-data-card">
            <div className="no-data-icon">📅</div>
            <h3>No Bookings Found</h3>
            <p>There are no bookings in the system</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminBookings;