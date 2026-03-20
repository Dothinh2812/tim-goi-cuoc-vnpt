import re
import glob
import os
import html

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract title and description
    title_match = re.search(r'const title = "(.*?)";', content)
    desc_match = re.search(r'const description = "(.*?)";', content)
    
    title = title_match.group(1) if title_match else ""
    desc = desc_match.group(1) if desc_match else ""
    
    # Extract canonical path from BaseLayout
    canonical_match = re.search(r'canonicalPath="(.*?)"', content)
    canonical = canonical_match.group(1) if canonical_match else ""
    
    # Extract bodyHtml string
    body_match = re.search(r'const bodyHtml = "(.*?)";\s*---', content, re.DOTALL)
    if not body_match:
        print(f"Skipping {filepath}: no bodyHtml found")
        return
    
    body_html_escaped = body_match.group(1)
    # Unescape the string
    # Replace \" with "
    # Replace \r\n with \n
    # Replace \n with \n
    body_html_unescaped = body_html_escaped.replace('\\"', '"').replace('\\r\\n', '\n').replace('\\n', '\n')
    
    # Extract just the <main>...</main> part
    main_match = re.search(r'(<main.*?>.*?</main>)', body_html_unescaped, re.DOTALL | re.IGNORECASE)
    if not main_match:
        print(f"Skipping {filepath}: no <main> tag found in bodyHtml")
        return
        
    main_content = main_match.group(1)
    
    # Form the new Astro file
    new_content = f"""---
import BaseLayout from '../layouts/BaseLayout.astro';
import SiteHeader from '../components/SiteHeader.astro';
import SiteFooter from '../components/SiteFooter.astro';
import FloatingCtas from '../components/FloatingCtas.astro';

const title = "{title}";
const description = "{desc}";
---

<BaseLayout title={{title}} description={{description}} canonicalPath="{canonical}">
  <SiteHeader />
  
  {main_content}
  
  <SiteFooter />
  <FloatingCtas />
</BaseLayout>
"""
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Successfully processed {filepath}")

if __name__ == '__main__':
    files = [
        'src/pages/chinh-sach-bao-mat.astro',
        'src/pages/dieu-khoan-su-dung.astro',
        'src/pages/tuyen-bo-minh-bach.astro',
        'src/pages/gioi-thieu.astro',
        'src/pages/lien-he.astro'
    ]
    
    for f in files:
        filepath = os.path.join(r'C:\Users\xuanthinh\Downloads\Tìm gói', f)
        process_file(filepath)
