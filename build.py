import os
import re
import random

# Define file paths
js_file2 = "fallback.js"
js_file = "devtool.js"
output_js = "dist/devtool.js"
output_js2 = "dist/fallback.js"

# Ensure the output directory exists
os.makedirs("dist", exist_ok=True)

class betterString(str):
    def __init__(self, value):
        super().__init__()
    def replaceAll(self,old,new):
        return self.replace(old, new,self.count(old))


# Read JavaScript file
with open(js_file, "r", encoding="utf-8") as f:
    js_content = f.read()

# Write output file
with open(output_js, "w", encoding="utf-8") as f:
    f.write(js_content)

with open(js_file2, "r", encoding="utf-8") as f:
    js_content = f.read()

with open(output_js2, "w", encoding="utf-8") as f:
    f.write(js_content)

print(f"✅ Successfully created {output_js}")