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
      if (index === segments.length - 1) {
        items.push({
          type: "page",
          label: segment.charAt(0).toUpperCase() + segment.slice(1),
        });
      } else {
        items.push({
          type: "link",
          label: segment.charAt(0).toUpperCase() + segment.slice(1),
          href: cumulativePath,
        });
      }
    });

    setBreadcrumbItems(items);
  }, []);

  return breadcrumbItems;
}
