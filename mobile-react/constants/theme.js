export const COLORS = {
  // Primary: Vibrant Sunset/Rose
  primary: '#f43f5e',
  primaryLight: '#fb7185',
  primaryDark: '#be123c',

  // Secondary: Deep Indigo/Slate for contrast
  secondary: '#6366f1',
  secondaryLight: '#818cf8',

  // Neutral: Clean & Premium
  background: '#f8fafc',
  surface: '#ffffff',
  overlay: 'rgba(255, 255, 255, 0.8)', // For glassmorphism

  // Text
  text: '#0f172a',
  textLight: '#64748b',
  textWhite: '#ffffff',

  // Functional
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  border: '#e2e8f0',

  // Gradients (Simulated with array for manual use or matching CSS)
  gradientPrimary: ['#f43f5e', '#fb7185'],
  gradientDark: ['#0f172a', '#1e293b'],
};

export const SHADOWS = {
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  vibrant: {
    shadowColor: '#f43f5e',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  }
};

export const SIZES = {
  radiusL: 16,
  radiusXL: 24,
  radiusXXL: 32,
  padding: 20,
  margin: 20,
};

export const API_CONFIG = {
  baseUrl: 'http://192.168.1.137:8000/api',
};
