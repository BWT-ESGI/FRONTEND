import React, { useState } from 'react';
import { useRuleSuggestions, submitRule } from '@/hooks/useRuleSuggestions';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import FolderTreeEditor, { TreeNode } from './FolderTreeEditor';
import { FileTree, FileTreeNode } from '@/components/ui/filetree';

const RuleTypeOptions = [
    { value: 'FILE_EXISTS', label: 'Présence de fichier' },
    { value: 'DIR_STRUCTURE', label: 'Architecture de dossier' },
    { value: 'CONTENT_REGEX', label: 'Contenu de fichier' },
];

export default function RuleForm({ deliverableId, onRuleCreated }: { deliverableId: string, onRuleCreated?: () => void }) {
    const { fileSuggestions, archSuggestions, loading } = useRuleSuggestions();
    const [type, setType] = useState('FILE_EXISTS');
    const [preset, setPreset] = useState('');
    const [customValue, setCustomValue] = useState('');
    const [matcherType, setMatcherType] = useState('text');
    const [matcherValue, setMatcherValue] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [treeValue, setTreeValue] = useState<TreeNode[]>([]);
    const [ruleToEdit, setRuleToEdit] = useState<any | null>(null);

    React.useEffect(() => {
        if (ruleToEdit) {
            setType(ruleToEdit.type);
            setPreset(ruleToEdit.preset || '');
            if (ruleToEdit.type === 'FILE_EXISTS') {
                if (ruleToEdit.preset) {
                    setCustomValue('');
                } else {
                    setCustomValue(ruleToEdit.config.file || '');
                }
            } else if (ruleToEdit.type === 'DIR_STRUCTURE') {
                if (ruleToEdit.preset) {
                    setCustomValue('');
                    setTreeValue([]);
                } else {
                    setCustomValue((ruleToEdit.config.structure || []).join(','));
                    // Optionnel : reconstruire treeValue à partir de structure si besoin
                }
            } else if (ruleToEdit.type === 'CONTENT_REGEX') {
                setPreset('');
                setCustomValue(ruleToEdit.config.file || '');
                setMatcherType(ruleToEdit.config.matcher?.type || 'text');
                setMatcherValue(ruleToEdit.config.matcher?.value || '');
            }
        } else {
            setType('FILE_EXISTS');
            setPreset('');
            setCustomValue('');
            setMatcherType('text');
            setMatcherValue('');
            setTreeValue([]);
        }
    }, [ruleToEdit]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        let config: any = {};
        let rulePreset = '';
        if (type === 'FILE_EXISTS') {
            if (preset && preset !== '__custom__') {
                config.file = preset;
                rulePreset = preset;
            } else {
                config.file = customValue;
            }
        } else if (type === 'DIR_STRUCTURE') {
            if (preset && preset !== '__custom__') {
                const arch = archSuggestions.find(a => a.name === preset);
                config.structure = arch ? arch.structure : [];
                rulePreset = preset;
            } else if (treeValue.length) {
                function flatten(nodes: TreeNode[], prefix = ''): string[] {
                    return nodes.flatMap(node => {
                        const path = prefix + node.name + (node.type === 'folder' ? '/' : '');
                        if (node.type === 'folder' && node.children) {
                            return [path, ...flatten(node.children, path)];
                        }
                        return [path];
                    });
                }
                config.structure = flatten(treeValue);
            } else {
                config.structure = customValue.split(',').map(s => s.trim());
            }
        } else if (type === 'CONTENT_REGEX') {
            config.file = preset || customValue;
            config.matcher = { type: matcherType, value: matcherValue };
        }
        try {
            if (ruleToEdit) {
                // Appel API de mise à jour (à adapter selon votre service)
                await submitRule({
                    ...ruleToEdit,
                    deliverableId,
                    type,
                    config,
                    preset: rulePreset || undefined,
                    id: ruleToEdit.id,
                    update: true,
                });
            } else {
                await submitRule({
                    deliverableId,
                    type,
                    config,
                    preset: rulePreset || undefined,
                });
            }
            setCustomValue('');
            setPreset('');
            setMatcherValue('');
            setRuleToEdit(null);
            if (onRuleCreated) onRuleCreated();
        } catch (e: any) {
            setError(e.message || 'Erreur lors de la création de la règle');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card className="p-6 w-full">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                    <Label>Type de règle</Label>
                    <Select value={type} onValueChange={v => { setType(v); setPreset(''); setCustomValue(''); }} disabled={!!ruleToEdit}>
                        <SelectTrigger className="mt-1 w-full">
                            <SelectValue placeholder="Type de règle" />
                        </SelectTrigger>
                        <SelectContent>
                            {RuleTypeOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                {type === 'FILE_EXISTS' && (
                    <div>
                        <Label>Fichier attendu</Label>
                        <Select value={preset} onValueChange={v => setPreset(v)}>
                            <SelectTrigger className="mt-1 w-full">
                                <SelectValue placeholder="Choisir un fichier courant ou custom" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="__custom__">Custom</SelectItem>
                                {fileSuggestions.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        {preset === "__custom__" && (
                            <Input className="mt-2" placeholder="Nom du fichier" value={customValue} onChange={e => setCustomValue(e.target.value)} />
                        )}
                    </div>
                )}
                {type === 'DIR_STRUCTURE' && (
                    <div>
                        <Label>Architecture attendue</Label>
                        <Select value={preset} onValueChange={v => { setPreset(v); }}>
                            <SelectTrigger className="mt-1 w-full">
                                <SelectValue placeholder="Choisir une architecture type ou custom" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="__custom__">Custom</SelectItem>
                                {archSuggestions.map(a => <SelectItem key={a.name} value={a.name}>{a.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        {preset === "__custom__" && (
                            <div className="mt-2 flex flex-col gap-2">
                                <FolderTreeEditor value={treeValue} onChange={setTreeValue} />
                                <Input className="mt-2" placeholder="src/,public/,README.md" value={customValue} onChange={e => setCustomValue(e.target.value)} readOnly />
                                <div className="text-xs text-muted-foreground">L'arborescence attendue ne peut être modifiée que via l'interface graphique ci-dessus.</div>
                                {treeValue.length > 0 && (
                                    <div className="mt-4">
                                        <Label>Prévisualisation de l'arborescence</Label>
                                        <FileTree nodes={convertTreeToFileTree(treeValue)} />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
                {type === 'CONTENT_REGEX' && (
                    <div className="flex flex-col gap-2">
                        <Label>Fichier à vérifier</Label>
                        <Input placeholder="Nom du fichier" value={preset || customValue} onChange={e => { setCustomValue(e.target.value); setPreset(''); }} />
                        <Label>Type de vérification</Label>
                        <Select value={matcherType} onValueChange={v => setMatcherType(v)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Type de vérification" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="text">Texte brut</SelectItem>
                                <SelectItem value="regex">Regex</SelectItem>
                            </SelectContent>
                        </Select>
                        <Label>Valeur à chercher</Label>
                        <Input placeholder="Texte ou regex" value={matcherValue} onChange={e => setMatcherValue(e.target.value)} />
                    </div>
                )}
                <Button type="submit" disabled={submitting || loading}>
                    {submitting ? (ruleToEdit ? 'Mise à jour...' : 'Création...') : (ruleToEdit ? 'Mettre à jour la règle' : 'Créer la règle')}
                </Button>
                {ruleToEdit && (
                    <Button type="button" variant="secondary" onClick={() => setRuleToEdit(null)}>
                        Annuler l'édition
                    </Button>
                )}
                {error && <div className="text-red-600">{error}</div>}
            </form>
        </Card>
    );
}

// Fonction utilitaire pour convertir TreeNode[] en FileTreeNode[] pour FileTree shadcn
function convertTreeToFileTree(nodes: TreeNode[]): FileTreeNode[] {
    return nodes.map(node => ({
        id: node.id,
        name: node.name,
        type: node.type,
        children: node.children ? convertTreeToFileTree(node.children) : undefined,
    }));
}
