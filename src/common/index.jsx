const backendDomain = "https://mbc-backend-16697290.asia-south2.run.app";

const SummaryApi = {
  signUP: { url: `${backendDomain}/api/signup`, method: "post" },
  logIn: { url: `${backendDomain}/api/login`, method: "post" },
  verifyOTP: { url: `${backendDomain}/api/VerifyOTP`, method: "post" },
  getProducts: { url: `${backendDomain}/api/products`, method: "get" },
  getCategorys: { url: `${backendDomain}/api/categories`, method: "get" },
  getCart: { url: `${backendDomain}/api/cart`, method: "get" },
  addToCart: { url: `${backendDomain}/api/cart/items`, method: "post" },
  createOrder: { url: `${backendDomain}/api/orders`, method: "post" },
  getOrders: { url: `${backendDomain}/api/orders`, method: "get" },

  // Reviews
  addReview: { url: `${backendDomain}/api/reviews/:id`, method: "post" },
  getReviews: (productId) => ({
    url: `${backendDomain}/api/reviews/${productId}`,
    method: "get",
  }),
};

export default SummaryApi;
