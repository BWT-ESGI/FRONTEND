export type Deliverable = {
  id: string;
  name: string;
  description: string;
  deadline: string;
  allowLateSubmission: boolean;
  penaltyPerHourLate: number;
  submissionType: 'archive' | 'git';
  maxSize?: number;
  projectId: string;
  criteriaSetId?: string;
};

export type Submission = {
  id: string;
  deliverableId: string;
  groupId: string;
  submittedAt: string;
  archiveObjectName?: string;
  filename?: string;
  size?: number;
  isLate: boolean;
  penaltyApplied: number;
};
