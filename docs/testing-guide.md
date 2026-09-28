# Velo App — Testing Guide

**Audience:** QA / stakeholders testing the mobile app (`velo-client`) against the API (`api`).  
**Prerequisites:** API running and reachable (`EXPO_PUBLIC_BACKEND_URL` / default backend), Expo app build or Expo Go, MySQL with migrations applied (`npx prisma migrate deploy` in `api/`).

Related docs:

- [Feedback gap analysis](./feedback-gap-analysis.md)
- [Super Admin bootstrap](./superadmin-bootstrap.md) — how to create a SUPERADMIN for verification testing

---

## 1. Roles at a glance

| Role (in app / DB) | How to get the account | Main tabs | Can ship? | Can manage org / pricing? | Verifies agents? |
|--------------------|------------------------|-----------|-----------|---------------------------|------------------|
| **USER** (sender) | Choose Role → Sender → register | Home, Market, History, Profile | Yes (after address form) | No | No |
| **AGENT** (logistic) | Choose Role → Agent → register + verification | Home, Market, Order, Profile | No (handles orders) | Yes (pricing; team if org mode) | No |
| **SUB_AGENT** | Created by org leader via Profile → Settings → Manage Team | Same as agent (limited org tools) | No | No (not org leader) | No |
| **SUPERADMIN** | Manual DB insert only — see [superadmin-bootstrap.md](./superadmin-bootstrap.md) | Home, Market, **Register Request**, Profile | No | No | **Yes** |
| **GUEST** | Choose Role → Guest → continue | Home, Market, Profile (limited) | No | No | No |

---

## 2. End-to-end happy path (sender → agent shipment)

Use this as the “registration to shipment completion” smoke test once an **approved AGENT** and a **USER** exist.

### A. Create and approve an agent (required before closed-market pricing tests)

1. Create SUPERADMIN ([bootstrap](./superadmin-bootstrap.md)); sign in; confirm **Register Request** tab is visible.
2. On a second device/session, register as **AGENT** (section 3).
3. Complete document upload, org profile, appointment.
4. As SUPERADMIN, open Register Request → open PDF → **Accept**.
5. As agent, on status screen confirm **Approved** (or re-login) → full Market / Order access.

### B. Create a sender and place a shipment

1. Register as **USER** (section 4).
2. Home → create shipment → fill receiver, package, options, pickup, choose shipping option (needs at least one approved agent with pricing set — section 6).
3. Confirm shipment → pay (closed market) or open-market confirm.
4. As **AGENT**, open **Order** tab → find shipment → update status through the lifecycle as needed.

### C. Track / history

1. As USER, **History** tab → open order; unpaid (`PAYMENT_PENDING`) can proceed to payment.
2. Track shipment from Profile → Track Shipment (or home track entry if available).

---

## 3. Agent registration and verification (checklist)

### 3.1 Agent registers

| Step | Action | Expected |
|------|--------|----------|
| 1 | Choose Role → **Agent** → Continue | Register screen |
| 2 | Name, email, password → continue | Mobile / OTP (or mobile flow) |
| 3 | Complete phone verification | Lands on **Verification Process** (document upload) |
| 4 | Upload National ID/Passport PDF (≤ 3 MB) | Success → Continue enabled |
| 5 | Continue → final register form | Org / countries / categories / address as required |
| 6 | Submit → set appointment | Appointment booked |
| 7 | Status screen | **Pending Verification**; optional “Limited Access” to home |

Statuses in DB / app:

| Status | Meaning |
|--------|---------|
| `PARTIAL` | Registered; needs doc and/or final form |
| `APPOINTMENT_BOOKED` | Waiting for SUPERADMIN |
| `LOGGED_IN` | Approved |
| `REJECTED` | Declined |

### 3.2 Super admin reviews

| Step | Action | Expected |
|------|--------|----------|
| 1 | Login as SUPERADMIN | Register Request tab visible |
| 2 | Open request card | Name, email, phone, appointment, org, **Open PDF** (or Not uploaded) |
| 3 | **Accept** | Card leaves list; agent → `LOGGED_IN`; agent email (if Resend configured) |
| 4 | (Separate agent) **Decline** | Card leaves list; agent → `REJECTED`; agent email |

### 3.3 Agent sees decision

