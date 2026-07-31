import os, glob
from bs4 import BeautifulSoup

files = glob.glob('/Users/joyspc/MY OWNS/website/**/*.html', recursive=True)

for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()
        
    soup = BeautifulSoup(html, 'html.parser')
    faq_accordion = soup.find(id="faqAccordion")
    
    modified = False
    if faq_accordion:
        items = faq_accordion.find_all('div', class_='accordion-item', recursive=False)
        
        # In our structure, accordion-items are immediate children of faq_accordion. 
        # But let's just find them recursively within faq_accordion just in case.
        items = faq_accordion.find_all('div', class_='accordion-item')
        
        if len(items) > 5:
            # We need to remove the ones from index 5 onwards
            for item in items[5:]:
                item.decompose()
            modified = True
            
    if modified:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(str(soup))
        print(f"Truncated FAQs in {os.path.relpath(file_path, '/Users/joyspc/MY OWNS/website')}")
