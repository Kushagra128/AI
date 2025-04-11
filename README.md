# SensAI - AI Interview Platform

SensAI is an AI-powered interview practice platform that helps users prepare for technical, behavioral, and system design interviews with real-time feedback.

## Features

- **AI-Powered Interviews**: Practice with a realistic AI interviewer
- **Real-time Voice Interaction**: Natural conversation with speech recognition
- **Different Interview Types**: Technical, Behavioral, System Design, and Mixed
- **Performance Analytics**: Track your progress and identify areas for improvement
- **Detailed Feedback**: Receive comprehensive feedback on your interview performance
- **Custom Interviews**: Create interviews tailored to specific roles and technologies
- **Dark Mode**: Modern dark theme UI for comfortable usage

## Getting Started

### Prerequisites

- Node.js 18.x or later
- NPM or Yarn
- Firebase account
- VAPI account (for voice AI)

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/sensai.git
   cd sensai
   ```

2. Install dependencies

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables

   - Copy `.env.local.example` to `.env.local`
   - Fill in your Firebase and VAPI credentials

4. Run the development server

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
sensai/
├── app/                 # Next.js application
│   ├── (auth)/          # Authentication routes
│   ├── (root)/          # Main application routes
│   ├── api/             # API routes
│   ├── components/      # Reusable components
│   └── globals.css      # Global styles
├── components/          # UI components
├── constants/           # Application constants
├── firebase/            # Firebase configuration
├── lib/                 # Utility functions and actions
│   └── actions/         # Server actions
├── public/              # Static assets
└── ...
```

## Usage

### Creating an Interview

1. Log in to your account
2. Go to the Dashboard
3. Click "Start an Interview"
4. Select the interview type and configure settings
5. Start the interview

### Taking an Interview

1. Ensure your microphone is enabled
2. Click the "Call" button to start
3. Respond naturally to the AI interviewer's questions
4. Click "End" when finished to receive feedback

## Technologies Used

- **Next.js**: React framework for building the web application
- **TypeScript**: Type-safe JavaScript
- **Firebase**: Authentication, database, and storage
- **VAPI**: Voice AI for realistic interview conversations
- **Tailwind CSS**: Utility-first CSS framework
- **NextAuth.js**: Authentication for Next.js
- **Recharts**: Charting library for visualizing performance

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Deployment to Vercel

This application is configured for deployment on Vercel. Follow these steps to deploy:

1. **Push your code to a Git repository** (GitHub, GitLab, or Bitbucket)

2. **Connect your repository to Vercel**

   - Go to [Vercel](https://vercel.com) and sign in or create an account
   - Click "Add New" > "Project"
   - Import your repository
   - Select the repository and click "Import"

3. **Configure environment variables**

   - In the Vercel project settings, go to the "Environment Variables" tab
   - Add all the environment variables from your `.env.local` file
   - Make sure to set `NEXTAUTH_URL` to your production URL (Vercel will set this automatically)

4. **Deploy**

   - Vercel will automatically detect that this is a Next.js project
   - Click "Deploy" to start the deployment process

5. **Post-deployment**
   - After deployment, Vercel will provide you with a URL for your application
   - You can set up a custom domain in the Vercel project settings

## Environment Variables

The following environment variables are required for the application to function properly:

```
# Authentication
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-nextauth-secret-key

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email@example.com
FIREBASE_PRIVATE_KEY="your-private-key"
FIREBASE_STORAGE_BUCKET=your-storage-bucket-name

# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket-name
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# VAPI Integration
NEXT_PUBLIC_VAPI_API_KEY=your-vapi-api-key
NEXT_PUBLIC_VAPI_WORKFLOW_ID=your-vapi-workflow-id
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your-vapi-assistant-id

# Google AI
GOOGLE_AI_API_KEY=your-google-ai-api-key
```

## Troubleshooting

If you encounter issues during deployment:

1. **Build errors**: Check the build logs in Vercel for specific error messages
2. **Environment variables**: Ensure all required environment variables are set correctly
3. **Firebase configuration**: Verify that your Firebase project is properly configured
4. **NextAuth configuration**: Make sure NEXTAUTH_URL is set to your production URL

For more help, refer to the [Vercel documentation](https://vercel.com/docs) or [Next.js documentation](https://nextjs.org/docs).
