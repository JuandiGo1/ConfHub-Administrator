const API_BASE_URL = "https://confhub-backend-production.up.railway.app";

/**
 * Obtiene todos los tracks y sus eventos asociados.
 * @returns {Promise<Array>} Lista de tracks.
 */
export async function getTracks() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tracks`);
    if (!response.ok) {
      console.error("Error al obtener los tracks");
      throw new Error("Error al obtener los tracks");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
