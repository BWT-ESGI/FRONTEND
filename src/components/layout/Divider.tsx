interface DividerProps {
    className?: string;
    color?: string;
    text?: string;
}

export default function Divider({ className = '', color = 'gray-300', text }: DividerProps) {
    return (
        <div className={`relative my-8 flex items-center ${className}`}>
            <div className={`flex-grow border-t border-${color} dark:border-white`}></div>
            {text && <span className="mx-4 text-gray-500">{text}</span>}
            <div className={`flex-grow border-t border-${color} dark:border-white`}></div>
        </div>
    );
}