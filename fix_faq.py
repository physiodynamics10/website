import glob
from bs4 import BeautifulSoup

files = glob.glob('/Users/joyspc/MY OWNS/website/**/*.html', recursive=True)
count = 0

for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    if 'faqAccordion' not in html:
        continue
        
    soup = BeautifulSoup(html, 'html.parser')
    modified = False
    
    accordions = soup.find_all('div', class_='accordion')
    for accordion in accordions:
        if 'faqAccordion' not in str(accordion.get('id', '')):
            if not accordion.parent or 'faq-accordion' not in accordion.parent.get('class', []):
                continue
        
        items = accordion.find_all('div', class_='accordion-item')
        if not items:
            continue
            
        for idx, item in enumerate(items, start=1):
            header = item.find(['h2', 'h3'])
            if not header:
                continue
            
            button = header.find('button')
            if not button:
                continue
                
            question_text = button.get_text(strip=True)
            
            collapse = item.find('div', class_='accordion-collapse')
            if not collapse:
                continue
                
            body = collapse.find('div', class_='accordion-body')
            if not body:
                continue
                
            if body.find('div', recursive=False):
                answer_html = "".join(str(c) for c in body.find('div', recursive=False).contents)
            else:
                answer_html = "".join(str(c) for c in body.contents)
            
            num = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"][idx-1] if idx <= 12 else str(idx)
            heading_id = f"heading{num}"
            collapse_id = f"collapse{num}"
            
            # Save itemprops
            item_itemprop = item.get('itemprop')
            item_itemscope = item.get('itemscope')
            item_itemtype = item.get('itemtype')
            
            header_itemprop = header.get('itemprop')
            button_itemprop = button.get('itemprop')
            
            collapse_itemprop = collapse.get('itemprop')
            collapse_itemscope = collapse.get('itemscope')
            collapse_itemtype = collapse.get('itemtype')
            
            body_itemprop = body.get('itemprop')
            
            item.clear()
            
            if item_itemprop: item['itemprop'] = item_itemprop
            if item_itemscope is not None: item['itemscope'] = ""
            if item_itemtype: item['itemtype'] = item_itemtype
            
            is_first = (idx == 1)
            
            new_header = soup.new_tag("h3", attrs={"class": "accordion-header", "id": heading_id})
            if header_itemprop: new_header['itemprop'] = header_itemprop
            
            new_btn = soup.new_tag("button", attrs={
                "class": "accordion-button" if is_first else "accordion-button collapsed",
                "type": "button",
                "data-bs-toggle": "collapse",
                "data-bs-target": f"#{collapse_id}",
                "aria-expanded": "true" if is_first else "false",
                "aria-controls": collapse_id
            })
            if button_itemprop: new_btn['itemprop'] = button_itemprop
            
            new_span = soup.new_tag("span")
            new_span.string = question_text
            new_btn.append(new_span)
            new_header.append(new_btn)
            item.append(new_header)
            
            new_collapse = soup.new_tag("div", attrs={
                "id": collapse_id,
                "class": "accordion-collapse collapse show" if is_first else "accordion-collapse collapse",
                "aria-labelledby": heading_id,
                "data-bs-parent": "#faqAccordion"
            })
            if collapse_itemprop: new_collapse['itemprop'] = collapse_itemprop
            if collapse_itemscope is not None: new_collapse['itemscope'] = ""
            if collapse_itemtype: new_collapse['itemtype'] = collapse_itemtype
            
            new_body = soup.new_tag("div", attrs={"class": "accordion-body"})
            if body_itemprop: new_body['itemprop'] = body_itemprop
            
            new_inner_div = soup.new_tag("div")
            inner_soup = BeautifulSoup(answer_html.strip(), 'html.parser')
            for child in inner_soup:
                new_inner_div.append(child)
                
            new_body.append(new_inner_div)
            new_collapse.append(new_body)
            item.append(new_collapse)
            
        modified = True
            
    if modified:
        # Use formatter="html" to avoid replacing HTML entities weirdly
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(str(soup))
        print(f"Updated FAQ in {file_path}")
        count += 1

print(f"Total files updated: {count}")
