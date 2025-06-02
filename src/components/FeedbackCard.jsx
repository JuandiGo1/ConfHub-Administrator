// src/components/FeedbackCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import formatDate from '../utils/dateFormatter';
import { Ionicons } from '@expo/vector-icons'

const FeedbackCard = ({ feedback }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.comment}>{feedback.comment}</Text>
      <View style={styles.metaContainer}>
        <Text style={styles.rating}>⭐ {feedback.score}/5</Text>
                <View style={styles.reactionContainer}>
          <View style={styles.reactionItem}>
            <Ionicons name="thumbs-up" size={16} color="#4CAF50" />
            <Text style={styles.reactionCount}>{feedback.likes || 0}</Text>
          </View>
          
          <View style={styles.reactionItem}>
            <Ionicons name="thumbs-down" size={16} color="#F44336" />
            <Text style={styles.reactionCount}>{feedback.dislikes || 0}</Text>
          </View>
        </View>
        <Text style={styles.date}>
          {formatDate(new Date(feedback.dateTime))}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  comment: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rating: {
    fontSize: 12,
    color: '#FF9500',
    fontWeight: 'bold',
  },
    reactionContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  reactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  reactionCount: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
});

export default FeedbackCard;