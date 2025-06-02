import { getData } from "../storage/localStorage";

const API_BASE_URL = "https://confhub-backend-production.up.railway.app/api/events";


/**
 * Obtiene todos los eventos.
 * @returns {Promise<Array>} Lista de eventos.
 */
export async function getEvents() {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      console.error("Error al obtener los eventos");
      throw new Error("Error al obtener los eventos");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
/**
 * Obtiene todos los eventos por id.
 *@param {string} eventid del evento
 * @returns {Promise<Array>} Lista de eventos.
 */
export async function getEventsById(eventId) {
  try {
    const response = await fetch(`${API_BASE_URL}/${eventId}`);
    if (!response.ok) {
      console.error("Error al obtener el evento");
      throw new Error("Error al obtener el evento");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
/**
 * Filtra los eventos dependiendo de un query
 * @param {string}
 * @returns {Promise<Array>} Lista de eventos.
 */
export async function searchEvents(query) {
  const events = await getEvents();

  return events.filter((event) => {
    return (
      event.name === query ||
      event.description.includes(query) ||
      event.tags.includes(query) ||
      event.category.includes(query)
    );
  });
}

/**
 * Crea un nuevo evento.
 * @param {Object} event Datos del evento.
 * @returns {Promise<Object>} Evento creado.
 */
export async function createEvent(event) {
  const token = await getData("token");
  console.log("Token:", token); // Debugging line to check token value
  console.log("Event data:", event); // Debugging line to check event data
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "authorization": token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });
    if (!response.ok) {
      throw new Error("Error al crear el evento");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * Elimina un evento por su ID.
 * @param {string} eventId ID del evento a eliminar.
 * @returns {Promise<void>}
 */
export async function deleteEvent(eventId) {
  try {
    const response = await fetch(`${API_BASE_URL}/${eventId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Error al eliminar el evento");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * Actualiza un evento existente.
 * @param {string} eventId
 * @param {Object} eventData
 * @returns {Promise<Object>}
 */
export async function updateEvent(eventId, eventData) {
  const token = await getData("token");
  try {
    const response = await fetch(`${API_BASE_URL}/${eventId}`, {
      method: "PATCH",
      headers: {
        "Authorization": token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al actualizar el evento");
    }

    return await data
  } catch (error) {
    console.error("Error en updateEvent:", error);
    throw error;
  }
}

