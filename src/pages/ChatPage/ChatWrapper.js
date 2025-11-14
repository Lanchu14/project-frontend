import { useParams } from "react-router-dom";
import ChatPage from "./pages/ChatPage";

function ChatWrapper() {
  const { bookingId } = useParams();
  const userName = "User"; // Replace dynamically: either provider or user name

  return <ChatPage bookingId={bookingId} userName={userName} />;
}

export default ChatWrapper;
