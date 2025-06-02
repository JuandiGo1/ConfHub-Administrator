import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";

export default function DeleteEventPop({ visible, onConfirm, onCancel }) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={styles.title}>¿Eliminar evento?</Text>
          <Text style={styles.message}>
            ¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBtn} onPress={onConfirm}>
              <Text style={styles.deleteText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: "80%",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
    color: "#dc2626",
  },
  message: {
    fontSize: 15,
    color: "#444",
    marginBottom: 20,
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    gap: 16,
  },
  cancelBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#e5e7eb",
    marginRight: 8,
  },
  cancelText: {
    color: "#374151",
    fontWeight: "bold",
  },
  deleteBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#dc2626",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },
});