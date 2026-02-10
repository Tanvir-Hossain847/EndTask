## EndTask
* Project Introduction

EndTask is a full-stack web application designed to manage real-world project execution in a structured, transparent, and scalable way. The platform focuses on turning loosely managed freelance or contract work into an organized workflow where tasks, submissions, and approvals are handled within a single system.

The application allows teams or project owners to assign work, receive structured submissions such as ZIP files, track progress, and ensure accountability through clearly defined roles and backend-controlled workflows. Instead of relying on informal tools like chat messages or shared drives, EndTask centralizes the entire project lifecycle into a reliable, performance-driven web platform.

The project is built with a strong emphasis on UI/UX, frontend performance, secure backend handling, and production-ready deployment practices.

## Tech Stack
* Frontend

Next.js (App Router) – Full-stack React framework

React 19 – Component-based UI development

Tailwind CSS + DaisyUI – Utility-first styling and UI components

Framer Motion & GSAP – Animations and smooth interactions

Lenis – Smooth scrolling experience

React Icons – Iconography


* Backend

Next.js API Routes – Server-side logic

MongoDB – NoSQL database for scalable data storage

Firebase – Authentication and session management

Context API – Global state and authentication handling


* File Storage

Cloudinary – Secure cloud storage for ZIP and raw file uploads


* Other Tools

ESLint – Code quality and linting

PostCSS – CSS processing


## Key Features

Role-based project and task management

Secure file (ZIP) uploads using Cloudinary

Backend-validated workflows

Authentication and protected routes

Scalable MongoDB schema design

Responsive and performance-optimized UI

## Installation Instructions

Prerequisites

Make sure you have the following installed:

Node.js (v18 or later recommended)

npm or yarn

MongoDB (local or cloud, e.g. MongoDB Atlas)

1. Clone the Repository
git clone https://github.com/your-username/EndTask.git
cd EndTask

2. Install Dependencies
npm install

or

yarn install

3. Environment Variables
cp .env.example 


4. Run the Development Server
npm run dev

5. Production Build
npm run build
npm start

Deployment

EndTask is optimized for deployment on Vercel.
Make sure all environment variables are added in the Vercel dashboard before deploying.

Purpose of the Project

This project was built to demonstrate real-world full-stack development skills, including frontend architecture, backend validation, database schema design, authentication, file handling, and production deployment. It reflects how modern web applications are built to solve real operational problems rather than acting as static demo projects.