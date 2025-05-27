import { useEffect, useState } from "react";
import {
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
  Modal,
  TextInput,
  Pressable,
} from "react-native";
import { getTracks, updateTrack } from "../../services/trackService";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { FAB } from "react-native-paper";
import styles from "../../styles/styles";
import { makeTrack, deleteTrack } from "../../services/trackService";
import Toast from "react-native-toast-message";
import TrackListing from "../../components/TrackListing";
import { getData } from "../../storage/localStorage";

export default function TrackListingPage() {
  const [tracks, setTracks] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [user, setUser] = useState(null);
  // spinner
  const [loading, setLoading] = useState(true);

  // modal para crear, editar tracks y eliminar tracks
  const [modalCreateVisible, setModalCreateVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);

  // datos de un track
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // validar inputs
  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  const handleRegisterTrack = async () => {
    if (name.length > 30) {
      setNameError("El nombre debe tener menos de 30 caracteres");
    } else {
      setNameError("");
    }

    if (description.length > 300) {
      setDescriptionError("La descripción debe tener menos de 300 caracteres");
    } else {
      setDescriptionError("");
    }
    if (!name) {
      setNameError("El Nombre es necesario");
    }

    if (!description) {
      setDescriptionError("Descripción necesaria");
    }

    if (nameError || descriptionError) {
      return;
    }
    const isCreated = await makeTrack({ name, description });
    if (isCreated) {
      setRefresh((prev) => !prev); // cambia el estado de refresh
      setLoading(true); // muestra el spinner
      setModalCreateVisible(false);
      setName("");
      setDescription("");
      setNameError("");
      setDescriptionError("");

      //show success message
      Toast.show({
        type: "success",
        text1: "Éxito",
        text2: "Datos actualizados",
        position: "bottom",
        visibilityTime: 2000,
      });
    } else {
      //show error message
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Revisa los datos ingresados",
        position: "bottom",
        visibilityTime: 2000,
      });
    }
  };
  const handleEditTrack = async () => {
    if (name.length > 30) {
      setNameError("el Nombre debe tener menos de 30 caracteres");
    } else {
      setNameError("");
    }

    if (description.length > 300) {
      setDescriptionError("La descripción debe tener menos de 300 caracteres");
    } else {
      setDescriptionError("");
    }
    if (!name) {
      setNameError("El Nombre es necesario");
    }

    if (!description) {
      setDescriptionError("Descripción necesaria");
    }

    if (nameError || descriptionError) {
      return;
    }
    const isUpdated = await updateTrack(name, { name, description });
    if (isUpdated) {
      setRefresh((prev) => !prev); // cambia el estado de refresh
      setLoading(true); // muestra el spinner
      setModalEditVisible(false);
      setName("");
      setDescription("");
      setNameError("");
      setDescriptionError("");

      //show success message
      Toast.show({
        type: "success",
        text1: "Éxito",
        text2: "Datos actualizados",
        position: "bottom",
        visibilityTime: 2000,
      });
    } else {
      //show error message
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Revisa los datos ingresados",
        position: "bottom",
        visibilityTime: 2000,
      });
    }
  };
  const handleDeleteTrack = async () => {
    const isDeleted = await deleteTrack(name);
    if (isDeleted) {
      setRefresh((prev) => !prev); // cambia el estado de refresh
      setLoading(true); // muestra el spinner
      setModalDeleteVisible(false);
      setName("");
      setDescription("");

      //show success message
      Toast.show({
        type: "success",
        text1: "Éxito",
        text2: "Datos actualizados",
        position: "bottom",
        visibilityTime: 2000,
      });
    } else {
      //show error message
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Revisa los datos ingresados",
        position: "bottom",
        visibilityTime: 2000,
      });
    }
  };

  const fetchData = async () => {
    try {
      const stringuser = await getData("user");
      setUser(JSON.parse(stringuser));
      const tracksData = await getTracks();
      setTracks(tracksData);
    } catch (err) {
      console.error("Error loading tracks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [refresh]);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }

  return (
    <SafeAreaProvider>
      <TrackListing
        tracks={tracks}
        onEdit={(name, description) => {
          setModalEditVisible(true);
          setDescription(description);
          setName(name);
        }}
        onDelete={(name, description) => {
          setModalDeleteVisible(true);
          setDescription(description);
          setName(name);
        }}
        setRefresh={setRefresh}
      />
      {user.rol && (
        <FAB
          icon="plus"
          onPress={() => setModalCreateVisible(true)}
          style={styles.fab3}
        />
      )}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalCreateVisible}
        onRequestClose={() => {
          setModalCreateVisible(false);
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Crear un track</Text>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text>Nombre:</Text>
                <TextInput
                  placeholder="Ingresa el nombre del track"
                  value={name}
                  onChangeText={setName}
                  style={{
                    borderWidth: 1,
                    padding: 10,
                    marginLeft: 37,
                    marginVertical: 10,
                    width: "100%",
                    borderColor: nameError ? "red" : "#ccc",
                  }}
                />
              </View>
              {nameError ? (
                <Text
                  style={{
                    display: "flex",
                    fontSize: 10,
                    justifyContent: "center",
                    marginLeft: "72px",
                    color: "red",
                  }}
                >
                  {nameError}
                </Text>
              ) : null}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text>Descripción:</Text>
                <TextInput
                  placeholder="Ingresa la descripción"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  style={{
                    borderWidth: 1,
                    padding: 15,
                    marginLeft: 10,
                    marginVertical: 10,
                    width: "100%",
                    borderColor: descriptionError ? "red" : "#ccc",
                  }}
                />
              </View>
              {descriptionError ? (
                <Text
                  style={{
                    display: "flex",
                    fontSize: 10,
                    justifyContent: "center",
                    marginLeft: "72px",
                    color: "red",
                  }}
                >
                  {descriptionError}
                </Text>
              ) : null}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  marginTop: 20,
                }}
              >
                <Pressable
                  style={[
                    styles.button,
                    styles.buttonClose,
                    { backgroundColor: "purple", marginRight: 10 },
                  ]}
                  onPress={handleRegisterTrack}
                >
                  <Text style={styles.textStyle}>Crear</Text>
                </Pressable>

                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalCreateVisible(false)}
                >
                  <Text style={styles.textStyle}>Salir</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalEditVisible}
        onRequestClose={() => {
          setModalEditVisible(false);
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Editar un track</Text>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text>Nombre:</Text>
                <TextInput
                  placeholder="Ingresa el nombre del track"
                  value={name}
                  onChangeText={setName}
                  style={{
                    borderWidth: 1,
                    padding: 10,
                    marginLeft: 37,
                    marginVertical: 10,
                    width: "100%",
                    borderColor: nameError ? "red" : "#ccc",
                  }}
                />
              </View>
              {nameError ? (
                <Text
                  style={{
                    display: "flex",
                    fontSize: 10,
                    justifyContent: "center",
                    marginLeft: "72px",
                    color: "red",
                  }}
                >
                  {nameError}
                </Text>
              ) : null}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text>Descripción:</Text>
                <TextInput
                  placeholder="Ingresa la descripción"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  style={{
                    borderWidth: 1,
                    padding: 15,
                    marginLeft: 10,
                    marginVertical: 10,
                    width: "100%",
                    borderColor: descriptionError ? "red" : "#ccc",
                  }}
                />
              </View>
              {descriptionError ? (
                <Text
                  style={{
                    display: "flex",
                    fontSize: 10,
                    justifyContent: "center",
                    marginLeft: "72px",
                    color: "red",
                  }}
                >
                  {descriptionError}
                </Text>
              ) : null}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  marginTop: 20,
                }}
              >
                <Pressable
                  style={[
                    styles.button,
                    styles.buttonClose,
                    { backgroundColor: "purple", marginRight: 10 },
                  ]}
                  onPress={handleEditTrack}
                >
                  <Text style={styles.textStyle}>Editar</Text>
                </Pressable>

                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalEditVisible(false)}
                >
                  <Text style={styles.textStyle}>Salir</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalDeleteVisible}
        onRequestClose={() => {
          setModalDeleteVisible(false);
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Eliminar un track</Text>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text> Estas seguro que deseas Eliminar el track {name}</Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  marginTop: 20,
                }}
              >
                <Pressable
                  style={[
                    styles.button,
                    styles.buttonClose,
                    { backgroundColor: "red", marginRight: 10 },
                  ]}
                  onPress={handleDeleteTrack}
                >
                  <Text style={styles.textStyle}>Eliminar</Text>
                </Pressable>

                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalDeleteVisible(false)}
                >
                  <Text style={styles.textStyle}>Salir</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaProvider>
  );
}

const styles2 = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f9fafb",
  },
  emptyText: {
    fontSize: 14,
    color: "#6b7280",
    paddingVertical: 8,
    paddingHorizontal: 4,
    fontStyle: "italic",
  },
  extraInfo: {
    alignItems: "flex-end",
  },
  extraInfoText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
});
