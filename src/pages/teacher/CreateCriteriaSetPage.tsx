import { useState, useEffect } from 'react';
import { createCriteriaSet, getCriteriaSets, CriteriaSet } from '../../services/criteriaSetService';

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
      setTitle('');
      setCriteria([{ label: '', maxScore: 10, weight: 1, commentGlobal: '', commentPerCriteria: '' }]);
      // Refresh list after creation
      const sets = await getCriteriaSets();
      setCriteriaSets(sets);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Créer une grille de critères</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Titre</label>
          <input className="border rounded px-2 py-1 w-full" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div>
          <label className="block font-medium">Type</label>
          <select className="border rounded px-2 py-1 w-full" value={type} onChange={e => setType(e.target.value as 'defense' | 'deliverable' | 'report')}>
            {CRITERIA_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-medium">Poids global</label>
          <input type="number" className="border rounded px-2 py-1 w-full" value={weight} min={0} step={0.1} onChange={e => setWeight(Number(e.target.value))} required />
        </div>
        <div>
          <label className="block font-medium mb-2">Critères</label>
          {criteria.map((c, idx) => (
            <div key={idx} className="border p-3 mb-2 rounded bg-gray-50">
              <div className="flex gap-2 mb-2">
                <input className="border rounded px-2 py-1 flex-1" placeholder="Label" value={c.label} onChange={e => handleCriteriaChange(idx, 'label', e.target.value)} required />
                <input type="number" className="border rounded px-2 py-1 w-20" placeholder="Max" value={c.maxScore} min={1} onChange={e => handleCriteriaChange(idx, 'maxScore', Number(e.target.value))} required />
                <input type="number" className="border rounded px-2 py-1 w-20" placeholder="Poids" value={c.weight} min={0} step={0.1} onChange={e => handleCriteriaChange(idx, 'weight', Number(e.target.value))} required />
                <button type="button" className="text-red-500" onClick={() => removeCriteria(idx)} disabled={criteria.length === 1}>Supprimer</button>
              </div>
              <input className="border rounded px-2 py-1 w-full mb-1" placeholder="Commentaire global (optionnel)" value={c.commentGlobal} onChange={e => handleCriteriaChange(idx, 'commentGlobal', e.target.value)} />
              <input className="border rounded px-2 py-1 w-full" placeholder="Commentaire par critère (optionnel)" value={c.commentPerCriteria} onChange={e => handleCriteriaChange(idx, 'commentPerCriteria', e.target.value)} />
            </div>
          ))}
          <button type="button" className="bg-blue-100 px-3 py-1 rounded" onClick={addCriteria}>Ajouter un critère</button>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Création...' : 'Créer la grille'}</button>
        {success && <div className="text-green-600">Grille créée !</div>}
        {error && <div className="text-red-600">{error}</div>}
      </form>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Grilles déjà créées</h2>
        <ul className="space-y-2">
          {criteriaSets.map((set) => (
            <li key={set.id} className="border rounded p-3 bg-gray-50">
              <div className="font-bold">{set.title} <span className="text-xs text-gray-500">({set.type})</span></div>
              <div className="text-sm text-gray-600">Poids : {set.weight}</div>
              <div className="text-sm text-gray-600">{set.criteria?.length ?? 0} critère(s)</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
