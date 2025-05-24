import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
   modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // semitransparente
    justifyContent: 'center', // <-- Aquí cambias la posición: 'flex-start', 'center', 'flex-end'
    alignItems: 'center',
  },
  modalContainer: {
    marginTop: 100, // puedes ajustar el desplazamiento desde arriba
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  subtitle: {
    color: "#999",
    fontSize: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  eventsGrid: {
    flexDirection: "column",
    width: "100%",
  },
  card: {
    width: "48%",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  cardValue: {
    fontSize: 28,
    fontWeight: "bold",
  },
  cardInfo: {
    fontSize: 12,
    color: "#444",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 170,
    bottom: 0,
    backgroundColor:"red"
  },
  fab2: {
    position: "absolute",
    margin: 16,
    right: 40,
    bottom: 0,
  },     
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 15,
    color: "#333",
    backgroundColor: "#fafafa",

  },
});

export default styles;
