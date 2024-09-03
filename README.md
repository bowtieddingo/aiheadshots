# AI Headshot Generator

## Overview

The AI Headshot Generator is a Next.js application that allows users to upload a picture and generate a professional business headshot using AI technology. This project integrates with Replicate AI for image processing, Stripe for payment processing, and uses NextAuth for Google OAuth authentication.

## Features

- User authentication with Google OAuth
- Secure dashboard accessible only to authenticated users
- Image upload functionality
- AI-powered headshot generation using Replicate AI
- Responsive design with a user-friendly interface
- Stripe payment processing

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [NextAuth.js](https://next-auth.js.org/) for authentication
- [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) for data storage
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Bun](https://bun.sh/) as the JavaScript runtime and package manager
- [UploadThing](https://www.uploadthing.com)
- [Replicate](https://replicate.com/)

## Prerequisites

Before you begin, ensure you have the following:
- [Node.js](https://nodejs.org/) (version 14 or later)
- [Bun](https://bun.sh/)
- [MongoDB](https://www.mongodb.com/)
- [Stripe](https://www.strpie.com)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/bowtieddingo/ai-headshot-generator.git
   cd ai-headshot-generator
   ```

2. Install dependencies:
   ```
   bun install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add copy the variables template from .example.env
   
5. Run the development server:
   ```
   bun run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `app/`: Contains the Next.js app router pages and API routes
- `components/`: Reusable React components
- `lib/`: Utility functions and database connection
- `models/`: Mongoose models for database schemas
- `public/`: Static assets

## Authentication

This project uses NextAuth.js with Google OAuth for authentication. Users can sign in using their Google accounts, and the application securely manages user sessions.

## Database

MongoDB is used as the database, with Mongoose as the ODM (Object Data Modeling) library. The database stores user information and potentially other data related to the AI headshot generation process.

## AI Integration

The project integrates with Replicate AI for generating professional headshots. (Note: Implement the AI integration logic in the appropriate components/API routes)

## Deployment

To deploy this application, follow these steps:

1. Set up a MongoDB database (e.g., MongoDB Atlas)
2. Configure your deployment platform (e.g., Vercel, Netlify) with the necessary environment variables
3. Deploy your application following the platform-specific instructions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).
