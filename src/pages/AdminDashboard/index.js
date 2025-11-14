// index.js
import { useState } from "react";
import AdminVerify from "./AdminVerify";
import AdminUsers from "./AdminUsers";
import AdminBookings from "./AdminBookings";
import AdminFeedback from "./AdminFeedback";
import AdminDocuments from "./AdminDocuments";
import AdminProviders from "./adminProviders";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("verify");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };
  
  const renderContent = () => {
    switch (activeTab) {
      case "verify":
        return <AdminVerify />;
      case "users":
        return <AdminUsers />;
      case "bookings":
        return <AdminBookings />;
      case "feedback":
        return <AdminFeedback />;
      case "documents":
        return <AdminDocuments />;
      case "providers":
        return <AdminProviders />;
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Background Elements */}
      <div className="dashboard-bg-elements">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
        <div className="bg-orb orb-1"></div>
        <div className="bg-orb orb-2"></div>
      </div>

      {/* Fixed Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">⚖️</div>
            <h2>Legal Connect</h2>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`sidebar-btn ${activeTab === "verify" ? "active" : ""}`}
            onClick={() => setActiveTab("verify")}
          >
            <span className="sidebar-icon">✅</span>
            <span>Verify Providers</span>
          </button>
          <button
            className={`sidebar-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <span className="sidebar-icon">👥</span>
            <span>Manage Users</span>
          </button>
          <button
            className={`sidebar-btn ${activeTab === "providers" ? "active" : ""}`}
            onClick={() => setActiveTab("providers")}
          >
            <span className="sidebar-icon">⚖️</span>
            <span>Manage Providers</span>
          </button>
          <button
            className={`sidebar-btn ${activeTab === "bookings" ? "active" : ""}`}
            onClick={() => setActiveTab("bookings")}
          >
            <span className="sidebar-icon">📅</span>
            <span>Manage Bookings</span>
          </button>
          <button
            className={`sidebar-btn ${activeTab === "feedback" ? "active" : ""}`}
            onClick={() => setActiveTab("feedback")}
          >
            <span className="sidebar-icon">⭐</span>
            <span>Manage Feedback</span>
          </button>
          <button
            className={`sidebar-btn ${activeTab === "documents" ? "active" : ""}`}
            onClick={() => setActiveTab("documents")}
          >
            <span className="sidebar-icon">📁</span>
            <span>Manage Documents</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-section">
          <div className="section-header">
            <h2>Admin Dashboard</h2>
            <div className="section-accent"></div>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;