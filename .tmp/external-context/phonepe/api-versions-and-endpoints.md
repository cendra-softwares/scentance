---
source: PhonePe Official Developer Documentation
library: phonepe
package: phonepe-payment-gateway
topic: API versions and endpoints
fetched: 2026-03-31T00:00:00Z
official_docs: https://developer.phonepe.com
---

# PhonePe Payment Gateway - API Versions and Endpoints

## API Version Overview

PhonePe has evolved through multiple API versions. As of 2025/2026, the following versions are in use:

| Version | Status | Use Case | Authentication |
|---------|--------|----------|----------------|
| **v1** | Legacy/Limited | Older integrations, OAuth token | X-VERIFY + Salt Key |
| **v2** | **Current Standard** | Standard Checkout, SDK integration | OAuth Bearer Token |
| **v3** | Available | Direct debit API | X-VERIFY + Salt Key |
| **v4** | Available | UPI Intent payments | X-VERIFY + Salt Key |

### Recommendation
- **New integrations**: Use **v2 API** with the official Node.js SDK (`@phonepe-pg/pg-sdk-node`)
- **v3/v4**: Used for specific flows (direct debit, UPI intent) - still require X-VERIFY checksum

---

## Sandbox (UAT) Endpoints

### Authentication (OAuth Token)
```
POST https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token
```
Query Parameters:
- `client_id` - Your client ID
- `client_version` - Your client version (integer)
- `client_secret` - Your client secret
- `grant_type` - `client_credentials`

### Create Payment (v2 Standard Checkout)
```
POST https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay
```

### Create SDK Order (v2)
```
POST https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/sdk/order
```

### Check Order Status (v2)
```
GET https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/order/{merchantOrderId}/status
```

### v3 Debit API (Direct)
```
POST https://api-preprod.phonepe.com/apis/pg-sandbox/v3/debit
```

### v4 Debit API (UPI Intent)
```
POST https://api-preprod.phonepe.com/apis/pg-sandbox/v4/debit
```

### UAT Sandbox Host (Legacy v1)
```
https://api-preprod.phonepe.com/apis/pgsandbox
```

---

## Production Endpoints

### Authentication (OAuth Token)
```
POST https://api.phonepe.com/apis/identity-manager/v1/oauth/token
```

### Create Payment (v2 Standard Checkout)
```
POST https://api.phonepe.com/apis/pg/checkout/v2/pay
```

### Create SDK Order (v2)
```
POST https://api.phonepe.com/apis/pg/checkout/v2/sdk/order
```

### Check Order Status (v2)
```
GET https://api.phonepe.com/apis/pg/checkout/v2/order/{merchantOrderId}/status
```

### Production Host (Legacy v1)
```
https://api.phonepe.com/apis/pg
```

---

## Frontend Checkout Bundle

Include this script in your frontend for Standard Checkout:
```html
<script src="https://mercury.phonepe.com/web/bundle/checkout.js"></script>
```

For UAT testing:
```html
<script src="https://mercury-uat.phonepe.com/web/bundle/checkout.js"></script>
```

---

## Key Differences: Sandbox vs Production

| Aspect | Sandbox (UAT) | Production |
|--------|---------------|------------|
| **Base URL** | `api-preprod.phonepe.com` | `api.phonepe.com` |
| **Auth Path** | `/apis/pg-sandbox/v1/oauth/token` | `/apis/identity-manager/v1/oauth/token` |
| **Checkout Path** | `/apis/pg-sandbox/checkout/v2/` | `/apis/pg/checkout/v2/` |
| **Redirect Host** | `mercury-uat.phonepe.com` | `mercury.phonepe.com` |
| **Real Money** | No (simulated) | Yes |
| **Test App** | PhonePe Simulator App | Real PhonePe App |
| **Webhook Setup** | Via support ticket | Dashboard UI |

---

## Test Credentials (Sandbox)

### Test Cards
**Credit Card:**
- Card Number: `4208 5851 9011 6667`
- CVV: `508`
- Expiry: `06/2027`
- Issuer: VISA
- Type: CREDIT_CARD

**Debit Card:**
- Card Number: `4242 4242 4242 4242`
- CVV: `936`
- Expiry: `12/2027`
- Issuer: VISA
- Type: DEBIT_CARD

**Simulation OTP:** `123456`
