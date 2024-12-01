/** @type {import('tailwindcss').Config} */
module.exports = {
    mode: 'jit',
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./shared/**/*.{js,ts,jsx,tsx,mdx}",
        "./lib/**/*.{js,ts,jsx,tsx,mdx}",
        // Or if using `src` directory:
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/flowbite-react/**/*.js",
    ],
    theme: {
        extend: {
            colors: {
                "dark-purple": "#081A51",
                'light-white': 'rgb(255,255,255,0.8)',
                'turquoise': {
                    100: '#00524e66',
                    200: '#00524e87',
                    300: '#00524ea3',
                    400: '#00524ed1',
                    500: '#00524e'
                },
                'lemonyellow': '#9e9a3b'
            },
        },
    },
    plugins: [
        require("flowbite/plugin")
    ],
}