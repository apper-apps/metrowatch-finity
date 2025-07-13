// Initialize ApperClient with Project ID and Public Key
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'analytic';

// Updateable fields for create/update operations (excluding System fields)
const updateableFields = [
  'Name', 'Tags', 'Owner', 'date', 'crowd_density', 'incident_count', 
  'alert_count', 'camera_uptime'
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
  { field: { Name: "date" } },
  { field: { Name: "crowd_density" } },
  { field: { Name: "incident_count" } },
  { field: { Name: "alert_count" } },
  { field: { Name: "camera_uptime" } }
];

// Helper function to filter data for create/update
const filterUpdateableData = (data) => {
  const filtered = {};
  updateableFields.forEach(field => {
    if (data.hasOwnProperty(field)) {
      // Format data based on field type
      if (field === 'date' && data[field]) {
        // Date format: YYYY-MM-DD
        const date = new Date(data[field]);
        filtered[field] = date.toISOString().split('T')[0];
      } else if (field === 'crowd_density' || field === 'incident_count' || field === 'alert_count') {
        // Number format
        filtered[field] = Number(data[field]);
      } else if (field === 'camera_uptime') {
        // Decimal format
        filtered[field] = parseFloat(data[field]);
      } else {
        filtered[field] = data[field];
      }
    }
  });
  return filtered;
};

// Get all analytics data
export const getAll = async () => {
  try {
    const params = {
      fields: allFields,
      orderBy: [
        { fieldName: "date", sorttype: "DESC" }
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
    console.error("Error fetching analytics:", error);
    throw error;
  }
};

// Get analytics by date range
export const getByDateRange = async (startDate, endDate) => {
  try {
    const start = new Date(startDate).toISOString().split('T')[0];
    const end = new Date(endDate).toISOString().split('T')[0];
    
    const params = {
      fields: allFields,
      whereGroups: [
        {
          operator: "AND",
          subGroups: [
            {
              operator: "AND",
              conditions: [
                {
                  fieldName: "date",
                  operator: "GreaterThanOrEqualTo",
                  values: [start]
                },
                {
                  fieldName: "date",
                  operator: "LessThanOrEqualTo",
                  values: [end]
                }
              ]
            }
          ]
        }
      ],
      orderBy: [
        { fieldName: "date", sorttype: "ASC" }
      ]
    };
    
    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    console.error("Error fetching analytics by date range:", error);
    throw error;
  }
};

// Get recent analytics (last N days)
export const getRecent = async (days = 7) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffDateStr = cutoffDate.toISOString().split('T')[0];
    
    const params = {
      fields: allFields,
      where: [
        {
          FieldName: "date",
          Operator: "GreaterThanOrEqualTo",
          Values: [cutoffDateStr]
        }
      ],
      orderBy: [
        { fieldName: "date", sorttype: "DESC" }
      ]
    };
    
    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    console.error("Error fetching recent analytics:", error);
    throw error;
  }
};

// Get analytics summary using aggregators
export const getSummary = async () => {
  try {
    const params = {
      aggregators: [
        {
          id: "totalIncidents",
          fields: [
            {
              field: { Name: "incident_count" },
              Function: "Sum"
            }
          ]
        },
        {
          id: "totalAlerts",
          fields: [
            {
              field: { Name: "alert_count" },
              Function: "Sum"
            }
          ]
        },
        {
          id: "avgCrowdDensity",
          fields: [
            {
              field: { Name: "crowd_density" },
              Function: "Average"
            }
          ]
        },
        {
          id: "avgUptime",
          fields: [
            {
              field: { Name: "camera_uptime" },
              Function: "Average"
            }
          ]
        },
        {
          id: "dataPoints",
          fields: [
            {
              field: { Name: "Id" },
              Function: "Count"
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
    const totalIncidents = aggregators.find(a => a.id === "totalIncidents")?.value || 0;
    const totalAlerts = aggregators.find(a => a.id === "totalAlerts")?.value || 0;
    const avgCrowdDensity = aggregators.find(a => a.id === "avgCrowdDensity")?.value || 0;
    const avgUptime = aggregators.find(a => a.id === "avgUptime")?.value || 0;
    const dataPoints = aggregators.find(a => a.id === "dataPoints")?.value || 0;
    
    return {
      totalIncidents,
      totalAlerts,
      avgCrowdDensity: parseFloat(avgCrowdDensity.toFixed(1)),
      avgUptime: parseFloat(avgUptime.toFixed(1)),
      dataPoints
    };
  } catch (error) {
    console.error("Error fetching analytics summary:", error);
    throw error;
  }
};

// Get analytics by metric
export const getByMetric = async (metric) => {
  try {
    const params = {
      fields: [
        { field: { Name: "date" } },
        { field: { Name: metric } }
      ],
      orderBy: [
        { fieldName: "date", sorttype: "ASC" }
      ]
    };
    
    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return (response.data || []).map(item => ({
      date: item.date,
      value: item[metric] || 0,
      metric
    }));
  } catch (error) {
    console.error("Error fetching analytics by metric:", error);
    throw error;
  }
};

// Create analytics entry
export const create = async (analyticsData) => {
  try {
    const filteredData = filterUpdateableData(analyticsData);
    
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
        console.error(`Failed to create analytics entry:${JSON.stringify(failedRecords)}`);
        const errorMessage = failedRecords[0].message || 'Failed to create analytics entry';
        throw new Error(errorMessage);
      }
      
      const successfulRecord = response.results.find(result => result.success);
      return successfulRecord?.data;
    }
    
    throw new Error('No response data received');
  } catch (error) {
    console.error("Error creating analytics entry:", error);
    throw error;
  }
};

// Get trend data for charts
export const getTrendData = async (metric, days = 30) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffDateStr = cutoffDate.toISOString().split('T')[0];
    
    const params = {
      fields: [
        { field: { Name: "date" } },
        { field: { Name: metric } }
      ],
      where: [
        {
          FieldName: "date",
          Operator: "GreaterThanOrEqualTo",
          Values: [cutoffDateStr]
        }
      ],
      orderBy: [
        { fieldName: "date", sorttype: "ASC" }
      ]
    };
    
    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return (response.data || []).map(item => ({
      date: item.date,
      value: item[metric] || 0
    }));
  } catch (error) {
    console.error("Error fetching trend data:", error);
    throw error;
  }
};

// Update analytics entry
export const update = async (id, updates) => {
  try {
    const updateData = {
      Id: parseInt(id),
      ...filterUpdateableData(updates)
    };
    
    const params = {
      records: [updateData]
    };
    
    const response = await apperClient.updateRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      if (failedRecords.length > 0) {
        console.error(`Failed to update analytics entry: ${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || "Failed to update analytics");
      }
      return response.results[0].data;
    }
    
    return response.data;
  } catch (error) {
    console.error("Error updating analytics:", error);
    throw error;
  }
};

// Delete analytics entry
export const deleteAnalytics = async (id) => {
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
        console.error(`Failed to delete analytics entry: ${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || "Failed to delete analytics");
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting analytics:", error);
    throw error;
  }
};

export default { 
  getAll, 
  getByDateRange, 
  getRecent, 
  getSummary, 
  getByMetric, 
  create, 
  getTrendData, 
  update, 
  delete: deleteAnalytics 
};