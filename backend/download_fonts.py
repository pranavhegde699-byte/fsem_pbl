import os
import requests

fonts_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fonts')
os.makedirs(fonts_dir, exist_ok=True)

fonts = {
    'NotoSans-Regular.ttf': 'https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSans/NotoSans-Regular.ttf',
    'NotoSansDevanagari-Regular.ttf': 'https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSansDevanagari/NotoSansDevanagari-Regular.ttf',
    'NotoSansKannada-Regular.ttf': 'https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSansKannada/NotoSansKannada-Regular.ttf',
    'NotoSansTamil-Regular.ttf': 'https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSansTamil/NotoSansTamil-Regular.ttf',
    'NotoSansTelugu-Regular.ttf': 'https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSansTelugu/NotoSansTelugu-Regular.ttf',
}

for name, url in fonts.items():
    path = os.path.join(fonts_dir, name)
    if os.path.exists(path):
        print(f'Already exists: {name}')
        continue
    print(f'Downloading {name}...')
    r = requests.get(url, timeout=60)
    if r.status_code == 200:
        with open(path, 'wb') as f:
            f.write(r.content)
        print(f'  Saved {name} ({len(r.content)//1024}KB)')
    else:
        print(f'  FAILED {name}: status {r.status_code}')

print('Done.')
