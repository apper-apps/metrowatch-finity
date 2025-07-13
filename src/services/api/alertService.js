import mockAlerts from "@/services/mockData/alerts.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const alertService = {
  async getAll() {
    await delay(250);
    return [...mockAlerts];
  },

  async getById(id) {
    await delay(200);
    const alert = mockAlerts.find(a => a.Id === parseInt(id));
    if (!alert) {
      throw new Error("Alert not found");
    }
    return { ...alert };
  },

  async create(alertData) {
    await delay(300);
    const maxId = Math.max(...mockAlerts.map(a => a.Id));
    const newAlert = {
      Id: maxId + 1,
      ...alertData,
      createdAt: new Date().toISOString(),
      acknowledged: false
    };
    mockAlerts.push(newAlert);
    return { ...newAlert };
  },

  async update(id, updates) {
    await delay(250);
    const index = mockAlerts.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Alert not found");
    }
    mockAlerts[index] = { ...mockAlerts[index], ...updates };
    return { ...mockAlerts[index] };
  },

  async delete(id) {
    await delay(300);
    const index = mockAlerts.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Alert not found");
    }
    const deleted = mockAlerts.splice(index, 1)[0];
    return { ...deleted };
  }
};