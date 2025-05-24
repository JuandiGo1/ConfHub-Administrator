import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "../../styles/styles";
import { createEvent } from "../../services/eventService";

export default function CreateEvent() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [datetime, setDatetime] = useState("");
  const [attendees, setAttendees] = useState("");
  const [availablespots, setAvailableSpots] = useState("");
  const [description, setDescription] = useState("");
  const [speakername, setSpeakerName] = useState("");
  const [speakeravatar, setSpeakerAvatar] = useState("");
  const [sessionorder, setSessionOrder] = useState([]);
  const [sessionName, setSessionName] = useState("");
  const [sessionDuration, setSessionDuration] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("Por empezar");
  const [message, setMessage] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    setShowDate(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTime(false);
    if (selectedTime) {
      // Mantener la fecha, solo cambiar la hora/minuto
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setDate(newDate);
    }
  };

  const handleAddSession = () => {
    if (sessionName && sessionDuration) {
      setSessionOrder([
        ...sessionorder,
        { name: sessionName, duration: Number(sessionDuration) },
      ]);
      setSessionName("");
      setSessionDuration("");
    }
  };

  const handleCreateEvent = async () => {
    try {
      const event = {
        title,
        category,
        location_: location,
        datetime: date.toISOString(),
        attendees: Number(attendees),
        availablespots: Number(availablespots),
        description,
        speakername,
        speakeravatar,
        sessionorder,
        tags: tags.split(",").map((t) => t.trim()),
        avgscore: 0,
        numberreviews: 0,
        status,
      };
      await createEvent(event);
      setMessage("Evento creado exitosamente");
    } catch (error) {
      setMessage("Error al crear el evento", error.message);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      contentContainerStyle={{ padding: 20 }}
    >
      <Text style={styles.title}>Crear Nuevo Evento</Text>
      <TextInput
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Categoría"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
      />
      <TextInput
        placeholder="Ubicación"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
      />

      {/* Date and Time Picker */}
      <Text style={{ marginBottom: 6, fontWeight: "bold" }}>Fecha y hora</Text>
      <View style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
        <TouchableOpacity
          style={[styles.input, { justifyContent: "center", flex: 1 }]}
          onPress={() => setShowDate(true)}
        >
          <Text>
            {date.toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.input, { justifyContent: "center", flex: 1 }]}
          onPress={() => setShowTime(true)}
        >
          <Text>
            {date.toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </TouchableOpacity>
      </View>
      {showDate && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
        />
      )}
      {showTime && (
        <DateTimePicker
          value={date}
          mode="time"
          is24Hour={true}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleTimeChange}
        />
      )}
      <TextInput
        placeholder="Asistentes hasta el momento (si se tienen)"
        value={attendees}
        onChangeText={setAttendees}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Cupos disponibles"
        value={availablespots}
        onChangeText={setAvailableSpots}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        multiline
      />
      <TextInput
        placeholder="Nombre del ponente"
        value={speakername}
        onChangeText={setSpeakerName}
        style={styles.input}
      />
      <Text style={{ marginTop: 10, fontWeight: "bold" }}>Sesiones</Text>
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
        <TextInput
          placeholder="Nombre sesión"
          value={sessionName}
          onChangeText={setSessionName}
          style={[styles.input, { flex: 2 }]}
        />
        <TextInput
          placeholder="Duración (min)"
          value={sessionDuration}
          onChangeText={setSessionDuration}
          keyboardType="numeric"
          style={[styles.input, { flex: 1 }]}
        />
        <TouchableOpacity
          onPress={handleAddSession}
          style={{ justifyContent: "center", paddingHorizontal: 8 }}
        >
          <Text style={{ color: "#2563eb", fontWeight: "bold" }}>Agregar</Text>
        </TouchableOpacity>
      </View>
      {sessionorder.map((s, idx) => (
        <Text key={idx} style={{ fontSize: 13, color: "#444" }}>
          {s.name} - {s.duration} min
        </Text>
      ))}
      <TextInput
        placeholder="Tags (separados por coma)"
        value={tags}
        onChangeText={setTags}
        style={styles.input}
      />
      <Button title="Crear Evento" onPress={handleCreateEvent} />
      {message ? (
        <Text style={{ marginTop: 10, color: "#2563eb" }}>{message}</Text>
      ) : null}
    </ScrollView>
  );
}
