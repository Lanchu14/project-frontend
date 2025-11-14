// adminProviders.js
import { useEffect, useState } from "react";

function AdminProviders() {
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

  const handleRemove = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/providers/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      alert(data.message);
      fetchProviders();
    } catch (err) {
      console.error("Remove provider error:", err);
      alert("Failed to remove provider");
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  return (
    <div>
      <div className="section-header">
        <h2>Manage Service Providers</h2>
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
              <th>Verified</th>
              <th>Action</th>
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
                  <span className={`status-badge ${p.is_verified ? 'status-accepted' : 'status-pending'}`}>
                    {p.is_verified ? "Verified" : "Pending"}
                  </span>
                </td>
                <td>
                  <button className="action-btn remove" onClick={() => handleRemove(p.id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {providers.length === 0 && (
              <tr>
                <td colSpan="7">
                  <div className="no-data-card">
                    <div className="no-data-icon">⚖️</div>
                    <h3>No Providers Found</h3>
                    <p>There are no service providers in the system</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProviders;