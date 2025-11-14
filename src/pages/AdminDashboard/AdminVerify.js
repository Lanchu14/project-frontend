// AdminVerify.js
import { useEffect, useState } from "react";

function AdminVerify() {
  const [providers, setProviders] = useState([]);

  const fetchProviders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/providers");
      const data = await res.json();
      setProviders(data);
    } catch (err) {
      console.error("Error fetching providers:", err);
    }
  };

  useEffect(() => { fetchProviders(); }, []);

  const handleVerify = async (id) => {
    await fetch(`http://localhost:5000/api/admin/providers/verify/${id}`, { method: "PUT" });
    fetchProviders();
    alert("Provider verified successfully!");
  };

  const handleReject = async (id) => {
    await fetch(`http://localhost:5000/api/admin/providers/reject/${id}`, { method: "PUT" });
    fetchProviders();
    alert("Provider rejected!");
  };

  return (
    <div>
      <div className="section-header">
        <h2>Verify Service Providers</h2>
        <div className="section-accent"></div>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Service Type</th>
              <th>Documents</th>
              <th>Verification</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.email}</td>
                <td>{p.phone}</td>
                <td>{p.service_type}</td>
                <td>
                  <div className="document-links">
                    {p.bar_certificate && (
                      <a href={`http://localhost:5000/${p.bar_certificate}`} target="_blank" rel="noreferrer" className="document-link">
                        Bar Certificate
                      </a>
                    )}
                    {p.id_proof && (
                      <a href={`http://localhost:5000/${p.id_proof}`} target="_blank" rel="noreferrer" className="document-link">
                        ID Proof
                      </a>
                    )}
                    {p.qualification_cert && (
                      <a href={`http://localhost:5000/${p.qualification_cert}`} target="_blank" rel="noreferrer" className="document-link">
                        Qualification
                      </a>
                    )}
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${p.is_verified ? 'status-accepted' : 'status-pending'}`}>
                    {p.is_verified ? "Verified" : "Pending"}
                  </span>
                </td>
                <td>
                  {!p.is_verified && (
                    <div className="action-buttons">
                      <button className="action-btn verify" onClick={() => handleVerify(p.id)}>
                        Verify
                      </button>
                      <button className="action-btn reject" onClick={() => handleReject(p.id)}>
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {providers.length === 0 && (
          <div className="no-data-card">
            <div className="no-data-icon">✅</div>
            <h3>No Providers Found</h3>
            <p>There are no providers waiting for verification</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminVerify;