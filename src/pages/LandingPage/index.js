// index.js
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./LandingPage.css";

function LandingPage() {
  const [currentText, setCurrentText] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const taglines = [
    "Bridging Justice with Technology",
    "Your Trusted Legal Partner",
    "Secure • Confidential • Professional",
    "Innovating Legal Solutions"
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % taglines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [taglines.length]);

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Simple form submission - in real project, connect to backend
    console.log('Contact form submitted:', contactForm);
    alert('Thank you for your message! We will get back to you soon.');
    setContactForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="landing-container">
      {/* Animated Background Elements */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
        <div className="shape shape-5"></div>
      </div>

      {/* Legal Icons Animation */}
      <div className="legal-icons">
        <div className="icon-scale">⚖️</div>
        <div className="icon-gavel">🔨</div>
        <div className="icon-document">📄</div>
        <div className="icon-shield">🛡️</div>
        <div className="icon-contract">📝</div>
      </div>

      {/* Particle Background */}
      <div className="particles">
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className="particle"></div>
        ))}
      </div>

      {/* Main Content */}
      <div className={`landing-content ${isVisible ? 'visible' : ''}`}>
        {/* Header */}
        <header className="landing-header">
          <div className="logo">
            <div className="logo-icon">⚖️</div>
            <h1>Legal Connect</h1>
          </div>
          <nav className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </nav>
        </header>

        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <div className="main-title">
              <h1 className="title-line-1">Welcome to</h1>
              <h1 className="title-line-2">Legal Connect</h1>
              <div className="title-accent"></div>
            </div>
            
            <div className="tagline-container">
              <p className="tagline">{taglines[currentText]}</p>
            </div>

            <p className="hero-description">
              Experience the future of legal services with our cutting-edge platform. 
              Connect with verified legal professionals, manage your cases securely, 
              and access justice like never before.
            </p>

            {/* CTA Buttons */}
            <div className="cta-buttons">
              <Link to="/register" className="cta-btn primary">
                <span>Get Started Free</span>
                <div className="btn-sparkle">✨</div>
              </Link>
              <Link to="/login" className="cta-btn secondary">
                <span>Existing Account</span>
                <div className="btn-arrow">→</div>
              </Link>
            </div>

            {/* Platform Highlights */}
            <div className="stats-container">
              <div className="stat">
                <h3>24/7</h3>
                <p>Accessibility</p>
              </div>
              <div className="stat">
                <h3>100%</h3>
                <p>Secure Platform</p>
              </div>
              <div className="stat">
                <h3>Fast</h3>
                <p>Case Matching</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div id="features" className="features-preview">
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h4>Secure Platform</h4>
            <p>End-to-end encrypted communications and document storage with military-grade security</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h4>Instant Matching</h4>
            <p>Smart algorithm connects you with the perfect legal expert for your specific needs</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h4>24/7 Access</h4>
            <p>Manage your legal matters anytime, anywhere with our mobile-friendly platform</p>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="why-choose-section">
          <h3>Why Choose Legal Connect?</h3>
          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-icon">👥</div>
              <h4>Verified Professionals</h4>
              <p>All legal experts are thoroughly vetted and verified</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">💼</div>
              <h4>Multiple Specializations</h4>
              <p>Find experts in corporate, family, criminal, and more legal fields</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">🔄</div>
              <h4>Seamless Process</h4>
              <p>From consultation to case resolution, we streamline everything</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">💰</div>
              <h4>Transparent Pricing</h4>
              <p>No hidden costs with clear, upfront pricing for all services</p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div id="contact" className="contact-section">
          <div className="contact-container">
            <h3>Get In Touch</h3>
            <p className="contact-subtitle">
              Have questions? Reach out to us and we'll get back to you as soon as possible.
            </p>
            
            <div className="contact-content">
              <div className="contact-info">
                <div className="contact-method">
                  <div className="contact-icon">📧</div>
                  <div className="contact-details">
                    <h4>Email Us</h4>
                    <p>support@legalconnect.com</p>
                  </div>
                </div>
                <div className="contact-method">
                  <div className="contact-icon">📞</div>
                  <div className="contact-details">
                    <h4>Call Us</h4>
                    <p>+91 93539 89172</p>
                  </div>
                </div>
                <div className="contact-method">
                  <div className="contact-icon">💬</div>
                  <div className="contact-details">
                    <h4>Live Chat</h4>
                    <p>Available 24/7 for instant support</p>
                  </div>
                </div>
              </div>

              <form className="contact-form" onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={contactForm.name}
                    onChange={handleContactChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    className="form-textarea"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="submit-btn">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="final-cta">
          <h3>Ready to Transform Your Legal Experience?</h3>
          <p>Join thousands who have already discovered the future of legal services</p>
          <Link to="/register" className="cta-btn primary large">
            <span>Start Your Journey Today</span>
            <div className="btn-sparkle">⚡</div>
          </Link>
        </div>
      </div>

      {/* Background Gradient Orbs */}
      <div className="gradient-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>
    </div>
  );
}

export default LandingPage;