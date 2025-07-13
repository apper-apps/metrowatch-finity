import mockCameras from "@/services/mockData/cameras.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const cameraService = {
  async getAll() {
    await delay(300);
    return [...mockCameras];
  },

  async getById(id) {
    await delay(200);
    const camera = mockCameras.find(c => c.Id === parseInt(id));
    if (!camera) {
      throw new Error("Camera not found");
    }
    return { ...camera };
  },

  async create(cameraData) {
    await delay(400);
    const maxId = Math.max(...mockCameras.map(c => c.Id));
    const newCamera = {
      Id: maxId + 1,
      ...cameraData,
      lastActive: new Date().toISOString()
    };
    mockCameras.push(newCamera);
    return { ...newCamera };
  },

  async update(id, updates) {
    await delay(300);
    const index = mockCameras.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Camera not found");
    }
    mockCameras[index] = { ...mockCameras[index], ...updates };
    return { ...mockCameras[index] };
  },

  async delete(id) {
    await delay(300);
    const index = mockCameras.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Camera not found");
    }
    const deleted = mockCameras.splice(index, 1)[0];
    return { ...deleted };
  },

  async getRealCameras() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      if (videoDevices.length === 0) {
        throw new Error("No camera devices found");
      }

      const cameras = videoDevices.map((device, index) => ({
        Id: index + 1,
        name: device.label || `Camera ${index + 1}`,
        location: "MacBook Camera",
        status: "online",
        feedUrl: `camera://${device.deviceId}`,
        deviceId: device.deviceId,
        lastActive: new Date().toISOString(),
        isRealCamera: true
      }));

      return cameras;
    } catch (error) {
      console.error("Error accessing cameras:", error);
      throw new Error("Failed to access camera devices");
    }
  },

  async getCameraStream(deviceId) {
    try {
      const constraints = {
        video: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      return stream;
    } catch (error) {
      console.error("Error getting camera stream:", error);
      throw new Error("Failed to get camera stream");
    }
  }
};