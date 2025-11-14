// AdminDocuments.js
import { useEffect, useState } from "react";

function AdminDocuments() {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/documents");
        const data = await res.json();
        setDocuments(data);
      } catch (err) {
        console.error("Error fetching documents:", err);
      }
    };

    fetchDocuments();
  }, []);

  return (
    <div>
      <div className="section-header">
        <h2>All Documents in Folder</h2>
        <div className="section-accent"></div>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>File Name</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {documents.length > 0 ? (
              documents.map((doc, idx) => (
                <tr key={idx}>
                  <td>{doc.file_name}</td>
                  <td>
                    <a href={`http://localhost:5000${doc.file_path}`} target="_blank" rel="noreferrer">
                      View / Download
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">
                  <div className="no-data-card">
                    <div className="no-data-icon">📁</div>
                    <h3>No Documents Found</h3>
                    <p>There are no documents in the system</p>
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

export default AdminDocuments;