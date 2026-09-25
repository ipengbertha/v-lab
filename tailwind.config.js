import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['"Bricolage Grotesque"', ...defaultTheme.fontFamily.sans],
                display: ['"Special Gothic Expanded One"', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                'vlab-ink': '#023436',
                'vlab-primary': '#023436',
                'vlab-accent': '#F76F8E',
                'vlab-soft': '#A3D9BA',
                'vlab-bg': '#F3FBF6',
            },
        },
    },

    plugins: [forms],
};
