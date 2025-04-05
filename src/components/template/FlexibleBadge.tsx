import { Badge } from "@/components/ui/badge";

const statusStyles: Record<string, {
    label: string;
    bg: string;
    text: string;
    border: string;
    dot: string;
}> = {
    "in-progress": {
        label: "En cours",
        bg: "bg-amber-600/10 dark:bg-amber-600/20 hover:bg-amber-600/10",
        text: "text-amber-500",
        border: "border-amber-600/60",
        dot: "bg-amber-500 animate-pulse",
    },
    blocked: {
        label: "Blocké",
        bg: "bg-red-600/10 dark:bg-red-600/20 hover:bg-red-600/10",
        text: "text-red-500",
        border: "border-red-600/60",
        dot: "bg-red-500",
    },
    done: {
        label: "Terminé",
        bg: "bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/10",
        text: "text-emerald-500",
        border: "border-emerald-600/60",
        dot: "bg-emerald-500",
    },
    "not-started": {
        label: "Pas commencé",
        bg: "bg-gray-600/10 dark:bg-gray-600/20 hover:bg-gray-600/10",
        text: "text-gray-500",
        border: "border-gray-600/60",
        dot: "bg-gray-500",
    },
    "on-hold": {
        label: "En attente",
        bg: "bg-yellow-600/10 dark:bg-yellow-600/20 hover:bg-yellow-600/10",
        text: "text-yellow-500",
        border: "border-yellow-600/60",
        dot: "bg-yellow-500 animate-pulse",
    },
    cancelled: {
        label: "Annulé",
        bg: "bg-purple-600/10 dark:bg-purple-600/20 hover:bg-purple-600/10",
        text: "text-purple-500",
        border: "border-purple-600/60",
        dot: "bg-purple-500 animate-pulse",
    },
    pending: {
        label: "En attente",
        bg: "bg-blue-600/10 dark:bg-blue-600/20 hover:bg-blue-600/10",
        text: "text-blue-500",
        border: "border-blue-600/60",
        dot: "bg-blue-500 animate-pulse",
    },
};

export type StatusType = keyof typeof statusStyles;

interface FlexibleBadgeProps {
    status: StatusType;
    label?: string;
}

export function FlexibleBadge({ status, label }: FlexibleBadgeProps) {
    const styles = statusStyles[status];

    return (
        <Badge
            className={`${styles.bg} ${styles.text} ${styles.border} shadow-none rounded-full flex items-center`}
        >
            <div className={`h-1.5 w-1.5 rounded-full ${styles.dot} mr-2`} />
            {label || styles.label}
        </Badge>
    );
}
