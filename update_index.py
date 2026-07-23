import re
from bs4 import BeautifulSoup

with open('blogs/index.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

# Find the featured blog card
featured_card = soup.find('article', class_='blog-card-featured')
if featured_card:
    featured_card.find('img')['src'] = '/img/blog-athlete-benefits-hero.jpg'
    featured_card.find('img')['alt'] = 'Athlete undergoing sports physiotherapy assessment at Physio Dynamics, Panamaram, Wayanad'
    
    # Update category label
    category_span = featured_card.find('span', class_='blog-category')
    if category_span:
        category_span.string = 'Sports Injury'
        
    # Update title and link
    title_a = featured_card.find('h3', class_='blog-title').find('a')
    if title_a:
        title_a['href'] = '/blogs/benefits-of-sports-physiotherapy-for-athletes'
        title_a.string = 'Benefits of Sports Physiotherapy for Athletes'
        
    # Update excerpt
    excerpt = featured_card.find('p', class_='blog-excerpt')
    if excerpt:
        excerpt.string = 'Discover the key benefits of sports physiotherapy for athletes, from faster recovery and injury prevention to improved performance.'

    # Update date
    date_meta = featured_card.find('span', class_='blog-meta-item')
    if date_meta:
        date_meta.string = '23 July 2026'

# Now we need to add the previous featured blog into the grid!
grid = soup.find('div', class_='blog-grid')
if grid:
    new_card_html = """
                                <article class="blog-card" data-category="sports">
                                    <div class="blog-card-img-wrap">
                                        <img src="/img/sports-physiotherapy-hero.jpg" alt="Physiotherapist providing sports rehabilitation to an athlete in Wayanad" loading="lazy">
                                        <span class="blog-category">Sports Injury</span>
                                    </div>
                                    <div class="blog-card-content">
                                        <div class="blog-meta mb-2">
                                            <span class="blog-meta-item">23 July 2026</span>
                                            <span class="blog-meta-item">&middot; 6 min read</span>
                                        </div>
                                        <h3 class="blog-title h5 mb-3">
                                            <a href="/blogs/what-is-sports-physiotherapy">What Is Sports Physiotherapy?</a>
                                        </h3>
                                        <p class="blog-excerpt text-muted mb-4">
                                            Learn what sports physiotherapy is, how it differs from general physiotherapy, and how it helps athletes prevent injury, recover faster, and perform better.
                                        </p>
                                        <a href="/blogs/what-is-sports-physiotherapy" class="btn btn-outline-primary btn-sm">Read More</a>
                                    </div>
                                </article>
    """
    # Insert at the beginning of the grid
    grid.insert(0, BeautifulSoup(new_card_html, 'html.parser'))

with open('blogs/index.html', 'w', encoding='utf-8') as f:
    f.write(str(soup))
