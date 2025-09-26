const backendDomain = "http://192.168.1.18:5000";
// const backendDomain = "https://e-com-backend-544302972243.asia-southeast1.run.app";

const SummaryApi = {
  signUP: { url: `${backendDomain}/api/signup`, method: "post" },
  logIn: { url: `${backendDomain}/api/login`, method: "post" },
  verifyOTP: { url: `${backendDomain}/api/VerifyOTP`, method: "post" },
  getProducts: { url: `${backendDomain}/api/products`, method: "get" },
  getCategorys: { url: `${backendDomain}/api/categories`, method: "get" },
  getCart: { url: `${backendDomain}/api/cart`, method: "get" },
  addToCart: { url: `${backendDomain}/api/cart/items`, method: "post" }, // ✅ added
};



export default SummaryApi;
