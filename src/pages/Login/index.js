// index.js
import { useState } from "react";
import "./Login.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let endpoint = "";
    if (formData.role === "user")
      endpoint = "http://localhost:5000/api/auth/login-user";
    else if (formData.role === "provider")
      endpoint = "http://localhost:5000/api/auth/login-provider";
    else endpoint = "http://localhost:5000/api/auth/login-admin";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    alert(data.message || "Login successful!");

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      if (data.role === "user") {
        localStorage.setItem("userId", data.id);
        window.location.href = "/user-dashboard";
      } else if (data.role === "provider") {
        localStorage.setItem("providerId", data.id);
        window.location.href = "/provider-dashboard";
      } else if (data.role === "admin") {
        localStorage.setItem("adminId", data.id);
        window.location.href = "/admin-dashboard";
      }
    }
  };

  return (
    <div className="login-container">
      {/* Animated Background Elements */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
        <div className="shape shape-5"></div>
      </div>
      
      {/* Legal-themed decorative elements */}
      <div className="legal-icons">
        <div className="icon-scale">⚖️</div>
        <div className="icon-gavel">🔨</div>
        <div className="icon-document">📄</div>
      </div>

      <div className="login-card">
        <div className="card-header">
          <div className="logo-container">
            <div className="logo-icon">⚖️</div>
            <h1>Legal Connect</h1>
          </div>
          <h2>Welcome Back</h2>
          <p>Access your legal services portal</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <input
              name="email"
              onChange={handleChange}
              value={formData.email}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              value={formData.password}
              required
              placeholder="Enter your password"
            />
          </div>

          <div className="input-group">
            <label>Login As</label>
            <select
              name="role"
              onChange={handleChange}
              value={formData.role}
            >
              <option value="user">User</option>
              <option value="provider">Service Provider</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <button type="submit" className="login-btn">
            <span>Access Portal</span>
            <div className="btn-arrow">→</div>
          </button>
        </form>

        <div className="card-footer">
          <p>Secure • Confidential • Professional</p>
        </div>
      </div>
    </div>
  );
}

export default Login;