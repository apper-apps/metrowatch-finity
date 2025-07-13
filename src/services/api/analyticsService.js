import mockAnalytics from "@/services/mockData/analytics.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const analyticsService = {
  async getAll() {
    await delay(500);
    return [...mockAnalytics];
  },

  async getById(id) {
    await delay(200);
    const analytics = mockAnalytics.find(a => a.Id === parseInt(id));
    if (!analytics) {
      throw new Error("Analytics data not found");
    }
    return { ...analytics };
  },

  async create(analyticsData) {
    await delay(400);
    const maxId = Math.max(...mockAnalytics.map(a => a.Id));
    const newAnalytics = {
      Id: maxId + 1,
      ...analyticsData
    };
    mockAnalytics.push(newAnalytics);
    return { ...newAnalytics };
  },

  async update(id, updates) {
    await delay(300);
    const index = mockAnalytics.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Analytics data not found");
    }
    mockAnalytics[index] = { ...mockAnalytics[index], ...updates };
    return { ...mockAnalytics[index] };
  },

  async delete(id) {
    await delay(300);
    const index = mockAnalytics.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Analytics data not found");
    }
    const deleted = mockAnalytics.splice(index, 1)[0];
    return { ...deleted };
  }
};