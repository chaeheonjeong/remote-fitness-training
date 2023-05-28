export const emailRegEx =
  /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/i;

export const scrollToTop = () => {
  return window.scrollTo({ top: 0, behavior: "smooth" });
};

//export const BASE_API_URI = "http://192.168.10.104:6060";
//export const BASE_API_URI_CAM = "http://192.168.10.104:5050";

export const BASE_API_URI = "http://localhost:8080";
export const BASE_API_URI_CAM = "http://localhost:5050";
