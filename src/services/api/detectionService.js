import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import React from "react";
// Object detection service using TensorFlow.js with camera integration

let model = null;

// Initialize ApperClient for camera data integration
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

// Initialize the model
export const initializeModel = async () => {
  try {
    if (!model) {
      model = await cocoSsd.load();
      console.log('COCO-SSD model loaded successfully');
    }
    return model;
  } catch (error) {
    console.error('Error loading COCO-SSD model:', error);
    throw error;
  }
};

// Detect objects in an image and update camera data
export const detectObjects = async (imageElement, cameraId = null) => {
  try {
    if (!model) {
      await initializeModel();
    }
    
    const predictions = await model.detect(imageElement);
    
    // Filter for person detections (security relevant)
    const personDetections = predictions.filter(prediction => 
      prediction.class === 'person' && prediction.score > 0.5
    );
    
    const detectionResult = {
      allDetections: predictions,
      personCount: personDetections.length,
      personDetections,
      timestamp: new Date().toISOString(),
      confidence: personDetections.length > 0 ? 
        Math.max(...personDetections.map(p => p.score)) : 0
    };
    
    // Update camera record with detection data if cameraId is provided
    if (cameraId) {
      try {
        await updateCameraWithDetection(cameraId, detectionResult);
      } catch (error) {
        console.error(`Error updating camera ${cameraId} with detection data:`, error);
        // Don't throw - detection should still work even if camera update fails
      }
    }
    
    return detectionResult;
  } catch (error) {
    console.error('Error detecting objects:', error);
    throw error;
  }
};

// Update camera record with detection information
const updateCameraWithDetection = async (cameraId, detectionResult) => {
  try {
    const updateData = {
      object_detected: detectionResult.personCount > 0 ? 
        `${detectionResult.personCount} person(s)` : 'none',
      confidence_level: Math.round(detectionResult.confidence * 100),
      last_active: detectionResult.timestamp
    };
    
    const params = {
      records: [{
        Id: parseInt(cameraId),
        ...updateData
      }]
    };
    
    const response = await apperClient.updateRecord('camera', params);
    
    if (!response.success) {
      console.error('Failed to update camera with detection data:', response.message);
    }
    
    return response.success;
  } catch (error) {
    console.error('Error updating camera with detection data:', error);
    throw error;
  }
};

// Analyze crowd density based on person detections
export const analyzeCrowdDensity = (detections, imageWidth, imageHeight) => {
  const personDetections = detections.personDetections || [];
  const imageArea = imageWidth * imageHeight;
  
  if (personDetections.length === 0) {
    return { density: 'low', level: 0, description: 'No people detected' };
  }
  
  const personArea = personDetections.reduce((total, detection) => {
    const [x, y, width, height] = detection.bbox;
    return total + (width * height);
  }, 0);
  
  const densityRatio = personArea / imageArea;
  const personCount = personDetections.length;
  
  let density, level, description;
  
  if (personCount <= 2 && densityRatio < 0.1) {
    density = 'low';
    level = 1;
    description = `${personCount} person(s) detected - Low density`;
  } else if (personCount <= 5 && densityRatio < 0.2) {
    density = 'medium';
    level = 2;
    description = `${personCount} people detected - Medium density`;
  } else if (personCount <= 10 && densityRatio < 0.4) {
    density = 'high';
    level = 3;
    description = `${personCount} people detected - High density`;
  } else {
    density = 'critical';
    level = 4;
    description = `${personCount} people detected - Critical density`;
  }
  
  return {
    density,
    level,
    description,
    personCount,
    densityRatio: parseFloat(densityRatio.toFixed(3))
  };
};

// Get cameras with recent detection data
export const getCamerasWithDetections = async () => {
  try {
    const params = {
      fields: [
        { field: { Name: "Id" } },
        { field: { Name: "Name" } },
        { field: { Name: "location" } },
        { field: { Name: "object_detected" } },
        { field: { Name: "confidence_level" } },
        { field: { Name: "last_active" } },
        { field: { Name: "is_online" } }
      ],
      where: [
        {
          FieldName: "object_detected",
          Operator: "HasValue",
          Values: []
        }
      ],
      orderBy: [
        { fieldName: "last_active", sorttype: "DESC" }
      ]
    };
    
    const response = await apperClient.fetchRecords('camera', params);
    
    if (!response.success) {
      console.error('Error fetching cameras with detections:', response.message);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    console.error('Error fetching cameras with detections:', error);
    return [];
  }
};

export default {
  initializeModel,
  detectObjects,
  analyzeCrowdDensity,
  getCamerasWithDetections
};