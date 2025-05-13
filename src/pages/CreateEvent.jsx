import { StatusBar } from 'expo-status-bar';

import { Text, View } from 'react-native';
import styles from '../styles/styles';

export default function CreateEvent() {
  return (
    <View style={styles.container}>
      <Text>Create a New Event</Text>
      <StatusBar style="auto" />
    </View>
  );
}