import json

def convert_py_to_ipynb(py_filepath, ipynb_filepath):
    with open(py_filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    cells = []
    current_cell_type = 'code'
    current_source = []
    
    for line in lines:
        if line.startswith('# %%'):
            # Save the previous cell if it's not empty
            if current_source:
                cells.append({
                    "cell_type": current_cell_type,
                    "metadata": {},
                    "source": current_source
                })
                if current_cell_type == "code":
                    cells[-1]["execution_count"] = None
                    cells[-1]["outputs"] = []
                current_source = []
            
            # Determine the type of the new cell
            if '[markdown]' in line:
                current_cell_type = 'markdown'
            else:
                current_cell_type = 'code'
        else:
            if current_cell_type == 'markdown':
                # Remove the leading '# ' or '#' from markdown lines
                if line.startswith('# '):
                    current_source.append(line[2:])
                elif line.startswith('#\n'):
                    current_source.append(line[1:])
                elif line.startswith('#'):
                    current_source.append(line[1:])
                else:
                    # Sometimes there are blank lines in markdown cells
                    current_source.append(line)
            else:
                current_source.append(line)
                
    # Add the last cell
    if current_source:
        cells.append({
            "cell_type": current_cell_type,
            "metadata": {},
            "source": current_source
        })
        if current_cell_type == "code":
            cells[-1]["execution_count"] = None
            cells[-1]["outputs"] = []

    notebook = {
        "cells": cells,
        "metadata": {
            "kernelspec": {
                "display_name": "Python 3",
                "language": "python",
                "name": "python3"
            },
            "language_info": {
                "name": "python"
            }
        },
        "nbformat": 4,
        "nbformat_minor": 4
    }
    
    with open(ipynb_filepath, 'w', encoding='utf-8') as f:
        json.dump(notebook, f, indent=1)

convert_py_to_ipynb('analysis/01_forecast_error_analysis.py', 'analysis/01_forecast_error_analysis.ipynb')
convert_py_to_ipynb('analysis/02_reliability_analysis.py', 'analysis/02_reliability_analysis.ipynb')
print("Conversion complete.")
