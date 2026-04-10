---
source: Context7 API + Official PhonePe Developer Documentation
library: PhonePe
package: phonepe-payment-gateway
topic: sandbox-testing-integration
fetched: 2026-03-31T00:00:00Z
official_docs: https://developer.phonepe.com/payment-gateway/uat-testing-go-live/uat-sandbox
---

# PhonePe Sandbox/ UAT Testing Complete Guide

## Overview

The PhonePe UAT (User Acceptance Testing) Sandbox allows merchants to simulate end-to-end payment flows without real transactions. It uses templates that map APIs to predefined sample responses, enabling simulation of Success, Failure, and Pending scenarios.

---

## 1. End-to-End Test Payment Flow

### Step 1: Update Host URL for Sandbox

Replace the production host URL with the UAT Sandbox endpoint:

```
UAT Host URL: https://api-preprod.phonepe.com/apis/pgsandbox
```

All PG Pay and PG Check Status API requests should route to this sandbox endpoint.

### Step 2: Install PhonePe Test App

- **Android**: Download from [here](com.phonepe.simulator) - Package Name: `com.phonepe.simulator`
- **iOS**: Share your email ID with the PhonePe Integration Team to receive an invite via Firebase

### Step 3: Configure Test Case Templates (for UPI Intent Flow)

1. Open the PhonePe Test App
2. Click "Test Case Templates"
3. Enter your Merchant ID and click "GET CONFIGURED TEMPLATES"
4. Select the appropriate template:
   - **Success**: `Paypage Upi Intent Success`
   - **Failure**: `Paypage Upi Intent Failure`
   - **Pending**: `Paypage Upi Intent Pending`

### Step 4: Initiate Payment

Make a payment API call with test credentials. The template will automatically apply based on your selection.

---

## 2. Test UPI IDs for Different Scenarios

### UPI Collect (Manual Selection)

| Scenario | VPA | Behavior |
|----------|-----|----------|
| Success | `success@ybl` | Redirects within 5 seconds |
| Failure | `failed@ybl` | Redirects within 5 seconds |
| Pending | `pending@ybl` or any other random VPA | Redirects within 60 seconds |

### UPI QR Code Testing

- Scan the UAT QR using any production version of PhonePe app or other UPI apps
- **Do NOT use the PhonePe Test App** to scan the QR code
- After opening the link, select "Success", "Failure", or "Pending" as per the flow to test
- No need to manually set templates

---

## 3. Test Card Numbers for Sandbox

### Credit Card

| Field | Value |
|-------|-------|
| Card Number | `4208 5851 9011 6667` |
| Card Type | CREDIT_CARD |
| Card Issuer | VISA |
| Expiry | 06/2027 |
| CVV | `508` |

### Debit Card

| Field | Value |
|-------|-------|
| Card Number | `4242 4242 4242 4242` |
| Card Type | DEBIT_CARD |
| Card Issuer | VISA |
| Expiry | 12/2027 |
| CVV | `936` |

### Test Net Banking

| Field | Value |
|-------|-------|
| Bank ID | `SBIN` (always use this for testing) |
| Username | `test` |
| Password | `test` |

**Important**: 
- OTP for card transactions: `123456`
- Transaction amount limits: Rs. 1/- to Rs. 1000/-
- For Net Banking, use bankId: "SBIN" in the PAY API request payload

---

## 4. Webhook Testing in Sandbox

### Webhook Configuration

1. Set up a webhook URL on your server
2. Configure username and password for authentication:
   - Username: 5-20 characters, letters, digits, underscores only
   - Password: 8-20 characters, must contain both letters and numbers

### IP Whitelisting

Whitelist these IPs to receive webhook callbacks:
```
103.116.33.8 - 103.116.33.13
103.116.32.16 - 103.116.32.29
103.116.34.1 - 103.116.34.23
103.243.35.242
```

### Webhook Events

**Order Events:**
- `checkout.order.completed` - Order successfully completed
- `checkout.order.failed` - Order failed

