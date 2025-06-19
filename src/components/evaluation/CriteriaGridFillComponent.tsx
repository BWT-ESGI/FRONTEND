import { useState, useEffect } from 'react';
import { CriteriaSet } from '@/services/criteriaSetService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import FlexibleCard from '../template/FlexibleCard';
import toast from 'react-hot-toast';
import { SquareArrowOutUpRight } from 'lucide-react';

interface Props {
  criteriaSet: CriteriaSet;
  onSubmit: (data: { scores: Record<string, number>; comments: Record<string, string> }) => Promise<void>;
  initialScores?: Record<string, number>;
  initialComments?: Record<string, string>;
  disabled?: boolean;
  groupId?: string;
  projectId?: string;
  filledBy?: string;
}

export default function CriteriaGridFillComponent({ criteriaSet, onSubmit, initialScores = {}, initialComments = {}, disabled, groupId, projectId, filledBy }: Props) {
  const [scores, setScores] = useState<Record<string, number>>(initialScores);
  const [comments, setComments] = useState<Record<string, string>>(initialComments);
  const [loading, setLoading] = useState(false);
  const [, setSuccess] = useState(false);
  const [, setError] = useState('');
  const [closeWarning, setCloseWarning] = useState(false);

  // Détecte si la page est un popup (ouverte par window.open)
  const [isPopup, setIsPopup] = useState(false);
  useEffect(() => {
    setIsPopup(!!window.opener && window.name !== "");
  }, []);

  const handleScoreChange = (criteriaId: string, value: number) => {
    setScores((prev) => ({ ...prev, [criteriaId]: value }));
  };
  const handleCommentChange = (criteriaId: string, value: string) => {
    setComments((prev) => ({ ...prev, [criteriaId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    setCloseWarning(false);
    try {
      await onSubmit({ scores, comments });
      setSuccess(true);
      toast.success('Grille enregistrée !');
      setTimeout(() => {
        if (window.opener) {
          window.close();
          setTimeout(() => {
            if (!window.closed) setCloseWarning(true);
          }, 100);
        }
      }, 5000);
    } catch (e: any) {
      setError(e.message);
      toast.error(e.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setScores(initialScores);
  }, [criteriaSet, initialScores]);
  useEffect(() => {
    setComments(initialComments);
  }, [criteriaSet, initialComments]);
  return (
    <>
      {closeWarning && (
        <div className="mb-2 p-2 bg-yellow-100 text-yellow-800 rounded">
          Impossible de fermer la page automatiquement. Vous pouvez la fermer manuellement.
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div
          className={
            criteriaSet.criteria.length > 3
              ? "max-h-96 overflow-y-auto pr-2"
              : undefined
          }
        >
          {criteriaSet.criteria.map((c) => (
            <FlexibleCard
              title={c.label}
              key={c.id || c.label}
              className="mb-2"
              childrenRightEnd={
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    className="w-24"
                    min={0}
                    max={c.maxScore}
                    value={scores[c.id || c.label] ?? ""}
                    onChange={(e) =>
                      handleScoreChange(c.id || c.label, Number(e.target.value))
                    }
                    required
                  />
                  <span className="text-gray-500">/ {c.maxScore}</span>
                </div>
              }
            >
              <Textarea
                className="resize-none"
                placeholder={
                  c.commentPerCriteria
                    ? c.commentPerCriteria
                    : "Commentaire (optionnel)"
                }
                value={comments[c.id || c.label] ?? ""}
                onChange={(e) =>
                  handleCommentChange(c.id || c.label, e.target.value)
                }
                disabled={disabled}
                rows={2}
              />
            </FlexibleCard>
          ))}
        </div>
        <div className='flex items-center justify-between mb-2 gap-2'>
          {!isPopup && (
            <div className="w-[5%] min-w-[40px]">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  const params = new URLSearchParams({
                    criteriaSetId: criteriaSet.id || '',
                    ...(groupId ? { groupId } : {}),
                    ...(projectId ? { projectId } : {}),
                    ...(filledBy ? { filledBy } : {}),
                  });
                  const url = `/teacher/criteria-grid?${params.toString()}`;
                  window.open(url, '_blank', 'noopener,noreferrer');
                }}
              >
                <SquareArrowOutUpRight />
              </Button>
            </div>
          )}
          <div className="w-[95%]">
            <Button type="submit" className="w-full" disabled={loading || disabled}>
              {loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </div>

      </form>
    </>
  );
}
