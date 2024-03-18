// eslint-disable-next-line no-restricted-imports
import {
    defineConfig,
    presetAttributify,
    presetUno,
    presetMini,
} from 'unocss';
import presetWebFonts from '@unocss/preset-web-fonts';

export default defineConfig({
    rules: [
    ],
    shortcuts: [
        {
            'tw-container': 'max-w-1200px w-100% ma max-xl:px-30px max-sm:px-15px',
            'heading': 'font-manrope font-400',
            'body': 'font-manrope '
        }
    ],
    theme: {
        breakpoints: {
            sm: '576px',
            md: '768px',
            lg: '992px',
            xl: '1200px',
            xxl: '1400px',

        },
        /* cấu hình css chung tại đấy  */
        colors: {
            'green': {
                // 5: '#E9F5F5',
                1: '#9AC7C8',
                2: '#7DB4B8',
                3: '#417D80',
                4: '#214D4F',
                5: '#142D29',
                6: '#122925',
                7: '#0E201D',
                8: '#0B1917',
                9: '#081311'
            },

        }
    },
    presets: [
        presetUno(),
        presetAttributify(),
        presetMini(),
        presetWebFonts({
            provider: 'google',
            fonts: {
                // these will extend the default theme
                manrope: [{
                    name: 'Manrope',
                    weights: ['200', '300', '400', '500', '600', '700', '800'],
                }],
            },
        }),
    ],
})