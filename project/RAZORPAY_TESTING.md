# Razorpay Integration Testing Guide

This document outlines how to test the Razorpay payment integration in the Pizza Delivery Application.

## 1. Test Environment Setup

- **Environment**: Development
- **Backend Port**: 3002
- **Frontend Port**: 5173
- **Test API Keys**:
  - Key ID: `rzp_test_ODQ3lf6JSSFi9z`
  - Key Secret: `EI21xvagP5DUVcGEl1xtS8AK`

## 2. Testing Card Payments

Use these test cards from Razorpay to validate different payment scenarios:

### 2.1 Successful Payment

- **Card Number**: 4111 1111 1111 1111
- **Expiry Date**: Any future date (e.g., 12/25)
- **CVV**: Any 3 digits (e.g., 123)
- **Name**: Any name
- **3D Secure OTP**: 1111

### 2.2 Failed Payment

- **Card Number**: 4242 4242 4242 4242
- **Expiry Date**: Any future date (e.g., 12/25)
- **CVV**: Any 3 digits (e.g., 123)
- **Name**: Any name
- **3D Secure OTP**: 1111

## 3. Testing UPI

### 3.1 Successful Payment

- **UPI ID**: success@razorpay

### 3.2 Failed Payment

- **UPI ID**: failure@razorpay

## 4. Testing Netbanking

In the test environment, all banks will simulate a successful payment.

## 5. Testing Wallets

In the test environment, all wallets will simulate a successful payment.

## 6. End-to-End Test Flow

1. **Add items to cart**:

   - Browse menu and add pizzas to your cart
   - Proceed to checkout

2. **Enter customer information**:

   - Fill in delivery address and contact details

3. **Select payment method**:

   - Choose "Online Payment (Razorpay)"

4. **Complete payment**:

   - Click "Place Order"
   - Razorpay checkout modal will open
   - Enter test card details
   - Submit payment
   - Enter OTP if prompted

5. **Verify success**:
   - Check for success message
   - Verify order appears in order history
   - Check order status

## 7. Fallback Testing

1. **Test Cash on Delivery**:

   - Follow steps 1-2 above
   - Select "Cash on Delivery"
   - Complete order
   - Verify order is created with COD payment method

2. **Error Handling**:
   - Test internet disconnection during payment
   - Test payment cancellation
   - Test browser refresh during payment
   - Verify appropriate error messages

## 8. Backend Verification Testing

The backend should verify the payment signature before confirming orders.
To test this process:

1. Monitor server logs during payment processing
2. Check for signature verification success messages
3. Verify that order is only created after payment verification

## 9. Common Issues and Troubleshooting

- **Razorpay SDK not loading**: Check browser console for network errors
- **Payment verification failing**: Ensure key secret is correctly configured
- **Order creation failing**: Check server logs for validation errors
- **Browser compatibility**: Test on multiple browsers (Chrome, Firefox, Safari)

---

For any issues, contact the development team.
