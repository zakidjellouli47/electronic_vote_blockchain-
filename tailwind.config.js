/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
		'./pages/**/*.{js,jsx}',
		'./components/**/*.{js,jsx}',
		'./app/**/*.{js,jsx}',
		'./src/**/*.{js,jsx}',
	],
	prefix: "",
	theme: {
    	screens: {
    		sm: '200px',
    		md: '768px',
    		lg: '1024px',
    		xl: '1280px',
    		'2xl': '1536px',
    		'2xs': '480px',
    		'3xl': '1600px'
    	},
    	container: {
    		center: 'true',
    		padding: '2rem',
    		screens: {
    			'2xl': '1400px'
    		}
    	},
    	extend: {
    		colors: {
    			border: 'rgb(var(--border) / <alpha-value>)',
    			bars: 'rgb(var(--bars) / <alpha-value>)',
    			input: 'rgb(var(--input) / <alpha-value>)',
    			ring: 'rgb(var(--ring))',
    			background: 'rgb(var(--background) / <alpha-value>)',
    			foreground: 'rgb(var(--foreground) / <alpha-value>)',
    			neutral: 'rgb(var(--neutral) / <alpha-value>)',
    			primary: {
    				DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
    				foreground: 'rgb(var(--primary-foreground) / <alpha-value>)'
    			},
    			secondary: {
    				DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
    				foreground: 'rgb(var(--secondary-foreground) / <alpha-value>)'
    			},
    			destructive: {
    				DEFAULT: 'rgb(var(--destructive) / <alpha-value>)',
    				foreground: 'rgb(var(--destructive-foreground) / <alpha-value>)'
    			},
    			muted: {
    				DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
    				foreground: 'rgb(var(--muted-foreground) / <alpha-value>)'
    			},
    			accent: {
    				DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
    				foreground: 'rgb(var(--accent-foreground) / <alpha-value>)'
    			},
    			popover: {
    				DEFAULT: 'rgb(var(--popover) / <alpha-value>)',
    				foreground: 'rgb(var(--popover-foreground) / <alpha-value>)'
    			},
    			card: {
    				DEFAULT: 'rgb(var(--card) / <alpha-value>)',
    				foreground: 'rgb(var(--card-foreground) / <alpha-value>)'
    			},
    			loginCard: {
    				DEFAULT: 'rgb(var(--loginCard) / <alpha-value>)',
    				foreground: 'rgb(var(--card-foreground) / <alpha-value>)'
    			},
    			sidebar: {
    				DEFAULT: 'hsl(var(--sidebar-background))',
    				foreground: 'hsl(var(--sidebar-foreground))',
    				primary: 'hsl(var(--sidebar-primary))',
    				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
    				accent: 'hsl(var(--sidebar-accent))',
    				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
    				border: 'hsl(var(--sidebar-border))',
    				ring: 'hsl(var(--sidebar-ring))'
    			}
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		fontFamily: {
    			abode: ['JK Abode', 'sans']
    		},
    		keyframes: {
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out'
    		}
    	}
    },
	plugins: [
		require('tailwindcss-rtl'),
		require("tailwindcss-animate"),
		function ({ addVariant }) {
			addVariant('child', '& > *');
			addVariant('child-hover', '& > *:hover');
		}
	],
}