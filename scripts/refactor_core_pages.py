import re
import os

def process_file(filepath, add_css_import=None):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract title and description
    title_match = re.search(r'const title = "(.*?)";', content)
    desc_match = re.search(r'const description = "(.*?)";', content)
    title = title_match.group(1) if title_match else ""
    desc = desc_match.group(1) if desc_match else ""

    # Extract canonical
    canonical_match = re.search(r'canonicalPath="(.*?)"', content)
    canonical = canonical_match.group(1) if canonical_match else "/"

    # Special handling for bodyClass
    body_class_match = re.search(r'const bodyClass = "(.*?)";', content)
    body_class = body_class_match.group(1) if body_class_match else ""

    # Extract inlineStyles
    inline_styles_match = re.search(r'const inlineStyles = \[\s*([\s\S]*?)\s*\];', content)
    raw_styles = []
    if inline_styles_match:
        styles_str = inline_styles_match.group(1)
        # simplistic split, in these files it's just one string usually
        if styles_str.strip():
            # Extract content between double quotes
            string_matches = re.finditer(r'"([\s\S]*?)"', styles_str)
            for m in string_matches:
                s = m.group(1).replace('\\r\\n', '\n').replace('\\n', '\n')
                raw_styles.append(s)

    # Extract script
    script_match = re.search(r'<script>\s*(import.*?)\s*</script>', content, re.DOTALL)
    script_import = script_match.group(1) if script_match else ""

    body_match = re.search(r'const bodyHtml = "(.*?)";\s*---', content, re.DOTALL)
    if not body_match:
        print(f"Skipping {filepath}: no bodyHtml found")
        return

    body_html_escaped = body_match.group(1)
    # unescape
    body_html_unescaped = body_html_escaped.replace('\\"', '"').replace('\\r\\n', '\n').replace('\\n', '\n')

    # Now we need to extract the middle part:
    # Everything after </nav> and before <footer
    
    # 1. find end of nav
    nav_end_idx = body_html_unescaped.find('</nav>')
    if nav_end_idx == -1:
        # Some might not have </nav>?
        pass
    else:
        body_html_unescaped = body_html_unescaped[nav_end_idx + 6:]
    
    # 2. find start of footer
    footer_start_idx = body_html_unescaped.find('<footer')
    if footer_start_idx != -1:
        body_html_unescaped = body_html_unescaped[:footer_start_idx]
    
    # Remove floating cta if any remains (sometimes it's before footer, sometimes after)
    # Actually, floating cta usually has class="fixed bottom-4 right-4 ... z-[1000] ..."
    floating_start_idx = body_html_unescaped.find('<div class="fixed bottom-4')
    if floating_start_idx != -1:
        # let's just strip everything from floating_start_idx and onward (assuming it's at the end)
        # To be safe, let's find the matching > ... </div> but usually it's at the very end
        pass

    # A simpler way: we know floating cta is `<div class="fixed bottom-4 right-4 ... z-[1000] ...`
    body_html_unescaped = re.sub(r'<!-- Floating CTA -->.*?</div>\s*$', '', body_html_unescaped, flags=re.DOTALL | re.IGNORECASE)
    body_html_unescaped = re.sub(r'<div class="fixed bottom-4 right-4.*?</div>\s*$', '', body_html_unescaped, flags=re.DOTALL | re.IGNORECASE)

    # Some files like tim-goi-cuoc.astro have floating-cta class
    body_html_unescaped = re.sub(r'<div class="floating-cta">.*?</div>\s*$', '', body_html_unescaped, flags=re.DOTALL | re.IGNORECASE)

    main_content = body_html_unescaped.strip()

    imports = [
        "import BaseLayout from '../layouts/BaseLayout.astro';",
        "import SiteHeader from '../components/SiteHeader.astro';",
        "import SiteFooter from '../components/SiteFooter.astro';",
        "import FloatingCtas from '../components/FloatingCtas.astro';"
    ]
    if add_css_import:
        imports.append(f"import '{add_css_import}';")

    import_str = "\n".join(imports)
    
    style_str = ""
    if raw_styles:
        combined_styles = "\n".join(raw_styles)
        style_str = f"\n<style is:global>\n{combined_styles}\n</style>"
        
    script_str = ""
    if script_import:
        script_str = f"\n<script>\n  {script_import}\n</script>"

    new_content = f"""---
{import_str}

const title = "{title}";
const description = "{desc}";
---

<BaseLayout title={{title}} description={{description}} canonicalPath="{canonical}" bodyClass="{body_class}">
  <SiteHeader currentPath="{canonical}" />
  
  {main_content}
  
  <SiteFooter />
  <FloatingCtas />
</BaseLayout>
{style_str}{script_str}
"""
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Processed {filepath}")

if __name__ == '__main__':
    base = r'C:\Users\xuanthinh\Downloads\Tìm gói'
    process_file(os.path.join(base, 'src/pages/bang-gia.astro'))
    process_file(os.path.join(base, 'src/pages/tim-goi-cuoc.astro'), '../styles/package-finder.css')
    process_file(os.path.join(base, 'src/pages/index.astro'))