**Refund Events:**
- `pg.refund.completed` - Refund successfully processed
- `pg.refund.failed` - Refund processing failed

### Webhook Verification

The Authorization header format is:
```
Authorization: SHA256(username:password)
```

Always verify the webhook by:
1. Extracting the Authorization header
2. Computing SHA256(username:password)
3. Comparing with the received value

### Webhook Response States

Use `payload.state` for payment status:
- `COMPLETED` - Payment successful
- `FAILED` - Payment failed
- `PENDING` - Payment in progress

---

## 5. Common Sandbox Errors and Solutions

### HTTP Error Codes

| Error Code | Description | Solution |
|------------|-------------|----------|
| 400 | Bad Request | Verify request parameters and JSON format |
| 401 | Unauthorized Access | Check API keys or authentication tokens |
| 404 | Resource Not Found | Ensure the endpoint is correct |
| 500 | Internal Server Error | Retry after delay; contact support if persists |

### Common Detailed Error Codes

| Error Code | Description | Resolution |
|------------|-------------|------------|
| Z9 | INSUFFICIENT_BALANCE | Customer has insufficient balance |
| ZM | INVALID_MPIN | Customer entered wrong UPI PIN |
| U90 | BANK_TECHNICAL_ISSUE | Bank taking longer than usual |
| Z7 | TXN_FREQ_LIMIT_BREACHED | Customer exceeded daily payment limit |
| Z6 | MPIN_LIMIT_BREACHED | Customer entered wrong PIN too many times |
| B1 | TXN_NOT_ALLOWED | Customer's number registered with bank is different |
| ZH | INVALID_VPA | Customer entered invalid UPI ID |
| ZA | TXN_CANCELLED | Customer cancelled the payment |
| ORDER_EXPIRED | TXN_NOT_COMPLETED | Customer did not complete payment in time |
| DUPLICATE_TRANSACTION | TXN_ALREADY_PROCESSED | Payment with same Order ID already in progress |
| HASH_MISMATCH | CHECKSUM_MISMATCH | Payment data was tampered with |
| CHECKSUM_GENERATION_FAILED | INVALID_CHECKSUM | Issue with checksum generation |

### Integration-Specific Errors

| Error | Cause | Solution |
|-------|-------|----------|
| KEY_NOT_CONFIGURED | API key not configured properly | Verify merchant ID and salt key in sandbox environment |
| ERROR_B2B_API_RETURNED_ERROR | B2B API error | Check API parameters and format |
| MERCHANT_CONFIG_NOT_FOUND | Missing merchant configuration | Contact PhonePe integration team |

---

## 6. Payment Status Check (Order Status API)

### API Endpoint

```
POST /v4/order/{orderId}/status
```

### Response States

Use root-level `state` parameter:
- `COMPLETED` → Payment Successful
- `FAILED` → Payment Failed
- `PENDING` → Payment in progress

### Reconciliation Schedule (Mandatory for PENDING)

When status is PENDING, poll as follows:
1. Every 3 seconds for 30 seconds
2. Every 6 seconds for 60 seconds
3. Every 10 seconds for 60 seconds
4. Every 30 seconds for 60 seconds
5. Every 1 minute until terminal status (or until expireAfter value)

### Handling PENDING Transactions

**Option 1: Mark as Failed**
- Show Payment Failed page
- Reconcile on server side
- If final status is COMPLETED, initiate refund

**Option 2: Mark as Pending**
- Show Payment Pending page
- Reconcile on backend until terminal status

---

## 7. Sandbox Limitations vs Production

| Aspect | Sandbox | Production |
|--------|---------|------------|
| Environment | `api-preprod.phonepe.com` | `api.phonepe.com` |
| Amount Limits | Rs. 1 - Rs. 1,000 | No limits |
| Test Cards | Only test cards work | Only real cards work |
| Real Money | No real money involved | Real transactions |
| Webhook URL | Must share with integration team | Configure via Dashboard |
| Response Time | May have delays | Faster processing |
| UPI VPA | Test VPAs only | Real VPAs |

### Key Differences

