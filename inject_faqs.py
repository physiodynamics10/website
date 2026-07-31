import os, glob
from bs4 import BeautifulSoup
from faq_content import faq_data
from faq_content_2 import faq_data_2
from faq_content_3 import faq_data_3

master_faqs = {**faq_data, **faq_data_2, **faq_data_3}

def create_accordion_item(soup, idx, q, a, is_first_in_section):
    num = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen"][idx-1] if idx <= 16 else str(idx)
    heading_id = f"headingNew{num}"
    collapse_id = f"collapseNew{num}"
    
    item = soup.new_tag("div", attrs={
        "class": "accordion-item",
        "itemprop": "mainEntity",
        "itemscope": "",
        "itemtype": "https://schema.org/Question"
    })
    
    header = soup.new_tag("h3", attrs={"class": "accordion-header", "id": heading_id})
    btn = soup.new_tag("button", attrs={
        "class": "accordion-button" if is_first_in_section else "accordion-button collapsed",
        "type": "button",
        "data-bs-toggle": "collapse",
        "data-bs-target": f"#{collapse_id}",
        "aria-expanded": "true" if is_first_in_section else "false",
        "aria-controls": collapse_id,
        "itemprop": "name"
    })
    span = soup.new_tag("span")
    span.string = q
    btn.append(span)
    header.append(btn)
    item.append(header)
    
    collapse = soup.new_tag("div", attrs={
        "id": collapse_id,
        "class": "accordion-collapse collapse show" if is_first_in_section else "accordion-collapse collapse",
        "aria-labelledby": heading_id,
        "data-bs-parent": "#faqAccordion",
        "itemprop": "acceptedAnswer",
        "itemscope": "",
        "itemtype": "https://schema.org/Answer"
    })
    body = soup.new_tag("div", attrs={"class": "accordion-body", "itemprop": "text"})
    inner_div = soup.new_tag("div")
    inner_div.string = a
    body.append(inner_div)
    collapse.append(body)
    item.append(collapse)
    
    return item

for file_rel_path, faqs in master_faqs.items():
    full_path = os.path.join('/Users/joyspc/MY OWNS/website', file_rel_path)
    if not os.path.exists(full_path):
        continue
        
    with open(full_path, 'r', encoding='utf-8') as f:
        html = f.read()
        
    soup = BeautifulSoup(html, 'html.parser')
    faq_accordion = soup.find(id="faqAccordion")
    
    modified = False
    
    if faq_accordion:
        existing_items = faq_accordion.find_all('div', class_='accordion-item')
        existing_questions = set()
        for item in existing_items:
            btn = item.find('button')
            if btn:
                existing_questions.add(btn.get_text(strip=True).lower())
                
        current_count = len(existing_items)
        items_added = 0
        for faq in faqs:
            if faq['q'].lower() not in existing_questions:
                current_count += 1
                items_added += 1
                is_first = (current_count == 1)
                new_item = create_accordion_item(soup, current_count, faq['q'], faq['a'], is_first)
                faq_accordion.append(new_item)
                
        if items_added > 0:
            modified = True
            
    else:
        if 'blogs' in file_rel_path:
            wrapper = soup.new_tag("div", attrs={"class": "faq-section mt-5 mb-5", "itemscope": "", "itemtype": "https://schema.org/FAQPage"})
            title = soup.new_tag("h3", attrs={"class": "mb-4"})
            title.string = "Frequently Asked Questions"
            accordion = soup.new_tag("div", attrs={"class": "faq-accordion accordion", "id": "faqAccordion"})
            
            for idx, faq in enumerate(faqs, start=1):
                new_item = create_accordion_item(soup, idx, faq['q'], faq['a'], idx==1)
                accordion.append(new_item)
                
            wrapper.append(title)
            wrapper.append(accordion)
            
            author_box = soup.find('div', class_='author-box')
            if author_box:
                author_box.insert_before(wrapper)
                modified = True
            else:
                article = soup.find('article')
                if article:
                    article.append(wrapper)
                    modified = True
        else:
            wrapper_html = """
            <section class="faq-section" aria-label="Frequently Asked Questions">
                <div class="container">
                    <div class="section-title text-center">
                        <h2>Frequently Asked Questions</h2>
                        <p>Common questions about our treatments and services</p>
                    </div>
                    <div class="row justify-content-center">
                        <div class="col-lg-10">
                            <div class="faq-accordion animate-fade-in" itemscope itemtype="https://schema.org/FAQPage">
                                <div class="accordion" id="faqAccordion">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            """
            wrapper_soup = BeautifulSoup(wrapper_html, 'html.parser')
            accordion = wrapper_soup.find(id="faqAccordion")
            
            for idx, faq in enumerate(faqs, start=1):
                new_item = create_accordion_item(wrapper_soup, idx, faq['q'], faq['a'], idx==1)
                accordion.append(new_item)
                
            cta = soup.find('section', class_='cta-section')
            if cta:
                cta.insert_before(wrapper_soup)
                modified = True
            else:
                main = soup.find('main')
                if main:
                    main.append(wrapper_soup)
                    modified = True
                    
    if modified:
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(str(soup))
        print(f"Injected into {file_rel_path}")
