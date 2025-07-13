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
  }
};