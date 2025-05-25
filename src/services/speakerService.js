const API_BASE_URL = "https://confhub-backend-production.up.railway.app/api/speakers";
import { getData, storeData } from "../storage/localStorage";

/*
 * Loguea un speaker
 * @param {Object} speaker correo y contraseña.
 * @returns {Promise<boolean>} .
 */

export async function loginSpeaker(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Error al iniciar sesión");
    }

    const data = await response.json();
    if (data.token) {
      await storeData("token", data.token);
      await storeData("email", email);
    }

    return true;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}

/*
 * Registra un speaker
 * @param {Object} datos del speaker.
 * @returns {Promise<boolean>} un booleano verdaro si lo creó, falso si no.
 */

export async function makeSpeaker(speaker) {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      body: speaker,
    });

    if (!response.ok) {
      throw new Error("Error al iniciar sesión");
    } else {
      return true;
    }
  } catch (error) {
    console.error("Error al registrarse:", error);
    return false;
  }
}

/*
 * Elimina un speaker
 * @param {string} correo del speaker.
 * @returns {Promise<boolean>} un booleano verdaro si lo eliminó, falso si no.
 */

export async function deleteSpeaker(email) {
  try {
    const response = await fetch(`${API_BASE_URL}/${email}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${await getData("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar un speaker");
    }
    return true;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}

/*
 * Edita un speaker
 * @param {string} correo del speaker.
 * @returns {Promise<boolean>} un booleano verdaro si lo editó, falso si no.
 */

export async function updateSpeaker(email, speaker) {
  try {
    const response = await fetch(`${API_BASE_URL}/${email}`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${await getData("token")}`,
      },
      body: speaker
    });

    if (!response.ok) {
      throw new Error("Error al actualizar speaker");
    }
    return true;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}

/*
 * obten un speaker
 * @param {string} email del speaker.
 * @returns {Promise<Object>} datos del speaker.
 */

export async function getSpeaker(email) {
   try {
    const response = await fetch(`${API_BASE_URL}/${email}`, {
      headers: {
        authorization: `Bearer ${await getData("token")}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error("Error al obtener el speaker");
    }
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}