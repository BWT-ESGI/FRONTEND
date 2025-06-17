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
import CriteriaGridFillComponent from '@/components/evaluation/CriteriaGridFillComponent';
import { getCriteriaSets, CriteriaSet } from '@/services/criteriaSetService';
import { submitEvaluationGrid, fetchEvaluationGrid } from '@/services/evaluationGridService';
import { ProjectProvider, useProjectContext } from '@/contexts/ProjectContext';
import FlexibleAlert from "@/components/template/FlexibleAlert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DefenseCorrectionPageWithProvider() {
  const { id } = useParams<{ id: string }>();
  if (!id) return null;
  return (
    <ProjectProvider projectId={id}>
      <DefenseCorrectionPageInner />
    </ProjectProvider>
  );
}

function DefenseCorrectionPageInner() {
  const { id } = useParams<{ id: string }>();
  const [groups, setGroups] = useState<any[]>([]);
  const [defenses, setDefenses] = useState<any[]>([]);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [criteriaSet, setCriteriaSet] = useState<CriteriaSet | null>(null);
  const { project } = useProjectContext();
  const [evaluationGrid, setEvaluationGrid] = useState<any>(null);
  const teacherId = localStorage.getItem('userId') || '';

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

  useEffect(() => {
    async function fetchGrid() {
      if (!project?.defenseCriteriaSetId || !group?.id) return;
      const sets = await getCriteriaSets('defense');
      const set = sets.find((s: any) => s.id === project.defenseCriteriaSetId);
      setCriteriaSet(set || null);
      if (set) {
        const grid = await fetchEvaluationGrid(set.id, group.id);
        setEvaluationGrid(grid);
      }
    }
    fetchGrid();
  }, [id, project, group, currentGroupIndex]);

  if (loading) return <FallBackPageSkeleton />;

  return (
    <DashboardLayout>
      <Divider
        text={`Passage des soutenances`}
        className="mt-0"
      />

      <div className="flex h-full min-h-[60vh] gap-4">
        <div className="w-1/3 max-w-xs flex flex-col">
          <FlexibleCard>
            <GroupTimeline
              groups={timelineGroups}
              currentIndex={currentGroupIndex}
              onSelect={setCurrentGroupIndex}
            />
            <Button
              className="w-full"
              onClick={() => setCurrentGroupIndex((idx) => Math.min(idx + 1, timelineGroups.length - 1))}
              disabled={currentGroupIndex >= timelineGroups.length - 1}
            >
              Groupe suivant
            </Button>
          </FlexibleCard>
        </div>
        <div className="flex-1 flex flex-col items-center justify-start">
          <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 overflow-y-auto">
            {group?.members?.map((member: any) => (
              <UserCard
                key={member.id}
                firstName={member.firstName}
                lastName={member.lastName}
              />
            ))}
          </div>

          <Divider className="w-full max-w-2xl" text="Notation" />

          <div className="w-full max-w-2xl">
            {criteriaSet && (
              <CriteriaGridFillComponent
                key={criteriaSet.id + '-' + (evaluationGrid?.id || group.id)}
                criteriaSet={criteriaSet}
                initialScores={evaluationGrid?.scores ?? {}}
                initialComments={evaluationGrid?.comments ?? {}}
                onSubmit={async ({ scores, comments }) => {
                  await submitEvaluationGrid({
                    projectId: id!,
                    criteriaSetId: criteriaSet.id!,
                    groupId: group.id,
                    filledBy: teacherId,
                    scores,
                    comments,
                  });
                }}
              />
            )}
            {!criteriaSet && (
              <FlexibleAlert
                variant="warning"
                title="Aucune grille de notation définie pour ce projet."
                icon={<AlertCircle />}
              />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
