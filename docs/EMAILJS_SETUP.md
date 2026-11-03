# EmailJS Setup Guide for Contact Form

## Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Create Email Service
1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose "Gmail" as your email service
4. Connect your Gmail account (mjr.elayron@gmail.com)
5. Note down your **Service ID** (it will look like `service_xxxxxxx`)

## Step 3: Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Use this template content:

**Template ID**: `template_contact`

**Subject**: New Contact Form Message from {{from_name}}

**Content**:
```
Hello {{to_name}},

You have received a new message from your portfolio contact form:

Name: {{from_name}}
Email: {{from_email}}
Subject: {{subject}}

Message:
{{message}}

---
This message was sent from your portfolio contact form.
Reply directly to this email to respond to {{from_name}}.
```

4. Save the template and note the **Template ID**

## Step 4: Get Your Public Key
1. Go to "Account" in your EmailJS dashboard
2. Copy your **Public Key** (it will look like `user_xxxxxxxxxxxxxxxx`)

## Step 5: Update the Code
Replace these values in `src/components/ContactSection.jsx`:

1. Line 62: Replace `YOUR_PUBLIC_KEY` with your actual public key
2. Line 140: Replace `service_portfolio` with your actual service ID
3. Line 141: Replace `template_contact` with your actual template ID
4. Line 143: Replace `YOUR_PUBLIC_KEY` with your actual public key

## Step 6: Test the Form
1. Fill out the contact form on your website
2. Submit the form
3. Check your Gmail inbox for the message
4. You should receive emails directly in your inbox!

## Important Notes:
- EmailJS free plan allows 200 emails per month
- The service works reliably and emails are delivered directly to your inbox
- No server setup required - it's all client-side
- Works with any email provider (Gmail, Outlook, etc.)

## Troubleshooting:
- Make sure all IDs are correct and match exactly
- Check that your Gmail account is properly connected
- Verify the template variables match the code
- Check the browser console for any error messages
