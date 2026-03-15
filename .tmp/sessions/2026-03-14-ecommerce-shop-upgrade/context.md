# Task Context: Ecommerce Shop Upgrade

Session ID: 2026-03-14-ecommerce-shop-upgrade
Created: 2026-03-14T15:00:00Z
Status: in_progress

## Current Request
Make the page like more like a e-commerce app and show the products from the db in this page and make sure this is responsive. Also, remove the animated background for the /shop pages.

## Context Files (Standards to Follow)
- .opencode/context/core/standards/code-quality.md
- .opencode/context/ui/web/ui-styling-standards.md
- .opencode/context/ui/web/react-patterns.md

## Reference Files (Source Material to Look At)
- src/app/layout.tsx
- src/app/shop/page.tsx
- src/app/shop/[category]/page.tsx
- src/lib/hooks/useShop.ts
- migrations/20260314_normalized_ecommerce.sql
- src/lib/types.ts

## Components
- ProductCard: Premium product display component
- FilterSidebar: Responsive filtering component
- ShopPage: Main product listing page

## Constraints
- Premium, luxury brand identity (minimalist, high-quality)
- Responsive (mobile-first)
- Use normalized schema (product_templates -> product_variants)
- No animated background on /shop routes

## Exit Criteria
- [ ] /shop shows a full, filterable product grid
- [ ] MeshBackground is hidden on /shop routes
- [ ] Layout is fully responsive (filters + grid)
- [ ] Products are fetched correctly from Supabase via useShop hook
