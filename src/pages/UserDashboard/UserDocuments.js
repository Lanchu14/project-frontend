import { useEffect, useState } from "react";

function UserDocuments({ bookingId }) {
  const [documents, setDocuments] = useState([]);

  const fetchDocuments = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/documents/${bookingId}`);
      const data = await res.json();
      // Filter only provider-uploaded files
      const providerDocs = data.filter(doc => doc.uploaded_by === "provider");
      setDocuments(providerDocs);
    } catch (err) {
      console.error("Error fetching documents:", err);
    }
  };

  useEffect(() => {
    fetchDocuments();
    const interval = setInterval(fetchDocuments, 10000);
    return () => clearInterval(interval);
  }, [bookingId]);

  if (documents.length === 0) return <p>No documents uploaded by provider yet.</p>;

  return (
    <ul>
      {documents.map((doc) => (
        <li key={doc.id} style={{ marginBottom: "5px" }}>
          <strong>{doc.uploader_name || "Provider"}:</strong>{" "} {/* Use actual name */}
          <a href={`http://localhost:5000/${doc.file_path}`} target="_blank" rel="noreferrer">
            {doc.file_name}
          </a>{" "}
          <span style={{ color: "#888", fontSize: "0.85em" }}>
            ({new Date(doc.uploaded_at).toLocaleString()})
          </span>
        </li>
      ))}
    </ul>
  );
}

export default UserDocuments;