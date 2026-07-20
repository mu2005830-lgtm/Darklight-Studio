---
name: EmailJS dynamic recipient fix
description: Why {{email}} in the template To Email field silently fails server-side, and the correct pattern using `to_email`.
---

# EmailJS dynamic recipient via REST API

## The rule
Pass `to_email` (not `email`) as the recipient key in `template_params` when calling the EmailJS REST API server-side. The EmailJS template's **To Email** field must also be set to `{{to_email}}` in the dashboard.

**Why:** EmailJS's REST API does not substitute arbitrary template variables in the **To Email** field server-side. Only its reserved `to_email` key is honoured as a recipient override. Using any other variable name (e.g. `{{email}}`) causes EmailJS to return HTTP 200 / `"sent"` but never actually deliver the email to the dynamic address — it silently discards it.

**How to apply:** Every call to `template_o2q56z1` (customer auto-reply) must pass `to_email: <address>` in `template_params`, not `email: <address>`. The admin template (`template_xege7fl`) is unaffected because its To Email is hardcoded in the dashboard.

## Dashboard change also required
In the EmailJS dashboard, template `template_o2q56z1` must have its **To Email** field changed from `{{email}}` to `{{to_email}}`. The code fix alone is not sufficient without this matching dashboard update.

## Files updated
- `darklightz-vercel/api/_lib/lib/email.ts` — `notifyClient()` central helper
- `darklightz-vercel/api/_lib/routes/bookings.ts`
- `darklightz-vercel/api/_lib/routes/contact.ts`
- `darklightz-vercel/api/_lib/routes/admin-portal.ts`
- `darklightz-vercel/api/_lib/routes/admin.ts` — was already using `to_email` correctly
