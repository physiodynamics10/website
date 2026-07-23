import re
from bs4 import BeautifulSoup

with open('blogs/benefits-of-sports-physiotherapy-for-athletes.html', 'r', encoding='utf-8') as f:
    html = f.read()

faq_items = [
    {
        "q": "How often should athletes see a sports physiotherapist?",
        "a": "This depends on the individual, their sport, and whether they are managing an existing injury. Some athletes benefit from regular check-ins during a season, while others may need more frequent sessions during active rehabilitation. A physiotherapist can recommend a suitable schedule after an assessment."
    },
    {
        "q": "Can sports physiotherapy improve performance even without an injury?",
        "a": "Yes. Many athletes use sports physiotherapy proactively to improve strength, flexibility, and movement efficiency, which can support better performance and reduce injury risk, even without a current injury."
    },
    {
        "q": "Is sports physiotherapy only needed after an injury?",
        "a": "No. While it plays a key role in injury recovery, sports physiotherapy is equally valuable for injury prevention, performance support, and general athletic conditioning."
    },
    {
        "q": "Where can athletes get sports physiotherapy in Wayanad?",
        "a": "Physio Dynamics Physiotherapy &amp; Sports Rehabilitation Centre in Panamaram, Wayanad provides sports physiotherapy for athletes across football, cricket, badminton, running, and fitness training. Call <a href=\"tel:+916282929104\">+91 62829 29104</a> to book an assessment."
    }
]

accordion_html = '<div class="blog-faq accordion" id="sportsPhysioFAQ">\n'
for i, item in enumerate(faq_items):
    q = item['q']
    a = item['a']
    expanded = "true" if i == 0 else "false"
    show_class = " show" if i == 0 else ""
    collapsed_class = "" if i == 0 else " collapsed"
    
    accordion_html += f"""
                                <div class="accordion-item" id="faq-q{i+1}">
                                    <h3 class="accordion-header">
                                        <button class="accordion-button{collapsed_class}" type="button" data-bs-toggle="collapse" data-bs-target="#faq-q{i+1}-body" aria-expanded="{expanded}">
                                            {q}
                                        </button>
                                    </h3>
                                    <div id="faq-q{i+1}-body" class="accordion-collapse collapse{show_class}" data-bs-parent="#sportsPhysioFAQ">
                                        <div class="accordion-body">
                                            {a}
                                        </div>
                                    </div>
                                </div>
"""
accordion_html += '                            </div>'

# Regex to replace the plain faq items
html = re.sub(r'<div class="faq-item mb-4">.*?</div>', '', html, flags=re.DOTALL)
# It will leave empty spaces, then we just replace the "Frequently Asked Questions</h2>" with the header and accordion
html = html.replace('<h2 id="faq">Frequently Asked Questions</h2>', '<h2 id="faq">Frequently Asked Questions</h2>\n' + accordion_html)

with open('blogs/benefits-of-sports-physiotherapy-for-athletes.html', 'w', encoding='utf-8') as f:
    f.write(html)
