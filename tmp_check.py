import re, pathlib
html = pathlib.Path('index.html').read_text(encoding='utf-8')
js = pathlib.Path('js/multilingual.js').read_text(encoding='utf-8')
ids = set()
for m in re.findall(r"document\.getElementById\('([^']+)'\)|translateElement\('([^']+)',", js):
    ids.add(m[0] or m[1])
missing = [id for id in ids if f'id="{id}"' not in html]
print('missing', missing)
