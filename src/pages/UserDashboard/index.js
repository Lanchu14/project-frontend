// index.js
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import UserDocuments from "./UserDocuments";
import "./UserDashboard.css";

function UserDashboard() {
  const [providers, setProviders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState({});
  const [activeSection, setActiveSection] = useState("profile");
  const userId = localStorage.getItem("userId") || 1;
  const navigate = useNavigate();

  const mainContentRef = useRef(null);
  const profileRef = useRef(null);
  const providersRef = useRef(null);
  const bookingsRef = useRef(null);
  const legalRef = useRef(null);
  const airef = useRef(null);
  const documentsRef = useRef(null);

  // Fetch user, providers, bookings
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/users/${userId}`);
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("fetchUserDetails err", err);
      }
    };

    const fetchProviders = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/bookings/verified-providers");
        const data = await res.json();
        setProviders(data || []);
      } catch (err) {
        console.error("fetchProviders err", err);
      }
    };

    const fetchBookings = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/bookings/user/${userId}`);
        const data = await res.json();
        setBookings(data || []);
      } catch (err) {
        console.error("fetchBookings err", err);
      }
    };

    fetchUserDetails();
    fetchProviders();
    fetchBookings();
  }, [userId]);

  // Scroll spy to update active section
  useEffect(() => {
    const sections = [
      { id: 'profile', ref: profileRef },
      { id: 'providers', ref: providersRef },
      { id: 'bookings', ref: bookingsRef },
      { id: 'documents', ref: documentsRef },
      { id: 'ai', ref: airef },
      { id: 'legal', ref: legalRef }
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

  const handleBooking = async (providerId) => {
    try {
      const res = await fetch("http://localhost:5000/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: Number(userId), provider_id: providerId }),
      });
      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Booking requested");
      } else {
        alert(data.message || "Booking failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending booking request");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // AI Chat
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState([]);

  const handleAsk = async () => {
    if (!question.trim()) return;
    const userQuestion = question;
    setChat([...chat, { type: "user", text: userQuestion }]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/gemini/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userQuestion }),
      });
      const data = await res.json();
      setChat((prev) => [...prev, { type: "bot", text: data.answer || data.message }]);
    } catch (err) {
      console.error(err);
      setChat((prev) => [...prev, { type: "bot", text: "Something went wrong!" }]);
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const sections = {
      'profile': profileRef,
      'providers': providersRef,
      'bookings': bookingsRef,
      'documents': documentsRef,
      'ai': airef,
      'legal': legalRef
    };

    if (sections[sectionId] && sections[sectionId].current) {
      sections[sectionId].current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Document Upload Handler
  const handleDocumentUpload = async (bookingId) => {
    const fileInput = document.getElementById(`userFile_${bookingId}`);
    if (!fileInput.files[0]) {
      alert("Select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);
    formData.append("booking_id", bookingId);
    formData.append("uploaded_by", "user");

    try {
      const res = await fetch("http://localhost:5000/api/documents/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      alert(data.message);
      // Clear the file input after successful upload
      fileInput.value = '';
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
    }
  };

  // Handle file input change to show selected file name
  const handleFileInputChange = (bookingId) => {
    const fileInput = document.getElementById(`userFile_${bookingId}`);
    const fileNameDisplay = document.getElementById(`fileName_${bookingId}`);
    
    if (fileInput.files[0]) {
      fileNameDisplay.textContent = fileInput.files[0].name;
      fileNameDisplay.parentElement.classList.add('has-file');
    } else {
      fileNameDisplay.textContent = 'Choose file...';
      fileNameDisplay.parentElement.classList.remove('has-file');
    }
  };

  return (
    <div className="dashboard-container">
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

        <div className="user-info">
          <div className="user-avatar">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="user-details">
            <h3>{user.name || "User"}</h3>
            <p>{user.email || "user@email.com"}</p>
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
            className={`nav-item ${activeSection === 'providers' ? 'active' : ''}`}
            onClick={() => scrollToSection('providers')}
          >
            <span className="nav-icon">🔍</span>
            <span>Search Providers</span>
          </button>
          
          <button 
            className={`nav-item ${activeSection === 'bookings' ? 'active' : ''}`}
            onClick={() => scrollToSection('bookings')}
          >
            <span className="nav-icon">📅</span>
            <span>My Bookings</span>
          </button>
          
          <button 
            className="nav-item"
            onClick={() => navigate("/feedback")}
          >
            <span className="nav-icon">⭐</span>
            <span>Feedback & Ratings</span>
          </button>
          
          <button 
            className={`nav-item ${activeSection === 'documents' ? 'active' : ''}`}
            onClick={() => scrollToSection('documents')}
          >
            <span className="nav-icon">📁</span>
            <span>Documents / Case Files</span>
          </button>
          
          <button 
            className={`nav-item ${activeSection === 'ai' ? 'active' : ''}`}
            onClick={() => scrollToSection('ai')}
          >
            <span className="nav-icon">🤖</span>
            <span>AI Legal Assistant</span>
          </button>
          
          <button 
            className={`nav-item ${activeSection === 'legal' ? 'active' : ''}`}
            onClick={() => scrollToSection('legal')}
          >
            <span className="nav-icon">📚</span>
            <span>Legal Resources</span>
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
            <h1>Welcome back, {user.name || "User"}! </h1>
            <p>Here's your legal services dashboard</p>
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
              <div className="stat-icon">⚖️</div>
              <div className="stat-info">
                <h3>{providers.length}</h3>
                <p>Available Providers</p>
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
                <span className="info-value">{user.name || "-"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email Address</span>
                <span className="info-value">{user.email || "-"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Phone Number</span>
                <span className="info-value">{user.phone || "-"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">User ID</span>
                <span className="info-value">{userId}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Providers Section */}
        <section className="dashboard-section" ref={providersRef}>
          <div className="section-header">
            <h2>Search & Book Service Providers</h2>
            <div className="section-accent"></div>
          </div>
          <div className="providers-grid">
            {providers.map((provider) => (
              <div key={provider.id} className="provider-card">
                <div className="provider-header">
                  <div className="provider-avatar">
                    {provider.name ? provider.name.charAt(0).toUpperCase() : "P"}
                  </div>
                  <div className="provider-info">
                    <h4>{provider.name}</h4>
                    <p className="provider-service">{provider.service_type}</p>
                  </div>
                </div>
                <div className="provider-contact">
                  <span className="contact-email">{provider.email}</span>
                </div>
                <button 
                  className="book-btn"
                  onClick={() => handleBooking(provider.id)}
                >
                  Book Consultation
                </button>
              </div>
            ))}
            {providers.length === 0 && (
              <div className="no-data-card">
                <div className="no-data-icon">🔍</div>
                <h3>No Verified Providers Available</h3>
                <p>Check back later for available legal professionals</p>
              </div>
            )}
          </div>
        </section>

        {/* Bookings Section */}
        <section className="dashboard-section" ref={bookingsRef}>
          <div className="section-header">
            <h2>My Bookings</h2>
            <div className="section-accent"></div>
          </div>
          <div className="bookings-container">
            {bookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <h4>Booking #{booking.id}</h4>
                  <span className={`status-badge status-${booking.status}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="booking-details">
                  <div className="detail-item">
                    <span className="detail-label">Provider:</span>
                    <span className="detail-value">{booking.provider_name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Service:</span>
                    <span className="detail-value">{booking.service_type}</span>
                  </div>
                </div>
                <div className="booking-actions">
                  {booking.status === "accepted" && (
                    <>
                      <button 
                        className="action-btn primary"
                        onClick={() => navigate(`/chat/${booking.id}`)}
                      >
                        💬 Start Chat
                      </button>
                      <button 
                        className="action-btn secondary"
                        onClick={() => navigate(`/video-call/${booking.id}`)}
                      >
                        📹 Video Call
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {bookings.length === 0 && (
              <div className="no-data-card">
                <div className="no-data-icon">📅</div>
                <h3>No Bookings Yet</h3>
                <p>Book your first legal consultation to get started</p>
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
            {bookings.map((booking) => (
              <div key={booking.id} className="document-card">
                <div className="document-header">
                  <h4>Booking #{booking.id} - {booking.provider_name}</h4>
                </div>
                <div className="document-upload">
                  <div className="file-input-wrapper">
                    <input 
                      type="file" 
                      id={`userFile_${booking.id}`}
                      className="file-input"
                      onChange={() => handleFileInputChange(booking.id)}
                    />
                    <div className="file-input-custom">
                      <span id={`fileName_${booking.id}`}>Choose file...</span>
                      <span>📎</span>
                    </div>
                  </div>
                  <button
                    className="upload-btn"
                    onClick={() => handleDocumentUpload(booking.id)}
                  >
                    📤 Upload Document
                  </button>
                </div>
                <div className="existing-documents">
                  <h5>Existing Documents:</h5>
                  <UserDocuments bookingId={booking.id} />
                </div>
              </div>
            ))}
            {bookings.length === 0 && (
              <div className="no-data-card">
                <div className="no-data-icon">📁</div>
                <h3>No Bookings Available</h3>
                <p>Create a booking to upload documents</p>
              </div>
            )}
          </div>
        </section>

        {/* AI Chat Assistant */}
        <section className="dashboard-section ai-section" ref={airef}>
          <div className="section-header">
            <h2>AI Legal Assistant</h2>
            <div className="section-accent"></div>
          </div>
          <div className="ai-container">
            <div className="ai-header">
              <div className="ai-avatar">🤖</div>
              <div className="ai-info">
                <h4>Legal AI Assistant</h4>
                <p>Get instant answers to your legal queries</p>
              </div>
            </div>
            
            <div className="chat-container">
              <div className="chat-messages">
                {chat.map((message, index) => (
                  <div key={index} className={`chat-message ${message.type}`}>
                    <div className="message-content">
                      {message.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="chat-message bot">
                    <div className="message-content loading">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="chat-input-container">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask me anything about legal matters..."
                  className="chat-input"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAsk();
                    }
                  }}
                />
                <button 
                  className="send-btn"
                  onClick={handleAsk}
                  disabled={loading || !question.trim()}
                >
                  {loading ? "⏳" : "🚀"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Legal Resources */}
        <section className="dashboard-section" ref={legalRef}>
          <div className="section-header">
            <h2>Legal Resources & FAQs</h2>
            <div className="section-accent"></div>
          </div>
          <div className="resources-container">
            <div className="resources-grid">
              <div className="resource-card">
                <h4>📚 Official Government Links</h4>
                <ul className="resource-links">
                  <li><a href="https://www.india.gov.in/" target="_blank" rel="noreferrer">India Government Portal</a></li>
                  <li><a href="https://www.mygov.in/" target="_blank" rel="noreferrer">MyGov India</a></li>
                  <li><a href="https://services.india.gov.in/" target="_blank" rel="noreferrer">Government Services</a></li>
                </ul>
              </div>
              
              <div className="resource-card">
                <h4>📄 PDF Resources</h4>
                <ul className="resource-links">
                  <li><a href="/resources/legal-guide.pdf" target="_blank" rel="noreferrer">Legal Guide (PDF)</a></li>
                  <li><a href="/resources/user-rights.pdf" target="_blank" rel="noreferrer">User Rights (PDF)</a></li>
                </ul>
              </div>
            </div>
            
            <div className="faq-section">
              <h4>❓ Frequently Asked Questions</h4>
              <div className="faq-list">
                <details className="faq-item">
                  <summary>How do I book a service provider?</summary>
                  <p>Go to "Search Providers", find a verified service provider, and click "Book Consultation".</p>
                </details>
                <details className="faq-item">
                  <summary>How can I give feedback?</summary>
                  <p>Click "Feedback & Ratings" in the sidebar and submit your rating and comment.</p>
                </details>
                <details className="faq-item">
                  <summary>What if my booking is rejected?</summary>
                  <p>You can try booking another provider or contact our support team for assistance.</p>
                </details>
                <details className="faq-item">
                  <summary>Who can I contact for legal issues?</summary>
                  <p>Use the official government links provided or consult with our verified legal professionals.</p>
                </details>
              </div>
            </div>
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

export default UserDashboard;