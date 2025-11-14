// index.js
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ProviderDocuments from "./ProviderDocuments";
import "./ProviderDashboard.css";

function ProviderDashboard() {
  const [provider, setProvider] = useState({});
  const [bookings, setBookings] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [activeSection, setActiveSection] = useState("profile");
  const providerId = localStorage.getItem("providerId") || 1;
  const navigate = useNavigate();

  const mainContentRef = useRef(null);
  const profileRef = useRef(null);
  const bookingsRef = useRef(null);
  const documentsRef = useRef(null);
  const feedbackRef = useRef(null);

  // Fetch provider details
  const fetchProviderDetails = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/providers/${providerId}`);
      const data = await res.json();
      setProvider(data);
    } catch (err) {
      console.error("fetchProviderDetails err", err);
    }
  };

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/provider/${providerId}`);
      const data = await res.json();
      setBookings(data || []);
    } catch (err) {
      console.error("fetchBookings err", err);
    }
  };

  // Fetch feedbacks
  const fetchFeedbacks = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/providers/feedbacks/provider/${providerId}`);
      const data = await res.json();
      setFeedbacks(data || []);
    } catch (err) {
      console.error("fetchFeedbacks err", err);
    }
  };

  useEffect(() => {
    fetchProviderDetails();
    fetchBookings();
    fetchFeedbacks();
  }, []);

  // Scroll spy to update active section
  useEffect(() => {
    const sections = [
      { id: 'profile', ref: profileRef },
      { id: 'bookings', ref: bookingsRef },
      { id: 'documents', ref: documentsRef },
      { id: 'feedback', ref: feedbackRef }
    ];

    const observerOptions = {
      root: mainContentRef.current,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('data-section');
          setActiveSection(sectionId);
        }
      });
    }, observerOptions);

    sections.forEach(section => {
      if (section.ref.current) {
        section.ref.current.setAttribute('data-section', section.id);
        observer.observe(section.ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);

  const updateStatus = async (bookingId, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/status/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      alert(data.message || `Booking ${status}`);
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert("Error updating booking status");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const sections = {
      'profile': profileRef,
      'bookings': bookingsRef,
      'documents': documentsRef,
      'feedback': feedbackRef
    };

    if (sections[sectionId] && sections[sectionId].current) {
      sections[sectionId].current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Document Upload Handler for Provider
  const handleDocumentUpload = async (bookingId) => {
    const fileInput = document.getElementById(`providerFile_${bookingId}`);
    if (!fileInput.files[0]) {
      alert("Select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);
    formData.append("booking_id", bookingId);
    formData.append("uploaded_by", "provider");

    try {
      const res = await fetch("http://localhost:5000/api/documents/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      alert(data.message);
      // Clear the file input after successful upload
      fileInput.value = '';
      // Reset file name display
      const fileNameDisplay = document.getElementById(`providerFileName_${bookingId}`);
      if (fileNameDisplay) {
        fileNameDisplay.textContent = 'Choose file...';
        fileNameDisplay.parentElement.classList.remove('has-file');
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
    }
  };

  // Handle file input change to show selected file name
  const handleFileInputChange = (bookingId) => {
    const fileInput = document.getElementById(`providerFile_${bookingId}`);
    const fileNameDisplay = document.getElementById(`providerFileName_${bookingId}`);
    
    if (fileInput.files[0]) {
      fileNameDisplay.textContent = fileInput.files[0].name;
      fileNameDisplay.parentElement.classList.add('has-file');
    } else {
      fileNameDisplay.textContent = 'Choose file...';
      fileNameDisplay.parentElement.classList.remove('has-file');
    }
  };

  return (
    <div className="provider-dashboard">
      {/* Background Elements */}
      <div className="dashboard-bg-elements">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
        <div className="bg-orb orb-1"></div>
        <div className="bg-orb orb-2"></div>
      </div>

      {/* Fixed Sidebar Navigation */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">⚖️</div>
            <h2>Legal Connect</h2>
          </div>
        </div>

        <div className="provider-info">
          <div className="provider-avatar">
            {provider.name ? provider.name.charAt(0).toUpperCase() : "P"}
          </div>
          <div className="provider-details">
            <h3>{provider.name || "Provider"}</h3>
            <p>{provider.service_type || "Legal Services"}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeSection === 'profile' ? 'active' : ''}`}
            onClick={() => scrollToSection('profile')}
          >
            <span className="nav-icon">👤</span>
            <span>My Profile</span>
          </button>
          
          <button 
            className={`nav-item ${activeSection === 'bookings' ? 'active' : ''}`}
            onClick={() => scrollToSection('bookings')}
          >
            <span className="nav-icon">📅</span>
            <span>Booking Requests</span>
          </button>
          
          <button 
            className={`nav-item ${activeSection === 'documents' ? 'active' : ''}`}
            onClick={() => scrollToSection('documents')}
          >
            <span className="nav-icon">📁</span>
            <span>Documents / Case Files</span>
          </button>
          
          <button 
            className={`nav-item ${activeSection === 'feedback' ? 'active' : ''}`}
            onClick={() => scrollToSection('feedback')}
          >
            <span className="nav-icon">⭐</span>
            <span>Feedback & Ratings</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Scrollable Main Content */}
      <div className="dashboard-main" ref={mainContentRef}>
        {/* Welcome Header */}
        <header className="main-header">
          <div className="header-content">
            <h1>Welcome back, {provider.name || "Provider"}!</h1>
            <p>Manage your legal services and client bookings</p>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-info">
                <h3>{bookings.length}</h3>
                <p>Total Bookings</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-info">
                <h3>{feedbacks.length}</h3>
                <p>Client Reviews</p>
              </div>
            </div>
          </div>
        </header>

        {/* Profile Section */}
        <section className="dashboard-section" ref={profileRef}>
          <div className="section-header">
            <h2>My Profile</h2>
            <div className="section-accent"></div>
          </div>
          <div className="profile-card">
            <div className="profile-info">
              <div className="info-item">
                <span className="info-label">Full Name</span>
                <span className="info-value">{provider.name || "-"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email Address</span>
                <span className="info-value">{provider.email || "-"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Service Type</span>
                <span className="info-value">{provider.service_type || "-"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Provider ID</span>
                <span className="info-value">{providerId}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Bookings Section */}
        <section className="dashboard-section" ref={bookingsRef}>
          <div className="section-header">
            <h2>Booking Requests</h2>
            <div className="section-accent"></div>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>User Name</th>
                  <th>User Email</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                  <th>Video Call</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td>{b.user_name}</td>
                    <td>{b.user_email}</td>
                    <td>{new Date(b.booking_date).toLocaleString()}</td>
                    <td>
                      <span className={`status-badge status-${b.status}`}>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      {b.status === "pending" ? (
                        <div className="action-buttons">
                          <button 
                            className="action-btn accept"
                            onClick={() => updateStatus(b.id, "accepted")}
                          >
                            Accept
                          </button>
                          <button 
                            className="action-btn reject"
                            onClick={() => updateStatus(b.id, "rejected")}
                          >
                            Reject
                          </button>
                        </div>
                      ) : b.status === "accepted" ? (
                        <button 
                          className="action-btn chat"
                          onClick={() => navigate(`/chat/${b.id}`)}
                        >
                          💬 Chat
                        </button>
                      ) : (
                        "❌ Rejected"
                      )}
                    </td>
                    <td>
                      {b.status === "accepted" ? (
                        <button 
                          className="action-btn chat"
                          onClick={() => navigate(`/video-call/${b.id}`)}
                        >
                          📹 Video Call
                        </button>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {bookings.length === 0 && (
              <div className="no-data-card">
                <div className="no-data-icon">📅</div>
                <h3>No Booking Requests</h3>
                <p>You don't have any booking requests yet</p>
              </div>
            )}
          </div>
        </section>

        {/* Documents Section */}
        <section className="dashboard-section" ref={documentsRef}>
          <div className="section-header">
            <h2>Documents / Case Files</h2>
            <div className="section-accent"></div>
          </div>
          <div className="documents-container">
            {bookings.map((b) => (
              <div key={b.id} className="document-card">
                <div className="document-header">
                  <h4>Booking #{b.id} - {b.user_name}</h4>
                </div>
                <div className="document-upload">
                  <div className="file-input-wrapper">
                    <input 
                      type="file" 
                      id={`providerFile_${b.id}`}
                      className="file-input"
                      onChange={() => handleFileInputChange(b.id)}
                    />
                    <div className="file-input-custom">
                      <span id={`providerFileName_${b.id}`}>Choose file...</span>
                      <span>📎</span>
                    </div>
                  </div>
                  <button
                    className="upload-btn"
                    onClick={() => handleDocumentUpload(b.id)}
                  >
                    📤 Upload Document
                  </button>
                </div>
                <div className="existing-documents">
                  <h5>Existing Documents:</h5>
                  <ProviderDocuments bookingId={b.id} />
                </div>
              </div>
            ))}
            {bookings.length === 0 && (
              <div className="no-data-card">
                <div className="no-data-icon">📁</div>
                <h3>No Bookings Available</h3>
                <p>Documents will appear here when you have active bookings</p>
              </div>
            )}
          </div>
        </section>

        {/* Feedback Section */}
        <section className="dashboard-section" ref={feedbackRef}>
          <div className="section-header">
            <h2>Feedback & Ratings</h2>
            <div className="section-accent"></div>
          </div>
          <div className="feedback-container">
            {feedbacks.length === 0 ? (
              <div className="no-feedback">
                <div className="no-feedback-icon">⭐</div>
                <h3>No Feedback Yet</h3>
                <p>You haven't received any feedback from clients yet</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Feedback ID</th>
                      <th>User Name</th>
                      <th>Rating</th>
                      <th>Comment</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedbacks.map(f => (
                      <tr key={f.id}>
                        <td>{f.id}</td>
                        <td>{f.user_name}</td>
                        <td>
                          <span style={{ color: '#ffde59' }}>
                            {'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}
                          </span>
                        </td>
                        <td>{f.comment}</td>
                        <td>{new Date(f.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Back to Top Button */}
        <button 
          className="back-to-top"
          onClick={() => mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          ↑ Back to Top
        </button>
      </div>
    </div>
  );
}

export default ProviderDashboard;