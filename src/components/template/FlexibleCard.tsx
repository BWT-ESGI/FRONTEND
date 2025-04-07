import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FlexibleCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  childrenRightEnd?: React.ReactNode;
  childrenFooter?: React.ReactNode;
  className?: string;
}

export default function FlexibleCard({
  title,
  description,
  children,
  childrenRightEnd,
  childrenFooter,
  className,
}: FlexibleCardProps) {
  return (
    <Card className={`${className}`}>
      <CardHeader className="flex items-center justify-between w-full">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {childrenRightEnd && <div>{childrenRightEnd}</div>}
      </CardHeader>
      <CardContent className="h-full">{children}</CardContent>
      <CardFooter className="mt-auto">
        {childrenFooter && <div className="w-full">{childrenFooter}</div>}
      </CardFooter>
    </Card>
  );
}
