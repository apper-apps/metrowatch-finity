// Initialize ApperClient with Project ID and Public Key
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const errorTableName = 'camera_permission_error';

// All fields for camera permission error table
const errorFields = [
  { field: { Name: "Id" } },
  { field: { Name: "Name" } },
  { field: { Name: "Tags" } },
  { field: { Name: "Owner" } },
  { field: { Name: "CreatedOn" } },
  { field: { Name: "CreatedBy" } },
  { field: { Name: "ModifiedOn" } },
  { field: { Name: "ModifiedBy" } },
  { 
    field: { name: "camera" },
    referenceField: { field: { Name: "Name" } }
  },
  { field: { Name: "message" } },
  { field: { Name: "constraint" } },
  { field: { Name: "timestamp" } }
];

// Get system status from multiple data sources
export const getSystemStatus = async () => {
  try {
    // Get camera statistics
    const { ApperClient } = window.ApperSDK;
    const cameraClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const cameraParams = {
      aggregators: [
        {
          id: "totalCameras",
          fields: [{ field: { Name: "Id" }, Function: "Count" }]
        },
        {
          id: "onlineCameras",
          fields: [{ field: { Name: "Id" }, Function: "Count" }],
          where: [{ FieldName: "is_online", Operator: "EqualTo", Values: [true] }]
        }
      ]
    };
    
    const cameraResponse = await cameraClient.fetchRecords('camera', cameraParams);
    
    if (!cameraResponse.success) {
      console.error("Error fetching camera stats:", cameraResponse.message);
    }
    
    const aggregators = cameraResponse.aggregators || [];
    const totalCameras = aggregators.find(a => a.id === "totalCameras")?.value || 0;
    const onlineCameras = aggregators.find(a => a.id === "onlineCameras")?.value || 0;
    const uptime = totalCameras > 0 ? ((onlineCameras / totalCameras) * 100).toFixed(1) : 0;
    
    // Get today's incidents and alerts from other services
    const today = new Date().toISOString().split('T')[0];
    
    // Get today's incidents
    const incidentParams = {
      aggregators: [
        {
          id: "todayIncidents",
          fields: [{ field: { Name: "Id" }, Function: "Count" }],
          where: [{ 
            FieldName: "timestamp", 
            Operator: "RelativeMatch", 
            Values: ["Today"] 
          }]
        }
      ]
    };
    
    const incidentClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const incidentResponse = await incidentClient.fetchRecords('incident', incidentParams);
    const incidentsToday = incidentResponse.success ? 
      (incidentResponse.aggregators?.find(a => a.id === "todayIncidents")?.value || 0) : 0;
    
    // Get today's alerts
    const alertParams = {
      aggregators: [
        {
          id: "todayAlerts",
          fields: [{ field: { Name: "Id" }, Function: "Count" }],
          where: [{ 
            FieldName: "created_at", 
            Operator: "RelativeMatch", 
            Values: ["Today"] 
          }]
        }
      ]
    };
    
    const alertClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const alertResponse = await alertClient.fetchRecords('alert', alertParams);
    const alertsToday = alertResponse.success ? 
      (alertResponse.aggregators?.find(a => a.id === "todayAlerts")?.value || 0) : 0;
    
    return {
      uptime: parseFloat(uptime),
      cameraCount: totalCameras,
      alertsToday,
      incidentsToday,
      lastUpdate: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error fetching system status:", error);
    throw error;
  }
};

// Get system health metrics (simulated for now)
export const getHealthMetrics = async () => {
  try {
    // In a real implementation, this would come from system monitoring APIs
    return {
      cpu: Math.floor(Math.random() * 40) + 20, // 20-60%
      memory: Math.floor(Math.random() * 30) + 40, // 40-70%
      disk: Math.floor(Math.random() * 20) + 30, // 30-50%
      network: Math.floor(Math.random() * 50) + 10, // 10-60 Mbps
      temperature: Math.floor(Math.random() * 20) + 45, // 45-65°C
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error fetching health metrics:", error);
    throw error;
  }
};

// Get error logs from camera permission errors
export const getErrorLogs = async (limit = 10) => {
  try {
    const params = {
      fields: errorFields,
      orderBy: [
        { fieldName: "timestamp", sorttype: "DESC" }
      ],
      pagingInfo: {
        limit: limit,
        offset: 0
      }
    };
    
    const response = await apperClient.fetchRecords(errorTableName, params);
    
    if (!response.success) {
      console.error(response.message);
      // Return empty array on error rather than throwing
      return [];
    }
    
    // Transform camera permission errors to error log format
    return (response.data || []).map(error => ({
      id: error.Id,
      timestamp: error.timestamp || error.CreatedOn,
      level: 'error',
      message: error.message || 'Camera permission error',
      source: error.camera?.Name || 'Unknown Camera',
      constraint: error.constraint
    }));
  } catch (error) {
    console.error("Error fetching error logs:", error);
    return []; // Return empty array on error
  }
};

// Restart system service (simulated)
export const restartService = async (serviceName) => {
  try {
    // Simulate service restart delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real implementation, this would call actual system restart APIs
    return {
      success: true,
      message: `${serviceName} service restarted successfully`,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error restarting service:", error);
    throw error;
  }
};

export default {
  getSystemStatus,
  getHealthMetrics,
  getErrorLogs,
  restartService
};