import json

check_cell = {
 "cell_type": "code",
 "metadata": {},
 "outputs": [],
 "execution_count": None,
 "source": [
  "import sys\n",
  "if sys.version_info >= (3, 14):\n",
  "    print(\"\\n❌ ERROR: You are using Python 3.15+ which is not fully supported by Pandas yet.\\n\")\n",
  "    print(\"👉 HOW TO FIX THIS IN VS CODE:\\n\")\n",
  "    print(\"1. Look at the top-right corner of this Jupyter Notebook.\\n\")\n",
  "    print(\"2. Click where it says 'Python 3.15' (or similar).\\n\")\n",
  "    print(\"3. Click 'Select Another Kernel...' -> 'Python Environments'.\\n\")\n",
  "    print(\"4. Select 'Python 3.13.x'.\\n\")\n",
  "    print(\"5. Run the notebook again.\\n\")\n",
  "    raise RuntimeError(\"Please switch to Python 3.13 as described above.\")\n"
 ]
}

for nb_file in ['analysis/01_forecast_error_analysis.ipynb', 'analysis/02_reliability_analysis.ipynb']:
    with open(nb_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Don't add if already there
    if "import sys" not in data['cells'][0]['source'][0]:
        data['cells'].insert(0, check_cell)
        
        with open(nb_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=1)
            
print("Successfully injected version check cells.")
