// FolderTreeEditor refactoré pour une UI verticale claire
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type TreeNode = {
    id: string;
    name: string;
    type: 'folder' | 'file';
    children?: TreeNode[];
};

function generateId() {
    return Math.random().toString(36).slice(2, 10);
}

function TreeList({ nodes, onAdd, onRemove, onRename, level = 0 }: {
    nodes: TreeNode[];
    onAdd: (parentId: string, type: 'folder' | 'file') => void;
    onRemove: (id: string) => void;
    onRename: (id: string, name: string) => void;
    level?: number;
}) {
    return (
        <ul className={cn('pl-2 border-l', { 'ml-2': level > 0 })}>
            {nodes.map(node => (
                <li key={node.id} className="flex flex-col gap-1 mb-2">
                    <div className="flex items-center gap-2">
                        <Input
                            className="w-40 h-7 text-xs"
                            value={node.name}
                            onChange={e => onRename(node.id, e.target.value)}
                            aria-label={node.type === 'folder' ? 'Nom du dossier' : 'Nom du fichier'}
                        />
                        <span className="text-xs text-muted-foreground">[{node.type}]</span>
                        <Button size="sm" variant="ghost" type="button" onClick={() => onRemove(node.id)} title="Supprimer">🗑️</Button>
                        {node.type === 'folder' && (
                            <>
                                <Button size="sm" variant="outline" type="button" onClick={() => onAdd(node.id, 'folder')}>+ Dossier</Button>
                                <Button size="sm" variant="outline" type="button" onClick={() => onAdd(node.id, 'file')}>+ Fichier</Button>
                            </>
                        )}
                    </div>
                    {node.children && node.children.length > 0 && (
                        <TreeList nodes={node.children} onAdd={onAdd} onRemove={onRemove} onRename={onRename} level={level + 1} />
                    )}
                </li>
            ))}
        </ul>
    );
}

export default function FolderTreeEditor({ value, onChange }: { value: TreeNode[], onChange: (tree: TreeNode[]) => void }) {
    const [tree, setTree] = useState<TreeNode[]>(value);

    const handleAdd = (parentId: string, type: 'folder' | 'file') => {
        function add(nodes: TreeNode[]): TreeNode[] {
            return nodes.map(node => {
                if (node.id === parentId && node.type === 'folder') {
                    const newNode: TreeNode = { id: generateId(), name: type === 'folder' ? 'nouveau_dossier' : 'nouveau_fichier', type, children: type === 'folder' ? [] : undefined };
                    return { ...node, children: [...(node.children || []), newNode] };
                } else if (node.children) {
                    return { ...node, children: add(node.children) };
                }
                return node;
            });
        }
        const newTree = add(tree);
        setTree(newTree);
        onChange(newTree);
    };

    const handleAddRoot = (type: 'folder' | 'file') => {
        const newNode: TreeNode = { id: generateId(), name: type === 'folder' ? 'nouveau_dossier' : 'nouveau_fichier', type, children: type === 'folder' ? [] : undefined };
        const newTree = [...tree, newNode];
        setTree(newTree);
        onChange(newTree);
    };

    const handleRemove = (id: string) => {
        function remove(nodes: TreeNode[]): TreeNode[] {
            return nodes.filter(node => node.id !== id).map(node => ({
                ...node,
                children: node.children ? remove(node.children) : undefined
            }));
        }
        const newTree = remove(tree);
        setTree(newTree);
        onChange(newTree);
    };

    const handleRename = (id: string, name: string) => {
        function rename(nodes: TreeNode[]): TreeNode[] {
            return nodes.map(node => node.id === id ? { ...node, name } : { ...node, children: node.children ? rename(node.children) : undefined });
        }
        const newTree = rename(tree);
        setTree(newTree);
        onChange(newTree);
    };

    return (
        <Card className="p-3 bg-muted/30 max-h-[60vh] overflow-y-auto">
            <div className="mb-2 font-semibold text-sm">Arborescence personnalisée</div>
            <TreeList nodes={tree} onAdd={handleAdd} onRemove={handleRemove} onRename={handleRename} />
            <div className="mt-2 flex gap-2">
                <Button size="sm" variant="outline" type="button" onClick={() => handleAddRoot('folder')}>+ Dossier racine</Button>
                <Button size="sm" variant="outline" type="button" onClick={() => handleAddRoot('file')}>+ Fichier racine</Button>
            </div>
        </Card>
    );
}
