import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { useEffect, useState } from "react";
import formatDate from "../../utils/dateFormatter";
import PaginatedList from "../../components/PaginatedList";
import FeedbackCard from "../../components/FeedbackCard";
import { getFeedbacksForEvent } from "../../services/feedbackService";

export default function EventDetailPage({ route }) {
  const { event } = route.params;
  const formattedDate = formatDate(new Date(event.datetime));
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        const data = await getFeedbacksForEvent(event.eventid);
        setFeedbacks(data);
      } catch (error) {
        console.error("Error loading feedbacks:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFeedbacks();
  }, [event.id]);

  const chartData = [
    {
      name: "Asistentes",
      amount: event.attendees,
      color: "#6C63FF", // Replace with your primary color
      legendFontColor: "#3D3E44", // Replace with your text color
      legendFontSize: 15,
    },
    {
      name: "Disponibles",
      amount: event.availablespots,
      color: "#5551A2", // Replace with your secondary color
      legendFontColor: "#3D3E44", // Replace with your text color
      legendFontSize: 15,
    },
  ];

  const renderFeedbackCard = ({ item }) => <FeedbackCard feedback={item} />;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{event.title}</Text>
      <View style={styles.speakerRow}>
        <Image source={{ uri: event.speakeravatar }} style={styles.avatar} />
        <View>
          <Text style={styles.speaker}>{event.speakername}</Text>
          <Text style={styles.category}>{event.category}</Text>
        </View>
      </View>

      <Text style={styles.description}>{event.description}</Text>
      <View style={styles.pieChartBlock}>
        <PieChart
          data={chartData}
          width={Dimensions.get("window").width - 40}
          height={220}
          chartConfig={{
            backgroundColor: "#FCFCFC", // Replace with your background color
            backgroundGradientFrom: "#FCFCFC",
            backgroundGradientTo: "#FCFCFC",
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="amount"
          backgroundColor="transparent"
          hasLegend={false}
          paddingLeft= { `${(Dimensions.get("window").width/4.5)}`}
          center={[0, 0]}
        />
        <View
          style={{
            marginTop: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent:"center"
          }}
        >
          {chartData.map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 7,
              }}
            >
              <View
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: item.color,
                  marginRight: 8,
                  borderRadius: 20,
                }}
              />
              <Text style={{ fontSize: 12, color: item.legendFontColor }}>
                {item.name}
              </Text>
            </View>
          ))}
          <View
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <View
              style={{
                width: 12,
                height: 12,
                backgroundColor: "transparent",
                borderWidth: 1,
                borderRadius:20,
                borderColor: "#000",
                marginRight: 8,
              }}
            />
            <Text style={{ fontSize: 12, color: "#000" }}>
              Total: {event.attendees + event.availablespots}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.info}>
          <Text style={styles.bold}>Fecha:</Text> {formattedDate}
        </Text>
        <Text style={styles.info}>
          <Text style={styles.bold}>Lugar:</Text> {event.location_}
        </Text>
        <Text style={styles.info}>
          <Text style={styles.bold}>Estado:</Text> {event.status}
        </Text>
        <Text style={styles.info}>
          <Text style={styles.bold}>Track:</Text> {event.track}
        </Text>
        {event.status == "Finalizado" ? (
          <Text style={styles.info}>
            <Text style={styles.bold}>Calificación promedio:</Text>{" "}
            {event.avgscore}
          </Text>
        ) : null}
      </View>

      <View style={styles.tagsRow}>
        {event.tags &&
          event.tags.map((tag, idx) => (
            <Text key={idx} style={styles.tag}>
              {tag}
            </Text>
          ))}
      </View>

      <View style={styles.sessionsBlock}>
        <Text style={[styles.bold, styles.session]}>Sesiones:</Text>
        {event.sessionorder &&
          event.sessionorder.map((session, idx) => (
            <View key={idx} style={styles.session}>
              <Text style={styles.sessionTitle}>{session.name}</Text>
              <Text style={styles.sessionDesc}>
                Duración: {session.duration} minutos
              </Text>
            </View>
          ))}
      </View>

      {event.status == "Finalizado" ? (
        <View style={styles.feedbackSection}>
          <Text style={styles.sectionTitle}> Feedbacks</Text>

          {loading ? (
            <ActivityIndicator style={{ marginTop: 40 }} />
          ) : (
            <PaginatedList
              data={feedbacks}
              renderItem={renderFeedbackCard}
              listHeight={400} // Altura fija
              emptyMessage="No hay feedbacks aún"
            />
          )}
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F9FAFB",
  },
  pieChartBlock: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 15
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  speakerRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  speaker: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  category: {
    fontSize: 13,
    color: "#6B7280",
  },
  description: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    marginBottom: 14,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    elevation: 1,
  },
  infoBlock: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 1,
  },
  info: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 8,
  },
  bold: {
    fontWeight: "600",
    color: "#111827",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 24,
  },
  tag: {
    backgroundColor: "#E5E7EB",
    color: "#374151",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  sessionsBlock: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 1,
  },
  session: {
    marginBottom: 12,
    borderBottomColor: "#E5E7EB",
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  sessionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  sessionDesc: {
    fontSize: 13,
    color: "#6B7280",
  },
  feedbackSection: {
    marginTop: 10,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  loadingContainer: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});
