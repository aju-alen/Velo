# Velo Client — Feedback Gap Analysis

**Date:** 2026-09-28  
**Scope:** Codebase vs stakeholder feedback (no separate original requirements docs found in-repo)  
**Packages:** `velo-client/` (Expo), `api/` (Express + Prisma)  
**Owning roadmap:** W7 → W4 → W6 → W2 → W5 → W3 → W1 (UI last; accept each before next)

---

## Summary matrix

| # | Theme | Severity | Current state | Primary gap | Workstream |
|---|--------|----------|---------------|-------------|------------|
| 1 | UI/UX polish | High | Soft dark tokens, Montserrat, quieter menus, splash fixed | Keep adopting tokens on remaining screens | **W1** (done) |
| 2 | Sender profile / account | Critical | Profile + Settings show identity and account actions | Cross-role shell polish → W5 | **W2** (done) |
| 3 | Shipment drafts | High | ShipmentDraft API + Save/resume on Home | — | **W3** (done) |
| 4 | Agent verification | Critical | Appointment + SUPERADMIN accept/decline; PDF URL on Agent; status screen | — | **W4** (done) |
| 5 | Profile consistency by role | High | Shared ProfileShell + role menu slots; distinct tab icons | — | **W5** (done) |
| 6 | Testing instructions | Critical | Testing guide + SUPERADMIN bootstrap docs | Keep updated as features ship | **W6** (done) |
| 7 | Prior guidance not reflected | Critical | Features/gaps above | This document | **W7** (this file) |

---

## 1. UI/UX Design and User Experience

### Expected
Clean, intuitive, consistent interface meeting modern mobile expectations.

### Actual (after W1)
- Soft dark palette (`#1C1F26` / `#262A33`) — not pure black; warm light `#F3F2EF`.
- Expanded tokens in [Colors.ts](../velo-client/constants/Colors.ts); Montserrat app-wide; navigation/Paper themed.
- Quieter profile menus (text + chevron, no orange icon rows); choose-role rebuilt without Expo parallax template.
- Splash updated; tab bar uses themed surfaces; bulk soften of harsh dark hexes across screens.

### Suggested workstream
**W1** (implemented)

---

## 2. Sender Profile and Account Management

### Expected
After registration, profile shows user info and essential account management.

### Actual (after W2)
- Shared [AccountInfoCard](../velo-client/components/profile/AccountInfoCard.tsx): name, role, email, phone; USER address from API.
- Shared [AccountMenuList](../velo-client/components/profile/AccountMenuList.tsx) on Profile and Settings (track, password, support, legal, delete).
- Settings is no longer logout-only: account details + management menu + logout; AGENT still gets Organisation Management.
- Guest: Sign Up CTA; password/delete/track hidden; Exit Guest instead of Logout.
- Live store subscription (no stale `useState` name).

### Remaining
Cross-role shell unification / role-specific shortcuts → **W5**.

### Suggested workstream
**W2** (implemented)

---

## 3. Shipment Draft and Save Functionality

### Expected
Save incomplete shipments, resume, edit, finalize later.

### Actual (after W3)
- `ShipmentDraft` model stores JSON wizard payload + `currentStep`.
- APIs: `POST /api/shipment/draft`, `GET /drafts/:userId`, `GET /draft/:id`, `DELETE /draft/:id`.
- Create-shipment headers show **Save**; Home lists **Saved drafts** (continue / delete).
- Confirming a shipment deletes the linked draft. `PAYMENT_PENDING` payment resume unchanged.

### Suggested workstream
**W3** (implemented)

---

## 4. Logistic Agent Verification Process

### Expected
Clear verification workflow: required docs, who admins, how admin reviews, how agent sees approve/reject.

### Actual (after W4)

```
chooseRole AGENT → register/OTP → verifyAgent (PDF → S3 + Agent.verificationDocumentUrl)
  → finalRegisterForm (org) → setAppointment → APPOINTMENT_BOOKED
  → agentRestriction (polls status) → SUPERADMIN Register Request tab
  → Accept → LOGGED_IN (+ email) | Decline → REJECTED (+ email)
```

