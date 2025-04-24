import { User } from "@/types/user.type";
import { Avatar, AvatarFallback } from "../ui/avatar";
import FlexibleCard from "../template/FlexibleCard";
import FlexibleAlert from "../template/FlexibleAlert";

interface GroupMemberCardProps {
  members: User[];
  className: string;
}

export default function GroupMemberCard({ members, className }: GroupMemberCardProps) {
  if (!members || members.length === 0) {
    return (<FlexibleAlert variant="warning" icon={<AvatarFallback className="rounded-lg">!</AvatarFallback>} title="Aucun membre trouvé"/>)
    }
  return (
    <FlexibleCard title="Membres de l'équipe" className={className}>
      <div className="flex flex-wrap justify-center items-stretch h-full gap-2">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex flex-col items-center p-4 border rounded-lg shadow-sm w-48"
          >
            <div className="flex-shrink-0">
              <Avatar className="h-12 w-12 rounded-lg">
                <AvatarFallback className="rounded-lg">
                  {member.firstName[0]}
                  {member.lastName[0]}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col mt-4 text-center">
              <p className="text-lg font-semibold">
                {member.firstName} {member.lastName}
              </p>
              <p className="text-sm text-gray-500"><a href={`mailto:${member.email}`}>{member.email}</a></p>
            </div>
          </div>
        ))}
      </div>
    </FlexibleCard>
  );
}
