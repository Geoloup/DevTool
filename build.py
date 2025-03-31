import os
import re
import random

# Define file paths
html_file = "devtool.html"
js_file = "devtool.js"
output_js = "dist/devtool.js"

# Ensure the output directory exists
os.makedirs("dist", exist_ok=True)

class betterString(str):
    def __init__(self, value):
        super().__init__()
    def replaceAll(self,old,new):
        return self.replace(old, new,self.count(old))


with open(html_file, "r", encoding="utf-8") as f:
    html_content = f.read()

# Convert HTML to JS function
js_function = html_to_js(html_content)

# Read JavaScript file
with open(js_file, "r", encoding="utf-8") as f:
    js_content = f.read()

# Insert function at the top of JS file
final_js = js_content

# Write output file
with open(output_js, "w", encoding="utf-8") as f:
    f.write(final_js)

print(f"✅ Successfully created {output_js}")