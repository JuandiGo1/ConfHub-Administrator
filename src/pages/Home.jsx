
import { View, Text, Image, SafeAreaView } from 'react-native';
import styles from '../styles/styles';

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <View>
          <Text style={styles.subtitle}>WELCOME BACK</Text>
          <Text style={styles.title}>Jack Doeson</Text>
        </View>
        <Image
          source={{ uri: 'https://i.pravatar.cc/100' }}
          style={styles.avatar}
        />
      </View>

      {/* Tarjetas */}
      <View style={styles.grid}>
        <View style={[styles.card, { backgroundColor: '#6EE7B7' }]}>
          <Text style={styles.cardTitle}>Active Projects</Text>
          <Text style={styles.cardValue}>23</Text>
          <Text style={styles.cardInfo}>↑ 3 More vs last 7 days</Text>
        </View>

        <View style={[styles.card, { backgroundColor: '#FCA5A5' }]}>
          <Text style={styles.cardTitle}>Overdue</Text>
          <Text style={styles.cardValue}>12</Text>
          <Text style={styles.cardInfo}>↓ 1 Less vs last 7 days</Text>
        </View>

        <View style={[styles.card, { backgroundColor: '#FDE68A' }]}>
          <Text style={styles.cardTitle}>Pending</Text>
          <Text style={styles.cardValue}>35</Text>
          <Text style={styles.cardInfo}>↑ 1 New vs last 7 days</Text>
        </View>

        <View style={[styles.card, { backgroundColor: '#BFDBFE' }]}>
          <Text style={styles.cardTitle}>Meetings</Text>
          <Text style={styles.cardValue}>None</Text>
          <Text style={styles.cardInfo}>No new Meetings</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
