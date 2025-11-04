const backendDomain = "https://mbc-backend-16697290.asia-south2.run.app";

const SummaryApi = {
  // Authentication
  signUP: { url: `${backendDomain}/api/signup`, method: "post" },
  logIn: { url: `${backendDomain}/api/login`, method: "post" },
  verifyOTP: { url: `${backendDomain}/api/VerifyOTP`, method: "post" },
  getUserProfile: { url: `${backendDomain}/api/user/profile`, method: "get" },
  updateUserProfile: { url: `${backendDomain}/api/user/profile`, method: "put" },
  // 🏠 Address Management
  addAddress: {
    url: `${backendDomain}/api/user/profile/address`,
    method: "post",
  },
  updateAddress: (id) => ({
    url: `${backendDomain}/api/user/profile/address/${id}`,
    method: "put",
  }),
  deleteAddress: (id) => ({
    url: `${backendDomain}/api/user/profile/address/${id}`,
    method: "delete",
  }),
 
  // Products & Categories
  getProducts: { url: `${backendDomain}/api/products`, method: "get" },
  getCategorys: { url: `${backendDomain}/api/categories`, method: "get" },                                                                                                                                                                                                                                                                                                                                                                                                                     

  // Cart
  getCart: { url: `${backendDomain}/api/cart`, method: "get" },              
  clearCart: { url: `${backendDomain}/api/cart`, method: "delete" },         
  addToCart: { url: `${backendDomain}/api/cart/items`, method: "post" },     
  updateCartItem: (itemId) => ({ url: `${backendDomain}/api/cart/items/${itemId}`, method: "put" }),
  removeCartItem: (itemId) => ({ url: `${backendDomain}/api/cart/items/${itemId}`, method: "delete" }),

  // Orders
  createOrder: { url: `${backendDomain}/api/orders`, method: "post" },
  getOrders: { url: `${backendDomain}/api/orders`, method: "get" },
  getOrderDetails: { url: `${backendDomain}/api/orders`, method: "get" },

  // Reviews
  addReview: { url: `${backendDomain}/api/reviews/:id`, method: "post" },
  getReviews: (productId) => ({ url: `${backendDomain}/api/reviews/${productId}`, method: "get" }),

  // Bookings (User)
  createBooking: { url: `${backendDomain}/api/user/bookings/create`, method: "post" },
  getBookings: (userId) => ({ url: `${backendDomain}/api/user/bookings/my-bookings/${userId}`, method: "get" }),
  cancelBooking: (id) => ({ url: `${backendDomain}/api/user/bookings/cancel/${id}`, method: "put" }),

  // Wishlist
  addToWishlist: { url: `${backendDomain}/api/wishlist/add`, method: "post" },      // Add product to wishlist
  removeFromWishlist: { url: `${backendDomain}/api/wishlist/remove`, method: "delete" }, // Remove product from wishlist
  getWishlist: { url: `${backendDomain}/api/wishlist`, method: "get" },            // Get all wishlist items
  // Contact Us
createContact: { url: `${backendDomain}/api/contact`, method: "post" },

};

export default SummaryApi;
