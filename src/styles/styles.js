import { StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
   header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  subtitle: {
    color: '#999',
    fontSize: 14
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  card: {
    width: '48%',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 'bold'
  },
  cardInfo: {
    fontSize: 12,
    color: '#444'
  }
});

export default styles;