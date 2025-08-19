# 🎬 MovieMate

MovieMate is a **React Native application** that serves as a personal movie companion. It allows users to browse popular movies, search for specific titles, view detailed information, and save favorites. Built with **modern React Native practices**, **Redux Toolkit**, and integrated with **The Movie Database (TMDB) API**, MovieMate provides a smooth, responsive, and theme-aware movie browsing experience.

---

## 📑 Table of Contents

- [🎬 MovieMate](#-moviemate)
  - [📑 Table of Contents](#-table-of-contents)
  - [✨ Features](#-features)
  - [🛠 Tech Stack](#-tech-stack)
  - [📂 Project Structure](#-project-structure)
  - [⚙️ Installation](#️-installation)
    - [Requirements](#requirements)
    - [Setup Steps](#setup-steps)
  - [▶️ Usage](#️-usage)
  - [🖼 Screens](#-screens)
  - [🏗️ Architecture Choices](#️-architecture-choices)
  - [🧩 Key Components](#-key-components)
  - [🗂 State Management](#-state-management)
  - [🌐 API Integration](#-api-integration)
  - [🎨 Theming](#-theming)
  - [🚀 Future Improvements](#-future-improvements)
  - [🛠 Troubleshooting](#-troubleshooting)
  - [📜 License](#-license)

---

## ✨ Features

- Browse **popular, top-rated, and upcoming movies**
- Search movies by title with **debounced input**
- View detailed information including **cast, budget, revenue, and trailers**
- Save favorite movies with **local persistence (MMKV)**
- **Light, dark, and system themes** with Redux-based state
- Smooth **animations** (Reanimated) & lazy loading for images
- **Offline-friendly favorites** management
- **Cross-platform splash screen** and safe area handling

---

## 🛠 Tech Stack

- **React Native**: v0.81.0
- **Redux Toolkit**: For state management
- **React Navigation v7**: Navigation and routing
- **TMDB API**: Movie database integration
- **MMKV**: Local storage
- **React Native Vector Icons (Ionicons)**: Icon set
- **Reanimated**: Animations
- **StyleSheet + Custom Theming**: Styling system

---

## 📂 Project Structure

```
MovieMate/
├── src/
│   ├── components/        # Reusable UI components
│   ├── config/            # App configuration (colors, fonts, images)
│   ├── navigation/        # Navigation setup
│   ├── redux/             # Redux state management
│   ├── screens/           # Main app screens
│   └── services/          # API services and utilities
├── assets/                # Static assets (images, fonts)
├── ios/                   # iOS-specific native code
└── android/               # Android-specific native code
```

---

## ⚙️ Installation

### Requirements

- **Node.js >=18**
- **React Native environment** (CLI, Metro bundler, etc.)
- **Xcode** (for iOS development)
- **Android Studio** (for Android development)

### Setup Steps

```bash
# Clone repository
git clone https://github.com/your-username/MovieMate.git
cd MovieMate

# Install dependencies
npm install

# iOS setup
cd ios && bundle exec pod install && cd ..

# Start Metro bundler
npm start

# Run app
npm run ios      # iOS
npm run android  # Android
```

---

## ▶️ Usage

- Launch the app to see the **HomeScreen** with popular, top-rated, and upcoming movies.
- Tap on a movie card to view **details, cast, trailers, and metadata**.
- Use the **search screen** to look up specific titles.
- Save favorites to access them later, even offline.
- Switch between **light/dark/system themes** via Settings.

---

## 🖼 Screens

- **HomeScreen** – Featured movie + lists of categories
- **MovieDetailsScreen** – Details, cast, budget, trailer integration
- **SearchScreen** – Debounced search with results grid
- **MovieListScreen** – Paginated grid by category
- **FavoritesScreen** – Saved movies with persistence
- **SettingsScreen** – Theme switcher, cache clearing
- **SplashScreen** – Animated loading on app start

---

## 🏗️ Architecture Choices

MovieMate uses a **modular architecture** for scalability and maintainability:

- **Separation of Concerns**:
  - UI components, navigation, state management, and API services are organized in dedicated folders.
- **Redux Toolkit**:
  - Centralized state management for theme and movie data, enabling predictable updates and easy debugging.
- **React Navigation**:
  - Split navigators (stack/tab) for clear routing and screen transitions.
- **Theming System**:
  - Consistent colors and typography via config files, supporting light/dark/system modes.
- **Service Layer**:
  - All API calls are abstracted in the `services/` folder for reusability and testability.
- **Persistence**:
  - Favorites are stored locally using MMKV for fast, offline access.

This structure makes the codebase easy to extend, test, and maintain as new features are added.

---

## 🧩 Key Components

- **Text** – Theme-aware typography system
- **MovieCard** – Movie poster, rating, and favorite toggle
- **MovieList** – Horizontal/grid scrolling with pagination
- **HeroBanner** – Featured movie with gradient overlay
- **SectionHeader** – Section titles with navigation
- **ThemeSwitcher** – Light/Dark/System toggle
- **MovieBackdrop** – Full-width backdrop with actions
- **MovieHeader** – Poster, title, rating, genres
- **MovieCast** – Horizontal list of cast members
- **MovieDetailsTable** – Budget, revenue, production info

---

## 🗂 State Management

- **Redux Toolkit** for global state:
  - `themeSlice`: Manages theme state
  - `moviesSlice`: Handles API data and loading states

---

## 🌐 API Integration

**TMDB API v3 Endpoints Used**:

- `/movie/popular`
- `/movie/top_rated`
- `/movie/upcoming`
- `/movie/now_playing`
- `/movie/{id}`
- `/search/movie`

All requests are authenticated using an **API key** stored in config.

---

## 🎨 Theming

- **Light & Dark mode support**
- **System theme detection**
- **Consistent colors and typography** (`colors.ts`, `fonts.ts`)
- Uses **react-native-safe-area-context** for notched devices

---

## 🚀 Future Improvements

- User authentication
- Watchlists
- TV shows support
- Enhanced offline capabilities
- Reviews and ratings
- Advanced filtering

---

## 🛠 Troubleshooting

- **Metro bundler issues**: Try `npm start --reset-cache`
- **iOS pod errors**: Run `cd ios && pod install`
- **Android build errors**: Check SDK + NDK versions in Android Studio
- **TMDB API errors**: Ensure API key is correctly set in config

---

## 📜 License

This project is licensed under the **MIT License**.
