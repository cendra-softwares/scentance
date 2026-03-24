# 🔐 Scentance Security Audit Report

**Project:** Next.js 16 + Supabase E-Commerce (Perfume Shop)  
**Date:** March 24, 2026  
**Overall Assessment:** 🔴 **Requires Critical Changes Before Production**

---

## Executive Summary

| Severity    | Count | Must Fix Before Deploy |
| ----------- | ----- | ---------------------- |
| 🔴 CRITICAL | 8     | ✅ Yes                 |
| 🟡 HIGH     | 11    | ✅ Yes                 |
| 🟠 MEDIUM   | 10    | Should fix             |
| 🔵 LOW      | 8     | Nice to have           |

**Total findings: 37**

---

## 🔴 CRITICAL Findings (Fix Immediately)

### 1. No Role-Based Access Control — Any Authenticated User Is Treated as Admin

- **Files:** `src/app/dashboard/page.tsx:14-18`, `src/app/dashboard/orders/page.tsx:15-19`, `src/app/dashboard/products/page.tsx:14-18`, `src/lib/actions.tsx:100-103, 166-169, 207-208, 242-243, 263-264`
- **Issue:** Every auth check only verifies `if (!user)` — it never checks what kind of user they are. Any customer who creates an account can access `/dashboard`, view all orders, modify products, delete orders, and send confirmation emails. There is zero admin role enforcement.
- **Impact:** Privilege escalation — any registered user gains full admin access to the e-commerce backend.
- **Fix:** Implement a `profiles` table with roles. Check `user.role === 'admin'` in every dashboard page and server action.

### 2. `createOrder` Has No Authentication Check

- **File:** `src/lib/actions.tsx:10-95`
- **Issue:** The `createOrder` server action performs zero authentication. Any anonymous user (or bot) can call this action to create orders, trigger confirmation emails to arbitrary addresses, and pollute the `orders` table.
- **Impact:** Spam orders, email abuse via Resend (could burn sending reputation), database pollution, potential cost amplification.
- **Fix:** Add authentication check and rate limiting.

### 3. Client-Side Price Used for Order Total — Price Tampering

- **File:** `src/lib/actions.tsx:22-25`
- **Issue:** The order total is calculated from `item.price` which comes directly from the client-supplied `data.items`. An attacker can submit a crafted request with `price: "1"` for every item, purchasing products at any price they choose.
- **Impact:** Direct financial loss — products sold at arbitrary prices.
- **Fix:** Always look up the price server-side from the database by product ID.

### 4. No Server-Side Input Validation on Any Server Action

- **File:** `src/lib/actions.tsx` (entire file)
- **Issue:** None of the 6 server actions validate their inputs. Zod is in `package.json` but never imported. `createProduct` inserts raw user input directly into Supabase.
- **Impact:** Data integrity issues, stored XSS via email templates, abuse vectors.
- **Fix:** Create Zod schemas for each action's input. Parse before any DB operation.

### 5. `sendOrderConfirmationEmail` Has No Auth Check

- **File:** `src/lib/actions.tsx:123-161`
- **Issue:** This server action fetches any order by ID and sends a confirmation email without verifying the caller is authenticated or authorized.
- **Impact:** Email abuse — attacker can spam customers with confirmation emails, causing reputational damage and potential Resend account suspension.
- **Fix:** Add auth + role check, or scope to the order's owner.

### 6. No RLS Policies in Database Schema

- **File:** `migrations/20260314_normalized_ecommerce.sql`
- **Issue:** The migration creates tables with zero Row Level Security policies. If RLS is not enabled, the Supabase publishable key can read/write all data from the browser.
- **Impact:** Complete data exposure — client-side code with the anon key could potentially read all orders, customer PII, and modify/delete any product.
- **Fix:** Enable RLS on every table and create restrictive policies.

### 7. No Middleware — Route Protection Is Page-Level Only

- **Issue:** No `middleware.ts` exists in the project root. Auth checks are scattered across individual page components. If any developer forgets the check on a new dashboard page, it's immediately unprotected.
- **Impact:** Defense-in-depth failure — a single omission exposes the entire admin area.
- **Fix:** Create `src/middleware.ts` with Supabase auth middleware.

