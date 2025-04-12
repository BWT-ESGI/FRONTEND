import { GoogleLogin } from '@react-oauth/google';
import { APP_NAME } from "@/config";
import { Separator } from "@/components/ui/separator";
import { sendGoogleToken } from "@/services/authentification";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-sm w-full flex flex-col items-center border rounded-lg p-6 shadow-sm">
        <p className="mt-4 text-xl font-bold tracking-tight">
          Log in to {APP_NAME}
        </p>

        <div className="mt-8 w-full flex justify-center">
          <GoogleLogin
            width="300px"
            onSuccess={async (credentialResponse) => {
              if (credentialResponse.credential) {
                const response = await sendGoogleToken(credentialResponse.credential);
                if (response.data.accessToken) {
                  localStorage.setItem('token', response.data.accessToken);
                  window.location.href = "/list-projets";
                } else {
                  console.error('Erreur côté backend:', response.data);
                }
              }
            }}
            onError={() => {
              console.error('Erreur lors de la connexion Google');
            }}
          />
        </div>

        <div className="my-7 w-full flex items-center justify-center overflow-hidden">
          <Separator />
        </div>

        <div className="mt-5 space-y-5">
          <p className="text-sm text-center">
            Don't have an account?
            <a href="#" className="ml-1 underline text-muted-foreground">
              Create account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;