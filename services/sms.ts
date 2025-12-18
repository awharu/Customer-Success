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
       * Using GET as the primary method for 'no-cors' requests. 
       * GET is the most robust fire-and-forget method for browser-based dispatch.
       */
      const url = `${HERO_API_ENDPOINT}?${params.toString()}`;
      
      await fetch(url, {
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-cache'
      });

      console.log(`[SUCCESS] Request accepted by browser network stack.`);
      console.groupEnd();

      return { 
        success: true, 
        message: "SMS handed off to gateway. Note: Browser security limits direct delivery confirmation; check the Hero portal for real-time logs.",
        link: reviewLink,
        debugInfo: `Log ID: ${logId} | Dest: ${normalizedPhone}`
      };

    } catch (error: any) {
      console.error(`[CRITICAL] Transport failure:`, error);
      console.groupEnd();
      
      return { 
        success: false, 
        message: `Network error: ${error?.message || 'Check your internet connection.'}`,
        link: reviewLink
      };
    }
  }
};