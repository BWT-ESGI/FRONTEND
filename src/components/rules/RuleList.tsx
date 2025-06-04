import React, { useEffect, useState } from 'react';
import { fetchRulesByDeliverable, deleteRule } from '@/services/ruleService';
import { FileTree, FileTreeNode } from '@/components/ui/filetree';

export default function RuleList({ deliverableId, onEditRule }: { deliverableId: string, onEditRule?: (rule: any) => void }) {
    const [rules, setRules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const refresh = () => {
        setLoading(true);
        fetchRulesByDeliverable(deliverableId).then(data => {
            setRules(Array.isArray(data) ? data : []);
            setLoading(false);
        });
    };

    useEffect(() => {
        refresh();
    }, [deliverableId]);

    async function handleDelete(id: string) {
        if (!window.confirm('Supprimer cette règle ?')) return;
        setDeletingId(id);
        try {
            await deleteRule(id);
            refresh();
        } finally {
            setDeletingId(null);
        }
    }

    function formatRule(rule: any) {
        if (rule.type === 'FILE_EXISTS') {
            return (
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-blue-700">Fichier requis :</span>
                    <span className="font-mono bg-blue-50 px-2 py-0.5 rounded text-blue-900 border border-blue-200">{rule.config.file}</span>
                </div>
            );
        }
        if (rule.type === 'DIR_STRUCTURE') {
            return (
                <div>
                    <div className="font-medium text-yellow-700 mb-1">Architecture du projet :</div>
                    <FileTree nodes={convertPathsToFileTree(rule.config.structure)} />
                </div>
            );
        }
        if (rule.type === 'CONTENT_REGEX') {
            return (
                <div className="flex flex-col gap-1 text-sm">
                    <div>
                        <span className="font-medium text-green-700">Fichier :</span>
                        <span className="font-mono bg-green-50 px-2 py-0.5 rounded text-green-900 border border-green-200 ml-1">{rule.config.file}</span>
                    </div>
                    <div>
                        <span className="font-medium text-green-700">Doit contenir :</span>
                        <span className="font-mono bg-green-50 px-2 py-0.5 rounded text-green-900 border border-green-200 ml-1">{rule.config.matcher?.type === 'regex' ? 'Regex' : 'Texte'} : {rule.config.matcher?.value}</span>
                    </div>
                </div>
            );
        }
        return null;
    }

    if (loading) return <div>Chargement des règles...</div>;
    if (!rules.length) return <div>Aucune règle définie.</div>;

    return (
        <ul className="space-y-4">
            {rules.map(rule => (
                <li key={rule.id} className="border p-3 rounded bg-white shadow-sm flex flex-col gap-2">
                    <div className="flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-2">
                            <span className="uppercase text-xs font-bold tracking-wider text-gray-500">
                                {rule.type === 'FILE_EXISTS' && 'Fichiers requis'}
                                {rule.type === 'DIR_STRUCTURE' && 'Architecture du projet'}
                                {rule.type === 'CONTENT_REGEX' && 'Contenu de fichier'}
                            </span>
                            {rule.preset && <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">Preset : {rule.preset}</span>}
                        </div>
                        <div className="flex gap-2">
                            {onEditRule && (
                                <button
                                    className="text-xs text-primary underline hover:opacity-80"
                                    onClick={() => onEditRule(rule)}
                                    type="button"
                                >
                                    Modifier
                                </button>
                            )}
                            <button
                                className="text-xs text-destructive underline hover:opacity-80"
                                onClick={() => handleDelete(rule.id)}
                                type="button"
                                disabled={deletingId === rule.id}
                            >
                                {deletingId === rule.id ? 'Suppression...' : 'Supprimer'}
                            </button>
                        </div>
                    </div>
                    {formatRule(rule)}
                </li>
            ))}
        </ul>
    );
}

// Fonction utilitaire pour convertir une liste de chemins en FileTreeNode[]
function convertPathsToFileTree(paths: string[]): FileTreeNode[] {
    const root: FileTreeNode[] = [];
    for (const path of paths) {
        const parts = path.split('/').filter(Boolean);
        let current = root;
        for (let i = 0; i < parts.length; i++) {
            const isLast = i === parts.length - 1;
            const isFolder = path.endsWith('/') && isLast;
            const name = parts[i];
            // Fusionne les dossiers existants, ne crée qu'un seul noeud par nom/type
            let node = current.find(n => n.name === name && n.type === (isLast ? (isFolder ? 'folder' : 'file') : 'folder'));
            if (!node) {
                node = {
                    id: `${name}-${i}-${Math.random().toString(36).slice(2, 8)}`,
                    name,
                    type: isLast ? (isFolder ? 'folder' : 'file') : 'folder',
                    children: isLast && !isFolder ? undefined : [],
                };
                current.push(node);
            }
            if (node.type === 'folder' && node.children) {
                current = node.children;
            }
        }
    }
    return root;
}
