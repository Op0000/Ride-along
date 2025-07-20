import nodemailer from 'nodemailer'

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'ridealong.service@gmail.com',
      pass: process.env.EMAIL_PASSWORD || 'your-app-password'
    },
    debug: true, // Enable debug mode
    logger: true // Enable logging
  })
}

// Test email configuration
export const testEmailConfiguration = async () => {
  try {
    const transporter = createTransporter()
    await transporter.verify()
    console.log('✅ Email configuration is valid')
    return true
  } catch (error) {
    console.error('❌ Email configuration error:', error)
    return false
  }
}

// Send booking confirmation email to passenger
export const sendBookingConfirmation = async (bookingDetails) => {
  try {
    console.log('📧 Attempting to send booking confirmation email...')
    
    const transporter = createTransporter()
    
    // Verify transporter configuration
    await transporter.verify()
    console.log('✅ Email transporter verified successfully')
    
    const { 
      userEmail, 
      userName, 
      userPhone,
      seatsBooked,
      ride,
      booking 
    } = bookingDetails

    console.log('📧 Sending email to:', userEmail)

    const departureDateTime = new Date(ride.departureTime)
    const formattedDate = departureDateTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    const formattedTime = departureDateTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })

    const mailOptions = {
      from: `"Ride Along" <${process.env.EMAIL_USER || 'ridealong.service@gmail.com'}>`,
      to: userEmail,
      subject: '🚗 Ride Booking Confirmation - Ride Along',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #4F46E5; text-align: center; margin-bottom: 30px;">🚗 Booking Confirmed!</h1>
            
            <div style="background-color: #EBF8FF; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h2 style="color: #1E40AF; margin-top: 0;">Trip Details</h2>
              <p><strong>Route:</strong> ${ride.from} → ${ride.to}</p>
              ${ride.via && ride.via.length > 0 ? `<p><strong>Via:</strong> ${ride.via.join(', ')}</p>` : ''}
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Time:</strong> ${formattedTime}</p>
              <p><strong>Seats Booked:</strong> ${seatsBooked}</p>
              <p><strong>Total Cost:</strong> ₹${ride.price * seatsBooked}</p>
            </div>

            <div style="background-color: #F0FDF4; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h2 style="color: #166534; margin-top: 0;">Driver Details</h2>
              <p><strong>Name:</strong> ${ride.driverName}</p>
              <p><strong>Contact:</strong> ${ride.driverContact}</p>
              <p><strong>Vehicle:</strong> ${ride.vehicleNumber}</p>
            </div>

            <div style="background-color: #FEF3C7; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h2 style="color: #92400E; margin-top: 0;">Your Booking Info</h2>
              <p><strong>Booking ID:</strong> ${booking._id}</p>
              <p><strong>Passenger:</strong> ${userName}</p>
              <p><strong>Contact:</strong> ${userPhone}</p>
              <p><strong>Booked At:</strong> ${new Date(booking.bookedAt).toLocaleString()}</p>
            </div>

            <div style="background-color: #FEE2E2; padding: 15px; border-radius: 8px; border-left: 4px solid #DC2626;">
              <h3 style="color: #DC2626; margin-top: 0;">Important Notes:</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Please arrive at the pickup location 10 minutes early</li>
                <li>Keep your phone accessible for driver communication</li>
                <li>You can cancel your booking from your profile page</li>
                <li>Contact the driver directly for any last-minute changes</li>
              </ul>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #6B7280;">Thank you for choosing Ride Along!</p>
              <p style="color: #6B7280; font-size: 14px;">Safe travels! 🛣️</p>
            </div>
          </div>
        </div>
      `
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('✅ Booking confirmation email sent successfully to:', userEmail)
    console.log('📧 Message ID:', result.messageId)
    return true
  } catch (error) {
    console.error('❌ Error sending booking confirmation email:', error)
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      response: error.response
    })
    return false
  }
}

// Send driver notification email about new passenger
export const sendDriverNotification = async (bookingDetails) => {
  try {
    console.log('📧 Attempting to send driver notification email...')
    
    const transporter = createTransporter()
    
    // Verify transporter configuration
    await transporter.verify()
    console.log('✅ Email transporter verified for driver notification')
    
    const { 
      userEmail, 
      userName, 
      userPhone,
      userAge,
      userGender,
      seatsBooked,
      ride,
      booking 
    } = bookingDetails

    console.log('📧 Sending driver notification to:', ride.userEmail)

    const departureDateTime = new Date(ride.departureTime)
    const formattedDate = departureDateTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    const formattedTime = departureDateTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })

    const mailOptions = {
      from: `"Ride Along" <${process.env.EMAIL_USER || 'ridealong.service@gmail.com'}>`,
      to: ride.userEmail, // Driver's email
      subject: '👥 New Passenger Joined Your Ride - Ride Along',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #059669; text-align: center; margin-bottom: 30px;">👥 New Passenger Joined!</h1>
            
            <div style="background-color: #ECFDF5; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h2 style="color: #065F46; margin-top: 0;">Ride Details</h2>
              <p><strong>Route:</strong> ${ride.from} → ${ride.to}</p>
              ${ride.via && ride.via.length > 0 ? `<p><strong>Via:</strong> ${ride.via.join(', ')}</p>` : ''}
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Time:</strong> ${formattedTime}</p>
              <p><strong>Seats Remaining:</strong> ${ride.seatsAvailable - seatsBooked}</p>
            </div>

            <div style="background-color: #EBF8FF; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h2 style="color: #1E40AF; margin-top: 0;">New Passenger Details</h2>
              <p><strong>Name:</strong> ${userName}</p>
              <p><strong>Contact:</strong> ${userPhone}</p>
              <p><strong>Email:</strong> ${userEmail}</p>
              <p><strong>Age:</strong> ${userAge}</p>
              <p><strong>Gender:</strong> ${userGender}</p>
              <p><strong>Seats Booked:</strong> ${seatsBooked}</p>
            </div>

            <div style="background-color: #FEF3C7; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h2 style="color: #92400E; margin-top: 0;">Booking Information</h2>
              <p><strong>Booking ID:</strong> ${booking._id}</p>
              <p><strong>Booked At:</strong> ${new Date(booking.bookedAt).toLocaleString()}</p>
              <p><strong>Total Earnings:</strong> ₹${ride.price * seatsBooked}</p>
            </div>

            <div style="background-color: #F3F4F6; padding: 15px; border-radius: 8px; border-left: 4px solid #6B7280;">
              <h3 style="color: #374151; margin-top: 0;">Driver Tips:</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Contact the passenger before departure to confirm pickup</li>
                <li>Share your exact location for easy identification</li>
                <li>Keep passenger contact details handy during the trip</li>
                <li>Maintain a friendly and professional demeanor</li>
              </ul>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #6B7280;">Thank you for offering rides on Ride Along!</p>
              <p style="color: #6B7280; font-size: 14px;">Drive safe! 🚗💨</p>
            </div>
          </div>
        </div>
      `
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('✅ Driver notification email sent successfully to:', ride.userEmail)
    console.log('📧 Message ID:', result.messageId)
    return true
  } catch (error) {
    console.error('❌ Error sending driver notification email:', error)
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      response: error.response
    })
    return false
  }
}