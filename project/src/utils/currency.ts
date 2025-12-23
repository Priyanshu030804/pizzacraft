// Currency utilities for Indian market
export const formatCurrency = (amount: number): string => {
  return `₹${amount.toFixed(2)}`;
};

// Convert USD prices to INR (approximate conversion for demo)
// In production, you'd use real-time exchange rates
export const convertToINR = (usdAmount: number): number => {
  const USD_TO_INR_RATE = 83; // Approximate rate
  return usdAmount * USD_TO_INR_RATE;
};

// Format currency with Indian number system
export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

// For displaying large numbers in Indian style (lakhs, crores)
export const formatIndianNumber = (num: number): string => {
  if (num >= 10000000) {
    return `${(num / 10000000).toFixed(1)} Cr`;
  } else if (num >= 100000) {
    return `${(num / 100000).toFixed(1)} L`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};
