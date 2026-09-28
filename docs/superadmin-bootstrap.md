# Super Admin Bootstrap (Agent Verification)

Use this to create a **SUPERADMIN** account for reviewing logistic agent verification requests. Do **not** commit real passwords to git.

## What SUPERADMIN can do

After signing in with a SUPERADMIN account in the mobile app:

1. Open the **Register Request** tab.
2. Review each agent with status `APPOINTMENT_BOOKED` (name, contact, appointment, organisation, verification PDF link).
3. **Accept** → agent status becomes `LOGGED_IN`; agent is emailed.
4. **Decline** → agent status becomes `REJECTED`; agent is emailed.

API routes (JWT + SUPERADMIN role required):

- `GET /api/test-routes/get-all-appointent-request`
- `PUT /api/test-routes/approve-agent-appointment/:agentId`
- `PUT /api/test-routes/decline-agent-appointment/:agentId`

## Create a SUPERADMIN via SQL (MySQL)

API self-registration for SUPERADMIN is disabled. Insert a row into `SuperAdmin` (password must be a **bcrypt** hash of the plaintext password you will use to log in).

Example using Node to hash, then SQL:

```bash
cd api
node -e "import('bcrypt').then(b => b.default.hash('YOUR_TEMP_PASSWORD', 10).then(console.log))"
```

```sql
INSERT INTO `SuperAdmin` (
  `id`,
  `name`,
  `email`,
  `password`,
  `role`,
  `mobileCode`,
  `mobileCountry`,
  `mobileNumber`,
  `firstTimeLogin`,
  `registerVerificationStatus`,
  `updatedAt`,
  `createdAt`
) VALUES (
  'clsuperadmin0001',
  'Test Super Admin',
  'superadmin@example.com',
  '<PASTE_BCRYPT_HASH_HERE>',
  'SUPERADMIN',
  '+971',
  'AE',
  '500000000',
  0,
  'SUPERADMINLOGGEDIN',
  NOW(3),
  NOW(3)
);
```

Then sign in on the app with that email/password.

## Apply DB migration for verification documents

Agent PDF URLs are stored on `Agent.verificationDocumentUrl`. Apply migrations from `api/`:

```bash
cd api
npx prisma migrate deploy
# or for local dev:
npx prisma migrate dev
```

## Agent verification status values

| Status | Meaning |
|--------|---------|
| `PARTIAL` | Registered; may still need document upload / profile |
| `APPOINTMENT_BOOKED` | Awaiting SUPERADMIN review |
| `LOGGED_IN` | Approved |
| `REJECTED` | Declined; agent can abandon and re-register |

Full role testing paths are covered in the [testing guide](./testing-guide.md).
