import glob, re

files = glob.glob('/Users/joyspc/MY OWNS/website/**/*.html', recursive=True)
count = 0

for file_path in files:
    if 'index.html' in file_path and 'blogs' not in file_path:
        continue

    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()

    if 'faqAccordion' not in html:
        continue

    original_html = html

    # 1. Replace <h2 class="accordion-header"...> with h3
    html = re.sub(
        r'<h2(\s+class="accordion-header"[^>]*)>',
        r'<h3\1>',
        html
    )
    # Replace closing </h2> if it precedes an accordion collapse.
    html = re.sub(
        r'</h2>(\s*<div[^>]*id="collapse)',
        r'</h3>\1',
        html
    )
    
    html = re.sub(
        r'</h2>(\s*<div[^>]*class="accordion-collapse)',
        r'</h3>\1',
        html
    )

    # 2. Add span inside button
    def add_span(match):
        start_tag = match.group(1)
        inner_content = match.group(2)
        end_tag = match.group(3)
        if '<span>' not in inner_content:
            inner_content = f"<span>{inner_content.strip()}</span>"
        return f"{start_tag}\n{inner_content}\n{end_tag}"

    html = re.sub(
        r'(<button[^>]*class="accordion-button[^>]*>)(.*?)(</button>)',
        add_span,
        html,
        flags=re.DOTALL
    )

    # 3. Add div inside accordion-body
    def add_div(match):
        start_tag = match.group(1)
        inner_content = match.group(2)
        end_tag = match.group(3)
        if '<div' not in inner_content:
            inner_content = f"<div>\n{inner_content.strip()}\n</div>"
        return f"{start_tag}\n{inner_content}\n{end_tag}"

    html = re.sub(
        r'(<div[^>]*class="accordion-body"[^>]*>)(.*?)(</div>)',
        add_div,
        html,
        flags=re.DOTALL
    )

    if html != original_html:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"Updated {file_path}")
        count += 1

print(f"Total files updated: {count}")
