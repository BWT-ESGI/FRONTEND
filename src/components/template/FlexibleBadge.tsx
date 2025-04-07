import { Badge } from "@/components/ui/badge";

export type BadgeType = "draft" | "published" | "archived" | "manual" | "random" | "student_choice" | "custom";

const statusStyles: Record<BadgeType, {
    label: string;
    bg: string;
    text: string;
    border: string;
    dot: string; 
}> = {
    draft: {
        label: "Brouillon",
        bg: "bg-gray-600/10 dark:bg-gray-600/20 hover:bg-gray-600/10",
        text: "text-gray-500",
        border: "border-gray-600/60",
        dot: "bg-gray-500",
    },
    published: {
        label: "Publié",
        bg: "bg-green-600/10 dark:bg-green-600/20 hover:bg-green-600/10",
        text: "text-green-500",
        border: "border-green-600/60",
        dot: "bg-green-500",
    },
    archived: {
        label: "Archivé",
        bg: "bg-red-600/10 dark:bg-red-600/20 hover:bg-red-600/10",
        text: "text-red-500",
        border: "border-red-600/60",
        dot: "bg-red-500",
    },
    manual: {
        label: "Manuel",
        bg: "bg-blue-600/10 dark:bg-blue-600/20 hover:bg-blue-600/10",
        text: "text-blue-500",
        border: "border-blue-600/60",
        dot: "bg-blue-500",
    },
    random: {
        label: "Aléatoire",
        bg: "bg-purple-600/10 dark:bg-purple-600/20 hover:bg-purple-600/10",
        text: "text-purple-500",
        border: "border-purple-600/60",
        dot: "bg-purple-500",
    },
    student_choice: {
        label: "Choix étudiant",
        bg: "bg-yellow-600/10 dark:bg-yellow-600/20 hover:bg-yellow-600/10",
        text: "text-yellow-500",
        border: "border-yellow-600/60",
        dot: "bg-yellow-500",
    },
    custom: {
        label: "Personnalisé",
        bg: "bg-gray-600/10 dark:bg-gray-600/20 hover:bg-gray-600/10",
        text: "text-gray-500",
        border: "border-gray-600/60",
        dot: "bg-gray-500",
    },
};

export interface FlexibleBadgeProps {
    status: BadgeType;
    label?: string;
    bg?: string;
    text?: string;
    border?: string;
    noDot?: boolean | string;
    className?: string;
    dotClassName?: string;
}

export function FlexibleBadge({ status, label, bg, text, border, noDot, className, dotClassName }: FlexibleBadgeProps) {
    const styles = statusStyles[status];

    return (
        <Badge
            className={`${bg || styles.bg} ${text || styles.text} ${border || styles.border} shadow-none rounded-full flex items-center ${className || ""}`}
        >
            {!noDot && (
                <div className={`h-1.5 w-1.5 rounded-full ${styles.dot} mr-2 ${dotClassName || ""}`} />
            )}
            {label || styles.label}
        </Badge>
    );
}