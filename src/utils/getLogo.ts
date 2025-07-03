import { useTheme } from "@/hooks/theme-provider";

export default function getLogo() {
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

export function getLogoBase64() {
    const logo = getLogo();
    return {
        logo: `data:image/png;base64,${btoa(logo.logo)}`,
        logoText: `data:image/png;base64,${btoa(logo.logoText)}`,
    };
}

export function getLogoByTheme(theme: "light" | "dark") {
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
    return theme === "dark" ? logos.dark : logos.light;
}

export function getLogoUrlForPdf(theme: "light" | "dark" = "dark") {
    return getLogoByTheme(theme).logoText;
}