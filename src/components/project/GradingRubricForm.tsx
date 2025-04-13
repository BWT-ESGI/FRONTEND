import React, { useState } from "react";
import FlexibleCard from "@/components/template/FlexibleCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import FlexibleAlert from "../template/FlexibleAlert";
import { ShieldAlert } from "lucide-react";

interface Criterion {
  id: number;
  name: string;
  weight: number;
  description?: string;
}

interface Rubric {
  id: number;
  name: string;
  criteria: Criterion[];
}

const GradingRubricForm: React.FC = () => {
  const [rubricName, setRubricName] = useState<string>("");
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [criterionName, setCriterionName] = useState<string>("");
  const [criterionWeight, setCriterionWeight] = useState<number>(0);
  const [criterionDescription, setCriterionDescription] = useState<string>("");

  const [existingRubrics, setExistingRubrics] = useState<Rubric[]>([
    { id: 1, name: "Grille Exemple 1", criteria: [] },
    { id: 2, name: "Grille Exemple 2", criteria: [] },
  ]);

  const addCriterion = () => {
    if (!criterionName.trim()) return;
    const newCriterion: Criterion = {
      id: Date.now(),
      name: criterionName,
      weight: criterionWeight,
      description: criterionDescription,
    };
    setCriteria([...criteria, newCriterion]);
    setCriterionName("");
    setCriterionWeight(0);
    setCriterionDescription("");
  };

  const removeCriterion = (id: number) => {
    setCriteria(criteria.filter((criterion) => criterion.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRubric: Rubric = {
      id: Date.now(),
      name: rubricName,
      criteria: criteria,
    };
    console.log("New Rubric: ", newRubric);

    setExistingRubrics([...existingRubrics, newRubric]);

    setRubricName("");
    setCriteria([]);
  };

  return (
    <div className="flex space-x-6 p-6">
      <div className="w-1/3">
        <FlexibleCard title="Grilles de notation existantes">
          {existingRubrics.length === 0 ? (
            <FlexibleAlert
              variant="warning"
              title="Aucune grille existante pour le moment."
              icon={<ShieldAlert className="h-4 w-4" />}
            />
          ) : (
            <ul className="divide-y divide-gray-200">
              {existingRubrics.map((rubric) => (
                <li
                  key={rubric.id}
                  className="py-2 hover:bg-gray-50 cursor-pointer"
                >
                  {rubric.name}
                </li>
              ))}
            </ul>
          )}
        </FlexibleCard>
      </div>

      <div className="w-2/3">
        <FlexibleCard title="Créer une grille de notation">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom de la grille
              </label>
              <Input
                value={rubricName}
                onChange={(e) => setRubricName(e.target.value)}
                placeholder="Entrer le nom de la grille"
                className="mt-1"
              />
            </div>

            <div className="border p-4 rounded bg-gray-50">
              <h3 className="text-md font-semibold mb-2">Ajouter un critère</h3>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Nom du critère
                  </label>
                  <Input
                    value={criterionName}
                    onChange={(e) => setCriterionName(e.target.value)}
                    placeholder="Nom du critère"
                    className="mt-1"
                  />
                </div>
                <div className="w-32">
                  <label className="block text-sm font-medium text-gray-700">
                    Poids
                  </label>
                  <div className="flex items-center mt-1">
                    <Input
                      type="number"
                      value={criterionWeight}
                      onChange={(e) =>
                        setCriterionWeight(Number(e.target.value))
                      }
                      placeholder="Poids"
                      min={0}
                      className="w-full"
                    />
                    <div className="flex flex-col ml-1">
                      <button
                        type="button"
                        onClick={() => setCriterionWeight(criterionWeight + 1)}
                        className="p-1 hover:bg-gray-200"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setCriterionWeight(
                            criterionWeight > 0 ? criterionWeight - 1 : 0
                          )
                        }
                        className="p-1 hover:bg-gray-200"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full flex flex-col gap-2">
                  <Label htmlFor="message">Description (optionnel)</Label>
                  <Textarea
                    id="message"
                    value={criterionDescription}
                    onChange={(e) => setCriterionDescription(e.target.value)}
                    placeholder="Ajouter une description..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="mt-4">
                <Button type="button" onClick={addCriterion}>
                  Ajouter le critère
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-md font-semibold mb-2">Critères ajoutés</h3>
              {criteria.length === 0 ? (
                <FlexibleAlert
                  variant="warning"
                  title="Aucun critère ajouté pour le moment."
                  icon={<ShieldAlert className="h-4 w-4" />}
                />
              ) : (
                <div className="space-y-2">
                  {criteria.map((criterion) => (
                    <div
                      key={criterion.id}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div>
                        <p className="font-medium">{criterion.name}</p>
                        <p className="text-sm text-gray-500">
                          Poids : {criterion.weight}
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        type="button"
                        onClick={() => removeCriterion(criterion.id)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Button type="submit">Sauvegarder la grille</Button>
            </div>
          </form>
        </FlexibleCard>
      </div>
    </div>
  );
};

export default GradingRubricForm;
