import { useEffect, useState } from "react";
import FileInput from "@/components/ui/FileInput";
import { parseCSV } from "@/utils/parseCSV";
import Divider from "@/components/layout/Divider";
import { Input } from "@/components/ui/input";
import FlexibleAlert from "@/components/template/FlexibleAlert";
import { ClipboardMinus } from "lucide-react";
import FlexibleCard from "@/components/template/FlexibleCard";
import { useParams } from "react-router-dom";
import { usePromotion } from "@/hooks/api/usePromotion";
import FallBackPageSkeleton from "../../pages/global/FallBackPageSkeleton";
import { Button } from "@/components/ui/button";
import { updateStudentsPromotion } from "@/services/promotionService";
import toast from "react-hot-toast";
import { useStudents } from "@/hooks/api/useStudents";
import UserCard from "@/components/user/UserCard";

export default function PromotionEditStudentComponent() {
  const { students: users } = useStudents();
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [importedEmails, setImportedEmails] = useState<string[]>([]);
  const { id } = useParams<{ id: string }>();
  const { promotion, loading} = usePromotion(id ?? "");
  const [search, setSearch] = useState("");

  const students = promotion?.students || [];
  const studentsEmails = students.map((student) => student.email);

  useEffect(() => {
    if (studentsEmails.length > 0) {
      setSelectedEmails(studentsEmails);
    }
  }, [promotion?.id]);

  const handleCardClick = (email: string) => {
    setSelectedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const handleFileImport = (files: { file: File }[]) => {
    const selectedFile = files[0]?.file;
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      let parsed: any[] = [];

      try {
        if (selectedFile.name.endsWith(".json")) {
          parsed = JSON.parse(text);
        } else if (selectedFile.name.endsWith(".csv")) {
          parsed = parseCSV(text);
        }

        const emails = parsed.map((item) => item.email).filter(Boolean);
        setImportedEmails(emails);
      } catch (error) {
        console.error("Erreur lors de la lecture du fichier:", error);
      }
    };
    reader.readAsText(selectedFile);
  };

  useEffect(() => {
    setSelectedEmails(importedEmails);
  }, [importedEmails]);

  const filteredUsers = users?.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return (
      fullName.includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleSave = () => {
    const studentIdsToAdd = filteredUsers
      ?.filter((user) => selectedEmails.includes(user.email))
      .map((user) => user.id);

    if (studentIdsToAdd && studentIdsToAdd.length > 0) {
      updateStudentsPromotion(id ?? "", studentIdsToAdd ?? []).then(() => {
        toast.success("Étudiants sauvegardés avec succès");
      }).catch((error) => {
        console.error("Erreur lors de l'ajout des étudiants:", error);
        toast.error("Erreur lors de la sauvegarde des étudiants");
      }
      );
    }
    else {
      toast.error("Aucun étudiant sélectionné");
    }
  }

  if (loading) return <FallBackPageSkeleton />;


  return (
    <div>
      <FlexibleAlert
        variant="warning"
        icon={<ClipboardMinus />}
        title={`Les étudiants doivent être ajouter via l'onglet "Gestion utilisateur" avant d'être ajouté dans une promotion`}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 px-0">
        <FlexibleCard title="Liste des utilisateurs"
          childrenRightEnd={<Button onClick={() => handleSave()}>Sauvegarder</Button>}
          childrenFooter={
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {selectedEmails.length} étudiant(s) sélectionné(s)
              </p>
              <Button onClick={() => handleSave()}>Sauvegarder</Button>
            </div>
          }
        >
          <Divider className="my-2 mt-0" />
          <Input
            placeholder="Rechercher par nom ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="my-2"
          />
          <div className="grid grid-cols-2 gap-2 max-h-[500px] overflow-y-auto pt-4 w-full">
            {filteredUsers?.map((member) => {
              const isSelected = selectedEmails.includes(member.email);
              return (
                <UserCard
                  key={member.email}
                  firstName={member.firstName}
                  lastName={member.lastName}
                  email={member.email}
                  selected={isSelected}
                  onClick={() => handleCardClick(member.email)}
                />
              );
            })}
          </div>
        </FlexibleCard>

        <FlexibleCard title="Importer un fichier">
          <Divider className="my-2 mt-0" />
          <FileInput
            label="Fichier CSV ou JSON contenant des emails"
            accept={{
              "text/csv": [".csv"],
              "application/json": [".json"],
            }}
            maxFiles={1}
            onChange={handleFileImport}
          />
          {importedEmails.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {importedEmails.length} email(s) importé(s), utilisateurs
              sélectionnés automatiquement.
            </div>
          )}
        </FlexibleCard>
      </div>
    </div>
  );
}
