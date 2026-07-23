import re
from bs4 import BeautifulSoup
import sys

with open('blogs/benefits-of-sports-physiotherapy-for-athletes.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

# Update title and meta tags
soup.title.string = "Benefits of Sports Physiotherapy for Athletes | Physio Dynamics, Wayanad"
soup.find('link', {'rel': 'canonical'})['href'] = "https://www.physio-dynamics.com/blogs/benefits-of-sports-physiotherapy-for-athletes"

meta_desc = "Discover the key benefits of sports physiotherapy for athletes, from faster recovery and injury prevention to improved performance. Expert care at Physio Dynamics, Wayanad."
soup.find('meta', {'name': 'description'})['content'] = meta_desc
soup.find('meta', {'name': 'keywords'})['content'] = "benefits of sports physiotherapy, sports physiotherapy for athletes, athlete injury prevention Wayanad, sports rehabilitation benefits, physiotherapy for athletes Panamaram"

soup.find('meta', {'property': 'og:title'})['content'] = "Benefits of Sports Physiotherapy for Athletes | Physio Dynamics, Wayanad"
soup.find('meta', {'property': 'og:description'})['content'] = meta_desc
soup.find('meta', {'property': 'og:url'})['content'] = "https://www.physio-dynamics.com/blogs/benefits-of-sports-physiotherapy-for-athletes"
soup.find('meta', {'property': 'og:image'})['content'] = "https://www.physio-dynamics.com/img/blog-athlete-benefits-hero.jpg"

soup.find('meta', {'name': 'twitter:title'})['content'] = "Benefits of Sports Physiotherapy for Athletes | Physio Dynamics, Wayanad"
soup.find('meta', {'name': 'twitter:description'})['content'] = "Discover the key benefits of sports physiotherapy for athletes, from faster recovery and injury prevention to improved performance."
soup.find('meta', {'name': 'twitter:image'})['content'] = "https://www.physio-dynamics.com/img/blog-athlete-benefits-hero.jpg"

# Update structured data (JSON-LD)
# Find the script tag containing the JSON-LD
script_tag = soup.find('script', {'type': 'application/ld+json'})
if script_tag:
    content = script_tag.string
    content = content.replace("What Is Sports Physiotherapy?", "Benefits of Sports Physiotherapy for Athletes")
    content = content.replace("Learn what sports physiotherapy is, how it differs from general physiotherapy, and how it helps athletes prevent injury, recover faster, and perform better.", meta_desc)
    content = content.replace("what-is-sports-physiotherapy", "benefits-of-sports-physiotherapy-for-athletes")
    content = content.replace("sports-physiotherapy-hero.jpg", "blog-athlete-benefits-hero.jpg")
    script_tag.string = content

# Update Hero section
header_h1 = soup.find('h1', class_='blog-title')
if header_h1:
    header_h1.string = "Benefits of Sports Physiotherapy for Athletes"

hero_img = soup.find('img', class_='blog-hero-image')
if hero_img:
    hero_img['src'] = "/img/blog-athlete-benefits-hero.jpg"
    hero_img['alt'] = "Athlete undergoing sports physiotherapy assessment at Physio Dynamics, Panamaram, Wayanad"

# Update article content
article_body = soup.find('div', class_='blog-content')
if article_body:
    # First, let's keep the author box which is standard, and we will replace everything between author box and FAQ or just replace everything.
    # We will generate the HTML string to replace the inside of the body.
    new_html = """
                            <!-- Intro -->
                            <p class="lead fw-bold">
                                Athletes push their bodies harder and more repetitively than most people — which means the margin between peak performance and injury can be thin. <strong>Sports physiotherapy</strong> helps close that gap, offering targeted support that goes well beyond treating pain after it happens.
                            </p>
                            <p>
                                At <strong>Physio Dynamics</strong>, we work with footballers, runners, cricketers, badminton players, and gym-goers across Wayanad to help them train, compete, and recover in a way that protects their long-term health. Here's how sports physiotherapy benefits athletes at every level.
                            </p>

                            <!-- Point 1 -->
                            <h2 id="structured-recovery">1. Faster, More Structured Recovery</h2>
                            <p>A sports physiotherapist creates a <strong>structured rehabilitation plan</strong> based on the specific injury and the demands of your sport, rather than a generic recovery timeline. This targeted approach often helps athletes return to activity more efficiently and with less risk of setback.</p>
                            
                            <!-- Point 2 -->
                            <h2 id="reduced-risk">2. Reduced Risk of Injury</h2>
                            <p>Regular sports physiotherapy sessions can identify muscle imbalances, poor movement patterns, or areas of weakness before they turn into an injury. Addressing these issues early through targeted exercises is one of the most effective ways to reduce injury risk over a season.</p>
                            
                            <!-- Point 3 -->
                            <h2 id="improved-strength">3. Improved Strength, Flexibility, and Mobility</h2>
                            <p>Sports physiotherapists design strength and flexibility programmes suited to your specific sport — whether that means shoulder mobility for a bowler or explosive lower-body strength for a footballer. Better movement quality translates directly into better performance and lower injury risk.</p>

                            <figure class="blog-infographic my-4 text-center">
                                <img src="/img/athlete-benefits-infographic.jpg" class="img-fluid rounded shadow-sm" alt="Infographic illustrating the 7 benefits of sports physiotherapy for athletes" loading="lazy" />
                            </figure>

                            <!-- Point 4 -->
                            <h2 id="better-performance">4. Better Performance</h2>
                            <p>By improving biomechanics, correcting compensatory movement patterns, and building targeted strength, sports physiotherapy can help athletes move more efficiently — which often supports better performance on the field or court.</p>

                            <!-- Point 5 -->
                            <h2 id="safer-return">5. Safer Return to Sport</h2>
                            <p>Returning to sport too early after an injury is one of the leading causes of re-injury. Sports physiotherapists use structured <strong>return-to-sport testing and criteria</strong> to make sure an athlete is genuinely ready, not just pain-free.</p>

                            <!-- Point 6 -->
                            <h2 id="personalised-care">6. Personalised, Hands-On Care</h2>
                            <p>Every athlete's body, sport, and training load are different. Sports physiotherapy offers individualised assessment and treatment, rather than a one-size-fits-all programme — which matters for both recovery and long-term injury prevention.</p>

                            <!-- Point 7 -->
                            <h2 id="long-term-management">7. Long-Term Injury Management</h2>
                            <p>For athletes with recurring issues like tendinitis or chronic joint pain, ongoing sports physiotherapy helps manage symptoms, build resilience in the affected area, and reduce flare-ups over the course of a season.</p>

                            <!-- Divider before FAQ -->
                            <hr class="my-5" />

                            <!-- FAQ Section -->
                            <h2 id="faq">Frequently Asked Questions</h2>
                            
                            <div class="faq-item mb-4">
                                <h5>How often should athletes see a sports physiotherapist?</h5>
                                <p>This depends on the individual, their sport, and whether they are managing an existing injury. Some athletes benefit from regular check-ins during a season, while others may need more frequent sessions during active rehabilitation. A physiotherapist can recommend a suitable schedule after an assessment.</p>
                            </div>
                            
                            <div class="faq-item mb-4">
                                <h5>Can sports physiotherapy improve performance even without an injury?</h5>
                                <p>Yes. Many athletes use sports physiotherapy proactively to improve strength, flexibility, and movement efficiency, which can support better performance and reduce injury risk, even without a current injury.</p>
                            </div>

                            <div class="faq-item mb-4">
                                <h5>Is sports physiotherapy only needed after an injury?</h5>
                                <p>No. While it plays a key role in injury recovery, sports physiotherapy is equally valuable for injury prevention, performance support, and general athletic conditioning.</p>
                            </div>

                            <div class="faq-item mb-4">
                                <h5>Where can athletes get sports physiotherapy in Wayanad?</h5>
                                <p>Physio Dynamics Physiotherapy &amp; Sports Rehabilitation Centre in Panamaram, Wayanad provides sports physiotherapy for athletes across football, cricket, badminton, running, and fitness training. Call <a href="tel:+916282929104">+91 62829 29104</a> to book an assessment.</p>
                            </div>
"""
    # Keep the author box if possible, or we just insert it.
    author_html = """
                            <!-- Author Box -->
                            <div class="author-box mt-5 p-4 rounded bg-light">
                                <div class="d-flex align-items-center mb-3">
                                    <div class="author-avatar me-3">
                                        <i class="fas fa-user-circle fa-3x text-secondary"></i>
                                    </div>
                                    <div>
                                        <h4 class="mb-1 h5">Sandra Thomas, BPT</h4>
                                        <p class="text-muted mb-0 small">Founder &amp; Chief Physiotherapist, Physio Dynamics | HCPC (UK) Registered</p>
                                    </div>
                                </div>
                                <p class="mb-0 small text-muted">
                                    Sandra specializes in sports rehabilitation, orthopedics, and movement analysis. 
                                    She is dedicated to helping athletes of all levels prevent injuries and perform at their best.
                                </p>
                            </div>
"""
    article_body.clear()
    article_body.append(BeautifulSoup(new_html + author_html, 'html.parser'))

# Update TOC
toc = soup.find('ul', class_='toc-list')
if toc:
    toc.clear()
    toc_items = """
                                <li><a href="#structured-recovery">Structured Recovery</a></li>
                                <li><a href="#reduced-risk">Reduced Injury Risk</a></li>
                                <li><a href="#improved-strength">Strength &amp; Mobility</a></li>
                                <li><a href="#better-performance">Better Performance</a></li>
                                <li><a href="#safer-return">Safer Return to Sport</a></li>
                                <li><a href="#personalised-care">Personalised Care</a></li>
                                <li><a href="#long-term-management">Long-Term Management</a></li>
                                <li><a href="#faq">Frequently Asked Questions</a></li>
"""
    toc.append(BeautifulSoup(toc_items, 'html.parser'))

# Sidebar Related Articles: Add what-is-sports-physiotherapy, remove benefits-of-sports-physiotherapy-for-athletes
sidebar_related = soup.find_all('div', class_='sidebar-card')[2] # Usually the third card is Related Articles
if sidebar_related and sidebar_related.find('h4').text.strip() == "Related Articles":
    ul = sidebar_related.find('ul', class_='toc-list')
    ul.clear()
    ul_items = """
                                <li><a href="/blogs/what-is-sports-physiotherapy">What Is Sports Physiotherapy?</a></li>
                                <li><a href="/blogs/sports-injury-recovery-physiotherapy">Sports Injury Recovery</a></li>
                                <li><a href="/blogs/best-exercises-for-knee-pain">Knee Pain Exercises</a></li>
                                <li><a href="/blogs/lower-back-pain-physiotherapy-exercises">Lower Back Pain Exercises</a></li>
                                <li><a href="/blogs/">View All Blog Posts</a></li>
"""
    ul.append(BeautifulSoup(ul_items, 'html.parser'))

with open('blogs/benefits-of-sports-physiotherapy-for-athletes.html', 'w', encoding='utf-8') as f:
    f.write(str(soup))
