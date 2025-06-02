import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import { BarChart, PieChart, LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import { Card } from 'react-native-paper';
import formatDate from '../../utils/dateFormatter';

const API_URL = 'https://confhub-backend-production.up.railway.app/api';

const DashboardScreen = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    finishedEvents: 0,
    upcomingEvents: 0,
    totalFeedbacks: 0,
    averageScore: 0,
    categoryCounts: {},
    locationCounts: {},
    monthlyEvents: {},
    availableSpots: 0,
    totalAttendees: 0,
    capacityRate: 0,
    feedbackScores: [0, 0, 0, 0, 0],
    popularTags: [],
    topLocations: [],
    topTrackEvents: 0,
    answeredFeedbacks: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [commentsPerPage] = useState(3); // Número de comentarios por página
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [subscriptionsPage, setSubscriptionsPage] = useState(1);
  const [ratingsPage, setRatingsPage] = useState(1);
  const [eventsPerPage] = useState(5); // Eventos por página en cada tabla

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching events data from:', `${API_URL}/events`);

        const eventsResponse = await axios.get(`${API_URL}/events`);
        console.log('Events data received:', eventsResponse.data.length, 'events');
        setEvents(eventsResponse.data);

        console.log('Fetching feedbacks data from:', `${API_URL}/feedbacks`);
        const feedbacksResponse = await axios.get(`${API_URL}/feedbacks`);
        console.log('Feedbacks data received:', feedbacksResponse.data.length, 'feedbacks');
        setFeedbacks(feedbacksResponse.data);

        calculateStats(eventsResponse.data, feedbacksResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        alert('Error al conectar con la API. Por favor, verifica tu conexión a internet o contacta al administrador.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateStats = (eventsData, feedbacksData) => {
    // Inicializar contadores
    const activeEvents = eventsData.filter(event => event.status === 'Por empezar').length;
    const finishedEvents = eventsData.filter(event => event.status === 'Finalizado').length;

    // Calcular promedio de puntuación
    let totalScore = 0;
    let reviewCount = 0;
    eventsData.forEach(event => {
      if (event.avgscore > 0) {
        totalScore += event.avgscore;
        reviewCount += 1;
      }
    });
    const averageScore = reviewCount > 0 ? (totalScore / reviewCount).toFixed(1) : 0;

    // Conteo por categorías
    const categoryCounts = {};
    eventsData.forEach(event => {
      if (event.category) {
        categoryCounts[event.category] = (categoryCounts[event.category] || 0) + 1;
      }
    });

    // Conteo por ubicación
    const locationCounts = {};
    eventsData.forEach(event => {
      if (event.location_) {
        locationCounts[event.location_] = (locationCounts[event.location_] || 0) + 1;
      }
    });

    // Eventos por mes
    const monthlyEvents = {};
    eventsData.forEach(event => {
      const date = new Date(event.datetime);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      monthlyEvents[monthYear] = (monthlyEvents[monthYear] || 0) + 1;
    });

    // Total de asistentes y plazas disponibles
    const totalAttendees = eventsData.reduce((sum, event) => sum + event.attendees, 0);
    const availableSpots = eventsData.reduce((sum, event) => sum + event.availablespots, 0);

    // Tasa de ocupación (asistentes / capacidad total)
    const totalCapacity = totalAttendees + availableSpots;
    const capacityRate = totalCapacity > 0 ? ((totalAttendees / totalCapacity) * 100).toFixed(1) : 0;

    // Distribución de puntuaciones de feedback
    const feedbackScores = [0, 0, 0, 0, 0]; // Para puntajes 1-5
    feedbacksData.forEach(feedback => {
      if (feedback.score >= 1 && feedback.score <= 5) {
        feedbackScores[feedback.score - 1]++;
      }
    });

    // Tags populares
    const tagCounts = {};
    eventsData.forEach(event => {
      if (event.tags && Array.isArray(event.tags)) {
        event.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });

    // Top 5 tags por popularidad
    const popularTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));

    // Top 5 ubicaciones por número de eventos
    const topLocations = Object.entries(locationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([location, count]) => ({ location, count }));

    // Número de eventos con track
    const topTrackEvents = eventsData.filter(event => event.track).length;

    // Número de feedbacks respondidos
    const answeredFeedbacks = feedbacksData.filter(feedback => feedback.answer !== null).length;

    setStats({
      totalEvents: eventsData.length,
      activeEvents,
      finishedEvents,
      upcomingEvents: activeEvents,
      totalFeedbacks: feedbacksData.length,
      averageScore,
      categoryCounts,
      locationCounts,
      monthlyEvents,
      availableSpots,
      totalAttendees,
      capacityRate,
      feedbackScores,
      popularTags,
      topLocations,
      topTrackEvents,
      answeredFeedbacks,
    });
  };


  // Modificar la función preparePieChartData para simplificar las etiquetas
  const preparePieChartData = () => {
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];
    const total = Object.values(stats.categoryCounts).reduce((sum, count) => sum + count, 0);

    return Object.entries(stats.categoryCounts).slice(0, 5).map(([category, count], index) => {
      const percentage = ((count / total) * 100).toFixed(1);
      // Abreviar título si es demasiado largo - usar solo las primeras 4 letras
      const shortCategory = category.substring(0, 4);

      return {
        name: `${shortCategory} ${percentage}%`, // Formato más simple
        count,
        color: colors[index % colors.length],
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      };
    });
  };


  const prepareAttendanceData = () => {
    const total = stats.totalAttendees + stats.availableSpots;
    const attendeesPercentage = ((stats.totalAttendees / total) * 100).toFixed(1);
    const spotsPercentage = ((stats.availableSpots / total) * 100).toFixed(1);

    return [
      {
        name: `Asist: ${attendeesPercentage}%`, // Etiqueta más corta
        count: stats.totalAttendees,
        color: '#36A2EB',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      },
      {
        name: `Libres: ${spotsPercentage}%`, // Etiqueta más corta
        count: stats.availableSpots,
        color: '#FFCE56',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      },
    ];
  };


  // Añade esta función para cambiar de página en la lista de comentarios
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Añade esta función para filtrar comentarios por evento específico
  const handleSelectEvent = (eventId) => {
    setSelectedEvent(eventId === selectedEvent ? null : eventId);
    setCurrentPage(1); // Reiniciar a la primera página cuando cambia el filtro
  };

  // Añade estas nuevas funciones para manejar la paginación de las tablas
  const paginateSubscriptions = (pageNumber) => {
    setSubscriptionsPage(pageNumber);
  };

  const paginateRatings = (pageNumber) => {
    setRatingsPage(pageNumber);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Cargando estadísticas...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard de Eventos</Text>

      {/* Tarjetas de estadísticas principales */}
      <View style={styles.cardsContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Eventos Totales</Text>
            <Text style={styles.cardValue}>{stats.totalEvents}</Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Eventos Activos</Text>
            <Text style={styles.cardValue}>{stats.activeEvents}</Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Eventos Finalizados</Text>
            <Text style={styles.cardValue}>{stats.finishedEvents}</Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Feedbacks</Text>
            <Text style={styles.cardValue}>{stats.totalFeedbacks}</Text>
          </Card.Content>
        </Card>

        <Card style={styles.wideCard}>
          <Card.Content>
            <Text style={styles.cardTitle}>Eventos con Track</Text>
            <Text style={styles.cardValue}>{stats.topTrackEvents}</Text>
          </Card.Content>
        </Card>

        <Card style={styles.wideCard}>
          <Card.Content>
            <Text style={styles.cardTitle}>Asistentes Totales</Text>
            <Text style={styles.cardValue}>{stats.totalAttendees}</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Segunda fila de datos */}
      <View style={styles.cardsContainer}>
        <Card style={styles.wideCard}>
          <Card.Content>
            <Text style={styles.cardTitle}>Puntuación Media</Text>
            <Text style={styles.cardValue}>{stats.averageScore} / 5</Text>
          </Card.Content>
        </Card>

        <Card style={styles.wideCard}>
          <Card.Content>
            <Text style={styles.cardTitle}>Tasa de Ocupación</Text>
            <Text style={styles.cardValue}>{stats.capacityRate} %</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Gráfico de categorías */}
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Eventos por Categoría</Text>
        <View style={{ alignItems: 'center', height: 250 }}>
          <PieChart
            data={preparePieChartData()}
            width={Dimensions.get('window').width - 60}
            height={200}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="count"
            backgroundColor="transparent"
            paddingLeft="0"
            center={[0, 0]} // Centrar en (0,0) para que se vea completo
            absolute
            hasLegend={true}
            avoidFalseZero
            // Nuevas propiedades para mejorar visualización en móvil
            legendPosition="bottom"
            accessible={true}
          />
        </View>
      </View>


      {/* Gráfico de ocupación */}
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Ocupación de Eventos</Text>
        <View style={{ alignItems: 'center', height: 250 }}>
          <PieChart
            data={prepareAttendanceData()}
            width={Dimensions.get('window').width - 60}
            height={200}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="count"
            backgroundColor="transparent"
            paddingLeft="0"
            center={[0, 0]} // Centrar en (0,0)
            absolute
            hasLegend={true}
            avoidFalseZero
            // Nuevas propiedades para mejorar visualización en móvil
            legendPosition="bottom"
            accessible={true}
          />
        </View>
      </View>

      {/* Tabla de estadísticas por ubicación */}
      <View style={styles.tableContainer}>
        <Text style={styles.sectionTitle}>Eventos por Ubicación</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCell}>Ubicación</Text>
          <Text style={styles.tableHeaderCell}>Número de Eventos</Text>
        </View>
        {stats.topLocations.map((item, index) => (
          <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
            <Text style={styles.tableCell}>{item.location}</Text>
            <Text style={styles.tableCell}>{item.count}</Text>
          </View>
        ))}
      </View>

      {/* Tabla de tags populares */}
      <View style={styles.tableContainer}>
        <Text style={styles.sectionTitle}>Tags Populares</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCell}>Tag</Text>
          <Text style={styles.tableHeaderCell}>Ocurrencias</Text>
        </View>
        {stats.popularTags.map((item, index) => (
          <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
            <Text style={styles.tableCell}>{item.tag}</Text>
            <Text style={styles.tableCell}>{item.count}</Text>
          </View>
        ))}
      </View>

      {/* Nueva sección: Total de suscripciones por evento */}
      <View style={styles.tableContainer}>
        <Text style={styles.sectionTitle}>Suscripciones por Evento</Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Evento</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: 'right' }]}>Asistentes</Text>
        </View>

        {(() => {
          // Filtrar eventos que tienen asistentes y ordenarlos
          const eventsWithSubscriptions = events
            .filter(event => event.attendees >= 0)
            .sort((a, b) => b.attendees - a.attendees);

          // Si no hay datos
          if (eventsWithSubscriptions.length === 0) {
            return (
              <View style={styles.emptyTableRow}>
                <Text style={styles.emptyTableText}>No hay datos de asistencia disponibles</Text>
              </View>
            );
          }

          // Calcular índices para paginación
          const indexOfLastEvent = subscriptionsPage * eventsPerPage;
          const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
          const currentEvents = eventsWithSubscriptions.slice(indexOfFirstEvent, indexOfLastEvent);

          return (
            <>
              {currentEvents.map((event, index) => (
                <View key={event.id || index} style={[styles.tableRow, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
                  <Text
                    style={[styles.tableCell, { flex: 2 }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {event.title || 'Sin título'}
                  </Text>
                  <Text style={[styles.tableCellNumeric, { flex: 1 }]}>
                    {event.attendees || 0}
                  </Text>
                </View>
              ))}

              {/* Paginación para tabla de suscripciones */}
              <View style={styles.tablePagination}>
                <TouchableOpacity
                  style={[styles.pageButton, subscriptionsPage === 1 && styles.disabledPageButton]}
                  onPress={() => subscriptionsPage > 1 && paginateSubscriptions(subscriptionsPage - 1)}
                  disabled={subscriptionsPage === 1}
                >
                  <Text style={styles.pageButtonText}>Anterior</Text>
                </TouchableOpacity>

                <Text style={styles.pageInfo}>
                  Página {subscriptionsPage} de {Math.ceil(eventsWithSubscriptions.length / eventsPerPage)}
                </Text>

                <TouchableOpacity
                  style={[styles.pageButton, subscriptionsPage >= Math.ceil(eventsWithSubscriptions.length / eventsPerPage) && styles.disabledPageButton]}
                  onPress={() => subscriptionsPage < Math.ceil(eventsWithSubscriptions.length / eventsPerPage) && paginateSubscriptions(subscriptionsPage + 1)}
                  disabled={subscriptionsPage >= Math.ceil(eventsWithSubscriptions.length / eventsPerPage)}
                >
                  <Text style={styles.pageButtonText}>Siguiente</Text>
                </TouchableOpacity>
              </View>
            </>
          );
        })()}
      </View>

      {/* Nueva sección: Puntuación media por evento */}
      <View style={styles.tableContainer}>
        <Text style={styles.sectionTitle}>Puntuación Media por Evento</Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Evento</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: 'right' }]}>Valoración</Text>
        </View>

        {(() => {
          // Filtrar eventos con puntuación y ordenarlos
          const eventsWithRatings = events
            .filter(event => event.avgscore > 0 && event.avgscore !== null && event.avgscore !== undefined)
            .sort((a, b) => b.avgscore - a.avgscore);

          // Si no hay datos
          if (eventsWithRatings.length === 0) {
            return (
              <View style={styles.emptyTableRow}>
                <Text style={styles.emptyTableText}>No hay datos de valoración disponibles</Text>
              </View>
            );
          }

          // Calcular índices para paginación
          const indexOfLastEvent = ratingsPage * eventsPerPage;
          const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
          const currentEvents = eventsWithRatings.slice(indexOfFirstEvent, indexOfLastEvent);

          return (
            <>
              {currentEvents.map((event, index) => (
                <View key={event.id || index} style={[styles.tableRow, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
                  <Text
                    style={[styles.tableCell, { flex: 2 }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {event.title || 'Sin título'}
                  </Text>
                  <Text style={[styles.tableCellRating, { flex: 1 }]}>
                    {(event.avgscore || 0).toFixed(1)}
                    <Text style={styles.ratingStars}> {'\u2605'}</Text>
                  </Text>
                </View>
              ))}

              {/* Paginación para tabla de valoraciones */}
              <View style={styles.tablePagination}>
                <TouchableOpacity
                  style={[styles.pageButton, ratingsPage === 1 && styles.disabledPageButton]}
                  onPress={() => ratingsPage > 1 && paginateRatings(ratingsPage - 1)}
                  disabled={ratingsPage === 1}
                >
                  <Text style={styles.pageButtonText}>Anterior</Text>
                </TouchableOpacity>

                <Text style={styles.pageInfo}>
                  Página {ratingsPage} de {Math.ceil(eventsWithRatings.length / eventsPerPage)}
                </Text>

                <TouchableOpacity
                  style={[styles.pageButton, ratingsPage >= Math.ceil(eventsWithRatings.length / eventsPerPage) && styles.disabledPageButton]}
                  onPress={() => ratingsPage < Math.ceil(eventsWithRatings.length / eventsPerPage) && paginateRatings(ratingsPage + 1)}
                  disabled={ratingsPage >= Math.ceil(eventsWithRatings.length / eventsPerPage)}
                >
                  <Text style={styles.pageButtonText}>Siguiente</Text>
                </TouchableOpacity>
              </View>
            </>
          );
        })()}
      </View>

      {/*Comentarios de Feedback Anónimos con Paginación */}
      <View style={styles.commentContainer}>
        <Text style={styles.sectionTitle}>Comentarios de Feedback Anónimos</Text>

        {/* Selector de eventos para filtrar comentarios */}
        <Text style={styles.filterLabel}>Filtrar por evento:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.eventFilterScroll}>
          <TouchableOpacity
            style={[styles.eventFilterButton, !selectedEvent && styles.selectedFilter]}
            onPress={() => handleSelectEvent(null)}
          >
            <Text style={styles.eventFilterText}>Todos</Text>
          </TouchableOpacity>
          {events.map(event => (
            <TouchableOpacity
              key={event.eventid}
              style={[styles.eventFilterButton, selectedEvent === event.eventid && styles.selectedFilter]}
              onPress={() => handleSelectEvent(event.eventid)}
            >
              <Text style={styles.eventFilterText}>{event.title.length > 15 ? event.title.substring(0, 12) + '...' : event.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Lista de comentarios */}
        <View style={styles.commentsList}>
          {(() => {
            // Filtrar comentarios según el evento seleccionado
            const filteredFeedbacks = selectedEvent
              ? feedbacks.filter(feedback => feedback.eventid === selectedEvent)
              : feedbacks;

            // Verificar si hay comentarios
            if (filteredFeedbacks.length === 0) {
              return <Text style={styles.noCommentsText}>No hay comentarios disponibles.</Text>
            }

            // Calcular paginación
            const indexOfLastComment = currentPage * commentsPerPage;
            const indexOfFirstComment = indexOfLastComment - commentsPerPage;
            const currentComments = filteredFeedbacks.slice(indexOfFirstComment, indexOfLastComment);

            // Renderizar comentarios paginados
            return (
              <>
                {currentComments.map((feedback, index) => {
                  return (
                    <View key={index} style={styles.commentCard}>
                      <View style={styles.commentHeader}>
                        <Text style={styles.commentEvent}>{feedback.title}</Text>
                        <View style={styles.ratingContainer}>
                          {[1, 2, 3, 4, 5].map(star => (
                            <Text key={star} style={[styles.starIcon, star <= feedback.score && styles.filledStar]}>
                              ★
                            </Text>
                          ))}
                        </View>
                      </View>
                      <Text style={styles.commentText}>{feedback.comment || 'Sin comentario'}</Text>
                      <Text style={styles.commentDate}>{ formatDate(new Date(feedback.dateTime))}</Text>
                    </View>
                  );
                })}

                {/* Paginación */}
                <View style={styles.pagination}>
                  <TouchableOpacity
                    style={[styles.pageButton, currentPage === 1 && styles.disabledPageButton]}
                    onPress={() => currentPage > 1 && paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <Text style={styles.pageButtonText}>Anterior</Text>
                  </TouchableOpacity>

                  <Text style={styles.pageInfo}>
                    Página {currentPage} de {Math.ceil(filteredFeedbacks.length / commentsPerPage)}
                  </Text>

                  <TouchableOpacity
                    style={[styles.pageButton, currentPage >= Math.ceil(filteredFeedbacks.length / commentsPerPage) && styles.disabledPageButton]}
                    onPress={() => currentPage < Math.ceil(filteredFeedbacks.length / commentsPerPage) && paginate(currentPage + 1)}
                    disabled={currentPage >= Math.ceil(filteredFeedbacks.length / commentsPerPage)}
                  >
                    <Text style={styles.pageButtonText}>Siguiente</Text>
                  </TouchableOpacity>
                </View>
              </>
            );
          })()}
        </View>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
    fontFamily: 'Arial'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Arial'
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Arial'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Arial'
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
    fontFamily: 'Arial'
  },
  card: {
    width: '48%',
    marginBottom: 16,
    elevation: 3,
    backgroundColor: 'white',
    fontFamily: 'Arial'
  },
  wideCard: {
    width: '48%',
    marginBottom: 16,
    elevation: 3,
    backgroundColor: 'white',
    fontFamily: 'Arial'
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Arial'
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    fontFamily: 'Arial'
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    fontFamily: 'Arial',
    overflow: 'hidden'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    fontFamily: 'Arial'
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    fontFamily: 'Arial'
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
    marginBottom: 8,
    fontFamily: 'Arial'
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: 'Arial'
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    fontFamily: 'Arial'
  },
  evenRow: {
    backgroundColor: '#f9f9f9',
    fontFamily: 'Arial'
  },
  oddRow: {
    backgroundColor: 'white',
    fontFamily: 'Arial'
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Arial'
  },
  tableCellNumeric: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
    fontFamily: 'Arial',
    color: '#3498db',
  },
  tableCellRating: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
    fontFamily: 'Arial',
    color: '#2ecc71',
  },
  scrollIndicator: {
    alignItems: 'center',
    marginTop: 8,
  },
  scrollIndicatorText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    fontFamily: 'Arial'
  },
  // Estilos para la sección de comentarios
  commentContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    fontFamily: 'Arial',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#666',
    fontFamily: 'Arial',
  },
  eventFilterScroll: {
    marginBottom: 15,
  },
  eventFilterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  selectedFilter: {
    backgroundColor: '#3498db',
  },
  eventFilterText: {
    fontFamily: 'Arial',
    fontSize: 12,
    color: '#333',
  },
  commentsList: {
    marginTop: 10,
  },
  commentCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentEvent: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
    fontFamily: 'Arial',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  starIcon: {
    fontSize: 16,
    color: '#ddd',
    marginLeft: 2,
  },
  filledStar: {
    color: '#f1c40f',
  },
  commentText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    fontFamily: 'Arial',
    fontStyle: 'italic',
  },
  commentDate: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    fontFamily: 'Arial',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  pageButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#3498db',
    borderRadius: 5,
  },
  disabledPageButton: {
    backgroundColor: '#ccc',
  },
  pageButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Arial',
  },
  pageInfo: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Arial',
  },
  noCommentsText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 15,
    fontFamily: 'Arial',
  },
  emptyTableRow: {
    padding: 16,
    alignItems: 'center',
  },
  emptyTableText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#999',
    fontFamily: 'Arial',
  },
  tablePagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },

  ratingStars: {
    color: '#f1c40f',
    fontWeight: 'normal',
  },
});

export default DashboardScreen;