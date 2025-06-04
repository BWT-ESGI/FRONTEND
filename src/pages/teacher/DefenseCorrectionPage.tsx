import GroupTimeline from "@/components/group/GroupTimeline";
import { useState, useEffect } from "react";
import DashboardLayout from "@/layout/dashboard.layout";
import FallBackPageSkeleton from "../global/FallBackPageSkeleton";
import { useParams } from "react-router-dom";
import { fetchGroupsWithMembers } from "@/services/groupService";
import { fetchDefensesByProjectId } from "@/services/defenseService";
import FlexibleCard from "@/components/template/FlexibleCard";
import UserCard from "@/components/user/UserCard";
import Divider from "@/components/layout/Divider";

export default function DefenseCorrectionPage() {
  const { id } = useParams<{ id: string }>();
  const [groups, setGroups] = useState<any[]>([]);
  const [defenses, setDefenses] = useState<any[]>([]);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [groupsData, defensesData] = await Promise.all([
        fetchGroupsWithMembers(id!),
        fetchDefensesByProjectId(id!),
      ]);
      setGroups(groupsData);
      setDefenses(defensesData);
      setCurrentGroupIndex(0);
      setLoading(false);
    }
    load();
  }, [id]);

  useEffect(() => {
    async function loadGroupData() {
      if (!groups[currentGroupIndex]) return;
      setLoading(true);
      setLoading(false);
    }
    if (groups.length > 0) {
      loadGroupData();
    }
  }, [groups, currentGroupIndex, id]);

  const nonEmptyGroups = groups.filter((g: any) => g.members && g.members.length > 0);
  const timelineGroups = nonEmptyGroups.map((g: any) => {
    const defense = defenses.find((d: any) => d.group.id === g.id);
    return {
      id: g.id,
      name: g.name,
      defenseDate: defense ? defense.start : undefined,
    };
  });
  const group = nonEmptyGroups[currentGroupIndex];

  if (loading) return <FallBackPageSkeleton />;

  return (
    <DashboardLayout>
      <Divider text={`Passage des soutenances ${group?.name}`} className="mt-0" />
      
      <div className="flex h-full min-h-[60vh] gap-4">
        <div className="w-1/3 max-w-xs flex flex-col">
          <FlexibleCard>
            <GroupTimeline
              groups={timelineGroups}
              currentIndex={currentGroupIndex}
              onSelect={setCurrentGroupIndex}
            />
          </FlexibleCard>
        </div>
        <div className="flex-1 flex flex-col items-center justify-start">
          <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 overflow-y-auto">
            {group?.members?.map((member: any) => (
              <UserCard
                key={member.id}
                firstName={member.firstName}
                lastName={member.lastName}
                className="whitespace-normal bg-white dark:bg-gray-900 border shadow-sm p-2 flex items-center gap-3 min-h-[56px]"
              />
            ))}
          </div>
        </div>
        <div className="w-1/3" />
      </div>
    </DashboardLayout>
  );
}
