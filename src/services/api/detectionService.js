import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

class DetectionService {
  constructor() {
    this.model = null;
    this.isLoading = false;
  }

  async loadModel() {
    if (this.model || this.isLoading) {
      return this.model;
    }

    try {
      this.isLoading = true;
      console.log('Loading COCO-SSD model...');
      this.model = await cocoSsd.load();
      console.log('Model loaded successfully');
      return this.model;
    } catch (error) {
      console.error('Error loading detection model:', error);
      throw new Error('Failed to load detection model');
    } finally {
      this.isLoading = false;
    }
  }

  async detectObjects(videoElement, confidenceThreshold = 0.5) {
    if (!this.model) {
      await this.loadModel();
    }

    try {
      const predictions = await this.model.detect(videoElement);
      
      // Filter predictions by confidence threshold
      const filteredPredictions = predictions.filter(
        prediction => prediction.score >= confidenceThreshold
      );

      return filteredPredictions.map(prediction => ({
        class: prediction.class,
        confidence: Math.round(prediction.score * 100),
        bbox: {
          x: Math.round(prediction.bbox[0]),
          y: Math.round(prediction.bbox[1]),
          width: Math.round(prediction.bbox[2]),
          height: Math.round(prediction.bbox[3])
        }
      }));
    } catch (error) {
      console.error('Error during object detection:', error);
      return [];
    }
  }

  isModelLoaded() {
    return this.model !== null;
  }

  getModelStatus() {
    if (this.isLoading) return 'loading';
    if (this.model) return 'loaded';
    return 'not-loaded';
  }
}

export const detectionService = new DetectionService();