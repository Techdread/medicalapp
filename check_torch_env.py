import torch
import sys

print(f"Python version: {sys.version}")
print(f"PyTorch version: {torch.__version__}")
print(f"CUDA available: {torch.cuda.is_available()}")

if torch.cuda.is_available():
    print(f"CUDA version: {torch.version.cuda}")
    print(f"Device count: {torch.cuda.device_count()}")
    for i in range(torch.cuda.device_count()):
        print(f"Device {i}: {torch.cuda.get_device_name(i)}")
else:
    print("CUDA is not available. This is a CPU-only PyTorch installation.")
    
# Check if this is a CUDA-enabled build
if '+cu' in torch.__version__:
    print(f"This is a CUDA-enabled PyTorch build ({torch.__version__})")
else:
    print(f"This is a CPU-only PyTorch build ({torch.__version__})")
