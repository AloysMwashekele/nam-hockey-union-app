# Hockey Association Mobile App (MAP Project)

## Overview

This is a mobile application developed as part of the MAP (Mobile Application Development) group project. The app is designed for the Hockey Association, based on the existing association’s website, and reimagined for mobile accessibility and convenience. It enables users to register for events, join teams, manage players, and stay up to date with announcements.

## Features

The app replicates and enhances key functionalities of the Hockey Association's official website, allowing for mobile access and user interaction. Major features include:

- **User Authentication (Login & Signup)**
- **View and Register for Events**
- **Announcements Management**
- **Team and Player Registration**
- **User Profile Management**

## Project Stack

- **Frontend:** React Native (Expo)
- **Backend/Local Storage:** AsyncStorage (temporary data persistence)
- **Design & UI:** Figma (reference prototype)
- **Navigation:** React Navigation

## File & Screen Breakdown

### Authentication & User Flow
- `src/context/AuthContext.js` – Handles login state and authentication context.
- `src/screens/LoginScreen.js` – User login interface.
- `src/screens/SignupScreen.js` – User registration interface.
- `src/screens/ProfileScreen.js` – Displays and manages user profile.
- `src/screens/HomeScreen.js` – Landing page post-authentication.
- `src/navigation/AppNavigator.js` – Central hub for app navigation; manages public and authenticated routes.

### Event Module
- `EventCreationScreen.js` – Admin interface for creating events.
- `EventsScreen.js` – Displays all upcoming/current events in card format.
- `EventDetailsScreen.js` – Full info view for each selected event.
- `EventRegistrationScreen.js` – Allows users to register for events.
- `AnnouncementsScreen.js` – Displays admin-posted announcements.
- `storage.js` & `storage.js.new` – AsyncStorage utility functions for storing and retrieving data.

### Team & Player Management
- `TeamRegistrationScreen.js` – Admin interface for registering teams.
- `TeamsScreen.js` – Overview of all teams.
- `TeamDetailsScreen.js` – Detailed view of selected team.
- `PlayerRegistrationScreen.js` – Admin form for registering players.
- `PlayersScreen.js` – Overview of all registered players.
- `PlayerDetailsScreen.js` – Full info view of individual players.

### Components & Constants
- `Card.js` – Generic card component for events, players, and teams.
- `Header.js` – Reusable top navigation bar.
- `Button.js` – Standardised button component.
- `constants/colors.js` – Centralised colour configuration for theme consistency.

---

## Gradle Issues & Tech Pivot

We initially started this project using **Kotlin** with the intention of building a native Android app. However, persistent Gradle sync issues blocked our progress early on. We spent significant time attempting fixes—modifying Gradle files, switching SDK versions, and reinstalling dependencies—but with no breakthrough.

Given the deadline pressures and technical deadlocks, we made a collective decision to **switch to Node.js and React Native via Expo**, which allowed for faster prototyping and easier cross-platform development. This pivot required us to rebuild our project architecture from scratch in the middle of the development cycle.

## Workflow & Collaboration

Due to the last-minute tech stack change and inconsistent internet access, we improvised by sharing code **locally via WhatsApp**. Each team member worked on specific modules individually and forwarded their code to the group chat. Our team leader, **Alejandro**, was responsible for compiling all the pieces and pushing the working final version to a **new GitHub repository**.

Although unconventional, this approach allowed us to deliver a complete and functional product on time.

## Installation & Running the App

1. **Install Expo CLI:**
   ```bash
   npm install -g expo-cli

2. **Clone the Repo:**
  git clone <repo-url>
  cd <project-folder>

3. **Install Dependencies:**
  npm install

4. **Run the App:**
  expo start

5. **View on Device:**
  Install the Expo Go app on your Android device.
  Scan the QR code from the terminal/browser to view the app.
