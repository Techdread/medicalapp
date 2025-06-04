import sys
import os

# Create a log file in the same directory
log_file = os.path.join(os.path.dirname(__file__), "torch_check_log.txt")

# Redirect stdout to the log file
with open(log_file, "w") as f:
    # Write Python environment info
    f.write(f"Python executable: {sys.executable}\n")
    f.write(f"Python version: {sys.version}\n\n")
    
    # Try to import torch and get version info
    try:
        import torch
        f.write(f"PyTorch version: {torch.__version__}\n")
        f.write(f"CUDA available: {torch.cuda.is_available()}\n")
        
        if torch.cuda.is_available():
            f.write(f"CUDA version: {torch.version.cuda}\n")
            f.write(f"cuDNN version: {torch.backends.cudnn.version() if torch.backends.cudnn.is_available() else 'Not available'}\n")
            f.write(f"Device count: {torch.cuda.device_count()}\n")
            for i in range(torch.cuda.device_count()):
                f.write(f"Device {i}: {torch.cuda.get_device_name(i)}\n")
        else:
            f.write("CUDA is not available. This is a CPU-only PyTorch installation.\n")
        
        # Check if this is a CUDA-enabled build
        if '+cu' in torch.__version__:
            f.write(f"This is a CUDA-enabled PyTorch build ({torch.__version__})\n")
        else:
            f.write(f"This is a CPU-only PyTorch build ({torch.__version__})\n")
            
    except ImportError as e:
        f.write(f"Error importing torch: {e}\n")
    
    # List installed packages
    f.write("\nInstalled packages:\n")
    try:
        import pkg_resources
        for package in pkg_resources.working_set:
            f.write(f"{package.key}=={package.version}\n")
    except ImportError:
        f.write("Could not import pkg_resources to list installed packages\n")

print(f"Diagnostic information has been written to {log_file}")
