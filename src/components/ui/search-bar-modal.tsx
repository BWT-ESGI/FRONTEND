import * as React from "react";
import { useEffect, useState } from "react";
import { SearchBar } from "./search-bar";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface SearchBarModalProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
}

export function SearchBarModal({
  placeholder = "Spotlight Search",
  ...props
}: SearchBarModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );

  const openModal = () => setIsOpen(true);
  //const closeModal = () => setIsOpen(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.code === "Space") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (dragStart !== null) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setDragPos((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setDragStart(null);
  };

  useEffect(() => {
    if (dragStart !== null) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [dragStart]);

  return (
    <>
      <Button
        variant="outline"
        onClick={openModal}
        className="flex items-center gap-2"
      >
        <SearchIcon className="h-4 w-4" />
        Rechercher
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4">
            <div
            onMouseDown={handleMouseDown}
            style={{ transform: `translate(${dragPos.x}px, ${dragPos.y}px)` }}
            className="relative mt-[10vh] w-full max-w-xl bg-neutral-800/100 text-white px-4 py-2 rounded-2xl shadow-lg flex items-center cursor-move border border-neutral-700"
            >
            <SearchIcon className="h-6 w-6 mr-2 text-neutral-400" />

            <SearchBar
              placeholder={placeholder}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              {...props}
              autoFocus
              icon={false}
              className="w-full placeholder:text-neutral-400 border-none text-white h-12 p-0 m-0 text-lg placeholder:text-lg"
              inputClassName="appearance-none m-0 p-0 focus:border-none focus:ring-0 focus:visible-none focus-visible:border-none focus-visible:ring-0 focus-visible:outline-none text-lg"
              style={{ backgroundColor: "transparent" }}
            />
            </div>
        </div>
      )}
    </>
  );
}