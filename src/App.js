import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import ProviderDashboard from "./pages/ProviderDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminVerify from "./pages/AdminVerify";
import Feedback from "./pages/Feedback";

import { useParams } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import VideoCall from "./pages/ChatPage/VideoCall";

function ChatWrapper() {
  const { bookingId } = useParams();
  const userName = "User"; // Replace dynamically: either provider or user name
  return <ChatPage bookingId={bookingId} userName={userName} />;
}

function VideoCallWrapper() {
  const { bookingId } = useParams();
  const userName = localStorage.getItem("providerId") ? "Provider" : "User";
  return <VideoCall bookingId={bookingId} userName={userName} />;
}



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/provider-dashboard" element={<ProviderDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/verify" element={<AdminVerify />} />
        <Route path="/chat/:bookingId" element={<ChatWrapper />} />
        <Route path="/video-call/:bookingId" element={<VideoCallWrapper />} />
        <Route path="/feedback" element={<Feedback />} />


      </Routes>
    </Router>
  );
}

export default App;