### 8. File Upload Has No Server-Side Validation

- **File:** `src/components/dashboard/products-dashboard.tsx:237-265`
- **Issue:** Image upload accepts any file. Only `accept="image/*"` on the HTML input (client-side hint, easily bypassed). No server-side validation of file type, size, or content.
- **Impact:** Web shell upload, HTML file with embedded scripts, malicious SVG files.
- **Fix:** Validate MIME type server-side, check file magic bytes, enforce size limits.

---

## 🟡 HIGH Findings (Fix Before Production)

### 9. No Rate Limiting on Any Server Action

- **Files:** `src/lib/actions.tsx` (all actions)
- **Issue:** No rate limiting exists anywhere — no middleware, no in-memory throttle, no Supabase edge function rate limiter.
- **Impact:** Denial of service, cost amplification, resource exhaustion.

### 10. `updateOrderStatus` / `deleteOrder` — Auth but No Authorization

- **Files:** `src/lib/actions.tsx:97-121`, `src/lib/actions.tsx:163-187`
- **Issue:** Checks `supabase.auth.getUser()` but does not verify the user is an admin. Any authenticated user can update/delete any order.
- **Impact:** Privilege escalation — customers can mark their own orders as "confirmed" or "shipped".

### 11. Auth Errors Leaked to UI

- **File:** `src/app/login/page.tsx:29-30, 52-53`
- **Issue:** `signInError.message` and `signUpError.message` from Supabase are displayed verbatim to the user.
- **Impact:** User enumeration — attacker can determine which emails have accounts.

### 12. `select("*")` Over-Fetches Potentially Sensitive Columns

- **Files:** `src/lib/hooks/useProducts.ts:37`, `src/lib/hooks/useShop.ts:19`
- **Issue:** Both hooks use `.select("*")` which returns all columns. Admin-only columns (cost_price, supplier_id, internal_notes) could be exposed.
- **Impact:** Information disclosure — internal business data visible in browser network tab.

### 13. No Security Headers Configured

- **File:** `next.config.ts`
- **Issue:** Missing all security headers: Content-Security-Policy, Strict-Transport-Security, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
- **Impact:** Vulnerable to clickjacking, MIME sniffing attacks, lacks HTTPS enforcement.

### 14. Critical Vulnerability in `jspdf` — PDF Object Injection

- **File:** `package.json:27`
- **Issue:** `jspdf@^4.2.0` has a CRITICAL npm audit finding: PDF Object Injection and HTML Injection vulnerabilities.
- **Impact:** If user-controlled data flows into PDF generation, attackers could inject malicious PDF objects.

### 15. Critical Vulnerability in `xlsx` — Prototype Pollution & ReDoS

- **File:** `package.json:47`
- **Issue:** `xlsx@^0.18.5` has a HIGH severity finding: Prototype Pollution and ReDoS. No fix is available from the maintainer.
- **Impact:** Processing untrusted Excel files could lead to prototype pollution or DoS.

### 16. Multiple High-Severity Vulnerabilities in `next`

- **File:** `package.json:31`
- **Issue:** `next@16.1.1` has 8 advisories including DoS, HTTP request smuggling, and CSRF bypass.
- **Impact:** Various attack vectors depending on the specific vulnerability.

### 17. Cart State in localStorage Enables Price Manipulation

