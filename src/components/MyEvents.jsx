import { useEffect, useState, useCallback } from "react";
import { View, FlatList, Text } from "react-native";
import { IconButton, MD3Colors, Modal, Portal, Provider } from "react-native-paper";
import { getEventsById, searchEvents } from "../services/eventService";
import EventCard from "./EventCard";
import { getData, storeData } from "../storage/localStorage";
import styles from "../styles/styles";
import EditEventModal from "./EditEventModal"; // Nuevo componente
import { useFocusEffect } from "@react-navigation/native";
import { getSpeaker } from "../services/speakerService";
import { getAdmin } from "../services/adminService";


export default function MyEvents() {
  const [events, setEvents] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState(null);


  useEffect(() => {
    fetchMyEvents();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUser();
      fetchMyEvents();
    }, [])
  );

  const fetchUser = async () => {
    const speaker = await getSpeaker(await getData("email"));
    const admin = await getAdmin(await getData("email"));
    const currentUser = admin ? admin.admin : speaker.speaker;
    setUser(currentUser);
    await storeData("user", JSON.stringify(currentUser));
  };

  const handleDelete = async (event) => {
    await fetchMyEvents();
  };

  const fetchMyEvents = async () => {
    // Obtiene los datos del usuario logueado
    const userstring = await getData("user");
    const user = JSON.parse(userstring);
    // Si el usuario no tiene eventos, no hace nada
    if (user.events.length > 0) {
      const myEvents = await Promise.all(
        // Mapea los IDs de eventos del usuario a sus detalles
        user.events.map((eventid) => {
          return getEventsById(eventid);
        })
      );

      setEvents(myEvents.flat());
    }
  };

  const handleRefresh = async () => {
    
    setRefreshing(true);
    await fetchMyEvents(); // vuelve a pedir los datos
    setRefreshing(false); // se quita el spinner
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const handleModalClose = (updated) => {
    setModalVisible(false);
    setSelectedEvent(null);
    if (updated) fetchMyEvents(); // Refresca la lista si hubo cambios
  };

  return (

    <Provider>
      <View style={styles.container}>
        {events == null ? <Text>Aún no creas eventos</Text> : null}
        <FlatList
          data={events}
          renderItem={({ item }) => (
            <View>
              <EventCard event={item} />
              <IconButton
                icon="pencil"
                iconColor={MD3Colors.primary50}
                size={24}
                onPress={() => handleEdit(item)}
                style={{ alignSelf: "flex-end" }}
              />
            </View>
          )}
          keyExtractor={(item) => item.eventid}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={() => handleModalClose(false)}
            contentContainerStyle={{ flex: 1, justifyContent: "flex-start" }}
            style={{ flex: 1, margin: 0, justifyContent: "flex-start" }}
          >
            {selectedEvent && (
              <EditEventModal
                event={selectedEvent}
                onClose={handleModalClose}
              />
            )}
          </Modal>
        </Portal>
      </View>
    </Provider>

  );
}
