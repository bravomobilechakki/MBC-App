const backendDomain = "https://mbc-backend-16697290.asia-south2.run.app";

const SummaryApi = {
  // Authentication
  signUP: { url: `${backendDomain}/api/signup`, method: "post" },
  logIn: { url: `${backendDomain}/api/login`, method: "post" },
  verifyOTP: { url: `${backendDomain}/api/VerifyOTP`, method: "post" },

  // Products & Categories
  getProducts: { url: `${backendDomain}/api/products`, method: "get" },
  getCategorys: { url: `${backendDomain}/api/categories`, method: "get" },

  // Cart
  getCart: { url: `${backendDomain}/api/cart`, method: "get" },
  addToCart: { url: `${backendDomain}/api/cart/items`, method: "post" },

  // Orders
  createOrder: { url: `${backendDomain}/api/orders`, method: "post" },
  getOrders: { url: `${backendDomain}/api/orders`, method: "get" },

  // Reviews
  addReview: { url: `${backendDomain}/api/reviews/:id`, method: "post" },
  getReviews: (productId) => ({
    url: `${backendDomain}/api/reviews/${productId}`,
    method: "get",
  }),

  // Bookings (User)
  createBooking: { url: `${backendDomain}/api/user/bookings/create`, method: "post" },
  getBookings: (userId) => ({
    url: `${backendDomain}/api/user/bookings/my-bookings/${userId}`,
    method: "get",
  }),

  // Cancel Booking
  cancelBooking: (id) => ({
    url: `${backendDomain}/api/user/bookings/cancel/${id}`,
    method: "put"
  }),
};

export default SummaryApi;
