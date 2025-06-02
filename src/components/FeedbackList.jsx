import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { getFeedbacksForEvent } from '../services/feedbackService';

const FeedbackList = ({ eventId }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        const data = await getFeedbacksForEvent(eventId);
        setFeedbacks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadFeedbacks();
  }, [eventId]);

  const renderFeedbackItem = ({ item }) => (
    <View style={styles.feedbackItem}>
      <Text style={styles.feedbackText}>{item.comment}</Text>
      <Text style={styles.feedbackMeta}>
        Rating: {item.rating}/5 • {new Date(item.createdAt).toLocaleDateString()}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No feedbacks yet</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={feedbacks}
      renderItem={renderFeedbackItem}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  feedbackItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 1,
  },
  feedbackText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  feedbackMeta: {
    fontSize: 12,
    color: '#6B7280',
  },
  listContainer: {
    paddingBottom: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#B91C1C',
  },
  emptyText: {
    color: '#6B7280',
  },
});

export default FeedbackList;