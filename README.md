# MedGemma Medical App

This project is a Medical Educational App designed to help medical students understand complex medical terminology. It uses the MedGemma model to provide clear and concise explanations of medical terms.

## Project Overview

The application consists of two main parts:

-   **Frontend**: A Next.js application built with React, shadcn/ui components, and Tailwind CSS for a modern and responsive user interface.
-   **Backend**: A FastAPI (Python) application that serves the MedGemma model, providing an API endpoint for term explanations.

## Key Technologies

-   **Frontend**:
    -   Next.js (React framework)
    -   TypeScript
    -   shadcn/ui (UI components)
    -   Tailwind CSS (Utility-first CSS framework)
-   **Backend**:
    -   FastAPI (Python web framework)
    -   Python 3.10+
    -   Uvicorn (ASGI server)
-   **AI Model & GPU Integration**:
    -   MedGemma (`google/medgemma-4b-it`) via Hugging Face Transformers
    -   PyTorch (with CUDA support for GPU acceleration)
    -   NVIDIA CUDA (version 12.1 or compatible)
    -   Triton (Windows compatible version for PyTorch inductor backend)

## Prerequisites

-   Node.js (v18.x or later recommended for Next.js)
-   Python (v3.10 or later recommended)
-   NVIDIA GPU with CUDA drivers installed (CUDA 12.1 recommended)
-   Git for version control

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd medicalapp
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create and activate a Python virtual environment:

```bash
# Windows
python -m venv .venv
.venv\Scripts\activate
```

Install backend dependencies:

```bash
pip install -r requirements.txt
```

**Note on PyTorch and CUDA:**
The `requirements.txt` should ideally specify the PyTorch version compatible with your CUDA setup. If you encounter issues, you might need to install PyTorch manually. For CUDA 12.1, you can use:

```bash
pip uninstall torch torchvision torchaudio # Uninstall existing versions first
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
```

Install Triton for Windows (if not already in `requirements.txt`):

```bash
pip install triton-windows
```

Create a `.env` file in the `backend` directory and add your Hugging Face Model ID if it's different from the default:

```env
MODEL_ID="google/medgemma-4b-it"
```

### 3. Frontend Setup

Navigate to the frontend directory from the project root:

```bash
cd ../frontend
```

Install frontend dependencies:

```bash
npm install
# or
yarn install
```

## Running the Application

### 1. Start the Backend Server

Make sure your backend virtual environment is activated (`.venv\Scripts\activate`).
From the `backend` directory, run:

```bash
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The backend server will start, and the MedGemma model will be loaded onto the GPU (specifically `cuda:0`). You should see log messages indicating CUDA availability and model loading status.

### 2. Start the Frontend Development Server

From the `frontend` directory, run:

```bash
npm run dev
# or
yarn dev
```

The frontend application will typically be available at `http://localhost:3000`.

Open your browser and navigate to the application. You can now enter medical terms to get explanations from the MedGemma model.

## Troubleshooting

-   **CUDA Issues**: Ensure your NVIDIA drivers and CUDA toolkit are correctly installed and compatible with the PyTorch version.
-   **Model Loading Errors**: Check the backend console for detailed error messages. Ensure the `MODEL_ID` in your `.env` file is correct and you have internet access for the initial model download.
-   **CORS Errors**: The backend is configured to allow requests from `http://localhost:3000`. If your frontend runs on a different port, you may need to adjust the CORS settings in `backend/main.py`.
-   **PyTorch Compiler/Triton Errors**: The `backend/services.py` file includes configurations to suppress or manage PyTorch compiler errors. If issues persist, ensure `triton-windows` is correctly installed and compatible.

## Project Structure

```
medicalapp/
├── backend/
│   ├── .venv/                    # Python virtual environment
│   ├── main.py                   # FastAPI application entry point
│   ├── services.py               # MedGemma model loading and inference logic
│   ├── requirements.txt          # Backend Python dependencies
│   └── .env                      # Environment variables (e.g., MODEL_ID)
├── frontend/
│   ├── src/
│   │   └── app/                  # Next.js app directory
│   │       ├── explain/page.tsx  # Main page for term explanation
│   │       └── ...
│   ├── public/
│   ├── package.json
│   └── ...                       # Other Next.js files
└── README.md                     # This file
```

This `README.md` provides a good starting point. You can expand it further with more details about specific features, deployment, or contribution guidelines as your project evolves.
