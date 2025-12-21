import { db } from './db';
import { apiGateway } from './apiGateway';

// Default message template if not configured by the admin.
const DEFAULT_SMS_TEMPLATE = 'Please review your pharmacy delivery here: {{reviewLink}}';

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
    const timestamp = new Date().toISOString();
    
    console.groupCollapsed(`[SMS Dispatch] Log ID: ${logId} | Timestamp: ${timestamp}`);
    console.log(`1. Initiating invite for raw number: "${phoneNumber}"`);

    const normalizedPhone = smsService.formatNZNumber(phoneNumber);
    console.log(`2. Normalized number to: ${normalizedPhone}`);
    
    // 1. Generate unique access code
    const accessCode = db.createCode(phoneNumber);
    console.log(`3. Generated unique access code: ${accessCode.code}`);
    
    // 2. Construct a robust absolute review link.
    // FIX: Use location.origin + location.pathname to avoid 'blob:' URLs in sandboxed environments.
    const baseUrl = (window.location.origin + window.location.pathname).replace(/\/$/, '');
    const reviewLink = `${baseUrl}#/review/${accessCode.code}`;
    console.log(`4. Constructed review link: ${reviewLink}`);

    // 3. Prepare SMS content using a configurable template
    const customTemplate = localStorage.getItem('SMS_TEMPLATE');
    const template = customTemplate || DEFAULT_SMS_TEMPLATE;
    const messageBody = template.replace('{{reviewLink}}', reviewLink);
    console.log(`5. Prepared SMS body from template: "${messageBody}"`);

    // 4. Use the API Gateway to dispatch the SMS
    console.log("6. Sending request to API gateway...");
    const result = await apiGateway.dispatchSms(normalizedPhone, messageBody);

    if (result.success) {
      console.info(`[SUCCESS] Gateway accepted request. Due to API CORS policy, delivery confirmation is unavailable.`);
      console.log("Dispatch complete.");
      console.groupEnd();
      return {
        success: true,
        message: "SMS request dispatched. Delivery confirmation is not available from the browser.",
        link: reviewLink,
        debugInfo: `Log ID: ${logId} | Dest: ${normalizedPhone}`
      };
    } else {
      console.error(`[FAILURE] SMS dispatch failed. The API gateway or network returned an error.`);
      console.error(`Error Details:`, result.error || 'No error details available.');
      console.log("Dispatch failed.");
      console.groupEnd();
      return { 
        success: false, 
        message: `System error: Could not dispatch SMS request. Details: ${result.error}`,
        link: reviewLink
      };
    }
  }
};