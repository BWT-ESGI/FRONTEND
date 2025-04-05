import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";

export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="max-w-md w-full shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-6xl font-extrabold">404</CardTitle>
                    <CardDescription className="mt-2 text-xl">
                        Page non trouvée
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="mb-6">
                        Désolé, nous n’avons pas trouvé la page que vous recherchez.
                    </p>
                    <Button asChild>
                        <a href="/">Retourner à l’accueil</a>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
