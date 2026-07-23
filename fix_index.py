import re
from bs4 import BeautifulSoup

with open('blogs/index.html', 'r', encoding='utf-8') as f:
    html = f.read()
    
# Change featured post data attributes
html = html.replace('data-title="what is sports physiotherapy"', 'data-title="benefits of sports physiotherapy for athletes"')

# Change featured post image
html = html.replace('src="/img/sports-physiotherapy-hero.jpg"', 'src="/img/blog-athlete-benefits-hero.jpg"')

# Change featured title link and text
html = html.replace(
    '<a href="/blogs/what-is-sports-physiotherapy" class="blog-card-title">\n                                            What Is Sports Physiotherapy? | Physio Dynamics, Wayanad\n                                        </a>',
    '<a href="/blogs/benefits-of-sports-physiotherapy-for-athletes" class="blog-card-title">\n                                            Benefits of Sports Physiotherapy for Athletes | Physio Dynamics, Wayanad\n                                        </a>'
)

# Change excerpt
html = html.replace(
    '<p class="blog-card-excerpt">\n                                            Learn what sports physiotherapy is, how it differs from general physiotherapy, and how it helps athletes prevent injury, recover faster, and perform better.\n                                        </p>',
    '<p class="blog-card-excerpt">\n                                            Discover the key benefits of sports physiotherapy for athletes, from faster recovery and injury prevention to improved performance.\n                                        </p>'
)

# Change read more link
html = html.replace(
    '<a href="/blogs/what-is-sports-physiotherapy" class="blog-card-read-more" aria-label="Read full article: What Is Sports Physiotherapy?">',
    '<a href="/blogs/benefits-of-sports-physiotherapy-for-athletes" class="blog-card-read-more" aria-label="Read full article: Benefits of Sports Physiotherapy for Athletes">'
)

# Insert What Is Sports Physiotherapy to grid
new_card = """
                        <!-- What is sports physio -->
                        <div class="col-lg-4 col-md-6 blog-article-item" data-category="sports" data-title="what is sports physiotherapy">
                            <article class="blog-card">
                                <div class="blog-card-img-wrap">
                                    <img
                                        src="/img/sports-physiotherapy-hero.jpg"
                                        alt="Sports physiotherapist assessing an athlete's movement at Physio Dynamics, Panamaram, Wayanad"
                                        loading="lazy"
                                        onerror="this.src='https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80'; this.onerror=null;"
                                    />
                                    <span class="blog-card-category">Sports Rehab</span>
                                </div>
                                <div class="blog-card-body">
                                    <div class="blog-card-meta">
                                        <span><i class="far fa-calendar-alt"></i> 23 July 2026</span>
                                        <span><i class="far fa-clock"></i> 6 min read</span>
                                    </div>
                                    <a href="/blogs/what-is-sports-physiotherapy" class="blog-card-title">
                                        What Is Sports Physiotherapy? | Physio Dynamics, Wayanad
                                    </a>
                                    <p class="blog-card-excerpt">
                                        Learn what sports physiotherapy is, how it differs from general physiotherapy, and how it helps athletes prevent injury, recover faster, and perform better.
                                    </p>
                                    <div class="blog-card-footer">
                                        <div class="blog-card-author">
                                            <img src="/img/sandra-thomas.jpeg" alt="DR. Sandra Thomas (PT)" loading="lazy"
                                                onerror="this.src='https://ui-avatars.com/api/?name=Sandra+Thomas&background=007d94&color=fff&size=60'; this.onerror=null;" />
                                            <span>Dr. Sandra Thomas</span>
                                        </div>
                                        <a href="/blogs/what-is-sports-physiotherapy" class="blog-card-read-more" aria-label="Read full article: What Is Sports Physiotherapy?">
                                            Read <i class="fas fa-arrow-right"></i>
                                        </a>
                                    </div>
                                </div>
                            </article>
                        </div>
"""
html = html.replace('<!-- ── ARTICLE GRID ── -->\n                    <div class="row g-4" id="blogGrid">', '<!-- ── ARTICLE GRID ── -->\n                    <div class="row g-4" id="blogGrid">\n' + new_card)

with open('blogs/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
