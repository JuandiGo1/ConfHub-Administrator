import { StatusBar } from 'expo-status-bar';

import { Text, View } from 'react-native';
import styles from '../styles/styles';

export default function EventLine() {
  return (
    <View style={styles.container}>
      <Text>EVENT PAGE</Text>
      <StatusBar style="auto" />
    </View>
  );
}