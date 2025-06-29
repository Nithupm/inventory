Task:  Add Inventory Page - 1Box Tickets
Tech Stack: Next.js, TypeScript, Tailwind CSS, React Query, Context API, JSON Server (mock API)

Table of Contents:

1.Features
2.Project Structure
3.Setup & Run
4.Approach & Decisions
5.Assumptions
6.Tech Choices
7.Future Improvements

Features:

-Fully responsive Add Inventory UI (Desktop + Tablet)

-Controlled form fields with required validation

-Dynamic + Add Listing functionality

Table supports:

-Select
-Edit
-Delete
-Clone

Batch actions: Select All, Deselect All, Delete

Mock backend API simulating async CRUD

Project Structure:

-src/
-app/
 -page.tsx
 -layout.tsx
 -components/
   -FormSection.tsx
   -InventoryTable.tsx
   -ContextProvider.tsx
   -Sidebar.tsx
 -lib/
   -api.ts
 -styles/
   -globals.css
-db.json                     # Mock API data
-tailwind.config.js
-tsconfig.json
-package.json


 Setup & Run:
1.Clone Repository & Install Dependencies

git clone https://github.com/Nithupm/inventoryl
cd inventory
npm install

2.Install JSON Server (Mock API)
npm install -g json-server

3.Start the Mock API Server

json-server --watch db.json --port 4000
Your mock API will run at: http://localhost:4000

4.Start the Next.js Development
npm run dev
Open localhost server to view it in the browser.

Approach & Decisions:

UI: TailwindCSS used for utility-based responsive design

Form: Controlled inputs with simple validation for required fields

State Management: Context API for global state, React Query for API data

Mock API: JSON Server simulates network CRUD behavior

Table logic: Controlled by local and global state. Optimized for editing and cloning.

Assumptions:

The app only needs to simulate backend behavior using mock data

Clone creates a duplicate with a new ID

addate input used

Data is lost on page refresh (unless JSON server is extended with file-based persistence)

Tech Choices:

Next.js – Routing, SSR-friendly architecture

Tailwind CSS – For styling and layout

TypeScript – Type-safe development

React Query – For async state and data caching

Context API – Lightweight global state

JSON Server – Mock backend for full CRUD

Future Improvements:

Add form field-level validation (number ranges, date rules)

Include sorting & filtering options in the table

Add persistent storage for mock API

Integrate with a real backend

Add unit and integration testing
