// eslint-disable-next-line no-restricted-imports
import {
    defineConfig,
    presetAttributify,
    presetIcons,
    presetUno
} from 'unocss'

export default defineConfig({
    rules: [
        ['custom-rule', { color: 'red' }],
        ['/^(?:color|c)-(.+)$/', /^(?:color|c)-(.+)$/]
    ],
    shortcuts: {
        'custom-shortcut': 'text-lg text-orange hover:text-teal',
    },
    theme: {
        breakpoints: {
            xs: '0',
            sm: '576px',
            md: '768px',
            lg: '992px',
            xl: '1200px',
            xxl: '1400px',

        },
        color: {
            Neu: {
                1: "#CECBCB",
                2: "#A7A4A3",
                3: "#878382",
                4: "#6A6666",
                5: "#514E4D",
                6: "#3A3838",
                7: "#262626",
            }
        }
    },
    presets: [
        presetUno(),
        presetAttributify(),
        presetIcons({
            scale: 1.2,
            cdn: 'https://esm.sh/',
        }),
    ],
})
