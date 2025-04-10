import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { XCircleIcon, FileTextIcon, FileIcon } from "lucide-react";
import { useState, useEffect } from "react";
import Dropzone from "react-dropzone";

interface FileWithPreview {
  file: File;
  preview: string;
}

export interface FileInputProps {
  label?: string;
  accept?: { [mime: string]: string[] };
  maxFiles?: number;
  onChange?: (files: FileWithPreview[]) => void; // nouvelle propriété pour transmettre la liste des fichiers
}

const FilePreview = ({
  fileWithPreview,
  onRemove,
}: {
  fileWithPreview: FileWithPreview;
  onRemove: () => void;
}) => {
  return (
    <div className="relative border border-border rounded-md p-2">
      <button
        className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2"
        onClick={onRemove}
      >
        <XCircleIcon className="h-5 w-5 fill-primary text-primary-foreground" />
      </button>
      <div className="flex flex-col items-center justify-center h-40 w-40">
        <FileTextIcon className="h-10 w-10 text-muted-foreground" />
        <p className="mt-2 text-sm text-center">{fileWithPreview.file.name}</p>
      </div>
    </div>
  );
};

export default function FileInput({
  label = "Fichier",
  accept = {
    "image/png": [".png"],
    "image/jpeg": [".jpg", ".jpeg"],
    "image/webp": [".webp"],
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
    "application/vnd.ms-excel": [".xls"],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
      ".xlsx",
    ],
    "application/vnd.ms-powerpoint": [".ppt"],
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      [".pptx"],
    "text/csv": [".csv"],
    "application/json": [".json"],
    "application/xml": [".xml"],
    "application/zip": [".zip"],
    "application/x-rar-compressed": [".rar"],
    "application/x-7z-compressed": [".7z"],
    "application/x-tar": [".tar"],
    "application/x-gzip": [".gz"],
    "application/x-bzip2": [".bz2"],
    "application/x-iso9660-image": [".iso"],
    "application/x-msdownload": [".exe"],
    "application/x-shockwave-flash": [".swf"],
    "application/x-font-ttf": [".ttf"],
    "application/x-font-opentype": [".otf"],
    "application/x-font-woff": [".woff"],
    "application/x-font-woff2": [".woff2"],
  },
  maxFiles = 1,
  onChange, // nouvelle propriété
}: FileInputProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  useEffect(() => {
    return () => {
      files.forEach((f) => URL.revokeObjectURL(f.preview));
    };
  }, [files]);

  const onDrop = (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles
      .slice(0, maxFiles - files.length)
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    if (onChange) {
      onChange(updatedFiles);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      if (onChange) {
        onChange(newFiles);
      }
      return newFiles;
    });
  };

  return (
    <div className="w-full">
      <Label htmlFor="file-input">{label}</Label>
      <div className="mt-1">
        {files.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {files.map((fileWithPreview, index) => (
              <FilePreview
                key={index}
                fileWithPreview={fileWithPreview}
                onRemove={() => removeFile(index)}
              />
            ))}
          </div>
        ) : (
          <Dropzone onDrop={onDrop} accept={accept} maxFiles={maxFiles}>
            {({
              getRootProps,
              getInputProps,
              isDragActive,
              isDragAccept,
              isDragReject,
            }) => (
              <div
                {...getRootProps()}
                className={cn(
                  "border border-dashed flex items-center justify-center aspect-square rounded-md focus:outline-none focus:border-primary",
                  {
                    "border-primary bg-secondary": isDragActive && isDragAccept,
                    "border-destructive bg-destructive/20":
                      isDragActive && isDragReject,
                  }
                )}
              >
                <input {...getInputProps()} id="file-input" />
                <FileIcon className="h-16 w-16" strokeWidth={1.25} />
              </div>
            )}
          </Dropzone>
        )}
      </div>
    </div>
  );
}
