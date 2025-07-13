// Initialize ApperClient with Project ID and Public Key
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'camera';

// Updateable fields for create/update operations (excluding System fields)
const updateableFields = [
  'Name', 'Tags', 'Owner', 'location', 'status', 'feed_url', 'last_active',
  'is_online', 'alert_level', 'device_id', 'real_camera', 'capabilities',
  'error', 'preview_status', 'preview_type', 'object_detected', 'confidence_level'
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
  { field: { Name: "location" } },
  { field: { Name: "status" } },
  { field: { Name: "feed_url" } },
  { field: { Name: "last_active" } },
  { field: { Name: "is_online" } },
  { field: { Name: "alert_level" } },
  { field: { Name: "device_id" } },
  { field: { Name: "real_camera" } },
  { field: { Name: "capabilities" } },
  { field: { Name: "error" } },
  { field: { Name: "preview_status" } },
  { field: { Name: "preview_type" } },
  { field: { Name: "object_detected" } },
  { field: { Name: "confidence_level" } }
];

// Helper function to filter data for create/update
const filterUpdateableData = (data) => {
  const filtered = {};
  updateableFields.forEach(field => {
    if (data.hasOwnProperty(field)) {
      // Format data based on field type
      if (field === 'last_active' && data[field]) {
        // DateTime format: ISO 8601
        filtered[field] = new Date(data[field]).toISOString();
      } else if (field === 'is_online' || field === 'real_camera') {
        // Boolean format
        filtered[field] = Boolean(data[field]);
      } else if (field === 'alert_level' || field === 'confidence_level') {
        // Number format
        filtered[field] = Number(data[field]);
      } else {
        filtered[field] = data[field];
      }
    }
  });
  return filtered;
};

