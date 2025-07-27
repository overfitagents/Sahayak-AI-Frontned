# Sahayak AI Assistant

## Overview

Sahayak AI is a smart teaching assistant that helps teachers with teaching, planning, and managing students. It works like a digital partner, reducing teachers' workload, so they can focus more on teaching.

## Market Research

The need for AI-driven tools in education is rapidly growing. Here's a look at the market landscape:

-   **Teacher Workload:** Teachers work an average of **50+ hours per week**, with nearly half of that time spent on non-teaching activities like planning and administrative tasks.
-   **AI in Education Market Size:** The global AI in Education market is projected to reach **$32.27 billion by 2030**, growing at a CAGR of 36.4%, indicating a massive industry shift towards adopting AI solutions.
-   **Demand for Personalization:** Over **80% of educators** believe that personalized learning is crucial for student success, yet only a fraction have the tools to implement it effectively.
-   **EdTech Adoption:** Post-pandemic, the adoption of digital tools in classrooms has surged by over **90%**. Teachers are more receptive than ever to technology that can simplify their workflow.

## Features

-   **Curriculum Planning**: Automatically generate comprehensive, year-long curriculum plans and weekly timetables.
-   **Detailed Chapter Planning**: Generate detailed lesson plans for any chapter, including learning goals, activities, and differentiation support.
-   **Presentation Generation**: Instantly create downloadable PowerPoint presentations for any chapter.
-   **Intelligent Student Grouping**: Upload a photo of marksheet and the AI will create balanced study groups based on performance.

## Tech Stack

-   **Frontend**: Next.js (React Framework)
-   **Styling**: Tailwind CSS with ShadCN UI components
-   **Generative AI**: Google Genkit with Gemini models
-   **Database/Backend Integration**: Google Cloud Run,Firestore
-   **Programming Language**: TypeScript

Frontend UI is prototyped with Firebase AI Studio

## Prerequisites

-   Node.js (v18 or later)
-   npm or yarn

## Setup and Running the Project

1.  **Clone the Repository**
    ```bash
    git clone <https://github.com/overfitagents/Sahayak-AI-Frontned.git>
    cd sahayak-ai-assistant
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Set Up Environment Variables**
    Create a `.env.local` file in the root of your project and add your Firebase and Google Cloud API keys.
    ```
    NEXT_PUBLIC_GEMINI_API_KEY=YOUR_API_KEY
    NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
    NEXT_PUBLIC_BACKEND_URL=https://dev-sahayak-server-543433794712.us-central1.run.app
    NEXT_PUBLIC_VAPID=YOUR_VAPID_KEY
    # ... other variables
    ```

4.  **Run the Development Server**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## Deployed Link

You can try out a live version of the Sahayak AI Assistant here:
[**[Sahayak AI]**](https://sahayak-frontend-543433794712.us-central1.run.app)

We have published from firebase AI Studio 
Check out <link> 

## Conclusion

Sahayak is not just a chatbot. It’s a goal-driven AI agent that understands teacher’s entire teaching context, reacts in real time. With Sahayak, teacher has an assistant — one that speaks her language, understands her students, and helps her teach every child, every day.
