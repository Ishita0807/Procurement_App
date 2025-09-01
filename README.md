Procurement & Sustainability Analytics Platform
A full-stack web application for data-driven, sustainable supplier selection and procurement analysis.

This repository contains the source code for a comprehensive procurement analytics tool. The project's structure and included assets reveal a complete development lifecycle, progressing from an initial business concept to a functional data prototype and culminating in this production-grade web application. The application is the scalable, interactive implementation of the ideas first proposed in the    

Sustainable_Supplier_Selection_Tool (1).pptx presentation and later prototyped in the sustainable supplier dashboard.pbix Power BI file. It is designed to overcome the limitations of standalone BI dashboards by offering enhanced scalability, user-specific data access, a custom user experience, and the potential for API-driven integrations with other enterprise systems.

Live Demo & Visual Showcase
https://procurement-app-red.vercel.app

Core Features
This application provides a suite of tools for modern, sustainable procurement management.

📊 Interactive Supplier Dashboard: Visualize key performance indicators for all suppliers in a centralized, interactive dashboard, based on the concepts prototyped in the project's Power BI file.   

🌱 Sustainability & ESG Scoring: Evaluate suppliers based on customizable environmental, social, and governance (ESG) metrics.

⚖️ Comparative Analysis: Directly compare multiple suppliers across dozens of data points to make informed, data-driven decisions.

📈 Performance & Risk Monitoring: Track supplier performance over time and identify potential risks in the supply chain.

📄 Detailed Reporting: Generate and export detailed reports for individual suppliers or comparative analyses.

Project Artifacts & Non-Code Assets
This repository contains more than just source code. It includes the key business and data artifacts that provide the foundational context for the application.

Sustainable_Supplier_Selection_Tool (1).pptx
This Microsoft PowerPoint presentation file represents the project's conceptual foundation. It likely serves as the initial pitch deck or design document, outlining the business problem, proposed solution, project goals, and scope for the sustainable supplier selection tool.   

How to View:
You do not need Microsoft PowerPoint installed to view this file. If you have a Microsoft account, you can upload the file to a free OneDrive account and open it using PowerPoint for the web. Alternatively, several free online services allow you to view PPTX files by uploading them or providing a URL to the raw file on GitHub.   

sustainable supplier dashboard.pbix
This is an interactive data model and dashboard created in Microsoft Power BI. It serves as the functional blueprint and prototype for the web application's data visualizations, demonstrating the core analytics and data relationships.   

How to View:
Viewing a .pbix file requires either the Power BI Desktop application or the Power BI Service. Unlike simple documents, these files contain complex data models and connections that cannot be rendered by generic online viewers. The recommended method for sharing this dashboard is to publish it from Power BI Desktop to the Power BI Service and then generate a public "Publish to web" link. For collaborators with appropriate permissions, this file can also be viewed directly in a web browser if it is uploaded to a SharePoint or OneDrive for Business folder, provided the user has a Power BI Pro, Premium, or E5 license.   

Technical Architecture & Stack
This project is built on a modern, type-safe, and highly performant technology stack designed for building scalable, full-stack web applications. The architecture leverages the Next.js App Router for a robust foundation that combines server-side rendering (SSR) and static site generation (SSG) with a powerful API layer. Prisma is used as the ORM to ensure type-safe database interactions, and Tailwind CSS with Shadcn/UI provides a flexible and efficient system for building a beautiful, responsive user interface.

