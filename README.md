# 🚗 Ride Along - Smart Cab-Sharing Platform

**Smart cab-sharing app — offer or find rides along a route.**

## 📋 Table of Contents
- [🌟 Features](#-features)
- [🚀 Getting Started](#-getting-started)
- [💻 Tech Stack](#-tech-stack)
- [⚡ Performance](#-performance)
- [🛡️ Security Features](#-security-features)
- [📧 Email Notifications](#-email-notifications)
- [🚨 Emergency Features](#-emergency-features)
- [📱 User Experience](#-user-experience)
- [🔧 API Endpoints](#-api-endpoints)
- [🏗️ Project Structure](#-project-structure)
- [🌐 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)

## 🌟 Features

### 🚙 Core Ride-Sharing Features
- **Post Rides**: Create ride offers with detailed route information
- **Search & Find Rides**: Discover available rides matching your route
- **Real-time Booking**: Instant ride booking with driver-passenger matching
- **Interactive Maps**: Powered by Leaflet for precise location visualization
- **Route Planning**: Smart route optimization and visualization

### 🔐 Authentication & Security
- **Firebase Authentication**: Secure Google Sign-In integration
- **User Profiles**: Comprehensive user management system
- **Privacy Controls**: Data protection and user privacy features
- **reCAPTCHA Protection**: Bot prevention for secure bookings

### 📧 Smart Notifications
- **Email Confirmations**: Beautiful HTML email templates for bookings
- **Driver Notifications**: Automatic driver alerts for new passengers
- **Real-time Updates**: Instant booking status updates
- **Professional Templates**: Mobile-responsive email designs

### 🚨 Emergency & Safety Features
- **SOS Emergency System**: Quick access to emergency services
- **Live Location Sharing**: Real-time location broadcasting with shareable links
- **Emergency Contacts**: Direct access to emergency numbers (112, 1033)
- **Location Services**: GPS tracking and reverse geocoding
- **Platform-specific SOS**: Native emergency features for iOS/Android
- **Live Location Viewer**: Dedicated page for viewing shared emergency locations

### 💼 Business Features
- **Automated Cleanup**: Scheduled removal of expired rides
- **Performance Analytics**: Comprehensive performance monitoring
- **Legal Compliance**: Terms of Service, Privacy Policy, Refund Policy
- **Rate Limiting**: API protection against abuse

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB database
- Firebase project
- Gmail account (for email notifications)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Op0000/Ride-along.git
   cd Ride-along
   ```

2. **Set up the backend**
   ```bash
   cd server
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Create server/.env
   MONGO_URI=your_mongodb_connection_string
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASSWORD=your-gmail-app-password
   RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
   ```

4. **Set up the frontend**
   ```bash
   cd ../client
   npm install
   ```

5. **Configure Firebase**
   ```bash
   # Update client/src/firebase.js with your Firebase config
   ```

6. **Start the application**
   ```bash
   # Backend (in server directory)
   npm start

   # Frontend (in client directory)
   npm run dev
   ```

7. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

## 💻 Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Maps**: Leaflet & React Leaflet
- **Routing**: React Router DOM v6
- **Authentication**: Firebase Auth
- **Build Tool**: Vite with ESBuild

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Firebase Admin SDK
- **Email Service**: Nodemailer with Gmail
- **Security**: CORS, Rate Limiting
- **Task Scheduling**: Node-cron

### DevOps & Performance
- **Code Splitting**: React.lazy() with Suspense
- **Bundle Analysis**: Vite rollup configurations
- **Compression**: Gzip compression
- **Caching**: In-memory caching strategies
- **Monitoring**: Comprehensive logging system

## ⚡ Performance

### Bundle Optimization
- **98.9% Reduction**: Main bundle size reduced from 618.52 KB to 6.93 KB
- **Smart Code Splitting**: Lazy loading for all major components
- **Manual Chunking**: Optimized vendor and feature-specific chunks

| Chunk Type | Size | Gzipped | Load Strategy |
|------------|------|---------|---------------|
| Main App | 6.93 KB | 2.76 KB | Immediate |
| React Core | 140.01 KB | 44.94 KB | Immediate |
| Firebase | 142.76 KB | 29.46 KB | On Auth |
| Maps | 151.93 KB | 44.03 KB | Lazy |
| Animations | 115.00 KB | 36.90 KB | Lazy |
| Router | 20.00 KB | 7.35 KB | On Navigation |

### Performance Features
- **~60% Faster** initial load times
- **Near-instant** route transitions
- **Production-ready** build configuration
- **Mobile-optimized** performance
- **Enterprise-grade** optimizations

## 🛡️ Security Features

### Authentication Security
- Firebase Authentication with Google OAuth
- JWT token validation
- Secure session management
- User data encryption

### API Security
- Rate limiting (100 requests/15 minutes per IP)
- CORS configuration
- Input validation and sanitization
- Error handling without data exposure

### Data Protection
- Privacy-compliant data handling
- Secure environment variable management
- No sensitive data in client-side code
- Regular security audits

## 📧 Email Notifications

### Features
- **Booking Confirmations**: Professional HTML emails with trip details
- **Driver Notifications**: Automatic alerts for new passengers
- **Email Status Tracking**: Real-time delivery confirmation
- **Error Handling**: Graceful fallback for failed deliveries

### Email Templates
- **Responsive Design**: Mobile-optimized HTML templates
- **Professional Styling**: Branded email layouts
- **Complete Information**: Trip details, contact info, important notes
- **Customizable**: Easy template modification

### Setup Guide
1. Enable 2-Factor Authentication on Gmail
2. Generate App Password
3. Configure environment variables
4. Test email configuration endpoint

## 🚨 Emergency Features

### SOS System
- **Emergency Services**: Direct access to emergency numbers
- **Live Location Sharing**: Real-time GPS broadcasting
- **Location Services**: GPS tracking with reverse geocoding
- **Platform Integration**: Native SOS features for mobile devices

### Safety Features
- **Quick Emergency Access**: One-tap emergency calling
- **Location Broadcasting**: Shareable live location links
- **Emergency Contacts**: Pre-configured emergency numbers
- **Safety Instructions**: Platform-specific emergency procedures

### Supported Emergency Numbers
- **112**: Universal emergency services
- **1033**: Roadside assistance
- **Platform-specific**: Native emergency systems

## 📱 User Experience

### Responsive Design
- **Mobile-first**: Optimized for all device sizes
- **Touch-friendly**: Intuitive touch interactions
- **Fast Loading**: Optimized performance across devices
- **Offline Capability**: Service worker support foundation

### User Interface
- **Modern Design**: Clean, intuitive interface
- **Dark Theme**: Eye-friendly dark mode
- **Smooth Animations**: Framer Motion animations
- **Accessibility**: WCAG compliant design

### Navigation
- **Intuitive Routing**: Clear navigation structure
- **Breadcrumbs**: Easy navigation tracking
- **Quick Actions**: Fast access to core features
- **Search & Filter**: Advanced ride discovery

## 🔧 API Endpoints

### Rides
- `GET /api/rides` - Get all available rides
- `POST /api/rides` - Create a new ride
- `GET /api/rides/:id` - Get specific ride details
- `DELETE /api/rides/:id` - Delete a ride

### Bookings
- `POST /api/bookings` - Create a booking
- `GET /api/bookings/user/:userId` - Get user bookings
- `GET /api/bookings/test-email` - Test email configuration

### Authentication
- `POST /api/auth/verify` - Verify Firebase token
- `GET /api/users/:id` - Get user profile

### Live Location
- `POST /api/live-location` - Create/update live location session
- `GET /api/live-location/:sessionId` - Get live location data
- `DELETE /api/live-location/:sessionId` - Stop live location sharing
- `GET /api/live-location/user/:userId` - Get user's active sessions

### Health & Monitoring
- `GET /health` - Health check endpoint
- Performance monitoring endpoints

## 🏗️ Project Structure

```
ride-along/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   ├── utils/          # Utility functions
│   │   └── firebase.js     # Firebase configuration
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── server/                 # Express backend
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── utils/              # Backend utilities
│   ├── app.js              # Express app configuration
│   └── server.js           # Server entry point
└── README.md               # Project documentation
```

## 🌐 Deployment

### Production Deployment
- **Vercel Ready**: Optimized for modern deployment platforms
- **Environment Configuration**: Production environment variables
- **Build Optimization**: Production-ready build process
- **Performance Monitoring**: Built-in performance tracking

### Deployment Checklist
- [ ] Configure environment variables
- [ ] Set up MongoDB production database
- [ ] Configure Firebase for production
- [ ] Set up email service credentials
- [ ] Test all features in staging environment
- [ ] Monitor performance metrics

### Production URLs
- **Frontend**: Deployed on Vercel/Netlify
- **Backend API**: `https://ride-along-api.onrender.com`
- **Database**: MongoDB Atlas cluster

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Coding Standards
- Follow React best practices
- Use TypeScript for new components (migration in progress)
- Maintain test coverage
- Follow security guidelines
- Document new features

### Performance Guidelines
- Optimize bundle sizes
- Implement lazy loading for new features
- Monitor Core Web Vitals
- Test on mobile devices
- Follow accessibility standards

---

## 📊 Performance Metrics

- **Bundle Size**: 98.9% reduction achieved
- **Load Time**: ~60% improvement
- **Core Web Vitals**: Optimized for all metrics
- **Mobile Performance**: 90+ Lighthouse score
- **Accessibility**: WCAG 2.1 AA compliant

## 📞 Support

For issues, feature requests, or contributions:
- Create an issue on GitHub
- Follow the contributing guidelines
- Check existing documentation
- Test in development environment first

---

**Built with ❤️ for safe and efficient ride-sharing**