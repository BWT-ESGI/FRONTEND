interface GroupTimelineProps {
  groups: { id: string; name: string; defenseDate?: string }[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

export default function GroupTimeline({ groups, currentIndex, onSelect }: GroupTimelineProps) {
  return (
    <div className="max-w-screen-sm md:mx-auto py-6 px-2">
      <div className="relative">
        {groups.map((group, idx) => {
          const isActive = idx === currentIndex;
          const dateObj = group.defenseDate ? new Date(group.defenseDate) : null;
          const dateStr = dateObj ? dateObj.toLocaleDateString("fr-FR", { year: "numeric", month: "2-digit", day: "2-digit" }) : "—";
          const timeStr = dateObj ? dateObj.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "—";
          return (
            <div key={group.id} className="group relative">
              <div className="flex items-start">
                <div className="mt-3 mr-5 flex flex-col gap-2 shrink-0 w-[75px] sm:w-[90px] text-end">
                  <h6 className="text-sm text-primary font-semibold">
                    {timeStr}
                  </h6>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    {dateStr}
                  </span>
                </div>
                <div className="relative pb-5 border-l-2 group-last:pb-4 pl-6 sm:pl-8 flex items-center min-h-[32px]">
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label={`Sélectionner ${group.name}`}
                    className={`absolute h-3 w-3 -translate-x-1/2 -left-px top-1/2 -translate-y-1/2 rounded-full border-2 transition-colors duration-150 ${isActive ? "border-primary bg-primary" : "border-gray-300 bg-background hover:border-primary hover:bg-primary/30"}`}
                    onClick={() => onSelect(idx)}
                    onKeyPress={e => {
                      if (e.key === "Enter" || e.key === " ") onSelect(idx);
                    }}
                  />
                  <span
                    role="button"
                    tabIndex={0}
                    className={`mt-4 ml-6 sm:ml-8 flex flex-col justify-center items-start cursor-pointer select-none ${isActive ? "text-primary font-bold" : "hover:underline text-muted-foreground"}`}
                    style={{ minHeight: 32 }}
                    onClick={() => onSelect(idx)}
                  >
                    {group.name}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
