const backendDomain = "https://023288ebd4f2.ngrok-free.app";
// const backendDomain = "https://e-com-backend-544302972243.asia-southeast1.run.app";

const SummaryApi = {
  signUP: {
    url: `${backendDomain}/api/signup`,
    method: "post",
  },
  logIn: {
    url: `${backendDomain}/api/login`,
    method: "post",
  },
  verifyOTP: {
    url: `${backendDomain}/api/VerifyOTP`,
    method: "post",
  },
};

export default SummaryApi;
