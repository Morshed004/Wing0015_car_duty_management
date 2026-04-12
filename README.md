# 🚐 Vehicle Entry Management System

A comprehensive, real-time vehicle entry recording and management platform built with modern web technologies. This application provides a seamless workflow for registering vehicles (Buses and Microbuses), monitoring geographical distribution, and analyzing fleet data through an interactive dashboard.

## ✨ Key Features

- **📝 Public-Facing Registration Form**
  - Robust client-side validation using **TanStack Form** and **Zod**.
  - Dynamic cascading geographic dropdowns (Division, District/Zila, Thana).
  - Clean, responsive UI with immediate feedback via toast notifications.

- **📊 Real-Time Analytics Dashboard (`/dashboard`)**
  - Instant calculations of Total Fleet.
  - Granular breakdown of fleet types (Buses vs. Microbuses) with visual progress indicators.
  - Geographic distribution tracking (Total counts per Division, District, and Thana).
  - **One-Click Summary Report**: Formats real-time metrics into a clean **Bengali text report** and copies it to the clipboard—ideal for daily stakeholder reporting over WhatsApp/Email.

- **📋 Dynamic Entry Table (`/entry-table`)**
  - Real-time tabular visualization of all registered fleet entries using Convex subscriptions.
  - **Smart Filtering & Search**: Instantly look up entries by vehicle number, name, phone, or geographic regions.
  - **CSV Export**: One-click download of all registration data into a properly formatted `.csv` file for offline processing.
  - Highly responsive view, swapping to intuitive card-based layouts on mobile devices.

- **🔒 Backend & Authentication**
  - Features real-time queries and mutations out of the box via **Convex**.
  - Incorporates **Better Auth** (`@convex-dev/better-auth`) to easily lay down the foundation for protected administrative routes (e.g., controlling the `show_form` boolean).

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Database & Backend**: [Convex](https://www.convex.dev/) (Zero-setup real-time sync)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Forms & Validation**: [TanStack React Form](https://tanstack.com/form/latest) + [Zod](https://zod.dev/)
- **Authentication**: [Better Auth](https://better-auth.com/)
- **UI Tooling**: [Lucide React](https://lucide.dev/) (Icons), [Sonner](https://sonner.emilkowal.ski/) (Toasts)

## 🗃️ Database Schema

Defined in `convex/schema.ts`, the application manages:
- **`entry`**: Stores vehicle registration data including `vehicle_type` ('Bus' | 'Microbus'), `vehicle_number`, `representative_name`, `representative_mobile`, `driver_mobile` (optional), and location coordinates (`division`, `district`, `thana`).
- **`show_form`**: A boolean flag configuration table to manually control the visibility/activity of the public registration form.

## 🚀 Getting Started

Ensure you have your environment variables for Convex configured in a `.env.local` file (e.g., `CONVEX_DEPLOYMENT`, `NEXT_PUBLIC_CONVEX_URL`).

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Start the Convex backend** (This will sync your schema and run the backend):
   ```bash
   npx convex dev
   ```

3. **Run the Next.js development server:**
   ```bash
   pnpm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The application supports real-time updates seamlessly across dashboard and table views!
