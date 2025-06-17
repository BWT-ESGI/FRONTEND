import { useEffect, useState } from 'react';
import { fetchRulesByDeliverable, deleteRule } from '@/services/ruleService';
import { FileTree, FileTreeNode } from '@/components/ui/filetree';
import { Folder, FileText, Regex, Trash2, Edit2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
                <li key={rule.id} className="border rounded-xl bg-white/90 shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col gap-2 relative group">
                    <div className="flex items-center gap-3 mb-1">
                        {rule.type === 'FILE_EXISTS' && <FileText className="h-5 w-5 text-blue-500" />}
                        {rule.type === 'DIR_STRUCTURE' && <Folder className="h-5 w-5 text-yellow-500" />}
                        {rule.type === 'CONTENT_REGEX' && <Regex className="h-5 w-5 text-green-600" />}
                        <span className="uppercase text-xs font-bold tracking-wider text-gray-600">
                            {rule.type === 'FILE_EXISTS' && 'Fichier requis'}
                            {rule.type === 'DIR_STRUCTURE' && 'Architecture du projet'}
                            {rule.type === 'CONTENT_REGEX' && 'Contenu de fichier'}
                        </span>
                        {rule.preset && <Badge variant="outline" className="ml-2 text-xs border-blue-200 bg-blue-50 text-blue-700">Preset : {rule.preset}</Badge>}
                    </div>
                    <div className="pl-7">
                        {formatRule(rule)}
                    </div>
                    <div className="flex gap-2 absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        {onEditRule && (
                            <button
                                className="rounded p-1 hover:bg-blue-50"
                                onClick={() => onEditRule(rule)}
                                type="button"
                                title="Modifier"
                            >
                                <Edit2 className="h-4 w-4 text-blue-600" />
                            </button>
                        )}
                        <button
                            className="rounded p-1 hover:bg-red-50"
                            onClick={() => handleDelete(rule.id)}
                            type="button"
                            title="Supprimer"
                            disabled={deletingId === rule.id}
                        >
                            {deletingId === rule.id ? <span className="text-xs text-red-600">...</span> : <Trash2 className="h-4 w-4 text-red-500" />}
                        </button>
                    </div>
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
