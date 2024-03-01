// eslint-disable-next-line no-restricted-imports
import {
    defineConfig,
    presetAttributify,
    presetUno,
    presetMini
} from 'unocss'
export default defineConfig({
    rules: [
    ],
    shortcuts: {
        'tw-container': 'max-w-1208px w-100% ma max-xl:px-30px max-sm:px-15px',
        'guideline-cricket': 'w-70px h-70px rd-50% flex flex-items-center flex-justify-center cursor-pointer  transition-300 ease-in-out',
        '--G-2': 'bg-[linear-gradient(214deg,_#0A77CB_-80.97%,_#49D5DF_106.34%,_#3840EF_247.64%)]'
    },
    theme: {
        breakpoints: {
            sm: '576px',
            md: '768px',
            lg: '992px',
            xl: '1200px',
            xxl: '1400px',

        },
        colors: {
            neutral: {
                1: "#FFF",
                2: "#F3F4F7",
                3: "#E9EBF1",
                4: "#DDE0E9",
                5: "#BAC0D3",
                6: "#868EAC",
                7: "#3C435D",
                8: "#14161F",
            },
            blue: {
                1: "#E7F1FA",
                2: "#B6D6EF",
                3: "#6CADE0",
                4: "#3B92D5",
                5: "#0A77CB",
                6: "#085FA2",
                7: "#06477A",
                8: "#043051",
                9: "#021829",
            },
            purple: {
                1: "#EBECFD",
                2: "#C3C6FA",
                3: "#888CF5",
                4: "#6066F2",
                5: "#3840EF",
                6: "#2D33BF",
                7: "#22268F",
                8: "#161A60",
                9: "#0B0D30",
            },
            teal: {
                1: "#EDFBFC",
                2: "#C8F2F5",
                3: "#92E6EC",
                4: "#6DDDE5",
                5: "#49D5DF",
                6: "#3AAAB2",
                7: "#2C8086",
                8: "#1D5559",
                9: "#0F2B2D",
            },

        }
        , fontFamily: {
            sans: ['Inter', 'sans-serif'],
            mono: ['Fira Code', 'monospace']
        },
    },
    presets: [
        presetUno(),
        presetAttributify(),
        presetMini(),

    ],
})
