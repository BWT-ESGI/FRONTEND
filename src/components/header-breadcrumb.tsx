import React from "react"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

type BreadcrumbItemData = {
    type: "link" | "page"
    label: string
    href?: string
    className?: string
}

interface AutoBreadcrumbProps {
    items: BreadcrumbItemData[]
}

export function AutoBreadcrumb({ items }: AutoBreadcrumbProps) {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        {items.map((item, index) => (
                            <React.Fragment key={index}>
                                <BreadcrumbItem className={item.className || ""}>
                                    {item.type === "link" ? (
                                        <BreadcrumbLink href={item.href!}>
                                            {item.label}
                                        </BreadcrumbLink>
                                    ) : (
                                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                                    )}
                                </BreadcrumbItem>
                                {index < items.length - 1 && (
                                    <BreadcrumbSeparator className={item.className || ""} />
                                )}
                            </React.Fragment>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
    )
}
