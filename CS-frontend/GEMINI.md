# CommandSPES Frontend

CommandSPES is a React-based web and mobile application designed as a showcase for the "Software Programming and Engineering Specialist" (SPES) class (RPL Batch 58). It features student profiles, project showcases, and a gallery of activities.

## Project Overview

- **Purpose:** Showcase the talents, projects, and activities of the SPES class.
- **Architecture:** Client-side rendered (CSR) React application using Vite for development and building.
- **Platform:** Cross-platform support for Web (Vercel) and Mobile (Android via Capacitor).
- **Data Source:** Fetches student and gallery data from static JSON APIs hosted on GitHub and potentially a local/proxied backend.

## Tech Stack

- **Framework:** React 19
- **Build Tool:** Vite 6
- **Routing:** React Router 7
- **Mobile Integration:** Capacitor 6 (Android)
- **Styling:** Vanilla CSS, `@animxyz/core` for animations, and interactive 3D effects.
- **Deployment:** Vercel (Web), Android Studio (Mobile).

## Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- Android Studio (for mobile development)

### Commands

| Task | Command |
| :--- | :--- |
| **Development** | `npm run dev` |
| **Build Web** | `npm run build` |
| **Linting** | `npm run lint` |
| **Preview Build** | `npm run preview` |
| **Capacitor Sync** | `npx cap sync` |
| **Open Android** | `npx cap open android` |

## Directory Structure

- `src/pages/`: Contains the main views (Home, Student, Project, Gallery).
- `src/assets/`: Shared components like `NavBar` and `Footer`, along with static images.
- `src/utils/`: Utility functions and API configuration (`utils.jsx`).
- `android/`: Capacitor-generated Android project.
- `public/`: Static assets accessible directly.

## Development Conventions

- **State Management:** Uses React `useState` and `useEffect` for local state and data fetching.
- **Styling:** Primarily uses global and component-specific CSS files. Interactive effects are often handled via inline styles or direct DOM manipulation (e.g., 3D hover effects).
- **Data Fetching:** Standard `fetch` API is used. The primary data endpoints are defined in `src/pages/Home.jsx` and `src/utils/utils.jsx`.
- **Responsive Design:** Includes mobile detection logic and responsive CSS for a seamless experience across devices.

## Deployment

- **Web:** Automatically deployed via Vercel when pushed to the main branch. Configuration is in `vercel.json`.
- **Mobile:** Build the web project (`npm run build`), sync with Capacitor (`npx cap sync`), and then build the APK/Bundle via Android Studio.
