/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./script.js"],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#e6f3ff',
                    100: '#cce7ff',
                    200: '#99cfff',
                    300: '#66b7ff',
                    400: '#339fff',
                    500: '#1e90ff',
                    600: '#0073e6',
                    700: '#0056b3',
                    800: '#003d80',
                    900: '#00244d',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            }
        }
    },
    plugins: [],
}
