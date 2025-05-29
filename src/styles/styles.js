import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // semitransparente
    justifyContent: "center", // <-- Aquí cambias la posición: 'flex-start', 'center', 'flex-end'
    alignItems: "center",
  },
  modalContainer: {
    width: "90%", // Ocupa el 90% del ancho de pantalla
    maxWidth: 400, // No más ancho que 400
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 25, // Más espacio lateral
    alignSelf: "center",
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
    backgroundColor: "red",
    marginBottom: 30,
    marginRight: 20,
  },
  fab2: {
    backgroundColor: "purple",
    marginBottom: 30,
  },
  fab3: {
    position: "absolute",
    bottom: 30, // un poco de espacio respecto al borde inferior
    left: "50%",
    transform: [{ translateX: -28 }], // si el botón tiene 56px de ancho
    backgroundColor: "white",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // sombra en Android
    shadowColor: "#000", // sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
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