| Status | Meaning |
|--------|---------|
| `PARTIAL` | After register; upload UI enabled |
| `APPOINTMENT_BOOKED` | After booking; limited access; pending SUPERADMIN |
| `LOGGED_IN` | After SUPERADMIN accept |
| `REJECTED` | After SUPERADMIN decline |

**Documents:** National ID/passport PDF (max 3 MB). Upload persists URL on `Agent.verificationDocumentUrl`. Admin can open PDF from Register Request cards.

**Administrator:** SUPERADMIN tab; list/approve/decline require JWT + `SUPERADMIN` role. Bootstrap: [docs/superadmin-bootstrap.md](./superadmin-bootstrap.md).

**Agent feedback:** [agentRestriction.tsx](../velo-client/app/(auth)/agentRestriction.tsx) polls `/api/auth/account-status`, shows Pending / Approved / Rejected; emails on decision. Cold start routes PARTIAL agents without a document to `verifyAgent`.

### Remaining / out of scope for W4
Full multi-role testing handbook → **W6**.

### Suggested workstream
**W4** (implemented)

---

## 5. Inconsistent Profile Interfaces Across User Roles

### Expected
Consistent profile design; differences only by permissions.

### Actual (after W5)
- Single [ProfileShell](../velo-client/components/profile/ProfileShell.tsx) used by Profile tab and Settings.
- Role menu slots via [getProfileMenuItems](../velo-client/components/profile/getProfileMenuItems.ts): USER → history + track; AGENT/SUB_AGENT → orders; SUPERADMIN → register requests; GUEST → browse/sign-up/login only.
- AGENT Organisation Management in the same shell on both Profile and Settings.
- Tab icons differentiated: History (`time`), Orders (`cube`), Requests (`clipboard`).

### Suggested workstream
**W5** (implemented)

---

## 6. Incomplete Testing and Unclear Instructions

### Expected
Clear testing instructions per role; admin credentials or designated test admin; verification docs; registration → shipment completion path.

### Actual (after W6)
- [docs/testing-guide.md](./testing-guide.md) — role matrix, verification checklist, sender/guest/agent/org pricing paths, env checklist.
- [docs/superadmin-bootstrap.md](./superadmin-bootstrap.md) — how to create SUPERADMIN (no passwords in git).

### Gap
Testers must still create local credentials (table in testing guide). Product gaps (drafts, profile UI) remain tracked under W2–W3 / W1.

### Suggested workstream
**W6** (implemented)

---

## 7. Failure to Incorporate Previously Provided Guidance

### Expected
Review of original requirements / prior guidance; structured gap analysis.

### Actual
- Repo contains no archived product briefs, stakeholder emails, or design specs for the 18-month period.
- This file is the structured gap analysis against **current feedback + code**.

### Gap
Cannot verify historical guidance without external materials. If briefs/Miro/Notion are provided later, re-run this analysis against those sources and amend this document.

### Suggested workstream
**W7** (complete with this document)

---

## Recommended execution order (locked)

1. **W7** — This gap analysis  
2. **W4** — Agent verification (product)  
3. **W6** — Testing guide  
4. **W2** — Sender profile / account  
5. **W5** — Profile consistency  
6. **W3** — Shipment drafts  
7. **W1** — UI/UX polish (last)

**Rule:** After each workstream, pause for explicit acceptance before starting the next. No opportunistic W1 polish during earlier features beyond what that feature needs.

---

## Key file index

| Area | Paths |
|------|--------|
| Profile | `velo-client/app/(tabs)/profile/profileHome.tsx`, `.../settings/settingsHome.tsx`, `velo-client/store/loginAccountStore.ts` |
| Verification (client) | `velo-client/app/(auth)/verifyAgent.tsx`, `setAppointment.tsx`, `agentRestriction.tsx`, `superRegisterRequestTab/superRegisterRequest.tsx` |
| Verification (api) | `api/controllers/superAdmin-route.js`, `api/controllers/s3-controller.js`, `api/controllers/auth-controller.js` |
| Shipments | `velo-client/store/shipmentStore.ts`, `velo-client/app/(tabs)/home/createShipment/*`, `api/controllers/shipment-controller.js`, `api/prisma/schema.prisma` |
| Theme | `velo-client/constants/Colors.ts`, `velo-client/app/_layout.tsx`, `velo-client/app.json` |
