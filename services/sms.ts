import { db } from './db';

/**
 * Hero.co.nz (2talk) SMS API Configuration
 */
const HERO_USER = "hkawharu@gmail.com"; 
const HERO_PASS = "Brigid2107";     
const HERO_API_ENDPOINT = "https://hero.co.nz/sms.php"; 

export const smsService = {
  /**
   * Normalizes New Zealand phone numbers to international format (64...)
   */
  formatNZNumber: (phone: string): string => {
    let clean = phone.replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) {
      clean = '64' + clean.substring(1);
    }
    return clean;
  },

  sendInvite: async (phoneNumber: string): Promise<{ success: boolean; message: string; link?: string; debugInfo?: string }> => {
    const logId = Math.random().toString(36).substring(7).toUpperCase();
    const normalizedPhone = smsService.formatNZNumber(phoneNumber);
    
    // 1. Generate unique access code
    const accessCode = db.createCode(phoneNumber);
    
    // 2. Resolve absolute path for the review link
    const { origin, pathname } = window.location;
    let basePath = pathname;
    if (pathname.split('/').pop()?.includes('.')) {
      basePath = pathname.substring(0, pathname.lastIndexOf('/') + 1);
    }
    const absoluteBasePath = new URL(basePath, origin).href;
    const reviewLink = `${absoluteBasePath}#/review/${accessCode.code}`;

    // 3. Prepare SMS content
    const messageBody = `Please review your pharmacy delivery here: ${reviewLink}`;

    // 4. Construct parameters using standard Hero/2talk keys: user, pass, to, text
    const params = new URLSearchParams();
    params.append('user', HERO_USER);
    params.append('pass', HERO_PASS);
    params.append('to', normalizedPhone);
    params.append('text', messageBody);

    console.group(`[SMS-DISPATCH-${logId}]`);
    console.log(`Target: ${normalizedPhone}`);
    console.log(`Payload:`, messageBody);

    try {
      /**
       * The 'no-cors' mode has been removed to allow reading the API response.
       * This requires the hero.co.nz API to support CORS. If it doesn't, this
       * request may fail due to browser security policies.
       */
      const url = `${HERO_API_ENDPOINT}?${params.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        cache: 'no-cache'
      });

      if (!response.ok) {
        throw new Error(`API request failed with HTTP status ${response.status}`);
      }
      
      const responseText = await response.text();
      const resultCode = parseInt(responseText.trim(), 10);

      console.log(`[SUCCESS] API Response Code: ${resultCode}`);
      console.groupEnd();
      
      switch (resultCode) {
        case 0:
          return {
            success: true,
            message: "SMS successfully dispatched to the recipient.",
            link: reviewLink,
            debugInfo: `Log ID: ${logId} | Dest: ${normalizedPhone}`
          };
        case 2:
          return {
            success: false,
            message: "SMS failed: Authentication error. Please check API credentials.",
            link: reviewLink
          };
        case 3:
          return {
            success: false,
            message: "SMS failed: Invalid destination number. Please check the phone number format.",
            link: reviewLink
          };
        case 4:
          return {
            success: false,
            message: "SMS failed: Invalid message content. The text may be malformed.",
            link: reviewLink
          };
        default:
          return {
            success: false,
            message: `SMS failed: Unknown API response code (${resultCode}). Check the gateway portal.`,
            link: reviewLink
          };
      }

    } catch (error: any) {
      console.error(`[CRITICAL] Transport failure:`, error);
      console.groupEnd();

      // Provide a more specific message if the error looks like a CORS issue.
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        return { 
          success: false, 
          message: 'Network error: Could not connect to the SMS gateway. This may be a network issue or a CORS policy violation by the API.',
          link: reviewLink
        };
      }
      
      return { 
        success: false, 
        message: `System error: ${error?.message || 'Check your internet connection.'}`,
        link: reviewLink
      };
    }
  }
};