- **File:** `src/lib/store/useCart.ts:86-88`
- **Issue:** Cart is persisted to localStorage. A savvy user can modify `scentance-cart` in localStorage to change all prices to `1` and submit the order.
- **Impact:** Price tampering (mitigated if Finding #3 is fixed — but defense in depth matters).

### 18. Hardcoded Admin User in Sidebar — Not From Session

- **File:** `src/components/app-sidebar.tsx:19-24`
- **Issue:** The sidebar displays a hardcoded user object (`name: "Admin"`, `email: "admin@scentance.com"`). Not derived from the actual authenticated session.
- **Impact:** Misleading UI — masks privilege issues, prevents proper audit logging.

### 19. Logout Doesn't Invalidate Server-Side Session

- **File:** `src/components/nav-user.tsx:37-41`
- **Issue:** `handleLogout` calls `supabase.auth.signOut()` on the client and does a client-side redirect. Server-side cookie may not be properly cleared.
- **Impact:** Orphaned sessions — server may still consider user authenticated after logout.

---

## 🟠 MEDIUM Findings (Should Fix)

### 20. No Brute Force / Rate Limiting on Login

- **File:** `src/app/login/page.tsx:16-37`
- **Issue:** No client-side or server-side rate limiting on login attempts.
- **Impact:** Credential stuffing and brute force attacks are trivially executable.

### 21. Dynamic Route Params Not Validated for NaN

- **File:** `src/app/shop/[category]/[id]/page.tsx:25`
- **Issue:** `Number(params.id)` is used without validation. Non-numeric IDs return `NaN`.
- **Impact:** Confusing behavior, potential edge case errors.

### 22. Error Messages Leak RLS / Internal Architecture

- **Files:** `src/lib/actions.tsx:117`, `src/lib/actions.tsx:183`
- **Issue:** Error messages like `"No order updated (check RLS policies)"` expose internal security architecture.
- **Impact:** Information disclosure about authorization mechanism.

### 23. Product CRUD Has No Input Validation

- **Files:** `src/lib/actions.tsx:189-258`
- **Issue:** Product mutation functions accept arbitrary data without schema validation. Price is a string, not a number.
- **Impact:** Data integrity — malformed data could be inserted. XSS risk if rendered without escaping.

### 24. No Audit Logging on Product Mutations

- **File:** `src/lib/actions.tsx:224`
- **Issue:** `updateProduct` accepts partial updates on any field with no audit logging of who changed what.
- **Impact:** If admin account is compromised, attacker can silently modify prices.

### 25. `items: any[]` in Email Templates — Untyped Data Flow

- **Files:** `src/components/emails/order-received.tsx:6`, `src/components/emails/order-confirmed.tsx:6`
- **Issue:** The `items` prop is typed as `any[]`, meaning no compile-time safety on what data flows into email templates.
- **Impact:** If item structure changes, emails could render incorrectly or expose unexpected fields.

### 26. PDF Filename Injection

- **File:** `src/components/dashboard/orders-dashboard.tsx:406`
- **Issue:** User-controlled `customer_name` is used in PDF filename without sanitization. Only spaces replaced.
- **Impact:** Special characters in names could cause filename issues or path traversal.

### 27. Category Slug Displayed Without Sanitization

- **File:** `src/app/shop/[category]/page.tsx:36-37`
- **Issue:** `categorySlug` from URL is rendered directly in components.
- **Impact:** Low due to React auto-escaping, but should validate slug format.

### 28. `dangerouslySetInnerHTML` in Chart Component

- **File:** `src/components/ui/chart.tsx:83`
- **Issue:** Uses `dangerouslySetInnerHTML` to inject CSS. Currently config-driven (not user-driven).
- **Impact:** Low currently, but pattern to watch.

### 29. Debug `console.log` in Production Code

- **Files:** `src/lib/hooks/useProducts.ts:33,44`, `src/components/hero-section.tsx:26`
- **Issue:** Debug logs will execute in browser console in production.
- **Impact:** Information disclosure, log clutter.

---

## 🔵 LOW Findings (Nice to Have)

### 30. No Explicit CORS Configuration

- **Issue:** No CORS headers explicitly configured. Next.js defaults to same-origin.
- **Impact:** Acceptable for standard web app. Needed if adding external API consumers.

### 31. Hardcoded Supabase Project URL in Config

- **File:** `next.config.ts:13`
- **Issue:** Supabase hostname hardcoded in image remote patterns.
- **Impact:** Low — reveals project ref, but public hostname.

### 32. Cart `addItem` Typed as `any`

- **File:** `src/lib/store/useCart.ts:18`
- **Issue:** `addItem: (item: any) => void` bypasses TypeScript's type safety.
- **Impact:** Any object can be passed; `price` could be `undefined`.

### 33. Zod Imported But Only Used for Type Inference

- **File:** `src/components/data-table.tsx:40,97-105`
- **Issue:** Zod schema defined but never used for runtime validation.
- **Impact:** No runtime type checking at data ingestion points.

### 34. Contact Form Has No Backend Handler

- **File:** `src/app/contact-us/page.tsx:68-87`
- **Issue:** Form has no `onSubmit`, no action, submit button does nothing.
- **Impact:** Non-functional form. When implemented, must include validation.

### 35. Copyright Year Stale in Email Templates

- **Files:** `order-received.tsx:142`, `order-confirmed.tsx:116`
- **Issue:** Copyright says "© 2024" — should be updated or made dynamic.

### 36. Server-Side Supabase Client Uses Publishable Key

- **File:** `src/lib/supabase/server.ts:9`
- **Issue:** Uses `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` instead of service role key.
- **Impact:** Acceptable if relying on RLS. Document as intentional.

### 37. No CSRF Token Explicitly Configured

- **File:** `src/lib/actions.tsx` (all server actions)
- **Issue:** Next.js server actions have built-in CSRF protection in production, but should be verified.
- **Impact:** Low — Next.js handles this by default.

---

## ✅ What's Already Good

- `.gitignore` correctly excludes `.env*` files
- Supabase publishable key (modern approach) used correctly
- `RESEND_API_KEY` loaded via `process.env` (not hardcoded)
- Auth checks exist on most admin operations (baseline level)
- React auto-escaping protects against XSS in JSX
- Email templates use React components (auto-escaped)
- `removeConsole: true` and `reactRemoveProperties: true` in production config
- Image remote patterns locked to Supabase storage only
- `rel="noopener noreferrer"` properly used on external links
- Supabase parameterized queries prevent SQL injection in `.eq()` filters

---

## 📋 Remediation Plan

### ✅ Phase 1 — Critical Security Fixes — COMPLETED (March 24, 2026)

1. ✅ **Implement RBAC** — Created `profiles` table with `role` column, `requireAdmin()` helper, enforced on all dashboard pages and server actions
2. ✅ **Add Next.js middleware** — Centralized auth + admin role guard for `/dashboard/*` routes (`src/middleware.ts`)
3. ✅ **Enable RLS policies** — Restrictive policies on all 9 tables via Supabase MCP (profiles, products, orders, order_items, categories, product_templates, product_variants, attribute_definitions, variant_attribute_values)
4. ✅ **Add Zod validation** — Created `src/lib/schemas.ts` with schemas for orders, products, order status, and file upload validation
5. ✅ **Server-side price lookup** — `createOrder` now fetches actual prices from DB, never trusts client-supplied prices
6. ✅ **Add auth to `createOrder` and `sendOrderConfirmationEmail`** — `createOrder` validates input + looks up prices server-side; `sendOrderConfirmationEmail` requires admin
7. ✅ **File upload validation** — MIME type allowlist, 5MB size limit, sanitized file extension

**Files changed:** `src/lib/auth.ts` (new), `src/lib/schemas.ts` (new), `src/middleware.ts` (new), `src/lib/actions.tsx` (rewritten), `src/app/dashboard/page.tsx`, `src/app/dashboard/orders/page.tsx`, `src/app/dashboard/products/page.tsx`, `src/components/dashboard/products-dashboard.tsx`, `SECURITY-AUDIT.md` (new)

### Phase 2 — High Priority Hardening

8. **Add security headers** to `next.config.ts` (CSP, HSTS, X-Frame-Options, etc.)
9. **Run `npm audit fix`** — Resolve 16 of 18 dependency vulnerabilities
10. **Replace `xlsx`** with `exceljs` (no fix available for current package)
11. **Normalize auth error messages** — Stop leaking Supabase internals
12. **Explicit column selection** — Replace `select("*")` with specific columns
13. **Server-side logout** — Ensure cookies properly cleared
14. **Rate limiting** — At minimum on login and `createOrder`

### Phase 3 — Medium Priority

15. Add status allowlist validation on `updateOrderStatus`
16. Sanitize PDF filenames
17. Validate dynamic route params
18. Add audit logging for admin mutations
19. Remove debug `console.log` statements
20. Type email template props properly

### Phase 4 — Low Priority / Cleanup

21. Add explicit CORS config if needed
22. Type cart store properly (remove `any`)
23. Implement contact form backend with validation
24. Update copyright years in email templates

---

*Audit conducted on March 24, 2026. Phase 1 completed — see git branch `security/phase-1-critical-fixes`.*
