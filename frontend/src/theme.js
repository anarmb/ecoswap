import { createSystem, defaultConfig } from "@chakra-ui/react"

const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        
        brand: {
          50:  { value: "#e6fffa" },
          100: { value: "#b2f5ea" },
          200: { value: "#81e6d9" },
          300: { value: "#4fd1c5" },
          400: { value: "#38b2ac" },
          500: { value: "#319795" },
          600: { value: "#2c7a7b" },
          700: { value: "#285e61" },
          800: { value: "#234e52" },
          900: { value: "#1d4044" },
        },

        earth: {
          50:  { value: "#faf5eb" },
          100: { value: "#faebd7" },
          200: { value: "#e8c99a" },
          300: { value: "#d4a96a" },
          400: { value: "#c08040" },
          500: { value: "#a0522d" },
          600: { value: "#8b4513" },
          700: { value: "#6b3410" },
          800: { value: "#4a240c" },
          900: { value: "#2d1508" },
        },

        sand: {
          50:  { value: "#fdfaf5" },
          100: { value: "#f7f0e0" },
          200: { value: "#ede4c8" },
          300: { value: "#ddd3b0" },
          400: { value: "#c9be94" },
          500: { value: "#b5a878" },
          600: { value: "#9a8d5e" },
          700: { value: "#7a7048" },
          800: { value: "#5a5234" },
          900: { value: "#3a3520" },
        },
      },
    },
  },
})

export { system }