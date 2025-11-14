import { useEffect, useState } from "react";

function AdminVerify() {
  const [providers, setProviders] = useState([]);

  // Fetch all service providers
  const fetchProviders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/providers");
      const data = await res.json();
      setProviders(data);
    } catch (err) {
      console.error("Error fetching providers:", err);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  // Handle verify
  const handleVerify = async (id) => {
    await fetch(`http://localhost:5000/api/admin/providers/verify/${id}`, {
      method: "PUT",
    });
    fetchProviders();
    alert("✅ Provider verified successfully!");
  };

  // Handle reject
  const handleReject = async (id) => {
    await fetch(`http://localhost:5000/api/admin/providers/reject/${id}`, {
      method: "PUT",
    });
    fetchProviders();
    alert("❌ Provider rejected!");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>👑 Admin — Verify Service Providers</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr style={{ background: "#f3f3f3" }}>
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
                {p.bar_certificate && (
                  <>
                    <a
                      href={`http://localhost:5000/${p.bar_certificate}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Bar Cert
                    </a>{" "}
                    |{" "}
                  </>
                )}
                {p.id_proof && (
                  <>
                    <a
                      href={`http://localhost:5000/${p.id_proof}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      ID
                    </a>{" "}
                    |{" "}
                  </>
                )}
                {p.qualification_cert && (
                  <a
                    href={`http://localhost:5000/${p.qualification_cert}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Qualification
                  </a>
                )}
              </td>
              <td>{p.is_verified ? "✅ Verified" : "❌ Not Verified"}</td>
              <td>
                {!p.is_verified && (
                  <>
                    <button onClick={() => handleVerify(p.id)}>Verify</button>
                    <button
                      onClick={() => handleReject(p.id)}
                      style={{ marginLeft: "10px" }}
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminVerify;
