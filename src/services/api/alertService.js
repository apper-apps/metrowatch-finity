// Initialize ApperClient with Project ID and Public Key
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'alert';

// Updateable fields for create/update operations (excluding System fields)
const updateableFields = [
  'Name', 'Tags', 'Owner', 'incident_id', 'message', 'priority', 
  'created_at', 'acknowledged', 'incident'
];

// All fields for fetch operations including lookup fields
const allFields = [
  { field: { Name: "Id" } },
  { field: { Name: "Name" } },
  { field: { Name: "Tags" } },
  { field: { Name: "Owner" } },
  { field: { Name: "CreatedOn" } },
  { field: { Name: "CreatedBy" } },
  { field: { Name: "ModifiedOn" } },
  { field: { Name: "ModifiedBy" } },
  { field: { Name: "incident_id" } },
  { field: { Name: "message" } },
  { field: { Name: "priority" } },
  { field: { Name: "created_at" } },
  { field: { Name: "acknowledged" } },
  { 
    field: { name: "incident" },
    referenceField: { field: { Name: "Name" } }
  }
];

// Helper function to filter data for create/update
const filterUpdateableData = (data) => {
  const filtered = {};
  updateableFields.forEach(field => {
    if (data.hasOwnProperty(field)) {
      // Format data based on field type
      if (field === 'created_at' && data[field]) {
        // DateTime format: ISO 8601
        filtered[field] = new Date(data[field]).toISOString();
      } else if (field === 'acknowledged') {
        // Boolean format
        filtered[field] = Boolean(data[field]);
      } else if (field === 'incident' && data[field]) {
        // Lookup field - convert to integer ID
        filtered[field] = parseInt(data[field]);
      } else {
        filtered[field] = data[field];
      }
    }
  });
  return filtered;
};

// Get all alerts
export const getAll = async () => {
  try {
    const params = {
      fields: allFields,
      orderBy: [
        { fieldName: "created_at", sorttype: "DESC" }
      ],
      pagingInfo: {
        limit: 100,
        offset: 0
      }
    };
    
    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    console.error("Error fetching alerts:", error);
    throw error;
  }
};

// Get alert by ID
export const getById = async (id) => {
  try {
    const params = {
      fields: allFields
    };
    
    const response = await apperClient.getRecordById(tableName, parseInt(id), params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (!response.data) {
      throw new Error('Alert not found');
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching alert with ID ${id}:`, error);
    throw error;
  }
};

// Create new alert
export const create = async (alertData) => {
  try {
    const filteredData = filterUpdateableData(alertData);
    
    const params = {
      records: [filteredData]
    };
    
    const response = await apperClient.createRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create alert:${JSON.stringify(failedRecords)}`);
        const errorMessage = failedRecords[0].message || 'Failed to create alert';
        throw new Error(errorMessage);
      }
      
      const successfulRecord = response.results.find(result => result.success);
      return successfulRecord?.data;
    }
    
    throw new Error('No response data received');
  } catch (error) {
    console.error("Error creating alert:", error);
    throw error;
  }
};

// Update alert
export const update = async (id, alertData) => {
  try {
    const filteredData = filterUpdateableData(alertData);
    filteredData.Id = parseInt(id);
    
    const params = {
      records: [filteredData]
    };
    
    const response = await apperClient.updateRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to update alert:${JSON.stringify(failedRecords)}`);
        const errorMessage = failedRecords[0].message || 'Failed to update alert';
        throw new Error(errorMessage);
      }
      
      const successfulRecord = response.results.find(result => result.success);
      return successfulRecord?.data;
    }
    
    throw new Error('No response data received');
  } catch (error) {
    console.error("Error updating alert:", error);
    throw error;
  }
};

// Delete alert
export const deleteAlert = async (id) => {
  try {
    const params = {
      RecordIds: [parseInt(id)]
    };
    
    const response = await apperClient.deleteRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to delete alert:${JSON.stringify(failedRecords)}`);
        const errorMessage = failedRecords[0].message || 'Failed to delete alert';
        throw new Error(errorMessage);
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting alert:", error);
    throw error;
  }
};

// Get alerts by priority
export const getByPriority = async (priority) => {
  try {
    const params = {
      fields: allFields,
      where: [
        {
          FieldName: "priority",
          Operator: "EqualTo",
          Values: [priority]
        }
      ],
      orderBy: [
        { fieldName: "created_at", sorttype: "DESC" }
      ]
    };
    
    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    console.error("Error fetching alerts by priority:", error);
    throw error;
  }
};

// Get unacknowledged alerts
export const getUnacknowledged = async () => {
  try {
    const params = {
      fields: allFields,
      where: [
        {
          FieldName: "acknowledged",
          Operator: "EqualTo",
          Values: [false]
        }
      ],
      orderBy: [
        { fieldName: "created_at", sorttype: "DESC" }
      ]
    };
    
    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    console.error("Error fetching unacknowledged alerts:", error);
    throw error;
  }
};

// Acknowledge alert
export const acknowledge = async (id) => {
  try {
    const updateData = {
      acknowledged: true
    };
    
    return await update(id, updateData);
  } catch (error) {
    console.error("Error acknowledging alert:", error);
    throw error;
  }
};

// Get recent alerts
export const getRecent = async (limit = 10) => {
  try {
    const params = {
      fields: allFields,
      orderBy: [
        { fieldName: "created_at", sorttype: "DESC" }
      ],
      pagingInfo: {
        limit: limit,
        offset: 0
      }
    };
    
    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    console.error("Error fetching recent alerts:", error);
    throw error;
}
  }
};

export default { getAll, getById, create, update, deleteAlert, getByPriority, getUnacknowledged, acknowledge, getRecent };