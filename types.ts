export enum ReviewStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED'
}

export interface ProductRating {
  quality: number;
  effects: number;
  taste: number;
  appearance: number;
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
  createdAt: string;
}

export interface AggregatedMetrics {
  totalReviews: number;
  averageProduct: ProductRating;
  averageDelivery: DeliveryRating;
}