---
source: PhonePe Official Developer Documentation + Community Tutorials
library: phonepe
package: phonepe-payment-gateway
topic: Environment variable configuration
fetched: 2026-03-31T00:00:00Z
official_docs: https://developer.phonepe.com
---

# PhonePe Payment Gateway - Environment Setup

## Environment Variables Template

### .env File (Sandbox/UAT)
```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# PhonePe Credentials (from PhonePe Dashboard - Developer Settings)
PHONEPE_CLIENT_ID=your_client_id_from_dashboard
PHONEPE_CLIENT_SECRET=your_client_secret_from_dashboard
PHONEPE_CLIENT_VERSION=1
PHONEPE_MERCHANT_ID=your_merchant_id

# Environment: SANDBOX or PRODUCTION
PHONEPE_ENV=SANDBOX

# Callback Configuration
MERCHANT_REDIRECT_URL=https://yourdomain.com/payment/redirect
MERCHANT_CALLBACK_URL=https://yourdomain.com/api/payment/callback
MERCHANT_USERNAME=your_webhook_username
MERCHANT_PASSWORD=your_webhook_password

# For v3/v4 X-VERIFY (if using legacy APIs)
PHONEPE_SALT_KEY=your_salt_key_from_dashboard
PHONEPE_SALT_INDEX=1
```

### .env File (Production)
```bash
# PhonePe Production Credentials
PHONEPE_CLIENT_ID=prod_client_id
PHONEPE_CLIENT_SECRET=prod_client_secret
PHONEPE_CLIENT_VERSION=1
PHONEPE_MERCHANT_ID=prod_merchant_id
PHONEPE_ENV=PRODUCTION

# Production Callback URLs (MUST be HTTPS)
MERCHANT_REDIRECT_URL=https://yourdomain.com/payment/redirect
MERCHANT_CALLBACK_URL=https://yourdomain.com/api/payment/callback
MERCHANT_USERNAME=prod_webhook_username
MERCHANT_PASSWORD=prod_webhook_password
```

---

## Node.js SDK Installation

```bash
# Official SDK (v2.0.5+)
npm i @phonepe-pg/pg-sdk-node

# Additional dependencies
npm install express body-parser dotenv cors uuid
```

**Minimum Requirements:**
- Node.js: v14 or higher

---

## SDK Client Initialization

### Singleton Pattern (Recommended)
```javascript
const { StandardCheckoutClient, Env } = require('@phonepe-pg/pg-sdk-node');

class PhonePeClient {
  constructor() {
    if (!PhonePeClient.instance) {
      this.client = StandardCheckoutClient.getInstance(
        process.env.PHONEPE_CLIENT_ID,
        process.env.PHONEPE_CLIENT_SECRET,
        parseInt(process.env.PHONEPE_CLIENT_VERSION),
        process.env.PHONEPE_ENV === 'PRODUCTION' ? Env.PRODUCTION : Env.SANDBOX
      );
      PhonePeClient.instance = this;
    }
    return PhonePeClient.instance;
  }

  getClient() {
    return this.client;
  }
}

const phonePeClient = new PhonePeClient();
Object.freeze(phonePeClient);
module.exports = phonePeClient;
```

---

## Getting Credentials

### Where to Find Your Credentials

1. **Login to PhonePe Business Dashboard**: https://business.phonepe.com
2. **Navigate to**: Developer Settings (left sidebar)
3. **You'll find**:
   - Client ID
   - Client Secret
   - Client Version
   - Merchant ID (bottom-left corner under business name)
   - Salt Key & Salt Index (for v3/v4)

### If Credentials Not Visible
- Raise a ticket via the Help section chat box
- PhonePe team typically responds quickly with required keys

---

## UAT Sandbox Setup

### Step 1: Configure Templates
1. Go to UAT Sandbox section in dashboard
2. Enter your Merchant ID
3. Configure test templates:
   - `Paypage Upi Intent Success`
   - `Paypage Upi Intent Failure`
   - `Paypage Upi Intent Pending`

### Step 2: Install Test App
- **Android**: Download PhonePe Simulator (Package: `com.phonepe.simulator`)
- **iOS**: Share email with PhonePe Integration Team for Firebase invite

### Step 3: Update Host URL
Replace default host with sandbox endpoint:
```
https://api-preprod.phonepe.com/apis/pgsandbox
```

---

## Webhook Setup

### Production
1. Go to Developer Settings in PhonePe Dashboard
2. Add webhook URL (must be HTTPS)
3. Configure username and password
4. Select event types to receive

### UAT/Sandbox
- Webhook setup NOT available via dashboard UI
- Raise a ticket in PhonePe support chat
- Share webhook URL and credentials with support team

---

## Going Live Checklist

- [ ] All test scenarios pass in sandbox
- [ ] Callback URLs are HTTPS and publicly accessible
- [ ] Update `PHONEPE_ENV` to `PRODUCTION`
- [ ] Replace all sandbox credentials with production values
- [ ] Implement retry logic for failed status checks
- [ ] Set up monitoring for payment failures
- [ ] Implement comprehensive logging
- [ ] Test webhook handling with production credentials
- [ ] Verify redirect URLs work in production
