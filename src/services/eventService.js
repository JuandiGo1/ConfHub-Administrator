const API_BASE_URL = "http://localhost:3000/api/events";

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
 * Crea un nuevo evento.
 * @param {Object} event Datos del evento.
 * @returns {Promise<Object>} Evento creado.
 */
export async function createEvent(event) {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
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