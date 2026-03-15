# Task Context: Fix Variants Text Visibility

Session ID: 2026-03-14-fix-variants-visibility
Created: 2026-03-14T10:00:00Z
Status: in_progress

## Current Request
the "varients" text color is not visible at all , can you fix it

## Context Files (Standards to Follow)
- .opencode/context/core/standards/code-quality.md
- .opencode/context/ui/web/ui-styling-standards.md

## Reference Files (Source Material to Look At)
- src/components/shop/product-card.tsx

## External Docs Fetched
None needed for this simple CSS fix.

## Components
- ProductCard (src/components/shop/product-card.tsx)

## Constraints
- Follow Tailwind CSS patterns.
- Ensure WCAG AA compliance (visibility).
- Use modular/functional patterns.

## Exit Criteria
- [ ] Variants text in ProductCard is visible (opacity increased from 10% to 40% or higher).
- [ ] No regressions in ProductCard layout.
