import mockIncidents from "@/services/mockData/incidents.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const incidentService = {
  async getAll() {
    await delay(400);
    return [...mockIncidents];
  },

  async getById(id) {
    await delay(200);
    const incident = mockIncidents.find(i => i.Id === parseInt(id));
    if (!incident) {
      throw new Error("Incident not found");
    }
    return { ...incident };
  },

  async create(incidentData) {
    await delay(500);
    const maxId = Math.max(...mockIncidents.map(i => i.Id));
    const newIncident = {
      Id: maxId + 1,
      ...incidentData,
      timestamp: new Date().toISOString(),
      resolved: false
    };
    mockIncidents.push(newIncident);
    return { ...newIncident };
  },

  async update(id, updates) {
    await delay(300);
    const index = mockIncidents.findIndex(i => i.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Incident not found");
    }
    mockIncidents[index] = { ...mockIncidents[index], ...updates };
    return { ...mockIncidents[index] };
  },

  async delete(id) {
    await delay(300);
    const index = mockIncidents.findIndex(i => i.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Incident not found");
    }
    const deleted = mockIncidents.splice(index, 1)[0];
    return { ...deleted };
  }
};