Category	Technology	Description
Framework	Next.js	The React framework for building full-stack web applications. Using the App Router for server components and advanced routing.
Language	(https://www.typescriptlang.org/)	A statically typed superset of JavaScript that enhances code quality and developer experience.
Database ORM	Prisma	A next-generation ORM that provides type-safe database access and simplifies data modeling and migrations.
Styling	(https://tailwindcss.com/)	A utility-first CSS framework for rapidly building custom user interfaces.
UI Components	(https://ui.shadcn.com/)	
A collection of beautifully designed, accessible components built on Radix UI and Tailwind CSS. Its use is indicated by the presence of the components.json configuration file.   

Linting	(https://eslint.org/)	A tool for identifying and reporting on patterns found in ECMAScript/JavaScript code, ensuring code consistency.
Deployment	Vercel	
The platform for deploying Next.js applications, offering seamless integration, CI/CD, and global CDN, as recommended in the project's boilerplate.   

Repository Structure
The project follows a logical structure based on Next.js App Router conventions, separating concerns for maintainability and scalability.

/
├── app/                # Next.js App Router: contains all routes, pages, and API endpoints
├── components/         # Shared UI components used across the application
├── hooks/              # Custom React hooks for shared logic
├── lib/                # Utility functions and helper scripts
├── prisma/             # Prisma schema, migrations, and database client
├── public/             # Static assets (images, fonts, etc.)
├──.env.local.example  # Example environment variables file
└──...
app/: Contains all application routes, pages, and API endpoints, following the Next.js App Router paradigm.

components/: Houses reusable React components utilized throughout the application.

hooks/: Stores custom React hooks that encapsulate and share stateful logic.

lib/: A general-purpose directory for utility functions, helper scripts, and library initializations.

prisma/: Manages all database-related assets, including the Prisma schema file, migration history, and the generated database client.

public/: Serves static assets like images, fonts, and icons directly from the root URL.

System Setup & Local Development
Follow these steps to get the project running on your local machine for development and testing purposes.

Prerequisites
Ensure you have the following software installed on your system:

Node.js (v18.x or later recommended)

A package manager: npm, yarn, or pnpm

Git

A local or cloud-based PostgreSQL database.

Step-by-Step Installation
Clone the Repository
Clone the project to your local machine and navigate into the directory.

Bash

git clone https://github.com/Sneha-Bhattacharyya/Procurement_App.git
cd Procurement_App
Install Dependencies
Install all the required npm packages.

Bash

npm install
Set Up Environment Variables
Create a .env.local file in the root of the project to store your environment variables. You can start by copying the example file.

Bash

cp.env.local.example.env.local
Now, open .env.local and fill in the required values, especially your database connection string.

Code snippet

# Database Configuration
# ----------------------
# This URL is used by Prisma to connect to your database.
# Format for PostgreSQL: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL="postgresql://youruser:yourpassword@localhost:5432/procurement_app"

# NextAuth Configuration (if applicable)
# ------------------------------------
# NEXTAUTH_SECRET=
# GITHUB_ID=
# GITHUB_SECRET=
Initialize the Database
Run the Prisma migrations to set up your database schema. This command will create the tables and relations defined in prisma/schema.prisma.

Bash

npx prisma migrate dev
(Optional) If a seed script is configured, you can populate your database with initial or sample data.

Bash

npx prisma db seed
Run the Development Server
Start the Next.js development server.

Bash

npm run dev
Open your browser and navigate to http://localhost:3000 to see the application running.

Deployment
The easiest way to deploy this Next.js application is by using the Vercel Platform, from the creators of Next.js.   

Push your code to your GitHub repository.

Go to the Vercel dashboard and import the repository.

Vercel will automatically detect that it is a Next.js project and configure the build settings.

Add your production environment variables (like DATABASE_URL) in the Vercel project settings.

Click "Deploy". Your application will be built and deployed, and you will be provided with a live URL.

Contribution Guidelines
Contributions are welcome! If you have suggestions for improving the application, please feel free to fork the repository and submit a pull request.

Fork the Project.

Create your Feature Branch (git checkout -b feature/AmazingFeature).

Commit your Changes (git commit -m 'Add some AmazingFeature').

Push to the Branch (git push origin feature/AmazingFeature).

Open a Pull Request against the main branch.

Before submitting your pull request, please ensure your code adheres to the project's coding standards by running the linter.

Bash

npm run lint
License
This project is licensed under the MIT License. See the LICENSE file for more details.
