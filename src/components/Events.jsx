import React, { useEffect, useState } from "react";
import { View, TextInput, FlatList, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { searchEvents } from "../services/eventService";
import EventCard from "./EventCard";


export default function Events() {
  const [searched, setSearch] = useState("");
  const [events, setEvents] = useState(null);

  useEffect(() => {
    console.log(events);
  }, [events]);

  const handleSearch = async () => {
    if (searched) {
      setEvents(await searchEvents(searched));
    }
  };
  return (
    <>
      <View style={{ backgroundColor: "#ffff" }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 10,
          }}
        >
          <TextInput
            style={{
              padding: 20,
              borderWidth: 1,
              borderColor: "black",
              width: 300,
              borderRadius: 10,
            }}
            value={searched}
            onChangeText={setSearch}
            placeholder="Desarrollo Web"
          />
          <Ionicons
            style={{ borderRadius: 30 }}
            size={30}
            name="search-sharp"
            onPress={handleSearch}
          />
        </View>
      </View>
      {events && events.length === 0 && (
        <View style={{ padding: 20, alignItems: "center" }}>
          <Text style={{ fontSize: 18, color: "gray" }}>
            No se encontraron eventos.
          </Text>
        </View>
      )}
      {events && events.length > 0 && (
        <FlatList
          style={{ backgroundColor: "#ffff" }}
          data={events}
          renderItem={({ item }) => <EventCard event={item} />}
          keyExtractor={(item) => item.eventid}
        />
      )}
    </>
  );
}
