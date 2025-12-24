
export enum ReviewStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED'
}

export enum DeliveryStatus {
  QUEUED = 'QUEUED',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED'
}

export interface ProductRating {
  quality: number;
  effects: number;
  taste: number;
  weight: number;
}

export interface DeliveryRating {
  speed: number;
  communication: number;
  overall: number;
}

export interface Review {
  id: string;
  code: string;
  timestamp: string; // ISO string
  productRating: ProductRating;
  deliveryRating: DeliveryRating;
  comment?: string;
}

export interface AccessCode {
  code: string;
  phoneNumber: string;
  status: ReviewStatus;
  deliveryStatus: DeliveryStatus;
  providerMessageId?: string;
  createdAt: string;
  lastCheckedAt?: string;
}

export interface AggregatedMetrics {
  totalReviews: number;
  averageProduct: ProductRating;
  averageDelivery: DeliveryRating;
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}