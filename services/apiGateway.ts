/**
 * API Gateway Simulation
 */
const HERO_API_ENDPOINT = "https://hero.co.nz/sms.php";

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
  dispatchSms: async (destination: string, message: string): Promise<{ success: boolean; msgId?: string; error?: string }> => {
    const { username: HERO_USERNAME, password: HERO_PASSWORD } = getSmsCredentials();
    
    if (!HERO_USERNAME || !HERO_PASSWORD) {
      return { success: false, error: "SMS gateway credentials not configured." };
    }

    const params = new URLSearchParams();
    params.append('username', HERO_USERNAME);
    params.append('password', HERO_PASSWORD);
    params.append('destination', destination);
    params.append('message', message);

    try {
      // no-cors means we can't see the response body (and thus the real msgid)
      await fetch(HERO_API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
        mode: 'no-cors',
      });

      // Simulation: Return a mock message ID since we can't read the real one due to CORS
      const mockMsgId = 'HERO_' + Math.random().toString(36).substring(2, 10).toUpperCase();
      return { success: true, msgId: mockMsgId };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Simulates polling the HERO API for message status.
   * In a real CORS-enabled environment, this would call an endpoint like sms_status.php
   */
  checkSmsStatus: async (msgId: string): Promise<{ status: 'SENT' | 'DELIVERED' | 'FAILED' }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simulation logic: Messages transition from SENT to DELIVERED after a random time
    // For demo purposes, we base it on the ID or current time
    const seed = parseInt(msgId.replace(/\D/g, '') || '0') || Date.now();
    const isReady = (Date.now() - seed) % 10 > 3; // 70% chance to be delivered

    if (isReady) return { status: 'DELIVERED' };
    return { status: 'SENT' };
  }
};