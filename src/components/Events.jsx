import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { searchEvents } from "../services/eventService";
import EventCard from "./EventCard";

export default function Events() {
  const [searched, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState(null);

  const handleSearch = async () => {
    if (searched) {
      setLoading(true);
      setEvents(await searchEvents(searched));
      setLoading(false);
    }
  };
  return (
    <>
      <View
        style={{ backgroundColor: events && events.length != 0 ? "#fff" : "" }}
      >
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
        {loading ? <ActivityIndicator style={{ marginTop: 40 }} /> : null}

        {events && events.length === 0 && (
          <View style={{ padding: 20, alignItems: "center" }}>
            <Text style={{ fontSize: 18, color: "gray" }}>
              No se encontraron eventos.
            </Text>
          </View>
        )}
      </View>

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
