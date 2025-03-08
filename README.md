# AI-Powered Resume Builder

A modern, AI-enhanced resume builder application that helps users create professional resumes with ease.

## Features

- **Multiple Resume Templates**: Choose from Modern, Minimal, Creative, and Professional templates
- **AI Text Enhancement**: Improve your resume content with AI-powered suggestions using the Gemini API
- **Step-by-Step Form**: Easy-to-follow process for building your resume
- **PDF Export**: Download your resume as a PDF file
- **Print Functionality**: Print your resume directly from the application
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/resume-builder.git
   cd resume-builder
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Building for Production

```
npm run build
```

The build files will be in the `dist` directory.

## Technologies Used

- React
- TypeScript
- Material-UI
- Framer Motion
- Tailwind CSS
- Gemini API for AI text enhancement
- html2pdf.js for PDF generation

## Project Structure

- `/src/components` - Reusable UI components
- `/src/context` - React context for state management
- `/src/pages` - Main application pages
- `/src/templates` - Resume template components
- `/src/types` - TypeScript type definitions
- `/src/utils` - Utility functions
- `/public` - Static assets

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Gemini API for AI text enhancement
- Material-UI for the component library
- Tailwind CSS for styling
