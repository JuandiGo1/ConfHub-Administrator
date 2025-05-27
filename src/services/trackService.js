import { getData } from "../storage/localStorage";

const API_BASE_URL = "https://confhub-backend-production.up.railway.app/api/tracks";

/**
 * Obtiene todos los tracks y sus eventos asociados.
 * @returns {Promise<Array>} Lista de tracks.
 */
export async function getTracks() {
  try {
    const response = await fetch(API_BASE_URL);
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

/**
 * Crea un nuevo track.
 * @param {Object} track Datos del track.
 * @returns {Promise<boolean>} true si es creado, false si no.
 */
export async function makeTrack(track) {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "authorization":  `Bearer ${ await getData("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(track),
    });
    if (!response.ok) {
      throw new Error("Error al crear el track");
    } else {
      return true;
    }

  } catch (error) {
    console.error(error);
    return false;
  }
}

/**
 * Elimina un track
 * @param {string} name del track.
 * @returns {Promise<boolean>} un booleano verdaro si lo eliminó, falso si no.
 */

export async function deleteTrack(name) {
  try {
    const response = await fetch(`${API_BASE_URL}/${name}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${await getData("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el track");
    }
    return true;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}

/**
 * Edita un track.
 * @param {string} name del track.
 * @param {Object} track datos del track.
 * @returns {Promise<boolean>} un booleano verdaro si lo editó, falso si no.
 */
export async function updateTrack(name, track) {
  try {
    const response = await fetch(`${API_BASE_URL}/${name}`, {
      method: "PATCH",
      headers: {
        "authorization":  `Bearer ${ await getData("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(track),
    });
    if (!response.ok) {
      throw new Error("Error al crear el track");
    } else {
      return true;
    }

  } catch (error) {
    console.error(error);
    return false;
  }
}