import { Skeleton } from "@/components/ui/skeleton";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export function FlexibleCardSkeleton({ children }: { children?: React.ReactNode }) {
    return (
        <Card className="animate-pulse bg-default shadow-sm border border-muted rounded-lg p-4">
            <CardHeader>
                <CardTitle>
                    <Skeleton className="h-6 w-1/2" />
                </CardTitle>
                <CardDescription>
                    <Skeleton className="h-4 w-1/3" />
                </CardDescription>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            <CardFooter>
                <Skeleton className="h-4 w-1/3" />
            </CardFooter>
        </Card>
    );
}
