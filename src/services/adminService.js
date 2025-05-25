const API_BASE_URL = "https://confhub-backend-production.up.railway.app/api/admins";
import { getData, storeData } from "../storage/localStorage";

/*
 * Loguea un administrador
 * @param {Object} admin correo y contraseña.
 * @returns {Promise<boolean>} .
 */

export async function loginAdmin(email, password) {
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
 * Registra un administrador
 * @param {Object} datos del admin.
 * @returns {Promise<boolean>} un booleano verdaro si lo creo falso si no.
 */

export async function makeAdmin(admin) {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${await getData("token")}`,
      },
      body: admin
    });

    if (!response.ok) {
      throw new Error("Error al registrarse");
    }
    return true;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}

/*
 * Elimina un administrador
 * @param {string} correo del admin.
 * @returns {Promise<boolean>} un booleano verdaro si lo creo falso si no.
 */

export async function deleteAdmin(email) {
  try {
    const response = await fetch(`${API_BASE_URL}/${email}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${await getData("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar administrador");
    }
    return true;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}

/*
 * Edita un administrador
 * @param {string} correo del admin.
 * @returns {Promise<boolean>} un booleano verdaro si lo creo falso si no.
 */

export async function updateAdmin(email, admin) {
  try {
    const response = await fetch(`${API_BASE_URL}/${email}`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${await getData("token")}`,
      },
      body: admin
    });

    if (!response.ok) {
      throw new Error("Error al actualizar administrador");
    }
    return true;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}

/*
 * obten un administrador
 * @param {string} email del admin.
 * @returns {Promise<Object>} datos del admin.
 */


export async function getAdmin(email) {
   try {
    const response = await fetch(`${API_BASE_URL}/${email}`, {
      headers: {
        authorization: `Bearer ${await getData("token")}`,
      },
    });

    const data = await response.json();


    if (!response.ok) {
      throw new Error("Error al obtener el administrador");
    }
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}