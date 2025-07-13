const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const systemService = {
  async getStatus() {
    await delay(200);
    return {
      overallStatus: "online",
      camerasOnline: 8,
      aiLoad: Math.floor(Math.random() * 30) + 30,
      networkLatency: Math.floor(Math.random() * 10) + 8,
      storageUsed: Math.floor(Math.random() * 20) + 60,
      uptime: "99.9%"
    };
  }
};