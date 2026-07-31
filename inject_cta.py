import os, glob
from bs4 import BeautifulSoup

# The HTML block to inject
cta_html = """
<div class="cta-box mt-5 cta-expert-advice" style="background: linear-gradient(135deg, #c2eef1, #8eeaed); border-color: #95d0db; border-left: 4px solid #0692ab; padding: 20px; border-radius: 8px;">
<h3 style="font-size: 1.25rem; font-weight: 700; color: #0692ab; margin-bottom: 10px;"><i class="fas fa-stethoscope me-2"></i> Get Expert Advice Today</h3>
<p>Don't wait for a minor niggle to become a major injury. Book an assessment with our expert team in Wayanad.</p>
<div class="d-flex flex-wrap gap-3 mt-3">
<a class="btn btn-primary" href="tel:+916282929104" style="background-color: #0692ab; border: none;"><i class="fas fa-phone-alt me-2"></i>Call: +91 62829 29104</a>
<a class="btn btn-success" href="https://wa.me/916282929104" rel="noopener" target="_blank"><i class="fab fa-whatsapp me-2"></i>WhatsApp Us</a>
<a class="btn btn-outline-primary" href="https://kapcwayanad.in/bookings/create/9" rel="noopener" style="color: #0692ab; border-color: #0692ab;" target="_blank"><i class="far fa-calendar-alt me-2"></i>Book Online</a>
</div>
</div>
"""
cta_soup = BeautifulSoup(cta_html, 'html.parser')
cta_div = cta_soup.div

files = glob.glob('/Users/joyspc/MY OWNS/website/blogs/*.html')

for file_path in files:
    if 'index.html' in file_path:
        continue

    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()
        
    soup = BeautifulSoup(html, 'html.parser')
    
    # Check if the CTA already exists by looking for the specific text
    if "Get Expert Advice Today" in html:
        print(f"Skipping {os.path.basename(file_path)} (CTA already exists)")
        continue
        
    # Find the injection point: end of blog-article-body
    article_body = soup.find('div', class_='blog-article-body')
    if article_body:
        # Append as the last child
        # To avoid BeautifulSoup copying bugs, we parse a fresh CTA for each file
        fresh_cta = BeautifulSoup(cta_html, 'html.parser').div
        article_body.append(fresh_cta)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(str(soup))
        print(f"Injected into {os.path.basename(file_path)}")
    else:
        print(f"Warning: Could not find blog-article-body in {os.path.basename(file_path)}")
