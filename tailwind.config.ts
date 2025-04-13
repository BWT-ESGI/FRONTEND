// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // deal with bold styling clash
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-bold": "inherit",
          },
        },
      },
    },
  },
  // apply @tailwindcss/typography plugin
  plugins: [
    require('@tailwindcss/typography'),
  ],
} satisfies Config;