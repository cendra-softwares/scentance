"use client";

import { useAttributes } from "@/lib/hooks/useAttributes";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
  categorySlug: string;
  className?: string;
}

export function FilterSidebar({ categorySlug, className }: FilterSidebarProps) {
  const { attributes, loading } = useAttributes(categorySlug);

  if (loading || attributes.length === 0) return null;

  return (
    <aside className={cn("flex-shrink-0", className)}>
      <div className="space-y-12">
        <div className="px-1">
          <h3 className="text-white/20 text-[10px] uppercase tracking-[0.5em] mb-8">Filters</h3>
          <div className="space-y-10">
            {attributes.map((attr) => (
              <div key={attr.id} className="space-y-6">
                <h4 className="text-sm uppercase tracking-[0.2em] font-medium">{attr.name}</h4>
                <div className="flex flex-col gap-3">
                  {/* For now, just placeholder options since we'd need to fetch unique values */}
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-4 h-4 rounded-sm border border-white/10 group-hover:border-white/30 transition-colors" />
                    <span className="text-white/40 group-hover:text-white/70 text-sm transition-colors font-light">Option 1</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-4 h-4 rounded-sm border border-white/10 group-hover:border-white/30 transition-colors" />
                    <span className="text-white/40 group-hover:text-white/70 text-sm transition-colors font-light">Option 2</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-12 border-t border-white/5">
            <button className="text-[10px] uppercase tracking-[0.3em] text-white/30 hover:text-white transition-colors">
                Reset Filters
            </button>
        </div>
      </div>
    </aside>
  );
}
