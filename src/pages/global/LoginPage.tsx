// src/pages/LoginPage.tsx
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { APP_NAME } from "@/config";
import { Separator } from "@/components/ui/separator";
import { sendGoogleToken } from "@/services/authentification";
import AskSchoolModal, { School } from "@/components/auth/askSchoolModal";
import chooseLogoColor from "@/utils/chooseLogoColor";
import { ModeToggle } from "@/components/utils/ModeToggle";

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [school, setSchool] = useState<School | null>(null);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) return;

    try {
      let response;
      if (isRegistering && school) {
        response = await sendGoogleToken(credentialResponse.credential, school.name);
      } else {
        response = await sendGoogleToken(credentialResponse.credential);
      }

      if (response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        window.location.href = "/dashboard";
      } else {
        console.error("Backend error:", response.data);
      }
    } catch (err) {
      console.error("Authentication error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <div className="max-w-sm w-full flex flex-col items-center border rounded-lg p-6 shadow-sm">
        <img
          src={chooseLogoColor().logo}
          alt="Logo"
          className="w-20 h-20 object-cover"
        />
        <p className="mt-4 text-xl font-bold tracking-tight">
          {isRegistering ? `Register on ${APP_NAME}` : `Log in to ${APP_NAME}`}
        </p>

        <div className="mt-8 w-full flex flex-col justify-center gap-4">
          {isRegistering && <AskSchoolModal onSelect={(s) => setSchool(s)} />}

          <div
            className={
              isRegistering && !school ? "pointer-events-none opacity-50" : ""
            }
          >
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.error("Google login error")}
            />
          </div>
        </div>

        <div className="my-7 w-full flex items-center justify-center overflow-hidden">
          <Separator />
        </div>

        <p className="mt-5 text-sm text-center">
          {isRegistering ? (
            <>
              Déjà un compte?
              <button
                onClick={() => {
                  setIsRegistering(false);
                  setSchool(null);
                }}
                className="ml-1 underline text-muted-foreground"
              >
                Se connecter
              </button>
            </>
          ) : (
            <>
              Pas encore de compte?
              <button
                onClick={() => setIsRegistering(true)}
                className="ml-1 underline text-muted-foreground"
              >
                Créer un compte
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}