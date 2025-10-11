import { 
  View, Text, FlatList, StyleSheet, ActivityIndicator, 
  TextInput, TouchableOpacity, Alert 
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import SummaryApi from "../../common";
import { UserContext } from "../../context/UserContext";

const Review = ({ productId }) => {
  const { token } = useContext(UserContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Fetch reviews
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(SummaryApi.getReviews(productId).url, {
        method: SummaryApi.getReviews(productId).method.toUpperCase(),
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const result = await response.json();

      if (result.success) {
        setReviews(result.data || []);
      } else {
        Alert.alert("Error", result.message || "Failed to fetch reviews.");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      Alert.alert("Error", "Failed to fetch reviews. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Add review
  const handleAddReview = async () => {
    if (!comment || rating === 0) {
      Alert.alert("Error", "Please provide a rating and a comment.");
      return;
    }

    if (!token) {
      Alert.alert("Error", "You must be logged in to submit a review.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(
        SummaryApi.addReview.url.replace(":id", productId),
        {
          method: SummaryApi.addReview.method.toUpperCase(),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            product: productId,
            rating,
            comment,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setComment("");
        setRating(0);
        setReviews(prev => [...prev, result.data]);
      } else {
        Alert.alert("Error", result.message || "Failed to add review.");
      }
    } catch (error) {
      console.error("Error adding review:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const renderItem = ({ item }) => (
    <View style={styles.reviewCard}>
      <Text style={styles.user}>{item.user?.name || "Anonymous"}</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={item.rating >= star ? "star" : "star-outline"}
            size={20}
            color={item.rating >= star ? "#FFD700" : "#ccc"}
            style={{ marginRight: 2 }}
          />
        ))}
      </View>
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
          keyExtractor={(item) => item._id || Math.random().toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <Text style={{ color: "#555", marginVertical: 10 }}>
          No reviews yet. Be the first to review!
        </Text>
      )}

      <View style={styles.addReviewContainer}>
        <Text style={styles.addReviewTitle}>Add Your Review</Text>
        <TextInput
          style={styles.input}
          placeholder="Write your review here..."
          value={comment}
          onChangeText={setComment}
          multiline
        />
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <Ionicons
                name={rating >= star ? "star" : "star-outline"}
                size={28}
                color={rating >= star ? "#FFD700" : "#ccc"}
                style={{ marginHorizontal: 2 }}
              />
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity 
          style={[styles.submitButton, submitting && { opacity: 0.7 }]} 
          onPress={handleAddReview} 
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Review</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Review;

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  reviewCard: { backgroundColor: "#f8f8f8", padding: 12, borderRadius: 8, marginBottom: 10 },
  user: { fontSize: 16, fontWeight: "600" },
  ratingContainer: { flexDirection: "row", marginVertical: 4 },
  comment: { fontSize: 14, color: "#333" },
  addReviewContainer: { marginTop: 20, borderTopWidth: 1, borderTopColor: "#eee", paddingTop: 20 },
  addReviewTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 10, minHeight: 80 },
  submitButton: { backgroundColor: "#A98C43", padding: 12, borderRadius: 8, alignItems: "center" },
  submitButtonText: { color: "#fff", fontWeight: "bold" },
});


