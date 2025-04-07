import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FlexibleCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  childrenRightEnd?: React.ReactNode;
}

export default function FlexibleCard({
  title,
  description,
  children,
  childrenRightEnd,
}: FlexibleCardProps) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between w-full">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {childrenRightEnd && <div>{childrenRightEnd}</div>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
