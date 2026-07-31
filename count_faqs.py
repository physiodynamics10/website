import glob, re
from bs4 import BeautifulSoup

files = glob.glob('/Users/joyspc/MY OWNS/website/**/*.html', recursive=True)

for file_path in files:
    if 'index.html' in file_path and 'blogs' in file_path:
        continue # skip blog index if it exists

    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()

    soup = BeautifulSoup(html, 'html.parser')
    
    faq_section = soup.find(id='faqAccordion')
    if faq_section:
        items = faq_section.find_all('div', class_='accordion-item')
        print(f"{file_path}: {len(items)} FAQs")
    else:
        print(f"{file_path}: 0 FAQs")
