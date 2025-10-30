import axios from 'axios';
import SummaryApi from '../common';

export const fetchUserProfile = async (token, setUser) => {
  if (!token) return;

  try {
    console.log("🔍 Fetching from:", SummaryApi.getUserProfile.url);

    const response = await axios.get(SummaryApi.getUserProfile.url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.success) {
      setUser(response.data.data);
    } else {
      console.warn("⚠️ API did not return success:", response.data);
    }
  } catch (error) {
    console.error("❌ Axios Error:", error.response?.status, error.response?.data || error.message);
  }
};
