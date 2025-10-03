import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import SummaryApi from "../../common";
import { UserContext } from "../../context/UserContext";

const Review = ({ productId }) => {
  const { token } = useContext(UserContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const response = await fetch(SummaryApi.getReviews(productId).url, {
        method: SummaryApi.getReviews(productId).method.toUpperCase(),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setReviews(result.data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const renderItem = ({ item }) => (
    <View style={styles.reviewCard}>
      <Text style={styles.user}>{item.user?.name || "Anonymous"}</Text>
      <Text style={styles.rating}>⭐ {item.rating}/5</Text>
      <Text style={styles.comment}>{item.comment}</Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#A98C43" style={{ marginTop: 20 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Reviews</Text>
      {reviews.length > 0 ? (
        <FlatList
          data={reviews}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <Text style={{ color: "#555" }}>No reviews yet. Be the first to review!</Text>
      )}
    </View>
  );
};

export default Review;

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  reviewCard: { backgroundColor: "#f8f8f8", padding: 12, borderRadius: 8, marginBottom: 10 },
  user: { fontSize: 16, fontWeight: "600" },
  rating: { fontSize: 14, color: "#FFD700", marginVertical: 4 },
  comment: { fontSize: 14, color: "#333" },
});
