import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import { BarChart, PieChart, LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import { Card } from 'react-native-paper';

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

  const chartColors = [
    '#2ecc71', // Verde
    '#3498db', // Azul
    '#9b59b6', // Púrpura
    '#f1c40f', // Amarillo
    '#e74c3c', // Rojo
  ];
  
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
        // Si hay error en la conexión, puedes mostrar un mensaje específico
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
  
  // Preparar datos para gráficos
  const prepareBarChartData = () => {
    const categories = Object.keys(stats.categoryCounts).slice(0, 5);
    return {
      labels: categories,
      datasets: [
        {
          data: categories.map(cat => stats.categoryCounts[cat]),
          color: (opacity = 1) => `rgba(0, 100, 255, ${opacity})`,
        },
      ],
    };
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

    const prepareMonthlyData = () => {
    const sortedMonths = Object.entries(stats.monthlyEvents)
      .map(([key, value]) => {
        const [month, year] = key.split('/');
        return {
          key,
          value,
          date: new Date(`${year}-${month.padStart(2, '0')}-01`)
        };
      })
      .sort((a, b) => a.date - b.date)
      .slice(0, 5); 
    
    const labels = sortedMonths.map(item => {
      const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const monthIndex = item.date.getMonth();
      return `${monthNames[monthIndex]}`;
    });
    
    return {
      labels,
      datasets: [
        {
          data: sortedMonths.map(item => item.value),
          color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
          strokeWidth: 2,
          withDots: true,
          withShadow: true
        },
      ],
      legend: ['Número de eventos']
    };
  };

  const prepareFeedbackScoreData = () => {
    const maxValue = Math.max(...stats.feedbackScores);
    
    return {
      labels: ['1★', '2★', '3★', '4★', '5★'],
      datasets: [
        {
          data: stats.feedbackScores,
          colors: [
            (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
            (opacity = 1) => `rgba(255, 159, 64, ${opacity})`,
            (opacity = 1) => `rgba(255, 205, 86, ${opacity})`,
            (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
            (opacity = 1) => `rgba(54, 162, 235, ${opacity})`
          ]
        }
      ],
      legend: [`Máximo: ${maxValue}`]
    };
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
      
      {/* Gráfico de eventos por mes */}
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Eventos por Mes</Text>
        
        <ScrollView 
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          <LineChart
            data={prepareMonthlyData()}
            width={Dimensions.get('window').width * 1.1} // Un poco más ancho que la pantalla
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`, 
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: '6', 
                strokeWidth: '2',
                stroke: '#2ecc71', 
                fill: '#ffffff' 
              },
              propsForBackgroundLines: {
                strokeDasharray: '', 
                stroke: '#e0e0e0', 
                strokeWidth: 1
              },
              formatYLabel: (value) => Math.round(value).toString(),
              formatXLabel: (value) => value.split(' ')[0],
              count: 3, 
            }}
            bezier
            withHorizontalLabels={true}
            withVerticalLabels={true}
            withInnerLines={true}
            withOuterLines={true}
            withShadow={true}
            yAxisInterval={1}
            segments={5}
            style={{
              marginVertical: 8,
              borderRadius: 16,
              paddingRight: 40,
              paddingLeft: 10,  
              paddingTop: 10,   
              paddingBottom: 10 
            }}
            yAxisSuffix="" 
            getDotColor={(_, index) => chartColors[index % chartColors.length]}
          />
        </ScrollView>
        
        {/* Indicador de desplazamiento */}
        <View style={styles.scrollIndicator}>
          <Text style={styles.scrollIndicatorText}>← Deslizar →</Text>
        </View>
      </View>

      {/* Gráfico de distribución de puntuaciones */}
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Distribución de Puntuaciones</Text>
        
        <ScrollView 
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          <BarChart
            data={prepareFeedbackScoreData()}
            width={Dimensions.get('window').width * 1.1} // Un poco más ancho que la pantalla
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              barPercentage: 0.8, 
              useShadowColorFromDataset: false,
              style: {
                borderRadius: 16
              },
              formatYLabel: (value) => Math.round(value).toString(),
              count: 5,
            }}
            fromZero={true} 
            showBarTops={false} 
            flatColor={true}
            withCustomBarColorFromData={true} 
            style={{
              marginVertical: 8,
              borderRadius: 16,
              paddingRight: 20, // Reducido para el ScrollView
              paddingLeft: 10,
            }}
            yAxisSuffix=""    
            verticalLabelRotation={0}
          />
        </ScrollView>
        
        {/* Indicador de desplazamiento */}
        <View style={styles.scrollIndicator}>
          <Text style={styles.scrollIndicatorText}>← Deslizar →</Text>
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
    padding: 20, // Aumentar el padding general
    marginBottom: 20, // Aumentar el margen inferior
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    fontFamily: 'Arial',
    overflow: 'hidden' // Asegurar que el contenido no se salga
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
  scrollIndicator: {
    alignItems: 'center',
    marginTop: 8,
  },
  scrollIndicatorText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    fontFamily: 'Arial'
  }
});

export default DashboardScreen;