interface FlexibleAlertProps {
    variant?: "info" | "success" | "warning" | "error";
    icon: React.ReactNode;
    title: string;
}

const variantClasses = {
    info: "bg-blue-500/10 dark:bg-blue-600/30 border-none",
    success: "bg-emerald-500/10 dark:bg-emerald-600/30 border-none",
    warning: "bg-amber-500/10 dark:bg-amber-600/30 border-none",
    error: "bg-destructive/10 dark:bg-destructive/20 border-none",
};

export default function FlexibleAlert({ variant = "info", icon, title, ...props }: FlexibleAlertProps) {
    return (
        <div {...props} className={`p-4 rounded-md ${variantClasses[variant]}`}>
            <div className="flex items-start gap-2 min-w-0 w-full">
                <span className="flex-shrink-0 text-sm">{icon}</span>
                <div className="flex-1 min-w-0 w-full whitespace-normal break-normal">
                    {title}
                </div>
            </div>
        </div>
    )
}
