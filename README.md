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
