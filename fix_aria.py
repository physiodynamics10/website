import os, glob
from bs4 import BeautifulSoup

files = glob.glob('/Users/joyspc/MY OWNS/website/**/*.html', recursive=True)

for file_path in files:
    if 'index.html' in file_path and 'blogs' in file_path:
        continue

    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()
        
    soup = BeautifulSoup(html, 'html.parser')
    faq_accordion = soup.find(id="faqAccordion")
    
    modified = False
    
    if faq_accordion:
        items = faq_accordion.find_all('div', class_='accordion-item')
        
        for item in items:
            header = item.find(class_='accordion-header')
            collapse = item.find(class_='accordion-collapse')
            
            if header and collapse:
                h_id = header.get('id')
                if h_id and collapse.get('aria-labelledby') != h_id:
                    collapse['aria-labelledby'] = h_id
                    modified = True

    if modified:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(str(soup))
        print(f"Fixed aria-labelledby in {os.path.relpath(file_path, '/Users/joyspc/MY OWNS/website')}")
