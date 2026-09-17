import sys
from PIL import Image, ImageDraw, ImageFont
out, cols = sys.argv[1], int(sys.argv[2]); items = sys.argv[3:]
pairs = list(zip(items[::2], items[1::2]))
W,H = 400, 350
rows = (len(pairs)+cols-1)//cols
o = Image.new('RGB',(W*cols,H*rows),(10,12,14))
try: font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 15)
except: font = ImageFont.load_default()
d = ImageDraw.Draw(o)
for i,(f,l) in enumerate(pairs):
    im = Image.open(f).resize((W,H)); x,y = (i%cols)*W, (i//cols)*H
    o.paste(im,(x,y)); d.rectangle([x,y,x+W,y+22],fill=(0,0,0)); d.text((x+6,y+3),l,fill=(255,255,255),font=font)
o.save(out)