1. **Host URL**: Sandbox uses `api-preprod.phonepe.com`, Production uses `api.phonepe.com`
2. **Credentials**: Different merchant IDs and salt keys for sandbox vs production
3. **Transaction Limits**: Sandbox capped at Rs. 1,000 for testing
4. **Webhook Setup**: Sandbox requires sharing URL with team; Production uses self-service dashboard

---

## 8. Recent Changes (2025/2026)

### Updated Test App Versions (2023-2024)
- Android: v4.1.507-PREPROD
- iOS: v5.8.50.1004-PREPROD

### New Features
- Enhanced UAT Sandbox works even when PhonePe UAT server is unavailable
- Template-based simulation for Success/Failure/Pending scenarios
- Improved webhook verification with SHA256(username:password) format

### Go-Live Process
1. Complete integration in UAT
2. Share testing URL/App with PhonePe for sanity check
3. PhonePe provides UAT sign-off
4. Receive production credentials
5. Replace sandbox endpoints with production endpoints

---

## 9. Transition from Sandbox to Production

### Steps to Go Live

1. **Complete UAT Testing**
   - Test all payment flows (UPI, Card, Net Banking)
   - Test success, failure, and pending scenarios
   - Verify webhook handling
   - Test refund flow

2. **Get UAT Sign-Off**
   - Share your test URL/App with PhonePe integration team
   - Resolve any issues identified
   - Receive formal sign-off

3. **Receive Production Credentials**
   - Production Merchant ID
   - Production Salt Key
   - Production Endpoints

4. **Update Configuration**
   - Change host URL from `api-preprod.phonepe.com` to `api.phonepe.com`
   - Update merchant credentials
   - Update webhook URL (configure via PhonePe Business Dashboard)

5. **Verify Production**
   - Do a test transaction with real card (small amount)
   - Verify webhook receipt
   - Check refund functionality

### Pre-Go-Live Checklist

- [ ] Authorization API token management implemented
- [ ] Payment API with correct redirectUrl
- [ ] Order Status API with state handling
- [ ] Webhook configured and verified
- [ ] Refund API implemented (if applicable)
- [ ] Refund Status API for tracking
- [ ] PENDING transaction reconciliation schedule
- [ ] All error codes handled gracefully

---

## 10. Best Practices for Sandbox Testing

1. **Test All Scenarios**: Always test success, failure, and pending states
2. **Verify Webhooks**: Implement webhook verification before processing
3. **Handle PENDING**: Implement proper reconciliation for pending transactions
4. **Use Correct Credentials**: Only use test cards/UPI IDs in sandbox
5. **Check Amount Limits**: Keep test transactions within Rs. 1-1,000
6. **Token Management**: Implement token refresh before expiry
7. **Idempotency**: Use unique merchantOrderId for each transaction
8. **Error Handling**: Handle all error codes gracefully

---

## API Quick Reference

| API | Sandbox Endpoint | Production Endpoint |
|-----|------------------|---------------------|
| Payment | `https://api-preprod.phonepe.com/apis/pgsandbox/v4/pay` | `https://api.phonepe.com/apis/v4/pay` |
| Order Status | `https://api-preprod.phonepe.com/apis/pgsandbox/v4/order/{orderId}/status` | `https://api.phonepe.com/apis/v4/order/{orderId}/status` |
| Refund | `https://api-preprod.phonepe.com/apis/pgsandbox/v4/refund` | `https://api.phonepe.com/apis/v4/refund` |
| Refund Status | `https://api-preprod.phonepe.com/apis/pgsandbox/v4/refund/status` | `https://api.phonepe.com/apis/v4/refund/status` |

---

## Support & Resources

- **Developer Portal**: https://developer.phonepe.com/
- **UAT Sandbox Docs**: https://developer.phonepe.com/payment-gateway/uat-testing-go-live/uat-sandbox
- **Error Codes**: https://developer.phonepe.com/payment-gateway/error-codes
- **Webhook Handling**: https://developer.phonepe.com/payment-gateway/website-integration/standard-checkout/api-integration/api-reference/webhook