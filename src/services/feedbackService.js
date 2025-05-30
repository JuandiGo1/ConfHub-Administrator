const API_BASE_URL = "https://confhub-backend-production.up.railway.app";

/**
 * Gets all feedbacks for a specific event
 * @param {number} eventId - The ID of the event
 * @returns {Promise<Array>} List of feedbacks
 */
export async function getFeedbacksForEvent(eventId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/feedbacks/event/${eventId}`);
    
    if (!response.ok) {
      // Handle 444 status (no feedbacks) differently
      if (response.status === 444) {
        return []; // Return empty array when no feedbacks exist
      }
      
      const errorData = await response.json();
      console.error("Error getting feedbacks:", errorData);
      throw new Error(errorData.error || "Error getting feedbacks");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Network error:", error);
    throw error;
  }
}