---
source: PhonePe Official Developer Documentation
library: phonepe
package: phonepe-payment-gateway
topic: Headers and authentication requirements
fetched: 2026-03-31T00:00:00Z
official_docs: https://developer.phonepe.com
---

# PhonePe Payment Gateway - Headers and Authentication

## Authentication Methods by API Version

### v2 API (Recommended - OAuth Bearer Token)

The v2 API uses OAuth 2.0 client credentials flow.

**Step 1: Get Access Token**
```bash
curl -X POST \
  'https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token?client_id=YOUR_CLIENT_ID&client_version=YOUR_CLIENT_VERSION&client_secret=YOUR_CLIENT_SECRET&grant_type=client_credentials' \
  -H 'Content-Type: application/x-www-form-urlencoded'
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600
}
```

**Step 2: Use Token in API Calls**
```bash
curl -X POST \
  'https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: O-Bearer YOUR_ACCESS_TOKEN' \
  -d '{ ... }'
```

**Required Headers for v2:**
| Header | Value | Required |
|--------|-------|----------|
| `Content-Type` | `application/json` | Yes |
| `Authorization` | `O-Bearer {access_token}` | Yes |
| `X-MERCHANT-ID` | Your merchant ID | For status checks |

---

### v3/v4 API (X-VERIFY Checksum)

The v3 and v4 APIs use HMAC-SHA256 checksum verification.

**Required Headers for v3/v4:**
| Header | Value | Required |
|--------|-------|----------|
| `Content-Type` | `application/json` | Yes |
| `X-VERIFY` | `SHA256(...)###salt_index` | Yes |
| `X-REDIRECT-URL` | Dynamic redirect URI | No |
| `X-REDIRECT-MODE` | `REDIRECT` or `POST` | No |
| `X-CALLBACK-URL` | S2S callback URL | No |
| `X-CALL-MODE` | `POST` or `PUT` | No |
| `X-PROVIDER-ID` | For multi-merchant setups | No |

---

## X-VERIFY Header Format

### For v3 Debit API
```
X-VERIFY: SHA256(base64_payload + "/v3/debit" + salt_key)###salt_index
```

### For v4 Debit API
```
X-VERIFY: SHA256(base64_payload + "/v4/debit" + salt_key)###salt_index
```

### General Format
```
X-VERIFY: SHA256(base64_encoded_payload + api_endpoint + salt_key)###salt_index
```

---

## X-VERIFY Generation Process

### Step-by-Step:

1. **Create JSON payload**
```json
{
  "merchantId": "UATMERCHANT",
  "transactionId": "TX123456789",
  "merchantUserId": "U123456789",
  "amount": 100,
  "merchantOrderId": "OD1234"
}
```

2. **Encode to Base64**
```
ewogICJtZXJjaGFudElkIjoiVUFUTUVSQ0hBTlQiLAogICJ0cmFuc2FjdGlvbklkIjoiV"
```

3. **Concatenate: base64 + endpoint + salt_key**
```
ewogICJtZXJjaGFudElkIjoiVUFUTUVSQ0hBTlQiLA.../v3/debit6b451f58-d565-4890-836f-6fb1gjt84d97
```

4. **Calculate SHA256**
```
5DE0E70CF2B78F3923CA108E583E6A80FABE910EFD1726570B3E5CB2040DF7D2
```

5. **Append salt index**
```
5DE0E70CF2B78F3923CA108E583E6A80FABE910EFD1726570B3E5CB2040DF7D2###1
```

---

## Webhook Authentication

### Callback Validation
PhonePe sends webhooks with an `Authorization` header:
```
Authorization: SHA256(username:password)
```

### Callback Types
- `PG_ORDER_COMPLETED` / `CHECKOUT_ORDER_COMPLETED`
- `PG_ORDER_FAILED` / `CHECKOUT_ORDER_FAILED`
- `PG_REFUND_ACCEPTED`
- `PG_REFUND_COMPLETED`
- `PG_REFUND_FAILED`
- `PG_TRANSACTION_ATTEMPT_FAILED`

### Validation Code (Node.js SDK)
```javascript
const callbackResponse = client.validateCallback(
  username,
  password,
  authorizationHeader,  // SHA256(username:password)
  responseBody          // JSON string
);
```

---

## Client Version Parameter

The `client_version` is an integer that identifies your integration version:

- Provided by PhonePe during merchant onboarding
- Used in OAuth token generation
- Passed during SDK initialization
- Example: `1`, `2`, or version-specific integer

### SDK Initialization with Client Version
```javascript
const client = StandardCheckoutClient.getInstance(
  clientId,        // Your client ID
  clientSecret,    // Your client secret
  clientVersion,   // Integer (e.g., 1)
  env              // Env.SANDBOX or Env.PRODUCTION
);
```
