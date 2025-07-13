export const incidentService = {
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
          { field: { Name: "type" } },
          { field: { Name: "severity" } },
          { field: { Name: "camera_id" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "description" } },
          { field: { Name: "resolved" } },
          { field: { Name: "snapshot_url" } }
        ],
        orderBy: [
          { fieldName: "timestamp", sorttype: "DESC" }
        ]
      };
      
      const response = await apperClient.fetchRecords("incident", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching incidents:", error);
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
          { field: { Name: "type" } },
          { field: { Name: "severity" } },
          { field: { Name: "camera_id" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "description" } },
          { field: { Name: "resolved" } },
          { field: { Name: "snapshot_url" } }
        ]
      };
      
      const response = await apperClient.getRecordById("incident", parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching incident with ID ${id}:`, error);
      throw error;
    }
  },

  async create(incidentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields
      const params = {
        records: [{
          Name: incidentData.Name || incidentData.description,
          Tags: incidentData.Tags || "",
          type: incidentData.type,
          severity: incidentData.severity,
          camera_id: incidentData.camera_id,
          timestamp: incidentData.timestamp || new Date().toISOString(),
          description: incidentData.description,
          resolved: false,
          snapshot_url: incidentData.snapshot_url || ""
        }]
      };
      
      const response = await apperClient.createRecord("incident", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to create incident");
        }
        return response.results[0].data;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error creating incident:", error);
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
      if (updates.type !== undefined) updateData.type = updates.type;
      if (updates.severity !== undefined) updateData.severity = updates.severity;
      if (updates.camera_id !== undefined) updateData.camera_id = updates.camera_id;
      if (updates.timestamp !== undefined) updateData.timestamp = updates.timestamp;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.resolved !== undefined) updateData.resolved = updates.resolved;
      if (updates.snapshot_url !== undefined) updateData.snapshot_url = updates.snapshot_url;
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord("incident", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to update incident");
        }
        return response.results[0].data;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error updating incident:", error);
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
      
      const response = await apperClient.deleteRecord("incident", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to delete incident");
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting incident:", error);
      throw error;
    }
  }
};