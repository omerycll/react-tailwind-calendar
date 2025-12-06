/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Information colors
        'information-lighter': '#E3F2FD',
        'information-base': '#2196F3',
        
        // Warning colors
        'warning-lighter': '#FFF3E0',
        'warning-base': '#FF9800',
        
        // Success colors
        'success-lighter': '#E8F5E9',
        'success-base': '#4CAF50',
        
        // Error colors
        'error-lighter': '#FFEBEE',
        'error-base': '#F44336',
        
        // Away colors
        'away-lighter': '#F3E5F5',
        
        // Background colors
        'bg-white-0': '#FFFFFF',
        'bg-weak-50': '#F5F5F5',
        
        // Text colors
        'text-strong-950': '#212121',
        'text-sub-600': '#757575',
        'text-soft-400': '#BDBDBD',
        
        // Stroke colors
        'stroke-white-0': '#FFFFFF',
        'stroke-soft-200': '#EEEEEE',
      },
    },
  },
  plugins: [],
}

