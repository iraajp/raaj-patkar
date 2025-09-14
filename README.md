# AI Presentation Architect

AI Presentation Architect is a modern web application that leverages the power of Google's Gemini AI to automatically generate complete, editable presentations from a single text prompt. It features a sleek, intuitive interface for editing content, regenerating images, and exporting the final product, all wrapped in a secure authentication system.

## ✨ Features

- **AI-Powered Generation**: Create multi-slide presentations about any topic just by typing a prompt.
- **Rich Content Types**: The AI generates a mix of content slides (bullet points) and data-rich infographic slides (pie and bar charts).
- **Dual Authentication**: Secure sign-up and login using either a traditional email/password combination or one-click Google Sign-In.
- **Interactive Editor**:
    - Click to edit any text on a slide.
    - Modify text size and font family with a simple toolbar.
    - Add or remove bullet points.
    - Edit infographic data and chart types in a dedicated modal.
- **Dynamic Image Generation**: Each slide features a unique, AI-generated background image based on its content. You can edit the image prompt and regenerate the visual on the fly.
- **Full Slide Management**: Easily add new slides, delete unwanted ones, and reorder them with a drag-and-drop sidebar.
- **PDF Export**: Export your entire presentation as a high-quality PDF document with a single click.

## 🛠️ Setup and Configuration

To run this project, you need to configure two essential API keys.

### 1. Google Client ID (for Authentication)

The application uses Google Identity Services for its "Sign in with Google" feature.

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project or select an existing one.
3.  Navigate to **APIs & Services > Credentials**.
4.  Click **Create Credentials > OAuth client ID**.
5.  Choose **Web application** as the application type.
6.  Under "Authorized JavaScript origins," add the URL where your app is hosted (e.g., `http://localhost:5173`).
7.  Click **Create**. You will be given a Client ID.
8.  Open the `config.ts` file and paste your **Client ID** into the `GOOGLE_CLIENT_ID` constant.

### 2. Google Gemini API Key (for AI Generation)

The core presentation generation is powered by the Gemini API.

1.  Go to [Google AI Studio](https://aistudio.google.com/app/apikey) to get your API key.
2.  Once you have your key, you need to set it as an environment variable named `API_KEY` in the environment where the application is running.

With these two keys configured, the application will have full functionality.

## 💻 Technologies Used

- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API (`@google/genai`) for content and image generation.
- **Authentication**: Google Identity Services
- **PDF Export**: `html2canvas` and `jspdf`
