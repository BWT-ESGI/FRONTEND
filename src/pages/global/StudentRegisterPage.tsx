import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { APP_NAME } from "@/config";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserProfile, finalizeRegistration, checkRegistrationId } from "@/services/authentification"; // <-- ajout updateUserProfile
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
  username: z.string().min(2),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  description: z.string().optional(),
  email: z.string().email().optional(),
});

const StudentRegisterPage = () => {
  const { id: registrationId } = useParams();  
  const [submitted, setSubmitted] = useState(false);
  const [invalidId, setInvalidId] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      description: "",
    },    
  });

  useEffect(() => {
    if (registrationId) {
      checkRegistrationId(registrationId)
        .then((res) => {
          if (!res.valid) {
            setInvalidId(true);
          } else {
            setEmail(res.email || "");
          }
        })
        .catch(() => setInvalidId(true));
    } else {
      setInvalidId(false);
    }
  }, [registrationId]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!registrationId) return;
    try {
      const response = await updateUserProfile(email, data);
      if(response.status == 200) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour du profil:", err);
    }
  };

  if (invalidId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-sm w-full flex flex-col items-center border rounded-lg p-6 shadow-sm text-center">
          <p className="text-lg font-semibold">Invalid or expired registration link.</p>
          <Button className="mt-6" onClick={() => navigate("/auth/login")}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-sm w-full flex flex-col items-center border rounded-lg p-6 shadow-sm">
        <p className="mt-4 text-xl font-bold tracking-tight">
          Register to {APP_NAME}
        </p>

        <div className="mt-6 w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                render={() => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" value={email} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Save Info</Button>
            </form>
          </Form>
        </div>

        {submitted && email && (
          <>
            <div className="my-6 w-full flex items-center justify-center overflow-hidden">
              <Separator />
            </div>

            <div className="w-full flex justify-center">
              <GoogleLogin
                width="300px"
                onSuccess={async (credentialResponse) => {
                  if (credentialResponse.credential) {
                    const response = await finalizeRegistration(email, credentialResponse.credential);
                    if (response.data.accessToken) {
                      window.location.href = "/gestion-projets";
                    } else {
                      console.error("Erreur backend:", response.data);
                    }
                  }
                }}
                onError={() => console.error("Erreur lors de la connexion Google")}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentRegisterPage;