import Divider from '@/components/layout/Divider';
import FlexibleAlert from '@/components/template/FlexibleAlert';
import { InfoIcon } from 'lucide-react';
import CriteriaGridFillComponent from '@/components/evaluation/CriteriaGridFillComponent';
import { Deliverable, Submission } from '@/types/deliverable.type';
import { CriteriaSet } from '@/services/criteriaSetService';
import { EvaluationGridPayload } from '@/services/evaluationGridService';
import DetailedSubmissionView from './DetailedSubmissionView';

interface EvaluationGrid {
  id?: string;
  scores: Record<string, number>;
  comments: Record<string, string>;
}

interface Group {
  id: string;
  name?: string;
  [key: string]: any;
}

interface DeliverableTabsSectionProps {
  deliverables: Deliverable[];
  criteriaSets: CriteriaSet[];
  evaluationGrids: Record<string, EvaluationGrid>;
  submissions: Submission[];
  group: Group;
  id: string;
  teacherId: string;
  submitEvaluationGrid: (payload: EvaluationGridPayload) => Promise<any>;
}

export function DeliverableTabsSection({ deliverables, criteriaSets, evaluationGrids, submissions, group, id, teacherId, submitEvaluationGrid }: DeliverableTabsSectionProps) {
  return (
    <div className="w-full mt-4 mb-4">
      {deliverables.length === 0 && (
        <FlexibleAlert
          variant="info"
          title="Aucune grille de notation de livrable défini pour ce projet."
          icon={<InfoIcon />}
        />
      )}
      {deliverables.map((deliverable) => {
        const criteriaSet = criteriaSets.find(cs => cs.id === deliverable.criteriaSetId);
        const evaluationGrid = evaluationGrids[deliverable.id];
        const submission = submissions.find((s) => s.deliverableId === deliverable.id && s.groupId === group.id);
        return (
          <div key={deliverable.id} className="mb-4">
            <Divider text={deliverable.name} />
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-1/2 w-full">
                {submission ? (
                  <DetailedSubmissionView submission={submission} deliverable={deliverable} />
                ) : (
                  <FlexibleAlert variant='error' title={`Aucun rendu pour le livrable`} icon={<InfoIcon />} />
                )}
              </div>

              <div className="md:w-1/2 w-full">
                {criteriaSet ? (
                  <CriteriaGridFillComponent
                    key={deliverable.id + '-' + group.id}
                    criteriaSet={criteriaSet}
                    initialScores={evaluationGrid?.scores ?? {}}
                    initialComments={evaluationGrid?.comments ?? {}}
                    groupId={group.id}
                    projectId={id}
                    filledBy={teacherId}
                    onSubmit={async ({ scores, comments }) => {
                      await submitEvaluationGrid({
                        projectId: id,
                        criteriaSetId: criteriaSet.id!,
                        groupId: group.id,
                        deliverableId: deliverable.id,
                        filledBy: teacherId,
                        scores,
                        comments,
                      });
                    }}
                  />
                ) : (
                  <div className="mt-4">
                    <FlexibleAlert
                      variant="warning"
                      title={`Aucune grille de notation définie pour le livrable "${deliverable.name}".`}
                      icon={<InfoIcon />}
                    />
                  </div>
                )}
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}
