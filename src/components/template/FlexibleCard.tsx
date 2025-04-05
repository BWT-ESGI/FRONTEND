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
  badge?: React.ReactNode; // Badge flexible status optionnel
}

export default function FlexibleCard({
  title,
  description,
  children,
  badge,
}: FlexibleCardProps) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {badge && <div>{badge}</div>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
