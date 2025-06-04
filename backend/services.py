# This file will contain the logic for interacting with the MedGemma model.
import os
import torch
import torch._dynamo

# Explicitly suppress PyTorch compiler errors and disable optimizations
torch._dynamo.config.suppress_errors = True
torch._dynamo.config.disable = True

# Optimize CUDA operations without using compiler optimizations
torch.backends.cuda.matmul.allow_tf32 = True  # For better performance on Ampere+ GPUs (RTX 3090, 3060)
torch.backends.cudnn.allow_tf32 = True  # For better performance on Ampere+ GPUs
torch.backends.cudnn.benchmark = True  # Auto-tuner for better performance

# Force eager mode execution via environment variables
os.environ["PYTORCH_JIT"] = "0"
os.environ["TORCH_INDUCTOR_DISABLE"] = "1"

from transformers import AutoModelForImageTextToText, AutoProcessor # Import both required classes
from dotenv import load_dotenv
import traceback

load_dotenv() # Load environment variables from .env file

# --- Model Loading Configuration ---
MODEL_ID = os.getenv("MODEL_ID", "google/medgemma-4b-it")

# Print CUDA diagnostic information at module import time
print("\n==== CUDA Diagnostic Information ====")
print(f"PyTorch version: {torch.__version__}")
print(f"CUDA available: {torch.cuda.is_available()}")
if torch.cuda.is_available():
    print(f"CUDA version: {torch.version.cuda}")
    print(f"Device count: {torch.cuda.device_count()}")
    for i in range(torch.cuda.device_count()):
        print(f"Device {i}: {torch.cuda.get_device_name(i)}")
print("====================================\n")

model = None
processor = None

def load_medgemma_model():
    global model, processor, MODEL_ID
    # This check prevents reloading if already loaded
    if model is not None and processor is not None:
        print(f"MedGemma model ({MODEL_ID}) is already loaded on {model.device}")
        return

    # Force check CUDA availability again
    print("\n==== CUDA Check in load_medgemma_model() ====")
    cuda_available = torch.cuda.is_available()
    print(f"CUDA available in load_medgemma_model: {cuda_available}")
    if cuda_available:
        print(f"CUDA device count: {torch.cuda.device_count()}")
        print(f"CUDA device 0: {torch.cuda.get_device_name(0)}")
    print("=========================================\n")
    
    # Determine device and dtype
    local_device = "cuda" if cuda_available else "cpu"
    local_torch_dtype = None
    if local_device == "cuda":
        if torch.cuda.is_bf16_supported():
            local_torch_dtype = torch.bfloat16
            print("Using bfloat16 for GPU.")
        else:
            local_torch_dtype = torch.float16
            print("Using float16 for GPU (bfloat16 not supported).")
    else:
        local_torch_dtype = torch.float32
        print("Using float32 for CPU.")

    print(f"Attempting to load MedGemma model ({MODEL_ID}) onto {local_device} with dtype {local_torch_dtype}...")
    try:
        # Load the model specifically on GPU 0 (RTX 3090) if CUDA is available
        if cuda_available:
            print("Loading model specifically on cuda:0 (RTX 3090)...")
            device_map = {"":"cuda:0"}  # Force all model parts to cuda:0
        else:
            device_map = None
            
        model = AutoModelForImageTextToText.from_pretrained(
            MODEL_ID,
            torch_dtype=local_torch_dtype,
            device_map=device_map,  # Use specific device mapping
            low_cpu_mem_usage=True if local_device == "cuda" else False,
        )
        processor = AutoProcessor.from_pretrained(MODEL_ID)
        
        # Double-check that model is on the correct device
        if cuda_available and not str(model.device).startswith("cuda"):
            print("Model not on CUDA despite CUDA being available. Attempting to force move to CUDA:0...")
            try:
                # Try to explicitly move to CUDA:0
                model = model.to("cuda:0")
                print(f"Successfully moved model to {model.device}")
            except Exception as e:
                print(f"Failed to move model to CUDA:0: {e}")
                
        print(f"MedGemma model ({MODEL_ID}) loaded successfully. Model is on: {model.device}")
    except Exception as e:
        print(f"ERROR: Failed to load MedGemma model ({MODEL_ID}). Exception: {e}")
        traceback.print_exc()
        model = None
        processor = None

async def get_medgemma_explanation(term: str) -> str:
    global model, processor
    if model is None or processor is None:
        print("Model or processor not loaded. Attempting to load now...")
        load_medgemma_model() # Try to load if not already loaded (e.g., if startup load failed)
    
    if model is None or processor is None:
        error_message = "Error: MedGemma model is not available or failed to load. Please check backend logs."
        print(error_message)
        return error_message

    messages = [
        {
            "role": "system",
            "content": [{"type": "text", "text": "You are an expert medical terminologist. Explain the following medical term clearly and concisely for a medical student."}]
        },
        {
            "role": "user",
            "content": [
                {"type": "text", "text": f"Explain the medical term: {term}"},
            ]
        }
    ]

    try:
        print(f"Processing term: '{term}' with model on {model.device}")
        inputs = processor.apply_chat_template(
            messages, 
            add_generation_prompt=True, 
            tokenize=True,
            return_dict=True, 
            return_tensors="pt"
        ).to(model.device) 
        
        input_len = inputs["input_ids"].shape[-1]

        # Simple approach with torch.no_grad()
        with torch.no_grad():
            generation = model.generate(
                **inputs, 
                max_new_tokens=300, 
                do_sample=False,
                use_cache=True,  # Enable KV cache for faster generation
            )
            generation = generation[0][input_len:]
        
        decoded_explanation = processor.decode(generation, skip_special_tokens=True)
        print(f"Generated explanation for '{term}': {decoded_explanation[:100]}...") # Log snippet
        return decoded_explanation.strip()
    
    except Exception as e:
        print(f"ERROR: Could not generate explanation for term '{term}'. Exception: {e}")
        traceback.print_exc()
        return "Error: Could not generate explanation due to an internal issue. Please check backend logs."

# Note: Model loading is now triggered by an app startup event in main.py
# or on the first call to get_medgemma_explanation if startup failed.
