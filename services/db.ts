import { AccessCode, Review, ReviewStatus, AggregatedMetrics } from '../types';

const STORAGE_KEYS = {
  CODES: 'pharma_codes',
  REVIEWS: 'pharma_reviews',
};

// Helper to generate a random 6-character code
const generateUniqueId = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const db = {
  // Codes
  createCode: (phoneNumber: string): AccessCode => {
    const codes = db.getCodes();
    const newCode: AccessCode = {
      code: generateUniqueId(),
      phoneNumber,
      status: ReviewStatus.PENDING,
      createdAt: new Date().toISOString(),
    };
    codes.push(newCode);
    localStorage.setItem(STORAGE_KEYS.CODES, JSON.stringify(codes));
    return newCode;
  },

  getCodes: (): AccessCode[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CODES);
    return data ? JSON.parse(data) : [];
  },

  deleteCode: (code: string) => {
    const codes = db.getCodes();
    const filtered = codes.filter(c => c.code !== code);
    localStorage.setItem(STORAGE_KEYS.CODES, JSON.stringify(filtered));
  },

  validateCode: (code: string): { valid: boolean; used: boolean } => {
    const codes = db.getCodes();
    const found = codes.find((c) => c.code === code);
    if (!found) return { valid: false, used: false };
    return { valid: true, used: found.status === ReviewStatus.COMPLETED };
  },

  markCodeUsed: (code: string) => {
    const codes = db.getCodes();
    const index = codes.findIndex((c) => c.code === code);
    if (index !== -1) {
      codes[index].status = ReviewStatus.COMPLETED;
      localStorage.setItem(STORAGE_KEYS.CODES, JSON.stringify(codes));
    }
  },

  // Reviews
  addReview: (review: Omit<Review, 'id' | 'timestamp'>) => {
    const reviews = db.getReviews();
    const newReview: Review = {
      ...review,
      id: generateUniqueId(),
      timestamp: new Date().toISOString(),
    };
    reviews.push(newReview);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    db.markCodeUsed(review.code);
    return newReview;
  },

  getReviews: (): Review[] => {
    const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return data ? JSON.parse(data) : [];
  },

  // Metrics
  getMetrics: (): AggregatedMetrics => {
    const reviews = db.getReviews();
    const total = reviews.length;

    if (total === 0) {
      return {
        totalReviews: 0,
        averageProduct: { quality: 0, effects: 0, taste: 0, appearance: 0 },
        averageDelivery: { speed: 0, communication: 0, overall: 0 },
      };
    }

    const sumProduct = reviews.reduce(
      (acc, r) => ({
        quality: acc.quality + r.productRating.quality,
        effects: acc.effects + r.productRating.effects,
        taste: acc.taste + r.productRating.taste,
        appearance: acc.appearance + r.productRating.appearance,
      }),
      { quality: 0, effects: 0, taste: 0, appearance: 0 }
    );

    const sumDelivery = reviews.reduce(
      (acc, r) => ({
        speed: acc.speed + r.deliveryRating.speed,
        communication: acc.communication + r.deliveryRating.communication,
        overall: acc.overall + r.deliveryRating.overall,
      }),
      { speed: 0, communication: 0, overall: 0 }
    );

    return {
      totalReviews: total,
      averageProduct: {
        quality: Number((sumProduct.quality / total).toFixed(1)),
        effects: Number((sumProduct.effects / total).toFixed(1)),
        taste: Number((sumProduct.taste / total).toFixed(1)),
        appearance: Number((sumProduct.appearance / total).toFixed(1)),
      },
      averageDelivery: {
        speed: Number((sumDelivery.speed / total).toFixed(1)),
        communication: Number((sumDelivery.communication / total).toFixed(1)),
        overall: Number((sumDelivery.overall / total).toFixed(1)),
      },
    };
  },
  
  // Reset for Demo
  reset: () => {
    localStorage.removeItem(STORAGE_KEYS.CODES);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
  }
};