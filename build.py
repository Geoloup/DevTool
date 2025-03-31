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


def html_to_js(html_content):
    # use format
    html = html_content.split('\n')
    first = """var HL = document.createElement('div');HL.id = devtoolGL;HL.classList.add('devtool');"""
    js = ['var HL{} = document.createElement("{}")','HL{}.classList.add("{}")','HL{}.id = "{}"','HL{}.dataset.{} = "{}"','HL{}.style.{} = "{}"','HL.appendChild(HL{})']
    finalHTML = []
    for x in html:
        # x = id
        # id = content of elment
        element = x.split(' ') # split for id
        for y in element:
            el = y
            print(el)
            id = random.randint(1,100000000)
            if el.startswith('class='):
                for s in el[7:len(el)-1].split(' '):
                    finalHTML.append(js[1].format(id,s))
            elif el.startswith('style='):
                for s in el[7:len(el)-1].split(' '):
                    finalHTML.append(js[3].format(id,s))
            elif el.startswith('id='):
                finalHTML.append(js[2].format(id,el[4:len(el)-1]))
            else:
                finalHTML.append(js[0].format(id,el[1:len(el)-1]))

    return "addEventListener('DOMContentLoaded', (event) => {" + first + ";".join(finalHTML) + "});"
    

with open(html_file, "r", encoding="utf-8") as f:
    html_content = f.read()

# Convert HTML to JS function
js_function = html_to_js(html_content)

# Read JavaScript file
with open(js_file, "r", encoding="utf-8") as f:
    js_content = f.read()

# Insert function at the top of JS file
final_js = js_function + "\n" + js_content

# Write output file
with open(output_js, "w", encoding="utf-8") as f:
    f.write(final_js)

print(f"✅ Successfully created {output_js}")