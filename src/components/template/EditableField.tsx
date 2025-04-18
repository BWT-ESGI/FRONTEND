import { useState, useMemo } from "react";
import { useUpdateProject } from "@/hooks/api/useUpdateProject";
import { Project } from "@/types/project.type";
import debounce from "lodash/debounce";

export default function EditableField({ projectId, fieldName, initialValue }: {
  projectId: string;
  fieldName: keyof Project;
  initialValue: string;
}) {
  const [value, setValue] = useState(initialValue);
  const { mutate: updateProject } = useUpdateProject();

  const debouncedUpdate = useMemo(() => debounce((newValue: string) => {
    updateProject({ projectId, body: { [fieldName]: newValue } });
  }, 500), [projectId, fieldName, updateProject]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedUpdate(newValue);
  };

  return (
    <input
      value={value}
      onChange={handleChange}
      placeholder={`Modifier ${fieldName}`}
      className="mt-2"
    />
  );
}