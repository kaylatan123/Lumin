// Zoom Video SDK Configuration
export const ZOOM_CONFIG = {
  // Your Zoom SDK credentials
  sdkKey: 'wEfE1TSTG9FlrOLvjL4Q',
  sdkSecret: '', // You'll need the secret key as well for JWT generation
  
  // Default session settings
  defaultSessionConfig: {
    sessionIdleTimeoutMins: 40,
    audioOptions: {
      connect: true,
      mute: false,
      autoAdjustSpeakerVolume: true,
    },
    videoOptions: {
      localVideoOn: true,
    },
  },
};

// Generate JWT token for Zoom session
// NOTE: In production, this should be done on your backend server for security
export const generateZoomToken = (sessionName: string, role: 0 | 1 = 1): string => {
  // This is a placeholder - you need to implement JWT generation
  // using your SDK secret on a backend server
  // For now, you'll need to get tokens from your backend API
  
  console.warn('Zoom JWT token should be generated on backend server');
  return ''; // Replace with actual token from backend
};
