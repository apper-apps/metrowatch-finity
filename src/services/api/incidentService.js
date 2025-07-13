// Initialize ApperClient with Project ID and Public Key
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'incident';

// Updateable fields for create/update operations (excluding System fields)
const updateableFields = [
  'Name', 'Tags', 'Owner', 'type', 'severity', 'camera_id', 
  'timestamp', 'description', 'resolved', 'snapshot_url'
];

// All fields for fetch operations
const allFields = [
  { field: { Name: "Id" } },
  { field: { Name: "Name" } },
  { field: { Name: "Tags" } },
  { field: { Name: "Owner" } },
  { field: { Name: "CreatedOn" } },
  { field: { Name: "CreatedBy" } },
  { field: { Name: "ModifiedOn" } },
  { field: { Name: "ModifiedBy" } },
  { field: { Name: "type" } },
  { field: { Name: "severity" } },
  { field: { Name: "camera_id" } },
  { field: { Name: "timestamp" } },
  { field: { Name: "description" } },
  { field: { Name: "resolved" } },
  { field: { Name: "snapshot_url" } }
];

// Helper function to filter data for create/update
const filterUpdateableData = (data) => {
  const filtered = {};
  updateableFields.forEach(field => {
    if (data.hasOwnProperty(field)) {
      // Format data based on field type
      if (field === 'timestamp' && data[field]) {
        // DateTime format: ISO 8601
        filtered[field] = new Date(data[field]).toISOString();
      } else if (field === 'resolved') {
        // Boolean format
        filtered[field] = Boolean(data[field]);
      } else {
        filtered[field] = data[field];
      }
    }
  });
  return filtered;
};

// Get all incidents
export const getAll = async () => {
  try {
    const params = {
      fields: allFields,
      orderBy: [
        { fieldName: "timestamp", sorttype: "DESC" }
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
    console.error("Error fetching incidents:", error);
    throw error;
  }
};

// Get incident by ID
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
      throw new Error('Incident not found');
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching incident with ID ${id}:`, error);
    throw error;
  }
};

// Create new incident
export const create = async (incidentData) => {
  try {
    const filteredData = filterUpdateableData(incidentData);
    
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
        console.error(`Failed to create incident:${JSON.stringify(failedRecords)}`);
        const errorMessage = failedRecords[0].message || 'Failed to create incident';
        throw new Error(errorMessage);
      }
      
      const successfulRecord = response.results.find(result => result.success);
      return successfulRecord?.data;
    }
    
    throw new Error('No response data received');
  } catch (error) {
    console.error("Error creating incident:", error);
    throw error;
  }
};

// Update incident
export const update = async (id, incidentData) => {
  try {
    const filteredData = filterUpdateableData(incidentData);
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
        console.error(`Failed to update incident:${JSON.stringify(failedRecords)}`);
        const errorMessage = failedRecords[0].message || 'Failed to update incident';
        throw new Error(errorMessage);
      }
      
      const successfulRecord = response.results.find(result => result.success);
      return successfulRecord?.data;
    }
    
    throw new Error('No response data received');
  } catch (error) {
    console.error("Error updating incident:", error);
    throw error;
  }
};

// Delete incident
export const deleteIncident = async (id) => {
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
        console.error(`Failed to delete incident:${JSON.stringify(failedRecords)}`);
        const errorMessage = failedRecords[0].message || 'Failed to delete incident';
        throw new Error(errorMessage);
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting incident:", error);
    throw error;
  }
};

// Get incidents by severity
export const getBySeverity = async (severity) => {
  try {
    const params = {
      fields: allFields,
      where: [
        {
          FieldName: "severity",
          Operator: "EqualTo",
          Values: [severity]
        }
      ],
      orderBy: [
        { fieldName: "timestamp", sorttype: "DESC" }
      ]
    };
    
    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    console.error("Error fetching incidents by severity:", error);
    throw error;
  }
};

// Get recent incidents
export const getRecent = async (limit = 10) => {
  try {
    const params = {
      fields: allFields,
      orderBy: [
        { fieldName: "timestamp", sorttype: "DESC" }
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
    console.error("Error fetching recent incidents:", error);
    throw error;
  }
};

// Get incidents by status
export const getByStatus = async (resolved = false) => {
  try {
    const params = {
      fields: allFields,
      where: [
        {
          FieldName: "resolved",
          Operator: "EqualTo",
          Values: [resolved]
        }
      ],
      orderBy: [
        { fieldName: "timestamp", sorttype: "DESC" }
      ]
    };
    
    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    console.error("Error fetching incidents by status:", error);
    throw error;
  }
};

// Search incidents
export const search = async (query) => {
  try {
    const params = {
      fields: allFields,
      whereGroups: [
        {
          operator: "OR",
          subGroups: [
            {
              operator: "OR",
              conditions: [
                {
                  fieldName: "Name",
                  operator: "Contains",
                  values: [query]
                },
                {
                  fieldName: "description",
                  operator: "Contains",
                  values: [query]
                },
                {
                  fieldName: "type",
                  operator: "Contains",
                  values: [query]
                }
              ]
            }
          ]
        }
      ],
      orderBy: [
        { fieldName: "timestamp", sorttype: "DESC" }
      ]
    };
    
    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    console.error("Error searching incidents:", error);
    throw error;
  }
};

// Get incident statistics
export const getStats = async () => {
  try {
    const params = {
      aggregators: [
        {
          id: "totalIncidents",
          fields: [
            {
              field: { Name: "Id" },
              Function: "Count"
            }
          ]
        },
        {
          id: "resolvedIncidents",
          fields: [
            {
              field: { Name: "Id" },
              Function: "Count"
            }
          ],
          where: [
            {
              FieldName: "resolved",
              Operator: "EqualTo",
              Values: [true]
            }
          ]
        },
        {
          id: "criticalIncidents",
          fields: [
            {
              field: { Name: "Id" },
              Function: "Count"
            }
          ],
          where: [
            {
              FieldName: "severity",
              Operator: "EqualTo",
              Values: ["critical"]
            }
          ]
        },
        {
          id: "highIncidents",
          fields: [
            {
              field: { Name: "Id" },
              Function: "Count"
            }
          ],
          where: [
            {
              FieldName: "severity",
              Operator: "EqualTo",
              Values: ["high"]
            }
          ]
        }
      ]
    };
    
    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    // Process aggregator results
    const aggregators = response.aggregators || [];
    const total = aggregators.find(a => a.id === "totalIncidents")?.value || 0;
    const resolved = aggregators.find(a => a.id === "resolvedIncidents")?.value || 0;
    const critical = aggregators.find(a => a.id === "criticalIncidents")?.value || 0;
    const high = aggregators.find(a => a.id === "highIncidents")?.value || 0;
    
    return {
      total,
      resolved,
      unresolved: total - resolved,
      critical,
      high,
      resolutionRate: total > 0 ? ((resolved / total) * 100).toFixed(1) : 0
    };
return {
      total,
      resolved,
      unresolved: total - resolved,
      critical,
      high,
      resolutionRate: total > 0 ? ((resolved / total) * 100).toFixed(1) : 0
    };
  } catch (error) {
    console.error("Error fetching incident statistics:", error);
    throw error;
  }
};