# 📧 Email Notifications Setup Guide

This guide explains how to set up email notifications for booking confirmations in the Ride Along application.

## 🚀 Features

- **Passenger Confirmation**: Beautiful HTML email with all trip and driver details
- **Driver Notification**: Email to driver with new passenger information
- **Professional Templates**: Well-designed email templates with all necessary information
- **Error Handling**: Graceful fallback if emails fail to send

## 🔧 Setup Instructions

### 1. Gmail Configuration

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and generate a password
   - Copy the 16-character password

### 2. Environment Variables

Create a `.env` file in the `server` directory with:

```env
# Email Configuration
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASSWORD=your-16-character-app-password

# Other configurations...
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
```

### 3. Alternative Email Providers

You can also use other email providers by modifying the transporter configuration in `server/utils/emailService.js`:

#### For Outlook/Hotmail:
```javascript
const transporter = nodemailer.createTransporter({
  service: 'hotmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
})
```

#### For Custom SMTP:
```javascript
const transporter = nodemailer.createTransporter({
  host: 'your-smtp-server.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
})
```

## 📧 Email Templates

### Passenger Confirmation Email
- **Subject**: 🚗 Ride Booking Confirmation - Ride Along
- **Content**: Trip details, driver information, booking info, important notes
- **Design**: Professional HTML layout with color-coded sections

### Driver Notification Email
- **Subject**: 👥 New Passenger Joined Your Ride - Ride Along
- **Content**: Passenger details, ride information, earnings, driver tips
- **Design**: Clean layout optimized for mobile viewing

## 🔄 Integration Points

### Backend Integration
- Emails are sent automatically after successful booking
- Non-blocking: Booking succeeds even if emails fail
- Detailed logging for troubleshooting

### Frontend Integration
- Success message includes email confirmation status
- User feedback about email notifications
- Error handling for booking process

## 🛠️ Customization

### Modifying Email Templates
Edit the HTML templates in `server/utils/emailService.js`:

1. **Colors**: Change the color scheme by modifying style attributes
2. **Content**: Add or remove sections as needed
3. **Branding**: Add your logo or company information

### Adding New Email Types
1. Create new functions in `emailService.js`
2. Import and call them from booking routes
3. Add appropriate error handling

## 🧪 Testing

### Development Testing
```bash
# Test email configuration
node -e "
const { sendBookingConfirmation } = require('./utils/emailService.js');
sendBookingConfirmation({
  userEmail: 'test@example.com',
  userName: 'Test User',
  // ... other test data
});
"
```

### Production Monitoring
- Check server logs for email sending status
- Monitor email delivery rates
- Set up alerts for email failures

## 🔒 Security Best Practices

1. **Use App Passwords**: Never use your main Gmail password
2. **Environment Variables**: Store credentials securely
3. **Rate Limiting**: Implement email rate limiting if needed
4. **Validation**: Validate email addresses before sending

## 🚨 Troubleshooting

### Common Issues

1. **"Invalid login"**: Check app password and 2FA setup
2. **"Connection timeout"**: Check network and SMTP settings
3. **Emails in spam**: Configure SPF/DKIM records for your domain

### Debug Mode
Enable debug logging by setting:
```env
DEBUG=nodemailer:*
```

## 📊 Monitoring

### Success Metrics
- Email delivery rate
- User engagement with emails
- Booking completion rates

### Error Tracking
- Failed email attempts
- Authentication errors
- SMTP connection issues

## 🔄 Fallback Options

If email sending fails:
1. Booking still completes successfully
2. Error is logged for manual follow-up
3. Users can view booking details in their profile
4. Consider SMS notifications as backup

---

**Note**: Make sure to test email functionality in a development environment before deploying to production.