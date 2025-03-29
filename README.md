---
# Digital Wedding Invitation Platform

This is a web-based platform where couples can create personalized wedding invitations in the form of microsites with RSVP tracking, digital sharing (WhatsApp, social media), QR check-in, and themed designs tailored for Indonesian weddings.

---
## 1️⃣ Feature Breakdown (MVP Scope)

### 1.1 Personalized Microsites
Each couple gets a customizable wedding page that includes:

- **Couple’s Love Story** → Editable text & image section.
- **Countdown Timer** → Auto-updating days/hours until the wedding.
- **Event Details** → Date, time, venue (integrated with Google Maps).
- **Photo Gallery** → Upload engagement/pre-wedding photos.
- **Music Integration** → Custom background music (Spotify/YouTube).

---
### 1.2 Digital Invitation Sharing
- **Auto-Generated Invitation Links** → Each guest gets a unique URL.
- **WhatsApp Integration** → One-click share to WhatsApp, Telegram, or SMS.
- **Social Media Preview Optimization** → Proper meta tags for IG, FB, Twitter.
- **Email Invitation** → Optional email-based invites for more formal guests.

---
### 1.3 RSVP & Guest Management
- **Smart RSVP Form** → Guests confirm attendance, +1s, and meal preferences.
- **Guest List Import** → Upload CSV or connect with Google Contacts.
- **RSVP Analytics Dashboard** → Track who’s coming, pending responses, etc.

---
### 1.4 QR Code Entry System
- **Each Guest Gets a Unique QR Code** → Sent via WhatsApp or email.
- **QR Scanner for Check-in** → On wedding day, guests scan QR at the entrance.
- **Guest Attendance Tracking** → Real-time updates on who has checked in.

---
### 1.5 Themed Designs & Customization
- **Preset Themes** → Traditional (Javanese, Sundanese, Minang), Modern, Islamic.
- **Basic Customization** → Change fonts, colors, images.
- **Premium Customization (Future Feature)** → Drag-and-drop layout editor.

---
## 2️⃣ Tech Stack (Initial MVP)

### Frontend:
- **Next.js (App Router)** → For fast SSR & SEO optimization.
- **TailwindCSS** → For easy UI styling.

### Backend & Database:
- **MongoDB Atlas** → Store wedding pages, guests, RSVPs.
- **NextAuth.js / Clerk** → Authentication for couples.

### Other Integrations:
- **Google Maps API** → For venue location embedding.
- **WhatsApp API** → Auto-sharing invitation links.
- **Vercel Hosting** → Quick deployment.

---
## 3️⃣ Business Model (Monetization Plan)

### Freemium Model
Free access with basic features (limited themes, no QR).

### Premium Plans:
- **Basic (Rp 50K/event)** → More themes, RSVP analytics.
- **Pro (Rp 150K/event)** → QR check-in, unlimited RSVP.
- **Business (Rp 500K/event)** → Full customization, branded subdomain.

### Add-Ons:
- **Custom Domain (Rp 100K)** → Example: `akbardanaci.com`.
- **Live Guestbook (Rp 75K)** → Guests leave messages on the microsite.
- **Printed QR Invitation (Future Feature)** → Generate physical cards with QR.
