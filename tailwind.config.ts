import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: [
  				'var(--font-outfit)',
  				'system-ui',
  				'sans-serif'
  			]
  		},
		colors: {
			// Design System Colors (using CSS variables)
			'ds-primary': 'var(--color-primary)',
			'ds-primary-light': 'var(--color-primary-light)',
			'ds-primary-dark': 'var(--color-primary-dark)',
			'ds-success': 'var(--color-success)',
			'ds-success-light': 'var(--color-success-light)',
			'ds-success-dark': 'var(--color-success-dark)',
			'ds-text-primary': 'var(--text-primary)',
			'ds-text-secondary': 'var(--text-secondary)',
			'ds-text-muted': 'var(--text-muted)',
			'ds-bg-dark': 'var(--bg-dark)',
			'ds-bg-light': 'var(--bg-light)',
			brand: {
				// Rose palette - warmer, more premium
				'50': '#fff1f2',
				'100': '#ffe4e6',
				'200': '#fecdd3',
				'300': '#fda4af',
				'400': '#fb7185',
				'500': '#F03C4E', // Updated to match --color-primary
				'600': '#D62839', // Updated to match --color-primary-dark
				'700': '#be123c',
				'800': '#9f1239',
				'900': '#881337',
				'950': '#4c0519'
			},
			product: {
				'50': '#f5f3ff',
				'100': '#ede9fe',
				'200': '#ddd6fe',
				'300': '#c4b5fd',
				'400': '#a78bfa',
				'500': '#8b5cf6',
				'600': '#7c3aed',
				'700': '#6d28d9',
				'800': '#5b21b6',
				'900': '#4c1d95',
				'950': '#2e1065',
				from: '#7c3aed',
				to: '#db2777'
			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  		},
  		animation: {
  			'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
  			'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  			'bounce-slow': 'bounce 3s infinite'
  		},
  		keyframes: {
  			fadeInUp: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(20px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			}
  		},
		backgroundImage: {
			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
			'hero-pattern': 'radial-gradient(#F03C4E 0.5px, transparent 0.5px), radial-gradient(#F03C4E 0.5px, #fff1f2 0.5px)',
			'gradient-hero': 'var(--gradient-hero)',
			'gradient-cta': 'var(--gradient-cta)',
			'gradient-brand': 'var(--gradient-brand)'
		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
