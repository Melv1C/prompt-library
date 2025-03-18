# Prompt Library

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-9.x-FFCA28?logo=firebase)](https://firebase.google.com/)

A modern web application for storing, organizing, and sharing AI prompts. Prompt Library helps users manage their collection of prompts with advanced organization features and sharing capabilities.

## Table of Contents

-   [Overview](#overview)
-   [Key Features](#key-features)
-   [Tech Stack](#tech-stack)
-   [Project Structure](#project-structure)
-   [Getting Started](#getting-started)
    -   [Prerequisites](#prerequisites)
    -   [Installation](#installation)
    -   [Environment Setup](#environment-setup)
-   [Development](#development)
    -   [Available Scripts](#available-scripts)
    -   [Development Guidelines](#development-guidelines)
-   [Current Status](#current-status)
-   [Deployment](#deployment)
-   [Contributing](#contributing)
-   [License](#license)

## Overview

Prompt Library solves the challenge of managing and organizing the increasing number of AI prompts that users create for various AI models. As AI becomes more integrated into workflows, having a central repository for your prompts becomes essential.

The application offers a comprehensive solution for creating, editing, organizing, and sharing prompts with features like tagging, categorization, and permission-based sharing.

## Key Features

-   **Prompt Management**

    -   Create, read, update, and delete operations for prompts
    -   One-click copying of prompt content
    -   Rich text editing

-   **Organization System**

    -   Custom tagging system
    -   Categorization of prompts
    -   Advanced filtering and search capabilities

-   **User Management**

    -   Authentication (login/register/reset password)
    -   User profiles with stats and prompt collections
    -   Permission-based access control

-   **Sharing Capabilities**
    -   Public/private prompt visibility
    -   Shareable links to specific prompts
    -   Fork/clone functionality for shared prompts

## Tech Stack

### Frontend

-   **React 18+** with TypeScript
-   **Vite** as build tool and development environment
-   **Material UI (MUI)** for UI components
-   **Jotai** for state management
-   **React Router** for navigation
-   **Zod** for schema validation

### Backend & Infrastructure

-   **Firebase** ecosystem:
    -   Firestore for database
    -   Firebase Authentication for user management
    -   Firebase Hosting for deployment
    -   Firebase security rules for data protection

## Project Structure

```
prompt-library/
├── .github/                  # CI/CD configuration
├── public/                   # Public assets
├── src/
│   ├── assets/               # Images, icons, etc.
│   ├── components/           # Reusable React components
│   │   ├── common/           # Shared components (buttons, inputs, etc.)
│   │   ├── layout/           # Layout components
│   │   ├── prompt/           # Prompt-specific components
│   │   └── user/             # User-related components
│   ├── config/               # Application configuration
│   │   └── firebase.ts       # Firebase configuration
│   ├── constants/            # Application constants
│   ├── hooks/                # Custom hooks
│   ├── lib/                  # Libraries and utilities
│   ├── pages/                # Application pages
│   ├── services/             # Services (API, Firebase, etc.)
│   ├── store/                # Global state with Jotai
│   ├── types/                # Zod schemas and inferred Types
│   ├── utils/                # Utility functions
│   ├── App.tsx               # Root component
│   ├── main.tsx              # Entry point
│   └── vite-env.d.ts         # Vite types
├── .eslintrc.js              # ESLint configuration
├── .firebaserc               # Firebase configuration
├── .gitignore                # Git ignore patterns
├── firebase.json             # Firebase configuration
├── index.html                # Root HTML
├── package.json              # Dependencies and scripts
├── README.md                 # Documentation
├── tsconfig.json             # TypeScript configuration
└── vite.config.ts            # Vite configuration
```

## Getting Started

### Prerequisites

-   Node.js 16.x or higher
-   npm or pnpm
-   Firebase account (for backend services)

### Installation

1. Clone the repository

    ```bash
    git clone https://github.com/your-username/prompt-library.git
    cd prompt-library
    ```

2. Install dependencies

    ```bash
    npm install
    # or with pnpm
    pnpm install
    ```

3. Start the development server
    ```bash
    npm run dev
    # or with pnpm
    pnpm dev
    ```

### Environment Setup

1. Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore, Authentication, and Hosting
3. Create a `.env` file in the project root with your Firebase config:
    ```
    VITE_FIREBASE_API_KEY=your-api-key
    VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
    VITE_FIREBASE_PROJECT_ID=your-project-id
    VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
    VITE_FIREBASE_APP_ID=your-app-id
    ```

## Development

### Available Scripts

-   `npm run dev` - Start the development server
-   `npm run build` - Build for production
-   `npm run preview` - Preview the production build
-   `npm run lint` - Run ESLint
-   `npm run test` - Run tests

### Development Guidelines

-   Follow TypeScript best practices with strict typing (no `any` types)
-   Use functional components with hooks
-   Follow the component structure in `/src/components`
-   Use Jotai for global state management
-   Write tests for critical functionality

## Current Status

The project is in active development with the following components implemented:

-   ✅ Basic application structure and configuration
-   ✅ Modern UI layout with responsive design
-   ✅ Header and navigation components with desktop/mobile views
-   ✅ Home page with project description and key features
-   ✅ Theme setup with Material UI

Next steps:

-   🔄 User authentication functionality
-   🔄 Database schema design
-   🔄 CRUD operations for prompts
-   🔄 Advanced filtering and search

## Deployment

The application can be deployed using Firebase Hosting:

1. Build the application

    ```bash
    npm run build
    ```

2. Deploy to Firebase
    ```bash
    firebase deploy
    ```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