// Get all cameras
export const getAll = async () => {
  try {
    const params = {
      fields: allFields,
      orderBy: [
        { fieldName: "Name", sorttype: "ASC" }
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
    console.error("Error fetching cameras:", error);
    throw error;
  }
};

// Get camera by ID
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
      throw new Error('Camera not found');
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching camera with ID ${id}:`, error);
    throw error;
  }
};

// Create new camera
export const create = async (cameraData) => {
  try {
    const filteredData = filterUpdateableData(cameraData);
    
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
        console.error(`Failed to create camera:${JSON.stringify(failedRecords)}`);
        const errorMessage = failedRecords[0].message || 'Failed to create camera';
        throw new Error(errorMessage);
      }
      
      const successfulRecord = response.results.find(result => result.success);
      return successfulRecord?.data;
    }
    
    throw new Error('No response data received');
  } catch (error) {
    console.error("Error creating camera:", error);
    throw error;
  }
};

// Update camera
export const update = async (id, cameraData) => {
  try {
    const filteredData = filterUpdateableData(cameraData);
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
        console.error(`Failed to update camera:${JSON.stringify(failedRecords)}`);
        const errorMessage = failedRecords[0].message || 'Failed to update camera';
        throw new Error(errorMessage);
      }
      
      const successfulRecord = response.results.find(result => result.success);
      return successfulRecord?.data;
    }
    
    throw new Error('No response data received');
  } catch (error) {
    console.error("Error updating camera:", error);
    throw error;
  }
};

// Delete camera
export const deleteCamera = async (id) => {
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
        console.error(`Failed to delete camera:${JSON.stringify(failedRecords)}`);
        const errorMessage = failedRecords[0].message || 'Failed to delete camera';
        throw new Error(errorMessage);
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting camera:", error);
    throw error;
  }
};

// Get cameras by status
export const getByStatus = async (status) => {
  try {
    const params = {
      fields: allFields,
      where: [
        {
          FieldName: "status",
          Operator: "EqualTo",
          Values: [status]
        }
      ],
      orderBy: [
        { fieldName: "Name", sorttype: "ASC" }
      ]
    };
    
    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    console.error("Error fetching cameras by status:", error);
    throw error;
  }
};

// Get online cameras
export const getOnline = async () => {
  try {
    const params = {
      fields: allFields,
      where: [
        {
          FieldName: "is_online",
          Operator: "EqualTo",
          Values: [true]
        }
      ],
      orderBy: [
        { fieldName: "Name", sorttype: "ASC" }
      ]
    };
    
    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    console.error("Error fetching online cameras:", error);
    throw error;
  }
};

// Get offline cameras
export const getOffline = async () => {
  try {
    const params = {
      fields: allFields,
      where: [
        {
          FieldName: "is_online",
          Operator: "EqualTo",
          Values: [false]
        }
      ],
      orderBy: [
        { fieldName: "Name", sorttype: "ASC" }
      ]
    };
    
    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    console.error("Error fetching offline cameras:", error);
    throw error;
  }
};

// Search cameras
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
                  fieldName: "location",
                  operator: "Contains",
                  values: [query]
                },
                {
                  fieldName: "device_id",
                  operator: "Contains",
                  values: [query]
                }
              ]
            }
          ]
        }
      ],
      orderBy: [
        { fieldName: "Name", sorttype: "ASC" }
      ]
    };
    
    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    console.error("Error searching cameras:", error);
    throw error;
  }
};

// Get camera statistics
export const getStats = async () => {
  try {
    const params = {
      aggregators: [
        {
          id: "totalCameras",
          fields: [
            {
              field: { Name: "Id" },
              Function: "Count"
            }
          ]
        },
        {
          id: "onlineCameras",
          fields: [
            {
              field: { Name: "Id" },
              Function: "Count"
            }
          ],
          where: [
            {
              FieldName: "is_online",
              Operator: "EqualTo",
              Values: [true]
            }
          ]
        },
        {
          id: "alertCameras",
          fields: [
            {
              field: { Name: "Id" },
              Function: "Count"
            }
          ],
          where: [
            {
              FieldName: "status",
              Operator: "EqualTo",
              Values: ["alert"]
            }
          ]
        },
        {
          id: "errorCameras",
          fields: [
            {
              field: { Name: "Id" },
              Function: "Count"
            }
          ],
          where: [
            {
              FieldName: "status",
              Operator: "EqualTo",
              Values: ["error"]
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
    const total = aggregators.find(a => a.id === "totalCameras")?.value || 0;
    const online = aggregators.find(a => a.id === "onlineCameras")?.value || 0;
    const alert = aggregators.find(a => a.id === "alertCameras")?.value || 0;
    const error = aggregators.find(a => a.id === "errorCameras")?.value || 0;
    
    return {
      total,
      online,
      offline: total - online,
      alert,
      error,
      uptime: total > 0 ? ((online / total) * 100).toFixed(1) : 0
    };
  } catch (error) {
    console.error("Error fetching camera statistics:", error);
    throw error;
  }
};

// Update camera status
export const updateStatus = async (id, status, isOnline = true) => {
  try {
    const updateData = {
      status,
      is_online: isOnline,
      last_active: new Date().toISOString()
    };
    
    return await update(id, updateData);
  } catch (error) {
    console.error("Error updating camera status:", error);
    throw error;
  }
};
// Get real cameras from device
export const getRealCameras = async () => {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      throw new Error('Media devices not supported');
    }

    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    
    if (videoDevices.length === 0) {
      throw new Error('No video devices found');
    }

    const cameras = await Promise.all(
      videoDevices.map(async (device, index) => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: device.deviceId } }
          });
          
          stream.getTracks().forEach(track => track.stop());
          
          return {
            id: device.deviceId,
            name: device.label || `Camera ${index + 1}`,
            location: `Device ${index + 1}`,
            status: "online",
            isOnline: true,
            alertLevel: 0,
            deviceId: device.deviceId,
            realCamera: true,
            capabilities: ['video']
          };
        } catch (error) {
          console.warn(`Failed to initialize camera ${device.label || `Device ${index + 1}`}:`, {
            name: error.name,
            message: error.message,
            deviceId: device.deviceId
          });
          
          return {
            id: device.deviceId || `camera-${index}`,
            name: device.label || `Camera ${index + 1}`,
            location: `Device ${index + 1}`,
            status: "error",
            isOnline: false,
            alertLevel: 0,
            deviceId: device.deviceId,
            realCamera: true,
            error: error.message
          };
        }
      })
    );

    const validCameras = cameras.filter(camera => camera.status === "online");
    const failedCameras = cameras.filter(camera => camera.status === "error");
    
    if (failedCameras.length > 0) {
      console.warn(`${failedCameras.length} camera(s) failed to initialize:`, failedCameras);
    }
    
    if (validCameras.length === 0) {
      if (failedCameras.length > 0) {
        throw new Error(`All ${failedCameras.length} detected cameras failed to initialize. Check camera permissions and availability.`);
      } else {
        throw new Error('No cameras could be initialized');
      }
    }

    return validCameras;
  } catch (error) {
    console.error('Failed to get real cameras:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

// Get camera stream
export const getCameraStream = async (deviceId) => {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('getUserMedia not supported');
    }

    const constraints = {
      video: {
        deviceId: deviceId ? { exact: deviceId } : undefined,
        width: { ideal: 1280, min: 320 },
        height: { ideal: 720, min: 240 },
        frameRate: { ideal: 30, min: 15 }
      }
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    
    if (!stream || stream.getTracks().length === 0) {
      throw new Error('Failed to get active video stream');
    }

    return stream;
  } catch (error) {
    console.error('Failed to get camera stream:', {
      name: error.name,
      message: error.message,
      deviceId
    });
    throw error;
  }
};