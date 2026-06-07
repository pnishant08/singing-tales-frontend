import axios from "axios";
export const BASE_URL = "http://localhost:3000";

export const getImageUrl = (image) => {
  if (Array.isArray(image) && image.length > 0) {
    return image[0].startsWith("/uploads")
      ? `${BASE_URL}${image[0]}`
      : image[0];
  }

  if (typeof image === "string" && image.startsWith("/uploads")) {
    return `${BASE_URL}${image}`;
  }

  if (typeof image === "string" && image) {
    return image;
  }

  return "/images/card-preview.svg";
};

const api=axios.create({
    baseURL:  `${BASE_URL}/api`,
    withCredentials:true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
