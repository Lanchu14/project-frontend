import React, { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import io from 'socket.io-client';
import './VideoCall.css';

const VideoCall = ({ bookingId, userName }) => {
  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState('');
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);

  const userVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();

  useEffect(() => {
    socket.current = io.connect("http://localhost:5000");
    socket.current.emit("joinRoom", bookingId); // Join the room based on bookingId

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setStream(stream);
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });

    socket.current.on('hey', (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });
  }, [bookingId]);

  const callPeer = () => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on('signal', data => {
      socket.current.emit('callUser', { userToCall: bookingId, signalData: data, from: userName });
    });

    peer.on('stream', stream => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.current.on('callAccepted', signal => {
      setCallAccepted(true);
      peer.signal(signal);
    });
  };

  const acceptCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on('signal', data => {
      socket.current.emit('acceptCall', { signal: data, to: caller });
    });

    peer.on('stream', stream => {
      partnerVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
  };

  const leaveCall = () => {
    setCallEnded(true);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    socket.current.disconnect();
  };

  return (
    <div className="video-call-container">
      <div className="video-wrapper">
        {stream && <video playsInline muted ref={userVideo} autoPlay className="video-local" />}
        {callAccepted && !callEnded && <video playsInline ref={partnerVideo} autoPlay className="video-remote" />}
      </div>
      <div className="controls">
        {callAccepted && !callEnded ? (
          <button onClick={leaveCall} className="btn-leave">End Call</button>
        ) : (
          <button onClick={callPeer} className="btn-call">Call</button>
        )}
      </div>
      {receivingCall && !callAccepted && (
        <div className="incoming-call">
          <h1>{caller} is calling you</h1>
          <button onClick={acceptCall} className="btn-accept">Accept</button>
        </div>
      )}
    </div>
  );
};

export default VideoCall;
