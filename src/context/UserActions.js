import axios from 'axios';
import SummaryApi from '../common';

export const fetchUserProfile = async (token, setUser) => {
  if (!token) {
    return;
  }
  try {
    const response = await axios.get(SummaryApi.getUserProfile.url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.data.success) {
      setUser(response.data.data);
    }
  } catch (err) {
    console.error(err);
  }
};
