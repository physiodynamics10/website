import os

base = "/Users/joyspc/MY OWNS/website/service"

files = [
    'orthopedic-physiotherapy.html',
    'sports-physiotherapy.html',
    'neurological-physiotherapy.html',
    'pediatric-physiotherapy.html',
    'chest-physiotherapy.html',
    'home-care.html'
]

for filename in files:
    slug = filename.replace('.html', '')
    filepath = os.path.join(base, filename)

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # 1. Add hreflang after canonical (only if not already added)
    canonical_tag = f'<link rel="canonical" href="https://www.physio-dynamics.com/service/{slug}">'
    if canonical_tag not in content:
        canonical_tag = f'<link rel="canonical" href="https://www.physio-dynamics.com/service/{slug}" />'

    hreflang_block = (
        f'{canonical_tag}\n\n'
        f'  <!-- Hreflang for Indian English -->\n'
        f'  <link rel="alternate" hreflang="en-IN" href="https://www.physio-dynamics.com/service/{slug}" />\n'
        f'  <link rel="alternate" hreflang="en" href="https://www.physio-dynamics.com/service/{slug}" />'
    )
    if 'hreflang="en-IN"' not in content:
        content = content.replace(canonical_tag, hreflang_block)

    # 2. Fix og:url - remove .html
    content = content.replace(
        f'content="https://www.physio-dynamics.com/service/{slug}.html"',
        f'content="https://www.physio-dynamics.com/service/{slug}"'
    )

    # 3. Fix breadcrumb schema - services.html -> services
    content = content.replace(
        '"item": "https://www.physio-dynamics.com/services.html"',
        '"item": "https://www.physio-dynamics.com/services"'
    )
    # Fix breadcrumb schema - service/slug.html -> service/slug
    content = content.replace(
        f'"item": "https://www.physio-dynamics.com/service/{slug}.html"',
        f'"item": "https://www.physio-dynamics.com/service/{slug}"'
    )

    # 4. Fix nav/footer links
    content = content.replace('href="../index.html"', 'href="/"')
    content = content.replace('href="../about.html"', 'href="/about"')
    content = content.replace('href="../services.html"', 'href="/services"')
    content = content.replace('href="../contact.html"', 'href="/contact"')
    content = content.replace('href="../index.html" class="footer-logo"', 'href="/" class="footer-logo"')

    # 5. Bootstrap CSS: replace non-lazy with lazy preload version
    old_bootstrap = '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" />'
    new_bootstrap = (
        '<link rel="preload" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" as="style"\n'
        '    onload="this.onload=null;this.rel=\'stylesheet\'" />\n'
        '  <noscript><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" /></noscript>'
    )
    if 'rel="preload" href="https://cdn.jsdelivr.net/npm/bootstrap' not in content:
        content = content.replace(old_bootstrap, new_bootstrap)

    # 6. FontAwesome CSS: replace non-lazy with lazy preload version
    old_fa = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />'
    new_fa = (
        '<link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" as="style"\n'
        '    onload="this.onload=null;this.rel=\'stylesheet\'" />\n'
        '  <noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" /></noscript>'
    )
    if 'rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome' not in content:
        content = content.replace(old_fa, new_fa)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    changes = "CHANGED" if content != original else "no change"
    print(f"[{changes}] {filename}")

print("Done!")
