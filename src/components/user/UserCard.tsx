import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserCardProps {
  firstName: string;
  lastName: string;
  email?: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function UserCard({
  firstName,
  lastName,
  email,
  selected,
  onClick,
  className = "",
}: UserCardProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center p-2 gap-2 border rounded-lg shadow-sm w-full min-h-[56px] bg-card border shadow-sm flex-wrap break-words transition-all
        ${
          selected
            ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/30"
            : "border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
        }
        ${className}`}
      style={{ wordBreak: "break-word" }}
    >
      <div className="flex-shrink-0">
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarFallback className="rounded-lg">
            {firstName[0]}
            {lastName[0]}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col text-left min-w-0">
        <p className="text-sm font-medium break-words whitespace-normal">
          {firstName} {lastName}
        </p>
        {email && (
          <p className="text-xs text-gray-500 break-all whitespace-normal">
            {email}
          </p>
        )}
      </div>
    </div>
  );
}
