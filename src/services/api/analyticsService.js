export const analyticsService = {
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
          { field: { Name: "date" } },
          { field: { Name: "crowd_density" } },
          { field: { Name: "incident_count" } },
          { field: { Name: "alert_count" } },
          { field: { Name: "camera_uptime" } }
        ],
        orderBy: [
          { fieldName: "date", sorttype: "DESC" }
        ]
      };
      
      const response = await apperClient.fetchRecords("analytic", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      const analytics = response.data || [];
      
      // Map database fields to component expectations
      return analytics.map(analytic => ({
        ...analytic,
        crowdDensity: analytic.crowd_density,
        incidentCount: analytic.incident_count,
        alertCount: analytic.alert_count,
        cameraUptime: analytic.camera_uptime
      }));
    } catch (error) {
      console.error("Error fetching analytics:", error);
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
          { field: { Name: "date" } },
          { field: { Name: "crowd_density" } },
          { field: { Name: "incident_count" } },
          { field: { Name: "alert_count" } },
          { field: { Name: "camera_uptime" } }
        ]
      };
      
      const response = await apperClient.getRecordById("analytic", parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      const analytic = response.data;
      if (analytic) {
        return {
          ...analytic,
          crowdDensity: analytic.crowd_density,
          incidentCount: analytic.incident_count,
          alertCount: analytic.alert_count,
          cameraUptime: analytic.camera_uptime
        };
      }
      
      return null;
    } catch (error) {
      console.error(`Error fetching analytic with ID ${id}:`, error);
      throw error;
    }
  },

  async create(analyticsData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields
      const params = {
        records: [{
          Name: analyticsData.Name || `Analytics ${analyticsData.date}`,
          Tags: analyticsData.Tags || "",
          date: analyticsData.date,
          crowd_density: analyticsData.crowd_density || analyticsData.crowdDensity,
          incident_count: analyticsData.incident_count || analyticsData.incidentCount,
          alert_count: analyticsData.alert_count || analyticsData.alertCount,
          camera_uptime: analyticsData.camera_uptime || analyticsData.cameraUptime
        }]
      };
      
      const response = await apperClient.createRecord("analytic", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to create analytics");
        }
        return response.results[0].data;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error creating analytics:", error);
      throw error;
    }
  },

  async update(id, updates) {
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
      if (updates.date !== undefined) updateData.date = updates.date;
      if (updates.crowd_density !== undefined) updateData.crowd_density = updates.crowd_density;
      if (updates.crowdDensity !== undefined) updateData.crowd_density = updates.crowdDensity;
      if (updates.incident_count !== undefined) updateData.incident_count = updates.incident_count;
      if (updates.incidentCount !== undefined) updateData.incident_count = updates.incidentCount;
      if (updates.alert_count !== undefined) updateData.alert_count = updates.alert_count;
      if (updates.alertCount !== undefined) updateData.alert_count = updates.alertCount;
      if (updates.camera_uptime !== undefined) updateData.camera_uptime = updates.camera_uptime;
      if (updates.cameraUptime !== undefined) updateData.camera_uptime = updates.cameraUptime;
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord("analytic", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to update analytics");
        }
        return response.results[0].data;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error updating analytics:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord("analytic", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to delete analytics");
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting analytics:", error);
      throw error;
    }
  }
};