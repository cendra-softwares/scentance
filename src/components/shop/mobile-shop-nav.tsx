"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FilterIcon, LayoutGridIcon } from "lucide-react";
import { FilterSidebar } from "./filter-sidebar";
import { Category } from "@/lib/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface MobileShopNavProps {
  categorySlug: string;
  categories: Category[];
  isComingSoon?: boolean;
}

export function MobileShopNav({ categorySlug, categories, isComingSoon }: MobileShopNavProps) {
  const pathname = usePathname();

  return (
    <div className="flex lg:hidden items-center justify-between gap-4 py-6 border-b border-white/5 mb-8">
      {/* Category Switcher */}
      <Sheet>
        <SheetTrigger asChild>
          <button className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase tracking-[0.2em] font-medium text-white/60">
            <LayoutGridIcon className="size-3" />
            Collections
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-black border-r border-white/10 text-white pt-12 px-8">
          <SheetHeader className="px-0 mb-12">
            <SheetTitle className="text-white text-[10px] uppercase tracking-[0.5em] opacity-30 text-left">Archive</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-8">
            <Link 
              href="/shop"
              className={cn(
                "text-2xl font-light tracking-tight transition-colors",
                pathname === "/shop" ? "text-white" : "text-white/30 hover:text-white/60"
              )}
            >
              All Collections
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop/${cat.slug}`}
                className={cn(
                  "text-2xl font-light tracking-tight transition-colors capitalize",
                  categorySlug === cat.slug ? "text-white" : "text-white/30 hover:text-white/60"
                )}
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Filter Sidebar (Only if not coming soon) */}
      {!isComingSoon && (
        <Sheet>
          <SheetTrigger asChild>
            <button className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase tracking-[0.2em] font-medium text-white/60">
              <FilterIcon className="size-3" />
              Filters
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-black border-l border-white/10 text-white pt-12 px-8 overflow-y-auto">
            <SheetHeader className="px-0 mb-12">
              <SheetTitle className="text-white text-[10px] uppercase tracking-[0.5em] opacity-30 text-left">Refine Selection</SheetTitle>
            </SheetHeader>
            <FilterSidebar categorySlug={categorySlug} className="w-full" />
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
