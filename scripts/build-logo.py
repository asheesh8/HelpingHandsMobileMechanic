"""
Rebuilds the Helping Hands logo as clean SVG.

Reference: the official logo image supplied by ArkiTech (652x402 raster, white
swoosh with a red tip, letterspaced white wordmark, red tagline). Shapes are
traced by hand in that image's pixel coordinates, so the viewBox is a window
onto it. The lettering is Montserrat 700 (wordmark) and 600 (tagline),
converted to outlines so the SVG needs no font.

Outputs:
  src/assets/brand/logo-full.svg     stacked logo, for dark backgrounds
  src/assets/brand/logo-mark.svg     shield rim and swoosh only
  public/favicon.svg                 the mark on an ink tile

Run: python3 scripts/build-logo.py
"""
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from pathlib import Path

FONTS = Path('node_modules/@fontsource/montserrat/files')
TAG_RED = '#c8293b'
TIP_RED = '#c43a50'


def text_path(fontfile, text, cap_height, x0, baseline, fit_width):
    """Set `text` so its cap height and total width match the reference."""
    font = TTFont(fontfile)
    glyphs = font.getGlyphSet()
    cmap = font.getBestCmap()
    upm = font['head'].unitsPerEm
    hmtx = font['hmtx']
    size = cap_height / (font['OS/2'].sCapHeight / upm)
    s = size / upm
    advance = [hmtx[cmap[ord(ch)]][0] * s for ch in text]
    natural = sum(advance[:-1]) + advance[-1]
    # Stretch the tracking, not the letters.
    track = (fit_width - natural) / (len(text) - 1)
    pen = SVGPathPen(glyphs)
    x = x0
    for ch, adv in zip(text, advance):
        glyphs[cmap[ord(ch)]].draw(TransformPen(pen, (s, 0, 0, -s, x, baseline)))
        x += adv + track
    return pen.getCommands()


WORD = text_path(FONTS / 'montserrat-latin-700-normal.woff', 'HELPING HANDS', 26, 88, 282, 475)
TAG = text_path(FONTS / 'montserrat-latin-600-normal.woff', 'AUTO CARE TO YOUR DOOR', 17, 55, 311, 543)

DEFS = f'''
  <defs>
    <linearGradient id="hh-rim" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f6f7f8"/>
      <stop offset="0.45" stop-color="#b4b8be"/>
      <stop offset="0.7" stop-color="#eceef0"/>
      <stop offset="1" stop-color="#868b93"/>
    </linearGradient>
    <linearGradient id="hh-swoosh" x1="85" y1="0" x2="565" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="0.62" stop-color="#f4f4f5"/>
      <stop offset="0.8" stop-color="#e3aab3"/>
      <stop offset="1" stop-color="{TIP_RED}"/>
    </linearGradient>
    <linearGradient id="hh-roof" x1="0" y1="146" x2="0" y2="194" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="1" stop-color="#d9dbde"/>
    </linearGradient>
  </defs>'''

RIM = ('<path d="M166 186 L166 138 Q167 118 186 110 C240 94 300 87 350 88 C400 89 445 98 470 108 '
       'Q482 113 482 128 L483 206" fill="none" stroke="url(#hh-rim)" stroke-width="9" stroke-linejoin="round"/>')
GLINT = ('<path d="M153 92 L156 125 L190 128 L156 131 L153 164 L150 131 L116 128 L150 125 Z '
         'M153 128 L170 111 L156 128 L170 145 L153 128 L136 145 L150 128 L136 111 Z" fill="#fff"/>')
ROOF = ('<path d="M222 194 C250 170 290 152 335 147 C362 145 385 154 400 176 '
        'C385 171 366 168 342 168 C300 170 262 180 222 194 Z" fill="url(#hh-roof)"/>')
ZIG = '<path d="M400 176 L407 180 L352 206 L338 206 Z" fill="#f2f2f3"/>'
BODY = ('<path d="M85 229 C130 214 185 206 240 204 C290 203 320 206 346 205 '
        'C390 199 440 189 490 191 C525 193 548 202 564 215 '
        'C535 207 505 204 470 206 C425 209 395 219 350 224 C300 228 250 224 205 219 '
        'L168 222 L160 233 L148 222 C125 223 105 225 85 229 Z" fill="url(#hh-swoosh)"/>')
TAIL = f'<path d="M468 205 C492 210 512 218 528 230 C505 222 485 217 462 214 Z" fill="{TIP_RED}"/>'
CHEVRON = ('<path d="M213 329 L246 330 L318 399 L391 330 L432 329 L396 338 L318 389 L241 338 Z" '
           'fill="url(#hh-rim)"/>')
STAR = ('<path d="M318 339 L321.2 348.6 L331.3 348.7 L323.2 354.7 L326.2 364.4 L318 358.5 '
        'L309.8 364.4 L312.8 354.7 L304.7 348.7 L314.8 348.6 Z" fill="url(#hh-rim)"/>')

MARK = '\n  '.join([RIM, GLINT, ROOF, ZIG, BODY, TAIL])
TEXT = f'<path d="{WORD}" fill="#ffffff"/>\n  <path d="{TAG}" fill="{TAG_RED}"/>'


def svg(view, body, title):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view}" role="img" aria-label="{title}">'
            f'<title>{title}</title>{DEFS}\n  {body}\n</svg>\n')


out = Path('src/assets/brand')
out.mkdir(parents=True, exist_ok=True)
(out / 'logo-full.svg').write_text(svg('46 80 562 324', f'{MARK}\n  {TEXT}\n  {CHEVRON}\n  {STAR}', 'Helping Hands Auto Care'))
(out / 'logo-mark.svg').write_text(svg('80 84 490 154', MARK, 'Helping Hands'))
favicon = f'<rect x="60" y="-80" width="530" height="400" fill="#0a0a0b"/>\n  ' + '\n  '.join([RIM, ROOF, ZIG, BODY, TAIL])
Path('public/favicon.svg').write_text(svg('60 -80 530 400', favicon, 'Helping Hands'))
print('wrote logo-full.svg, logo-mark.svg, favicon.svg')
