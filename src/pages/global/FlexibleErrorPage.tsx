import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";

interface FlexibleErrorPageProps {
    errorCode: number;
    errorMessage: string;
    userFriendlyMessage: string;
}

export default function FlexibleErrorPage({
    errorCode,
    errorMessage,
    userFriendlyMessage,
}: FlexibleErrorPageProps) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="max-w-md w-full shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-6xl font-extrabold">{errorCode}</CardTitle>
                    <CardDescription className="mt-2 text-xl">
                        {errorMessage}
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="mb-6">{userFriendlyMessage}</p>
                    <Button asChild>
                        <a href="/">Retourner à l’accueil</a>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
