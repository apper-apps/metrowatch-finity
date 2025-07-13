export const cameraService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "location" } },
          { field: { Name: "status" } },
          { field: { Name: "feed_url" } },
          { field: { Name: "last_active" } },
          { field: { Name: "is_online" } },
          { field: { Name: "alert_level" } },
          { field: { Name: "device_id" } },
          { field: { Name: "real_camera" } },
          { field: { Name: "capabilities" } },
          { field: { Name: "error" } }
        ],
        orderBy: [
          { fieldName: "Name", sorttype: "ASC" }
        ]
      };
      
      const response = await apperClient.fetchRecords("camera", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      const cameras = response.data || [];
      
      // Map database fields to component expectations and add dynamic status
      return cameras.map(camera => ({
        ...camera,
        name: camera.Name || camera.name,
        isOnline: camera.is_online !== undefined ? camera.is_online : Math.random() > 0.15,
        alertLevel: camera.alert_level || (Math.random() > 0.8 ? Math.floor(Math.random() * 3) + 1 : 0),
        feedUrl: camera.feed_url,
        lastActive: camera.last_active
      }));
    } catch (error) {
      console.error("Error fetching cameras:", error);
      throw error;
    }
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
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "location" } },
          { field: { Name: "status" } },
          { field: { Name: "feed_url" } },
          { field: { Name: "last_active" } },
          { field: { Name: "is_online" } },
          { field: { Name: "alert_level" } },
          { field: { Name: "device_id" } },
          { field: { Name: "real_camera" } },
          { field: { Name: "capabilities" } },
          { field: { Name: "error" } }
        ]
      };
      
      const response = await apperClient.getRecordById("camera", parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      const camera = response.data;
      if (camera) {
        return {
          ...camera,
          name: camera.Name || camera.name,
          isOnline: camera.is_online !== undefined ? camera.is_online : true,
          alertLevel: camera.alert_level || 0,
          feedUrl: camera.feed_url,
          lastActive: camera.last_active
        };
      }
      
      return null;
    } catch (error) {
      console.error(`Error fetching camera with ID ${id}:`, error);
      throw error;
    }
  },

async updateCamera(id, updates) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields plus Id
      const updateData = {
        Id: parseInt(id)
      };
      
      if (updates.Name !== undefined) updateData.Name = updates.Name;
      if (updates.Tags !== undefined) updateData.Tags = updates.Tags;
      if (updates.location !== undefined) updateData.location = updates.location;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.feed_url !== undefined) updateData.feed_url = updates.feed_url;
      if (updates.last_active !== undefined) updateData.last_active = updates.last_active;
      if (updates.is_online !== undefined) updateData.is_online = updates.is_online;
      if (updates.alert_level !== undefined) updateData.alert_level = updates.alert_level;
      if (updates.device_id !== undefined) updateData.device_id = updates.device_id;
      if (updates.real_camera !== undefined) updateData.real_camera = updates.real_camera;
      if (updates.capabilities !== undefined) updateData.capabilities = updates.capabilities;
      if (updates.error !== undefined) updateData.error = updates.error;
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord("camera", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to update camera");
        }
        return response.results[0].data;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error updating camera:", error);
      throw error;
    }
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