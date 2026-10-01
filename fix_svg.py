import os
import re

files_to_fix = [
    "src/pages/LoginPage.tsx",
    "src/pages/ClayDashboardPage.tsx",
    "src/pages/LandingPage.tsx"
]

replacements = {
    "flood-color": "floodColor",
    "stop-color": "stopColor",
    "stroke-width": "strokeWidth",
    "stroke-linecap": "strokeLinecap",
    "stroke-linejoin": "strokeLinejoin",
    "flood-opacity": "floodOpacity",
    "stop-opacity": "stopOpacity",
    "fill-opacity": "fillOpacity"
}

for filepath in files_to_fix:
    with open(filepath, 'r') as f:
        content = f.read()
    
    for old, new in replacements.items():
        # Replace occurrences like old="value" with new="value"
        # We can just do a literal string replace since these strings shouldn't appear elsewhere
        content = content.replace(f'{old}=', f'{new}=')
        
    with open(filepath, 'w') as f:
        f.write(content)

print("Replaced SVG attributes.")
