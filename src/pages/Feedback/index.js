import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Feedback() {
  const [bookings, setBookings] = useState([]);
  const [feedbacks, setFeedbacks] = useState({});
  const userId = localStorage.getItem("userId") || 1;
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/feedback/user/${userId}`);
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
      
      // Initialize feedbacks state properly for each booking
      const initial = {};
      data.forEach(b => {
        initial[b.id] = {
          rating: b.your_rating || "",
          comment: "" // Always start with empty comment for each booking
        };
      });
      setFeedbacks(initial);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleFeedbackChange = (bookingId, field, value) => {
    setFeedbacks(prev => ({
      ...prev,
      [bookingId]: {
        ...prev[bookingId],
        [field]: value
      }
    }));
  };

  const submitFeedback = async (bookingId, providerId) => {
    const fb = feedbacks[bookingId];
    if (!fb || !fb.rating) {
      alert("Please provide a rating before submitting!");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: Number(userId),
          provider_id: Number(providerId),
          rating: Number(fb.rating),
          comment: fb.comment || ""
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert("Feedback submitted!");
        fetchBookings(); // Refresh ratings & your own feedback
      } else {
        alert(data.message || "Failed to submit feedback");
      }
    } catch (err) {
      console.error("Feedback submission error:", err);
      alert("Error submitting feedback");
    }
  };

  return (
    <div className="feedback-page">
      {/* Background Elements */}
      <div className="dashboard-bg-elements">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
        <div className="bg-orb orb-1"></div>
        <div className="bg-orb orb-2"></div>
      </div>

      {/* Main Content */}
      <div className="feedback-container">
        {/* Header */}
        <header className="feedback-header">
          <div className="header-content">
            <h1>Feedback & Ratings</h1>
            <p>Share your experience with service providers</p>
          </div>
          <button 
            className="back-btn"
            onClick={() => navigate("/user-dashboard")}
          >
            ← Back to Dashboard
          </button>
        </header>

        {/* Feedback Table */}
        <div className="feedback-section">
          <div className="section-header">
            <h2>Your Bookings</h2>
            <div className="section-accent"></div>
          </div>

          {bookings.length === 0 ? (
            <div className="no-data-card">
              <div className="no-data-icon">⭐</div>
              <h3>No Bookings Available</h3>
              <p>Complete a booking to provide feedback</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="feedback-table">
                <thead>
                  <tr>
                    <th>Provider Name</th>
                    <th>Service Type</th>
                    <th>Average Rating</th>
                    <th>Your Rating</th>
                    <th>Your Comment</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id} className="feedback-row">
                      <td>
                        <div className="provider-cell">
                          <div className="provider-avatar-small">
                            {b.provider_name ? b.provider_name.charAt(0).toUpperCase() : "P"}
                          </div>
                          <span>{b.provider_name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="service-badge">{b.service_type}</span>
                      </td>
                      <td>
                        <div className="rating-display">
                          {b.avg_rating ? (
                            <>
                              <span className="rating-stars">
                                {'★'.repeat(Math.round(Number(b.avg_rating)))}
                                {'☆'.repeat(5 - Math.round(Number(b.avg_rating)))}
                              </span>
                              <span className="rating-value">
                                ({Number(b.avg_rating).toFixed(1)})
                              </span>
                            </>
                          ) : (
                            <span className="no-rating">-</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <select
                          className="rating-select"
                          value={feedbacks[b.id]?.rating || ""}
                          onChange={e => handleFeedbackChange(b.id, "rating", e.target.value)}
                        >
                          <option value="">Select Rating</option>
                          <option value="1">1 ⭐</option>
                          <option value="2">2 ⭐⭐</option>
                          <option value="3">3 ⭐⭐⭐</option>
                          <option value="4">4 ⭐⭐⭐⭐</option>
                          <option value="5">5 ⭐⭐⭐⭐⭐</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="comment-input"
                          value={feedbacks[b.id]?.comment || ""}
                          onChange={e => handleFeedbackChange(b.id, "comment", e.target.value)}
                          placeholder="Add your comment (optional)"
                          style={{ width: "100%" }}
                        />
                      </td>
                      <td>
                        <button 
                          className="submit-btn"
                          onClick={() => submitFeedback(b.id, b.provider_id)}
                        >
                          Submit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .feedback-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0c1a2c 0%, #1a3a5f 50%, #0c1a2c 100%);
          position: relative;
          overflow-x: hidden;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        /* Background Elements */
        .dashboard-bg-elements {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          z-index: 1;
        }

        .bg-shape {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
          animation: float 20s infinite linear;
        }

        .shape-1 {
          width: 120px;
          height: 120px;
          top: 10%;
          left: 5%;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 80px;
          height: 80px;
          top: 70%;
          left: 85%;
          animation-delay: -8s;
        }

        .shape-3 {
          width: 150px;
          height: 150px;
          top: 20%;
          left: 80%;
          animation-delay: -15s;
        }

        .bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
          opacity: 0.2;
          animation: orbPulse 8s ease-in-out infinite;
        }

        .orb-1 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, #00c6ff 0%, transparent 70%);
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, #0072ff 0%, transparent 70%);
          bottom: 10%;
          right: 10%;
          animation-delay: -2s;
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 0.6;
          }
          25% {
            transform: translate(30px, -40px) rotate(90deg) scale(1.1);
            opacity: 0.8;
          }
          50% {
            transform: translate(-20px, 30px) rotate(180deg) scale(0.9);
            opacity: 0.4;
          }
          75% {
            transform: translate(40px, 20px) rotate(270deg) scale(1.05);
            opacity: 0.7;
          }
        }

        @keyframes orbPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.3;
          }
        }

        /* Main Container */
        .feedback-container {
          position: relative;
          z-index: 2;
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Header */
        .feedback-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .header-content h1 {
          font-size: 2.2rem;
          color: white;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #ffffff 0%, #00c6ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header-content p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1.1rem;
        }

        .back-btn {
          padding: 0.75rem 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .back-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateX(-5px);
        }

        /* Feedback Section */
        .feedback-section {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 2.5rem;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .section-header {
          margin-bottom: 2rem;
        }

        .section-header h2 {
          font-size: 1.8rem;
          color: white;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #00c6ff 0%, #0072ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .section-accent {
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, #00c6ff, #0072ff);
          border-radius: 2px;
        }

        /* Table Styles */
        .table-wrapper {
          overflow-x: auto;
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .feedback-table {
          width: 100%;
          border-collapse: collapse;
          color: white;
        }

        .feedback-table th {
          background: rgba(255, 255, 255, 0.08);
          color: #00c6ff;
          font-weight: 600;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 1.25rem;
          text-align: left;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .feedback-table td {
          padding: 1.25rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .feedback-row:nth-child(even) {
          background: rgba(255, 255, 255, 0.02);
        }

        .feedback-row:hover {
          background: rgba(0, 198, 255, 0.1);
        }

        /* Provider Cell */
        .provider-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .provider-avatar-small {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff6b6b, #ffa726);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
          font-size: 0.9rem;
        }

        /* Service Badge */
        .service-badge {
          background: rgba(0, 198, 255, 0.2);
          color: #00c6ff;
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          border: 1px solid rgba(0, 198, 255, 0.3);
        }

        /* Rating Display */
        .rating-display {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .rating-stars {
          color: #ffde59;
          font-size: 1.1rem;
        }

        .rating-value {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
        }

        .no-rating {
          color: rgba(255, 255, 255, 0.5);
          font-style: italic;
        }

        /* Form Elements */
        .rating-select {
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: white;
          font-size: 0.9rem;
          width: 100%;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .rating-select:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .rating-select option {
          background: #1a3a5f;
          color: white;
        }

        .comment-input {
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: white;
          font-size: 0.9rem;
          width: 100%;
          transition: all 0.3s ease;
        }

        .comment-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .comment-input:focus {
          outline: none;
          border-color: #00c6ff;
          background: rgba(255, 255, 255, 0.15);
        }

        /* Submit Button */
        .submit-btn {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #00c6ff 0%, #0072ff 100%);
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 114, 255, 0.4);
        }

        /* No Data State */
        .no-data-card {
          text-align: center;
          padding: 3rem 2rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 15px;
          border: 2px dashed rgba(255, 255, 255, 0.2);
        }

        .no-data-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .no-data-card h3 {
          color: white;
          margin-bottom: 0.5rem;
        }

        .no-data-card p {
          color: rgba(255, 255, 255, 0.7);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .feedback-container {
            padding: 1.5rem;
          }
          
          .feedback-header {
            flex-direction: column;
            gap: 1.5rem;
            text-align: center;
          }
        }

        @media (max-width: 768px) {
          .feedback-container {
            padding: 1rem;
          }
          
          .feedback-section {
            padding: 1.5rem;
          }
          
          .feedback-table {
            font-size: 0.9rem;
          }
          
          .feedback-table th,
          .feedback-table td {
            padding: 0.75rem 0.5rem;
          }
          
          .provider-cell {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
          }
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #00c6ff, #0072ff);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #00b4e6, #0066cc);
        }
      `}</style>
    </div>
  );
}

export default Feedback;