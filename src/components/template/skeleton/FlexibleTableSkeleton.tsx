import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export function FlexibleTableSkeleton() {
    const skeletonRows = Array.from({ length: 5 });

    return (
        <div className="w-full animate-pulse">
            <div className="flex justify-between items-center gap-2 py-4">
                <Skeleton className="h-8 w-52 rounded" />
                <Skeleton className="h-8 w-32 rounded" />
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {Array.from({ length: 4 }).map((_, index) => (
                                <TableHead key={index}>
                                    <Skeleton className="h-4 w-20" />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {skeletonRows.map((_, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {Array.from({ length: 4 }).map((_, cellIndex) => (
                                    <TableCell key={cellIndex}>
                                        <Skeleton className="h-4 w-full" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1">
                    <Skeleton className="h-4 w-32" />
                </div>
                <div className="space-x-2">
                    <Skeleton className="h-8 w-16 rounded" />
                    <Skeleton className="h-8 w-16 rounded" />
                </div>
            </div>
        </div>
    );
}
