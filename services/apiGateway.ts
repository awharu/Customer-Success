/**
 * API Gateway Simulation
 *
 * This module simulates a backend API gateway. In a real-world application,
 * this logic would live on a secure server to protect credentials and handle
 * third-party API interactions.
 *
 * Credentials for the SMS service are loaded from localStorage, configurable
 * via the admin dashboard.
 */

const HERO_API_ENDPOINT = "https://hero.co.nz/sms.php";

/**
 * Retrieves SMS credentials from localStorage.
 * @returns An object containing the username and password, or null if not found.
 */
const getSmsCredentials = (): { username: string | null; password: string | null } => {
  try {
    const username = localStorage.getItem('HERO_USERNAME');
    const password = localStorage.getItem('HERO_PASSWORD');
    return { username, password };
  } catch (error) {
    console.error("Could not access localStorage:", error);
    return { username: null, password: null };
  }
};


export const apiGateway = {
  dispatchSms: async (destination: string, message: string): Promise<{ success: boolean; error?: string }> => {
    const { username: HERO_USERNAME, password: HERO_PASSWORD } = getSmsCredentials();
    
    // Critical check to ensure credentials are provided in the environment.
    if (!HERO_USERNAME || !HERO_PASSWORD) {
      const errorMessage = "SMS gateway credentials are not configured. Please set them in the Admin > Settings panel.";
      console.error("[API_GATEWAY] Configuration Error:", errorMessage);
      return { success: false, error: errorMessage };
    }

    const params = new URLSearchParams();
    params.append('username', HERO_USERNAME);
    params.append('password', HERO_PASSWORD);
    params.append('destination', destination);
    params.append('message', message);

    try {
      /**
       * The API documentation supports POST. Using POST is more secure than GET
       * as parameters are not stored in browser history or server logs.
       *
       * Using 'no-cors' mode is a workaround because the hero.co.nz API does not
       * send the necessary CORS headers for browser-based requests. This means
       * the browser will send the request but will not allow the client-side
       * code to read the response body, making it impossible to confirm success
       * from the API. We can only confirm that the request was dispatched.
       */
      await fetch(HERO_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
        mode: 'no-cors',
      });
      return { success: true };
    } catch (error: any) {
      console.error("[API_GATEWAY] SMS Transport failure:", error);
      return { success: false, error: error.message };
    }
  },
};