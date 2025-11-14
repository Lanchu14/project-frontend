// index.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
    service_type: "",
  });

  const [files, setFiles] = useState({
    bar_certificate: null,
    id_proof: null,
    qualification_cert: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let endpoint;
    let options;

    if (formData.role === "user") {
      endpoint = "http://localhost:5000/api/auth/register-user";
      options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      };
    } else {
      endpoint = "http://localhost:5000/api/auth/register-provider";
      const formDataToSend = new FormData();

      for (let key in formData) formDataToSend.append(key, formData[key]);
      for (let key in files) if (files[key]) formDataToSend.append(key, files[key]);

      options = {
        method: "POST",
        body: formDataToSend,
      };
    }

    const response = await fetch(endpoint, options);
    const data = await response.json();
    alert(data.message);

    if (response.ok) {
      navigate("/login");
    }
  };

  return (
    <div className="register-container">
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

      <div className="register-card">
        <div className="card-header">
          <div className="logo-container">
            <div className="logo-icon">⚖️</div>
            <h1>Legal Connect</h1>
          </div>
          <h2>Create Account</h2>
          <p>Join our legal services platform</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input 
              name="name" 
              onChange={handleChange} 
              value={formData.name} 
              required 
              placeholder="Enter your full name"
            />
          </div>

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
            <label>Phone Number</label>
            <input 
              name="phone" 
              onChange={handleChange} 
              value={formData.phone} 
              required 
              placeholder="Enter your phone number"
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
              placeholder="Create a secure password"
            />
          </div>

          <div className="input-group">
            <label>Account Type</label>
            <select name="role" onChange={handleChange} value={formData.role}>
              <option value="user">Client</option>
              <option value="provider">Legal Provider</option>
            </select>
          </div>

          {formData.role === "provider" && (
            <div className="provider-fields">
              <div className="section-divider">
                <span>Legal Professional Details</span>
              </div>
              
              <div className="input-group">
                <label>Service Type</label>
                <input
                  name="service_type"
                  onChange={handleChange}
                  value={formData.service_type}
                  placeholder="e.g., Advocate, Mediator, Legal Consultant"
                  required
                />
              </div>

              <div className="input-group">
                <label>Bar Council Certificate</label>
                <div className="file-input-wrapper">
                  <input 
                    type="file" 
                    name="bar_certificate" 
                    onChange={handleFileChange} 
                    required 
                    className="file-input"
                  />
                  <div className="file-input-label">Choose File</div>
                </div>
              </div>

              <div className="input-group">
                <label>ID Proof</label>
                <div className="file-input-wrapper">
                  <input 
                    type="file" 
                    name="id_proof" 
                    onChange={handleFileChange} 
                    required 
                    className="file-input"
                  />
                  <div className="file-input-label">Choose File</div>
                </div>
              </div>

              <div className="input-group">
                <label>Qualification Certificate</label>
                <div className="file-input-wrapper">
                  <input 
                    type="file" 
                    name="qualification_cert" 
                    onChange={handleFileChange} 
                    required 
                    className="file-input"
                  />
                  <div className="file-input-label">Choose File</div>
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="register-btn">
            <span>Create Account</span>
            <div className="btn-arrow">→</div>
          </button>
        </form>

        <div className="card-footer">
          <p>Already have an account? <a href="/login" className="login-link">Sign In</a></p>
        </div>
      </div>
    </div>
  );
}

export default Register;