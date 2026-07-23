import json
import re

with open('blogs/benefits-of-sports-physiotherapy-for-athletes.html', 'r', encoding='utf-8') as f:
    html = f.read()

# We need to extract the JSON-LD script, parse it, update the FAQ section, and put it back.
match = re.search(r'(<script type="application/ld\+json">)(.*?)(</script>)', html, re.DOTALL)
if match:
    start_tag = match.group(1)
    json_str = match.group(2)
    end_tag = match.group(3)
    
    data = json.loads(json_str)
    for item in data.get('@graph', []):
        if item.get('@type') == 'FAQPage':
            item['mainEntity'] = [
                {
                    "@type": "Question",
                    "name": "How often should athletes see a sports physiotherapist?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "This depends on the individual, their sport, and whether they are managing an existing injury. Some athletes benefit from regular check-ins during a season, while others may need more frequent sessions during active rehabilitation. A physiotherapist can recommend a suitable schedule after an assessment."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Can sports physiotherapy improve performance even without an injury?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes. Many athletes use sports physiotherapy proactively to improve strength, flexibility, and movement efficiency, which can support better performance and reduce injury risk, even without a current injury."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Is sports physiotherapy only needed after an injury?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "No. While it plays a key role in injury recovery, sports physiotherapy is equally valuable for injury prevention, performance support, and general athletic conditioning."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Where can athletes get sports physiotherapy in Wayanad?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Physio Dynamics Physiotherapy & Sports Rehabilitation Centre in Panamaram, Wayanad provides sports physiotherapy for athletes across football, cricket, badminton, running, and fitness training. Call +91 62829 29104 to book an assessment."
                    }
                }
            ]
            
    new_json_str = json.dumps(data, indent=2)
    html = html.replace(json_str, "\n" + new_json_str + "\n")
    
    with open('blogs/benefits-of-sports-physiotherapy-for-athletes.html', 'w', encoding='utf-8') as f:
        f.write(html)
