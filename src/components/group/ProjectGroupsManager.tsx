import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

type Mode = "manual" | "random" | "free";

interface Props {
  mode: "manual" | "random" | "free";
  setMode: (mode: "manual" | "random" | "free") => void;
  minSize: number;
  maxSize: number;
  setMinSize: (n: number) => void;
  setMaxSize: (n: number) => void;
  deadline?: Date;
  setDeadline: (d: Date | undefined) => void;
}

export default function ProjectGroupsManager({mode, setMode, minSize, maxSize, setMinSize, setMaxSize, deadline, setDeadline}: Props) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Règle de constitution</Label>
          <Select value={mode} onValueChange={(val) => setMode(val as Mode)}>
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Sélectionner une règle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manuel</SelectItem>
              <SelectItem value="random">Aléatoire</SelectItem>
              <SelectItem value="free">
                Libre (choix des étudiants)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Effectifs par groupe</Label>
          <div className="flex gap-4">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="min">Min</Label>
              <Input
                id="min"
                type="number"
                value={minSize}
                onChange={(e) => setMinSize(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col space-y-1">
              <Label htmlFor="max">Max</Label>
              <Input
                id="max"
                type="number"
                value={maxSize}
                onChange={(e) => setMaxSize(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>
      
      {mode === "free" && (
        <div className="space-y-2">
          <Label>Date limite pour créer un groupe</Label>
          <Calendar mode="single" selected={deadline} onSelect={setDeadline} />
          {deadline && (
            <p className="text-sm text-muted-foreground">
              Sélectionné : {format(deadline, "PPP")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
