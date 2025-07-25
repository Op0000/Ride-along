import express from 'express'
import nodemailer from 'nodemailer'

const router = express.Router()

// Replace with your Gmail
const FROM_EMAIL = 'help.trenddash@gmail.com'

// Nodemailer transporter using app password (assumes it's stored in .env)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: FROM_EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
})

// Email Support Route
router.post('/email', async (req, res) => {
  const { name, email, subject, message } = req.body

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required.' })
  }

  const mailOptions = {
    from: FROM_EMAIL,
    to: FROM_EMAIL,
    subject: `📧 [Ride Along] New Support Email: ${subject}`,
    html: `
      <h2>📬 New Support Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong><br/>${message}</p>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    res.status(200).json({ message: 'Email sent successfully!' })
  } catch (err) {
    console.error('❌ Email error:', err)
    res.status(500).json({ error: 'Failed to send email. Try again later.' })
  }
})

// Callback Request Route
router.post('/callback', async (req, res) => {
  const { name, phone, preferredTime, message } = req.body

  if (!name || !phone || !message) {
    return res.status(400).json({ error: 'Name, phone, and message are required.' })
  }

  const mailOptions = {
    from: FROM_EMAIL,
    to: FROM_EMAIL,
    subject: `📞 [Ride Along] Callback Request`,
    html: `
      <h2>📞 Callback Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Preferred Time:</strong> ${preferredTime || 'Not specified'}</p>
      <p><strong>Message:</strong><br/>${message}</p>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    res.status(200).json({ message: 'Callback request sent successfully!' })
  } catch (err) {
    console.error('❌ Callback email error:', err)
    res.status(500).json({ error: 'Failed to send callback request. Try again later.' })
  }
})

export default router
