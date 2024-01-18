import { ref } from "vue";
import * as faceApi from "face-api.js";

// 表情对应的中文名称
const expressionTranslation = {
  neutral: "中立",
  happy: "开心",
  sad: "伤心",
  angry: "生气",
  fearful: "害怕",
  disgusted: "厌恶",
  surprised: "惊讶",
};

// 加载faceapi模型
const loadModel = async () => {
  await faceApi.nets.tinyFaceDetector.loadFromUri("/models");
  await faceApi.nets.faceLandmark68Net.loadFromUri("/models");
  await faceApi.nets.faceRecognitionNet.loadFromUri("/models");
  await faceApi.nets.faceExpressionNet.loadFromUri("/models");
  await faceApi.nets.ssdMobilenetv1.loadFromUri("/models"); // 加载SsdMobilenetv1模型
};

// 从监测数据中获取表情
const getTheExpression = (detections) => {
  return new Promise((resolve) => {
    if (detections.length > 0) {
      const bestDetection = detections.reduce((best, current) => {
        return current.detection.score > best.detection.score ? current : best;
      });

      const expressions = bestDetection.expressions;
      const maxExpression = Object.keys(expressions).reduce((a, b) =>
        expressions[a] > expressions[b] ? a : b
      );

      resolve(expressionTranslation[maxExpression]);
    } else {
      resolve("没有检测到人脸");
    }
  });
};

/**
 * 加载模型
 * @returns 模型加载状态
 */
export const useLoadModel = () => {
  const loading = ref(true);
  const error = ref(false);
  loadModel()
    .then(() => {
      loading.value = false;
    })
    .catch(() => {
      error.value = true;
    });
  return { loading, error };
};

/**
 * 分析视频中的人脸表情
 */
export const useDetectVideoFace = (video, callback) => {
  const detectFace = async () => {
    const detections = await faceApi
      .detectAllFaces(video)
      .withFaceLandmarks()
      .withFaceExpressions();

    const emotion = await getTheExpression(detections);
    callback(emotion);

    requestAnimationFrame(detectFace);
  };

  detectFace();
};

// 分析图片的表情
export const useDetectImageFace = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        faceApi
          .detectAllFaces(img, new faceApi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions()
          .then((detections) => getTheExpression(detections))
          .then((emotion) => resolve(emotion))
          .catch((error) => reject(error));
      };
      img.src = event.target.result;
    };
    try {
      reader.readAsDataURL(file);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
