import { useState, useEffect } from 'react';
import { CriteriaSet } from '@/services/criteriaSetService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import FlexibleCard from '../template/FlexibleCard';

interface Props {
  criteriaSet: CriteriaSet;
  onSubmit: (data: { scores: Record<string, number>; comments: Record<string, string> }) => Promise<void>;
  initialScores?: Record<string, number>;
  initialComments?: Record<string, string>;
  disabled?: boolean;
}

export default function CriteriaGridFillComponent({ criteriaSet, onSubmit, initialScores = {}, initialComments = {}, disabled }: Props) {
  const [scores, setScores] = useState<Record<string, number>>(initialScores);
  const [comments, setComments] = useState<Record<string, string>>(initialComments);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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
    try {
      await onSubmit({ scores, comments });
      setSuccess(true);
    } catch (e: any) {
      setError(e.message);
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

  console.log(criteriaSet)

  return (
    <form onSubmit={handleSubmit}>
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
      <Button type="submit" className="w-full" disabled={loading || disabled}>
        {loading ? "Enregistrement..." : "Enregistrer"}
      </Button>
      {success && (
        <div className="text-green-600 text-center">Grille enregistrée !</div>
      )}
      {error && <div className="text-red-600 text-center">{error}</div>}
    </form>
  );
}
