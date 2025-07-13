export const alertService = {
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
          { field: { Name: "incident_id" } },
          { field: { Name: "message" } },
          { field: { Name: "priority" } },
          { field: { Name: "created_at" } },
          { field: { Name: "acknowledged" } },
          { 
            field: { name: "incident" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        orderBy: [
          { fieldName: "created_at", sorttype: "DESC" }
        ]
      };
      
      const response = await apperClient.fetchRecords("alert", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching alerts:", error);
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
          { field: { Name: "incident_id" } },
          { field: { Name: "message" } },
          { field: { Name: "priority" } },
          { field: { Name: "created_at" } },
          { field: { Name: "acknowledged" } },
          { 
            field: { name: "incident" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      };
      
      const response = await apperClient.getRecordById("alert", parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching alert with ID ${id}:`, error);
      throw error;
    }
  },

  async create(alertData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields
      const params = {
        records: [{
          Name: alertData.Name || alertData.message,
          Tags: alertData.Tags || "",
          incident_id: alertData.incident_id,
          message: alertData.message,
          priority: alertData.priority,
          created_at: alertData.created_at || new Date().toISOString(),
          acknowledged: false,
          incident: alertData.incident || null
        }]
      };
      
      const response = await apperClient.createRecord("alert", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to create alert");
        }
        return response.results[0].data;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error creating alert:", error);
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
      if (updates.incident_id !== undefined) updateData.incident_id = updates.incident_id;
      if (updates.message !== undefined) updateData.message = updates.message;
      if (updates.priority !== undefined) updateData.priority = updates.priority;
      if (updates.created_at !== undefined) updateData.created_at = updates.created_at;
      if (updates.acknowledged !== undefined) updateData.acknowledged = updates.acknowledged;
      if (updates.incident !== undefined) updateData.incident = updates.incident;
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord("alert", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to update alert");
        }
        return response.results[0].data;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error updating alert:", error);
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
      
      const response = await apperClient.deleteRecord("alert", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to delete alert");
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting alert:", error);
      throw error;
    }
  }
};