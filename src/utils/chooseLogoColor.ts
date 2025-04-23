import { useTheme } from "@/hooks/theme-provider";

export default function chooseRightLogo() {
    const { theme } = useTheme();
    const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    
    const logos = {
        light: {
            logo: "/logo-light-no-text.png",
            logoText: "/logo-light.png",
        },
        dark: {
            logo: "/logo-dark-no-text.png",
            logoText: "/logo-dark.png",
        },
    };

    if (theme === "system") {
        return isDark ? logos.dark : logos.light;
    } else if (theme === "dark") {
        return logos.light;
    } else {
        return logos.dark;
    }
}