| Step | Action | Expected |
|------|--------|----------|
| 1 | Stay on status screen or re-login as pending agent | Polls ~15s; or tap **Check Status Now** |
| 2 | After Accept | **Verification Approved** → Continue to App |
| 3 | After Decline | **Verification Not Approved** → Start over |
| 4 | Market → create listing while pending | Alert: disabled until verified |
| 5 | Order tab while pending | Not fully verified messaging |

### 3.4 Cold start / resume checks

| Scenario | Expected destination |
|----------|----------------------|
| AGENT `PARTIAL`, no document URL | Document upload (`verifyAgent`) |
| AGENT `PARTIAL`, document already uploaded | Final register form |
| AGENT `APPOINTMENT_BOOKED` or `REJECTED` | Status screen (`agentRestriction`) |
| AGENT `LOGGED_IN` | Home |

---

## 4. Sender (USER) registration checklist

| Step | Action | Expected |
|------|--------|----------|
| 1 | Choose Role → **Sender / User** | Register |
| 2 | Account + phone OTP | Final address / profile form |
| 3 | Submit address form | Home; status `LOGGED_IN` |
| 4 | Profile | Greeting + menu (track, password, support, etc.) |
| 5 | History tab | Visible for USER |
| 6 | Create shipment | Wizard available |

---

## 5. Guest checklist

| Step | Action | Expected |
|------|--------|----------|
| 1 | Choose Role → Guest → Continue | Guest onboarding explains limits |
| 2 | Continue as guest | Home / Market browse |
| 3 | Create shipment / full profile ops | Should be unavailable or fail without full account — prefer Sign Up |

---

## 6. Agent org, pricing, and team (post-approval)

Requires AGENT with `LOGGED_IN`.

| Feature | Where | Notes |
|---------|--------|------|
| **Manage Pricing and Timeline** | Profile → gear (Settings) → Organisation Management | Any approved AGENT; set document/package prices and delivery timeline used in shipping quotes |
| **Manage Team** | Same menu | Only if `modeOfWork === ORGANISATION` |
| **Create employee (SUB_AGENT)** | Manage Team → create | Sub-agent is `LOGGED_IN` immediately (skips verification) |
| **Create listing** | Market → create | Only when agent `LOGGED_IN` |

**Pricing test tip:** After setting prices, register/login as USER and run create-shipment through **view shipping options** — closed-market quotes should reflect the agent org pricing.

---

## 7. Super Admin day-to-day

| Action | How |
|--------|-----|
| Access | Login with SUPERADMIN email/password from DB |
| Tab | **Register Request** |
| Scope | Only agents in `APPOINTMENT_BOOKED` |
| Accept / Decline | See section 3.2 |
| No self-serve signup | Must use [superadmin-bootstrap.md](./superadmin-bootstrap.md) |

---

## 8. Suggested test accounts (fill in locally — do not commit secrets)

| Role | Email | Password | Notes |
|------|-------|----------|-------|
| SUPERADMIN | | | Created via SQL |
| AGENT (pending) | | | Stop before Accept to test queue |
| AGENT (approved) | | | After Accept; set pricing |
| USER | | | Place test shipments |
| SUB_AGENT | | | Created by org leader |
| GUEST | n/a | n/a | No account |

---

## 9. Environment checklist before testing

- [ ] `api` running; client `EXPO_PUBLIC_BACKEND_URL` points at it  
- [ ] `npx prisma migrate deploy` applied (includes `verificationDocumentUrl`)  
- [ ] SUPERADMIN row exists  
- [ ] Email (Resend) configured if you need to assert approve/reject emails; otherwise check in-app status only  
- [ ] S3 credentials configured for PDF upload  
- [ ] Stripe keys configured if testing real payment (or use test mode)

---

## 10. Known limitations (do not file as “verification broken”)

- Shipment **draft save** is available: use **Save** in the create-shipment header; resume from Home → Saved drafts.
- Full visual polish is deferred to **W1**.
- Decline/Accept emails depend on Resend env; in-app status is the reliable signal.

---

## Quick verification smoke (minimum for feedback item 4 / 6)

1. Bootstrap SUPERADMIN.  
2. Register AGENT → upload PDF → complete form → book appointment.  
3. SUPERADMIN opens PDF → Accept one agent; Decline another (or same flow twice).  
4. Confirm approved agent reaches Market create-listing; rejected agent sees Rejected status.  
5. Optional: set agent pricing → USER creates shipment → see quotes.
