import re

with open('scratch/source.html', 'r') as f:
    html = f.read()

# Very basic replacements for React JSX
html = html.replace('class=', 'className=')
html = html.replace('charSet=', 'charSet=')
html = html.replace('crossorigin', 'crossOrigin')
html = html.replace('stroke-width', 'strokeWidth')
html = html.replace('stroke-dasharray', 'strokeDasharray')
html = html.replace('stop-color', 'stopColor')
html = html.replace('stop-opacity', 'stopOpacity')
html = html.replace('fill-opacity', 'fillOpacity')
html = html.replace('font-size', 'fontSize')
html = html.replace('font-weight', 'fontWeight')
html = html.replace('font-family', 'fontFamily')
html = html.replace('text-anchor', 'textAnchor')
html = html.replace('dominant-baseline', 'dominantBaseline')
html = html.replace('preserveAspectRatio', 'preserveAspectRatio')
html = html.replace('viewBox', 'viewBox')
html = html.replace('animateTransform', 'animateTransform')
html = html.replace('animateMotion', 'animateMotion')
html = html.replace('attributeName', 'attributeName')
html = html.replace('repeatCount', 'repeatCount')

def replace_style(match):
    style_str = match.group(1)
    props = style_str.split(';')
    react_style = []
    for prop in props:
        prop = prop.strip()
        if not prop: continue
        parts = prop.split(':', 1)
        if len(parts) == 2:
            key, val = parts
            key = key.strip()
            key = re.sub(r'-([a-z])', lambda m: m.group(1).upper(), key)
            val = val.strip()
            if re.match(r'^-?\d+(?:\.\d+)?$', val) and key != 'opacity':
                react_style.append(f"{key}: {val}")
            else:
                react_style.append(f"{key}: '{val}'")
    return "style={{" + ", ".join(react_style) + "}}"

html = re.sub(r'style="([^"]*)"', replace_style, html)
html = re.sub(r'<(br|hr|input|img|meta|link)([^>]*?)(?<!/)>', r'<\1\2/>', html)

with open('scratch/output.jsx', 'w') as f:
    f.write(html)
