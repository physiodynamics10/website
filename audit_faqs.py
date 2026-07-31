import os, glob
from bs4 import BeautifulSoup

files = glob.glob('/Users/joyspc/MY OWNS/website/**/*.html', recursive=True)

errors = []

for file_path in files:
    # Skip non-content pages
    if any(x in file_path for x in ['privacy-policy.html', 'terms-of-service.html', '404.html', 'google89be9aab9d25c09c.html']):
        continue
    if 'blogs/index.html' in file_path or 'service/index.html' in file_path:
        continue

    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()
        
    soup = BeautifulSoup(html, 'html.parser')
    faq_accordion = soup.find(id="faqAccordion")
    
    if faq_accordion:
        items = faq_accordion.find_all('div', class_='accordion-item')
        
        # 1. Check count
        if len(items) != 5:
            # wait, index.html had 7 originally. The user said "only 5 question needed for every pages".
            # My truncate script truncated index.html to 5.
            errors.append(f"{file_path}: Has {len(items)} FAQs instead of 5.")
            
        questions_seen = set()
        
        for idx, item in enumerate(items):
            header = item.find(class_='accordion-header')
            collapse = item.find(class_='accordion-collapse')
            btn = item.find('button', class_='accordion-button')
            
            if not header or not collapse or not btn:
                errors.append(f"{file_path}: Missing structure in FAQ #{idx+1}")
                continue
                
            h_id = header.get('id')
            c_id = collapse.get('id')
            target = btn.get('data-bs-target')
            
            # 2. Check IDs
            if target != f"#{c_id}":
                errors.append(f"{file_path}: Button target {target} does not match collapse id {c_id}")
            if collapse.get('aria-labelledby') != h_id:
                errors.append(f"{file_path}: Collapse aria-labelledby {collapse.get('aria-labelledby')} does not match header id {h_id}")
                
            # 3. Check for duplicates
            q_text = btn.get_text(strip=True).lower()
            if q_text in questions_seen:
                errors.append(f"{file_path}: Duplicate question '{q_text}'")
            questions_seen.add(q_text)
            
            # 4. Check for contradictory info (old phone number etc.)
            a_text = collapse.get_text(strip=True).lower()
            if '91 62829 29104' in a_text or '6282929104' in a_text:
                pass # This is the correct number from floating button
            if '8086884666' in a_text:
                errors.append(f"{file_path}: Found old/wrong phone number 8086884666 in FAQ: '{q_text}'")

if not errors:
    print("All FAQs are perfectly structured, unique, and have exactly 5 items!")
else:
    for e in errors:
        print(e)
