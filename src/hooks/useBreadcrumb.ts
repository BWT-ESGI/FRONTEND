import { useState, useEffect } from "react";

export type BreadcrumbItemData = {
  type: "link" | "page";
  label: string;
  href?: string;
};

export function useBreadcrumb(): BreadcrumbItemData[] {
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItemData[]>(
    []
  );

  useEffect(() => {
    const pathname = window.location.pathname;
    const segments = pathname.split("/").filter(Boolean);

    const items: BreadcrumbItemData[] = [
      { type: "link", label: "Home", href: "/" },
    ];

    let cumulativePath = "";
    segments.forEach((segment, index) => {
      cumulativePath += `/${segment}`;
      const formattedLabel = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      if (index === segments.length - 1) {
        items.push({
          type: "page",
          label: formattedLabel,
        });
      } else {
        items.push({
          type: "link",
          label: formattedLabel,
          href: cumulativePath,
        });
      }
    });

    setBreadcrumbItems(items);
  }, []);

  return breadcrumbItems;
}
