# Frontend Internal Link Analysis

## Identified Broken Links

1.  **`frontend/src/app/(dashboard)/tools/page.tsx`**:
    *   `/ai/ask` -> `frontend/src/app/(dashboard)/ai/ask/page.tsx` (Valid)
    *   `/tools/resume-builder` -> `frontend/src/app/(dashboard)/tools/resume-builder/page.tsx` (Valid)
    *   `/tools/scholarship-finder` -> `frontend/src/app/(dashboard)/tools/scholarship-finder/page.tsx` (Valid)
    *   `/tools/photo-resizer` -> `frontend/src/app/(dashboard)/tools/photo-resizer/page.tsx` (Valid)
    *   `/jobs` -> `frontend/src/app/(dashboard)/jobs/page.tsx` (Valid)

2.  **`frontend/src/app/(public)/scholarships/[id]/page.tsx`**:
    *   `/login?redirect=/dashboard/scholarships/${scholarship.id}` -> `dashboard/scholarships/[id]` **DOES NOT EXIST**.
    *   **Fix**: Should point to `/scholarships/${scholarship.id}` (public view) or if there is a dashboard view, it's missing. Based on `(dashboard)` structure, there is no `scholarships` route under dashboard, only `tools/scholarship-finder` and `(public)/scholarships`. The application form is likely inline or modal.
    *   **Investigation**: `(dashboard)/tools/scholarship-finder/page.tsx` seems to list scholarships. Is there a detailed view?
    *   `frontend/src/app/(public)/scholarships/[id]/page.tsx` is the detail view. The user is redirected to login, then where?
    *   If the user logs in, they should probably go back to the *public* scholarship detail page where they can apply (since the apply button is there), OR there should be a dashboard route.
    *   However, `frontend/src/app/(public)/scholarships/[id]/page.tsx` has the Apply button that triggers `post(/scholarships/${id}/apply)`. Wait, no.
    *   Line 82: `Link href={/login?redirect=/dashboard/scholarships/${scholarship.id}}`. This implies after login, go to `/dashboard/scholarships/:id`.
    *   But `/dashboard/scholarships/:id` does not exist in the file list.
    *   **Recommendation**: Change redirect to `/scholarships/${scholarship.id}` (the public page) which should have logic to show "Apply" button if logged in.
    *   *Correction*: The public page `frontend/src/app/(public)/scholarships/[id]/page.tsx` Line 81 shows the Apply button links to login. If logged in, does it show an Apply form? The code read previously (Line 39) shows the page structure. It doesn't seem to have "logged in" state logic visible in the snippet. It just links to login.
    *   If I look at `frontend/src/components/landing-page-client.tsx`, it links to `/scholarships`.

3.  **`frontend/src/components/dashboard/command-menu.tsx`**:
    *   `/dashboard` -> Valid.
    *   `/scholarships` -> Valid (Public).
    *   `/settings` -> `frontend/src/app/(dashboard)/settings/page.tsx` (Valid).
    *   `/profile` -> `frontend/src/app/(dashboard)/profile/page.tsx` (Valid).
    *   `/support` -> `frontend/src/app/(dashboard)/support/page.tsx` (Valid).

## Fix Plan
1.  **Fix 1**: In `frontend/src/app/(public)/scholarships/[id]/page.tsx`, change the redirect URL from `/dashboard/scholarships/${scholarship.id}` to `/scholarships/${scholarship.id}`. The public page should be capable of handling authenticated users (or at least, that's where the user expects to return).
2.  **Verify**: Check if `frontend/src/app/(public)/scholarships/[id]/page.tsx` adapts when a user is logged in. The current code snippet shows it *always* shows "Login required to apply" button (Line 81-86). This is a logic gap. It should check authentication. Since this is a server component (`async function`), it can check cookies/session.
    *   *Self-Correction*: Use `useAuthStore` is client-side. Server components need a different way or be client components.
    *   The page is a Server Component. It cannot use `useAuthStore`.
    *   It renders a button that *always* links to login. This is broken for logged-in users.
    *   **Action**: Convert `ScholarshipDetailPage` to use a Client Component wrapper for the "Apply" section, or make the whole page a Client Component to check auth state, OR (better) just fix the link to redirect back to the same page, and then update the page to show an "Apply" button if cookies exist (Server Side) or via Client Side hydration.
    *   For now, strictly fixing *broken links* (404s), redirecting to `/dashboard/scholarships/...` is definitely a 404. Redirecting to `/scholarships/...` is valid (200), even if the UX is imperfect (might still show "Login" button).
    *   I will change the redirect link to `/scholarships/${scholarship.id}`.

## Other Potential Issues
- `frontend/src/components/landing-page-client.tsx` links to `/register`, `/scholarships`. All seem valid.
- `frontend/src/components/dashboard/sidebar.tsx` links to `/dashboard`, `/dashboard/support`. Valid.

## Execution
1. Modify `frontend/src/app/(public)/scholarships/[id]/page.tsx` to fix the redirect link.
