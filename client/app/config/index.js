export const config = {
  signaling: 'https://localhost:8443/',
  peerConfig: {
    iceServers: [
      { urls: 'stun:stun.stunprotocol.org:3478' },
      { urls: 'stun:stun.l.google.com:19302' }
    ]
  },
  media: {
    video: true,
    audio: false
  }
};

