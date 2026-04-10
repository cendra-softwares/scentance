---
source: PhonePe Official Developer Documentation
library: phonepe
package: phonepe-payment-gateway
topic: Checksum and X-VERIFY generation
fetched: 2026-03-31T00:00:00Z
official_docs: https://developer.phonepe.com/switch/documentation/calculating-x-verify
---

# PhonePe Payment Gateway - Checksum/X-VERIFY Generation

## Overview

The X-VERIFY header is used for API request authentication in PhonePe's v3 and v4 APIs. It uses HMAC-SHA256 to create a checksum that validates request integrity.

---

## X-VERIFY Formula

```
X-VERIFY = SHA256(base64_payload + api_endpoint + salt_key) + "###" + salt_index
```

### Components:
1. **base64_payload**: Base64-encoded JSON request body
2. **api_endpoint**: The API path (e.g., `/v3/debit`, `/v4/debit`)
3. **salt_key**: Secret key provided by PhonePe
4. **salt_index**: Key index (1 or 2) corresponding to the salt key

---

## Step-by-Step Generation

### Step 1: Create JSON Payload
```json
{
  "merchantId": "UATMERCHANT",
  "transactionId": "TX123456789",
  "merchantUserId": "U123456789",
  "amount": 100,
  "merchantOrderId": "OD1234",
  "mobileNumber": "9xxxxxxxxx",
  "message": "payment for order placed OD1234",
  "subMerchantId": "DemoMerchant",
  "email": "user@example.com",
  "shortName": "User"
}
```

### Step 2: Base64 Encode the Payload
```javascript
const payload = JSON.stringify(requestBody);
const base64Payload = Buffer.from(payload).toString('base64');
```

Example result:
```
ewogICJtZXJjaGFudElkIjoiVUFUTUVSQ0hBTlQiLAogICJ0cmFuc2FjdGlvbklkIjoiV"
```

### Step 3: Concatenate String
```javascript
const stringToHash = base64Payload + apiEndpoint + saltKey;
// Example: base64Payload + "/v3/debit" + "6b451f58-d565-4890-836f-6fb1gjt84d97"
```

### Step 4: Calculate SHA256
```javascript
const crypto = require('crypto');
const hash = crypto.createHash('sha256').update(stringToHash).digest('hex').toUpperCase();
```

### Step 5: Append Salt Index
```javascript
const xVerify = hash + '###' + saltIndex;
// Example: "5DE0E70CF2B78F3923CA108E583E6A80FABE910EFD1726570B3E5CB2040DF7D2###1"
```

---

## Complete Implementation (Node.js)

```javascript
const crypto = require('crypto');

function generateXVerify(payload, apiEndpoint, saltKey, saltIndex) {
  // Step 1: Base64 encode the payload
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
  
  // Step 2: Concatenate: base64 + endpoint + salt_key
  const stringToHash = base64Payload + apiEndpoint + saltKey;
  
  // Step 3: Calculate SHA256
  const hash = crypto
    .createHash('sha256')
    .update(stringToHash)
    .digest('hex')
    .toUpperCase();
  
  // Step 4: Append salt index
  return `${hash}###${saltIndex}`;
}

// Usage
const payload = {
  merchantId: "UATMERCHANT",
  transactionId: "TX123456789",
  amount: 100
};

const xVerify = generateXVerify(
  payload,
  "/v3/debit",
  process.env.PHONEPE_SALT_KEY,
  process.env.PHONEPE_SALT_INDEX
);

// Make API call
fetch('https://api-preprod.phonepe.com/apis/pg-sandbox/v3/debit', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-VERIFY': xVerify
  },
  body: JSON.stringify({ request: Buffer.from(JSON.stringify(payload)).toString('base64') })
});
```

---

## Example Calculation

### Input:
- **Payload**: `{"grantToken": "GRT979a63f48f21b6f1db7ba93bb4a0fb2975d49afbc2cd107da0fac1dd57de7fb4"}`
- **Base64**: `ewoJImdyYW50VG9rZW4iOiAiR1JUOTc5YTYzZjQ4ZjIxYjZmMWRiN2JhOTNiYjRhMGZiMjk3NWQ0OWFmYmMyY2QxMDdkYTBmYWMxZGQ1N2RlN2ZiNCIKfQ==`
- **Endpoint**: `/v3/service/auth/access`
- **Salt Key**: `6b451f58-d565-4890-836f-6fb1gjt84d97`
- **Salt Index**: `1`

### String to Hash:
```
ewoJImdyYW50VG9rZW4iOiAiR1JUOTc5YTYzZjQ4ZjIxYjZmMWRiN2JhOTNiYjRhMGZiMjk3NWQ0OWFmYmMyY2QxMDdkYTBmYWMxZGQ1N2RlN2ZiNCIKfQ==/v3/service/auth/access6b451f58-d565-4890-836f-6fb1gjt84d97
```

### Result:
```
X-VERIFY: 5DE0E70CF2B78F3923CA108E583E6A80FABE910EFD1726570B3E5CB2040DF7D2###1
```

---

## Webhook Signature Validation

For webhook callbacks, PhonePe sends:
```
Authorization: SHA256(username:password)
```

### Validation:
```javascript
function validateWebhook(authHeader, username, password) {
  const expectedSignature = crypto
    .createHash('sha256')
    .update(`${username}:${password}`)
    .digest('hex');
  
  return authHeader === expectedSignature;
}
```

---

## Important Notes

1. **Salt Key**: Provided by PhonePe corresponding to your Merchant ID
2. **Multiple Keys**: PhonePe may provide multiple key indices (1, 2) for key rotation
3. **Case Sensitivity**: SHA256 hash should be uppercase
4. **No Spaces**: Ensure no whitespace in the concatenated string
5. **Endpoint Path**: Include only the path, not the full URL
