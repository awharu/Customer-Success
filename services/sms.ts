import { db } from './db';
import { apiGateway } from './apiGateway';
import { DeliveryStatus } from '../types';

const DEFAULT_SMS_TEMPLATE = 'Please review your pharmacy delivery here: {{reviewLink}}';

export const smsService = {
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
    const accessCode = db.createCode(phoneNumber);
    
    const getBaseUrl = (): string => {
      const href = window.location.href;
      if (href.startsWith('blob:')) {
        try {
          const url = new URL(href.substring(5));
          return url.origin;
        } catch (e) {
          return 'https://' + window.location.host;
        }
      } else {
        const hashIndex = href.indexOf('#');
        return hashIndex >= 0 ? href.substring(0, hashIndex) : href;
      }
    };

    const baseUrl = getBaseUrl().replace(/\/$/, '');
    const reviewLink = `${baseUrl}/#/review/${accessCode.code}`;

    const customTemplate = localStorage.getItem('SMS_TEMPLATE');
    const template = customTemplate || DEFAULT_SMS_TEMPLATE;
    const messageBody = template.replace('{{reviewLink}}', reviewLink);

    const result = await apiGateway.dispatchSms(normalizedPhone, messageBody);

    if (result.success) {
      // Update state to SENT and store the provider's message ID
      db.updateDeliveryStatus(accessCode.code, DeliveryStatus.SENT, result.msgId);
      
      // Trigger an immediate background poll
      smsService.syncStatuses();

      return {
        success: true,
        message: "SMS dispatched. Tracking delivery status...",
        link: reviewLink,
        debugInfo: `ID: ${result.msgId}`
      };
    } else {
      db.updateDeliveryStatus(accessCode.code, DeliveryStatus.FAILED);
      return { 
        success: false, 
        message: `System error: ${result.error}`,
        link: reviewLink
      };
    }
  },

  /**
   * Synchronizes delivery statuses for all pending invites.
   */
  syncStatuses: async (): Promise<void> => {
    const codes = db.getCodes();
    const pending = codes.filter(c => c.deliveryStatus === DeliveryStatus.SENT && c.providerMessageId);

    for (const code of pending) {
      try {
        const check = await apiGateway.checkSmsStatus(code.providerMessageId!);
        if (check.status === 'DELIVERED') {
          db.updateDeliveryStatus(code.code, DeliveryStatus.DELIVERED);
        } else if (check.status === 'FAILED') {
          db.updateDeliveryStatus(code.code, DeliveryStatus.FAILED);
        }
      } catch (e) {
        console.error(`Status sync failed for ${code.code}`, e);
      }
    }
  }
};