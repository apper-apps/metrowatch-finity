import mockCameras from '@/services/mockData/cameras.json';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const cameraService = {
  async getAll() {
    await delay(800);
    return mockCameras.map(camera => ({
      ...camera,
      isOnline: Math.random() > 0.15,
      alertLevel: Math.random() > 0.8 ? Math.floor(Math.random() * 3) + 1 : 0
    }));
  },

  async checkCameraAvailability() {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        return false;
      }
      
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      return videoDevices.length > 0;
    } catch (error) {
      console.error('Error checking camera availability:', error);
      return false;
    }
  },

  async checkCameraPermission() {
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const permission = await navigator.permissions.query({ name: 'camera' });
        return permission.state;
      }
      return 'prompt'; // Default if permission API not available
    } catch (error) {
      console.error('Error checking camera permission:', error);
      return 'prompt';
    }
  },

  async getRealCameras() {
    try {
      // Check permission first
      const permissionState = await this.checkCameraPermission();
      if (permissionState === 'denied') {
        throw new Error('Camera permission denied');
      }

      // Check if MediaDevices API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        throw new Error('MediaDevices API not supported');
      }

      // Enumerate media devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => 
        device.kind === 'videoinput' && device.deviceId
      );
      
      if (videoDevices.length === 0) {
        throw new Error('No video input devices found');
      }

      // Create camera objects from real devices with enhanced error handling
      const cameras = await Promise.all(
        videoDevices.map(async (device, index) => {
          try {
            // Test each camera with minimal constraints first
            const stream = await navigator.mediaDevices.getUserMedia({
              video: { 
                deviceId: { exact: device.deviceId },
                width: { min: 320 },
                height: { min: 240 }
              }
            });
            
            // Get actual stream capabilities
            const videoTrack = stream.getVideoTracks()[0];
            const capabilities = videoTrack.getCapabilities ? videoTrack.getCapabilities() : {};
            
            // Clean up stream immediately
            stream.getTracks().forEach(track => track.stop());
            
            return {
              id: device.deviceId || `camera-${index}`,
              name: device.label || `Camera ${index + 1}`,
              location: `Device ${index + 1}`,
              status: "online",
              isOnline: true,
              alertLevel: 0,
              deviceId: device.deviceId,
              realCamera: true,
              capabilities: {
                width: capabilities.width || { min: 320, max: 1920 },
                height: capabilities.height || { min: 240, max: 1080 },
                facingMode: capabilities.facingMode || ['user']
              }
            };
          } catch (error) {
            console.warn(`Failed to initialize camera ${device.label || `Device ${index + 1}`}:`, {
              name: error.name,
              message: error.message,
              deviceId: device.deviceId
            });
            
            // Return a placeholder for failed cameras
            return {
              id: device.deviceId || `camera-${index}`,
              name: device.label || `Camera ${index + 1}`,
              location: `Device ${index + 1}`,
              status: "error",
              isOnline: false,
              alertLevel: 0,
              deviceId: device.deviceId,
              realCamera: true,
              error: error.message
            };
          }
})
      );

      // Separate working and failed cameras
      const validCameras = cameras.filter(camera => camera.status === "online");
      const failedCameras = cameras.filter(camera => camera.status === "error");
      
      if (failedCameras.length > 0) {
        console.warn(`${failedCameras.length} camera(s) failed to initialize:`, failedCameras);
      }
      
      if (validCameras.length === 0) {
        if (failedCameras.length > 0) {
          throw new Error(`All ${failedCameras.length} detected cameras failed to initialize. Check camera permissions and availability.`);
        } else {
          throw new Error('No cameras could be initialized');
        }
      }

      return validCameras;
    } catch (error) {
      console.error('Failed to get real cameras:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
},

  async getById(id) {
    await delay(300);
    const cameras = await this.getAll();
    return cameras.find(camera => camera.id === id);
  },

  async updateCamera(id, updates) {
    await delay(500);
    return {
      id,
      ...updates,
      lastUpdated: new Date().toISOString()
    };
  },

  async getCameraStream(deviceId) {
    try {
      // Check permission before attempting to get stream
      const permissionState = await this.checkCameraPermission();
      if (permissionState === 'denied') {
        throw new Error('Camera permission denied');
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia not supported');
      }

      const constraints = {
video: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          width: { ideal: 1280, min: 320 },
          height: { ideal: 720, min: 240 },
          frameRate: { ideal: 30, min: 15 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Verify stream is active
      if (!stream || stream.getTracks().length === 0) {
        throw new Error('Failed to get active video stream');
      }

      return stream;
    } catch (error) {
      console.error('Failed to get camera stream:', {
        name: error.name,
        message: error.message,
        deviceId
      });
      throw error;
    }
  }
};