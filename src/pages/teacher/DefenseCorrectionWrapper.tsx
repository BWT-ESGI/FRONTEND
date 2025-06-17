import { ProjectProvider } from '@/contexts/ProjectContext';
import { useParams } from 'react-router-dom';
import DefenseCorrectionPage from './DefenseCorrectionPage';

export default function DefenseCorrectionWrapper() {
  const { id } = useParams<{ id: string }>();
  if (!id) return null;
  return (
    <ProjectProvider projectId={id}>
      <DefenseCorrectionPage />
    </ProjectProvider>
  );
}
