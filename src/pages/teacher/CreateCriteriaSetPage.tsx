import { useState, useEffect } from 'react';
import { createCriteriaSet, getCriteriaSets, CriteriaSet } from '../../services/criteriaSetService';
import DashboardLayout from '@/layout/dashboard.layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import FlexibleCard from '@/components/template/FlexibleCard';
import toast from 'react-hot-toast';

const CRITERIA_TYPES = [
  { value: 'defense', label: 'Soutenance' },
  { value: 'deliverable', label: 'Rendu' },
  { value: 'report', label: 'Rapport' },
];

export default function CreateCriteriaSetPage() {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'defense' | 'deliverable' | 'report'>('defense');
  const [weight, setWeight] = useState(1);
  const [criteria, setCriteria] = useState([
    { label: '', maxScore: 10, weight: 1, commentGlobal: '', commentPerCriteria: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [criteriaSets, setCriteriaSets] = useState<CriteriaSet[]>([]);
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    getCriteriaSets().then(setCriteriaSets).catch(() => {});
  }, []);

  const handleCriteriaChange = (idx: number, field: string, value: any) => {
    setCriteria((prev) => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  };

  const addCriteria = () => setCriteria([...criteria, { label: '', maxScore: 10, weight: 1, commentGlobal: '', commentPerCriteria: '' }]);
  const removeCriteria = (idx: number) => setCriteria(criteria.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      await createCriteriaSet({ title, type, weight, criteria });
      setSuccess(true);
      toast.success('Grille créée !');
      setTitle('');
      setCriteria([{ label: '', maxScore: 10, weight: 1, commentGlobal: '', commentPerCriteria: '' }]);
      // Refresh list after creation
      const sets = await getCriteriaSets();
      setCriteriaSets(sets);
    } catch (e: any) {
      setError(e.message);
      toast.error(e.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const filteredCriteriaSets = filterType === 'all' ? criteriaSets : criteriaSets.filter(set => set.type === filterType);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6 flex gap-8">
        {/* Liste des grilles */}
        <FlexibleCard className="w-1/3 min-w-[260px]">
          <div className="mb-4 flex items-center gap-2">
            <Label>Filtrer par type</Label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                {CRITERIA_TYPES.map(t => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ul className="space-y-3">
            {filteredCriteriaSets.map((set) => (
              <Collapsible key={set.id}>
                <CollapsibleTrigger className="w-full flex justify-between items-center rounded-lg border border-gray-200 bg-white dark:bg-zinc-900 shadow-sm px-4 py-3 font-bold cursor-pointer transition hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary/50">
                  <div className="flex flex-col items-start">
                    <span className="text-base font-semibold text-primary">{set.title}</span>
                    <span className="text-xs text-gray-500">{CRITERIA_TYPES.find(t => t.value === set.type)?.label} • {set.criteria?.length ?? 0} critère(s)</span>
                  </div>
                  <svg className="ml-2 w-5 h-5 text-gray-400 group-data-[state=open]:rotate-90 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-4 pr-2 pb-2 bg-gray-50 dark:bg-zinc-800 rounded-b-lg border-t border-gray-100 dark:border-zinc-800">
                  <ul className="list-disc text-sm text-gray-700 dark:text-gray-200 pl-4 pt-2">
                    {set.criteria?.map((c, i) => (
                      <li key={i}>{c.label}</li>
                    ))}
                  </ul>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </ul>
        </FlexibleCard>
        {/* Formulaire */}
        <FlexibleCard className="flex-1">
          <h1 className="text-2xl font-bold mb-4">Créer une grille de notation</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="block mb-1">Titre</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div>
              <Label className="block mb-1">Type</Label>
              <RadioGroup value={type} onValueChange={v => setType(v as 'defense' | 'deliverable' | 'report')} className="flex gap-4">
                {CRITERIA_TYPES.map(t => (
                  <div key={t.value} className="flex items-center gap-2">
                    <RadioGroupItem value={t.value} id={t.value} />
                    <Label htmlFor={t.value}>{t.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div>
              <Label className="block mb-1">Poids global</Label>
              <Input type="number" value={weight} min={0} step={0.1} onChange={e => setWeight(Number(e.target.value))} required />
            </div>
            <Separator className="my-4" />
            <div>
              <Label className="block mb-2">Critères</Label>
              {criteria.map((c, idx) => (
                <FlexibleCard key={idx} className='mt-2'>
                  <div className="flex gap-3 mb-2 items-end flex-wrap">
                    <div className="flex-1 min-w-[120px]">
                      <Label className="mb-1 block">Label</Label>
                      <Input placeholder="Label du critère" value={c.label} onChange={e => handleCriteriaChange(idx, 'label', e.target.value)} required />
                    </div>
                    <div className="w-24">
                      <Label className="mb-1 block">Note Maximal</Label>
                      <Input type="number" placeholder="Max" value={c.maxScore} min={1} onChange={e => handleCriteriaChange(idx, 'maxScore', Number(e.target.value))} required />
                    </div>
                    <div className="w-24">
                      <Label className="mb-1 block">Poids</Label>
                      <Input type="number" placeholder="Poids" value={c.weight} min={0} step={0.1} onChange={e => handleCriteriaChange(idx, 'weight', Number(e.target.value))} required />
                    </div>
                    <Button type="button" variant="destructive" onClick={() => removeCriteria(idx)} disabled={criteria.length === 1} className="self-end">Supprimer</Button>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <div className="flex-1">
                      <Label className="mb-1 block">Commentaire (optionnel)</Label>
                      <Input placeholder="Commentaire par critère (optionnel)" value={c.commentPerCriteria} onChange={e => handleCriteriaChange(idx, 'commentPerCriteria', e.target.value)} />
                    </div>
                  </div>
                </FlexibleCard>
              ))}
              <Button type="button" variant="secondary" onClick={addCriteria} className='mt-4'>Ajouter un critère</Button>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Création...' : 'Créer la grille'}</Button>
          </form>
        </FlexibleCard>
      </div>
    </DashboardLayout>
  );
}
