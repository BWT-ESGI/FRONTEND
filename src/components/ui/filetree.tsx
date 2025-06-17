import * as React from "react"
import { ChevronDownIcon, FolderIcon, FileIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export type FileTreeNode = {
    id: string
    name: string
    type: "folder" | "file"
    children?: FileTreeNode[]
}

export function FileTree({ nodes }: { nodes: FileTreeNode[] }) {
    return (
        <div className="space-y-1">
            {nodes.map((node) => (
                <FileTreeItem key={node.id} node={node} />
            ))}
        </div>
    )
}

function FileTreeItem({ node, level = 0 }: { node: FileTreeNode; level?: number }) {
    const [open, setOpen] = React.useState(true)
    const isFolder = node.type === "folder"
    return (
        <div className={cn("pl-2", { "ml-2": level > 0 })}>
            <div className="flex items-center gap-1 cursor-pointer select-none" onClick={() => isFolder && setOpen((o) => !o)}>
                {isFolder ? (
                    <ChevronDownIcon className={cn("w-4 h-4 transition-transform", { "rotate-0": open, "-rotate-90": !open })} />
                ) : (
                    <span className="w-4 h-4" />
                )}
                {isFolder ? <FolderIcon className="w-4 h-4 text-yellow-600" /> : <FileIcon className="w-4 h-4 text-blue-600" />}
                <span className="text-xs font-mono">{node.name}</span>
            </div>
            {isFolder && open && node.children && node.children.length > 0 && (
                <div className="ml-4 border-l border-muted-foreground/20 pl-2">
                    {node.children.map((child) => (
                        <FileTreeItem key={child.id} node={child} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    )
}
