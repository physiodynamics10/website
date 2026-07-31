import os, glob

files = glob.glob('/Users/joyspc/MY OWNS/website/**/*.html', recursive=True)

for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if 'logo.webp' in content:
        content = content.replace('logo.webp', 'logo.png')
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file_path}")
