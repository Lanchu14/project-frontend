// AdminFeedback.js
import { useEffect, useState } from "react";

function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/feedbacks");
      const data = await res.json();
      setFeedbacks(data);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
    }
  };

  useEffect(() => { fetchFeedbacks(); }, []);

  return (
    <div>
      <div className="section-header">
        <h2>Feedback & Ratings</h2>
        <div className="section-accent"></div>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>User</th>
              <th>Provider</th>
              <th>Rating</th>
              <th>Comment</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map(f => (
              <tr key={f.id}>
                <td>{f.booking_id}</td>
                <td>{f.user_name}</td>
                <td>{f.provider_name}</td>
                <td>
                  <span style={{ color: '#ffde59' }}>
                    {'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}
                  </span>
                </td>
                <td>{f.comment}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {feedbacks.length === 0 && (
          <div className="no-data-card">
            <div className="no-data-icon">⭐</div>
            <h3>No Feedback Found</h3>
            <p>There is no feedback available</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminFeedback;