import { db } from './db';

/**
 * Hero.co.nz SMS API Configuration
 */
const HERO_USERNAME = "hkawharu@gmail.com"; 
const HERO_PASSWORD = "Brigid2107";     
const HERO_API_ENDPOINT = "https://hero.co.nz/sms.php"; 

export const smsService = {
  sendInvite: async (phoneNumber: string): Promise<{ success: boolean; message: string; link?: string; debugInfo?: string }> => {
    const logId = Math.random().toString(36).substring(7).toUpperCase();
    console.group(`[SMS-GATEWAY-LOG-${logId}] Dispatching to ${phoneNumber}`);
    
    // 1. Generate unique access code
    const accessCode = db.createCode(phoneNumber);
    
    // 2. ROBUST URL GENERATION
    const url = new URL(window.location.href);
    let path = url.pathname;
    if (path.includes('.')) {
      path = path.substring(0, path.lastIndexOf('/'));
    }
    const cleanBase = `${url.origin}${path.replace(/\/$/, '')}`;
    const reviewLink = `${cleanBase}/#/review/${accessCode.code}`;

    // 3. SMS Body Text (keeping it under 160 chars)
    const messageBody = `Please review your pharmacy delivery here: ${reviewLink}`;

    // 4. Sanitize destination
    const cleanDestination = phoneNumber.replace(/[^0-9]/g, '');

    const params = new URLSearchParams();
    params.append('username', HERO_USERNAME);
    params.append('password', HERO_PASSWORD);
    params.append('destination', cleanDestination);
    params.append('message', messageBody);

    console.log(`[PRE-FLIGHT] Payload:`, {
      destination: cleanDestination,
      messageLength: messageBody.length,
      link: reviewLink
    });

    let statusMessage = "";
    let isSuccess = false;
    let failureReason = "";

    try {
      console.log(`[ATTEMPT 1] Sending POST request to ${HERO_API_ENDPOINT}...`);
      
      /**
       * NOTE: Using 'no-cors' mode because the Hero API endpoint typically 
       * does not provide CORS headers. This results in an 'opaque' response.
       */
      const response = await fetch(HERO_API_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      });

      // With no-cors, we can't check response.ok or response.status.
      // If it didn't throw a network error, the browser handed it off to the gateway.
      console.log(`[SUCCESS] POST request handed off to browser network stack.`);
      isSuccess = true;
      statusMessage = "Request accepted by browser (Opaque Response)";

    } catch (error: any) {
      failureReason = error?.message || "Unknown Network Error";
      console.error(`[FAILURE] POST attempt failed: ${failureReason}`);
      
      console.log(`[ATTEMPT 2] Retrying via GET fallback...`);
      try {
        const getUrl = `${HERO_API_ENDPOINT}?${params.toString()}`;
        await fetch(getUrl, { 
          method: 'GET', 
          mode: 'no-cors' 
        });
        
        console.log(`[SUCCESS] GET fallback successful.`);
        isSuccess = true;
        statusMessage = "Fallback GET accepted by browser";
      } catch (fallbackError: any) {
        failureReason = `Primary: ${failureReason} | Fallback: ${fallbackError?.message || 'Unknown'}`;
        console.error(`[CRITICAL] All transport methods failed: ${failureReason}`);
        
        // Specific checks for common browser-level failures
        if (failureReason.toLowerCase().includes('failed to fetch')) {
          failureReason = "Network Error: Possible AdBlocker interference or lack of internet connection.";
        } else if (failureReason.toLowerCase().includes('cors')) {
          failureReason = "CORS Error: The server rejected the cross-origin request.";
        }
        
        isSuccess = false;
        statusMessage = `Failed: ${failureReason}`;
      }
    }

    console.groupEnd();

    return { 
      success: isSuccess, 
      message: statusMessage,
      link: reviewLink,
      debugInfo: `Log ID: ${logId} | ${statusMessage}`
    };
  }
};