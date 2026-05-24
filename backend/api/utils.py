import jwt
import datetime
import io
import re
import json
import base64
import bcrypt
import pdfplumber
from django.conf import settings
from groq import Groq
import os

# ReportLab imports
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.units import inch, cm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle
)
from reportlab.pdfgen import canvas

GROQ_API_KEY = "YOUR_GROQ_API_KEYYOUR_GROQ_API_KEY"
groq_client = Groq(api_key=GROQ_API_KEY)

JWT_SECRET = settings.SECRET_KEY

def generate_jwt(worker_id):
    payload = {
        'worker_id': str(worker_id),
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7),
        'iat': datetime.datetime.utcnow()
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm='HS256')
    return token

def decode_jwt(token):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        return payload['worker_id']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def check_password(password, hashed):
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def extract_text_from_pdf(pdf_file):
    text = ""
    try:
        with pdfplumber.open(pdf_file) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
    except Exception as e:
        print(f"Error extracting PDF: {e}")
    return text

def extract_json_from_text(text):
    """Robustly extract the first valid JSON object from any text."""
    # Strategy 1: Look for <output> tags
    match = re.search(r'<output>\s*(\{.*?\})\s*</output>', text, re.DOTALL | re.IGNORECASE)
    if match:
        candidate = match.group(1)
        try:
            json.loads(candidate)
            return candidate
        except Exception:
            pass

    # Strategy 2: Brace-matching to find the LAST complete JSON object
    # Walk through all '{' positions and try to find valid JSON
    valid_json = None
    start = 0
    while True:
        idx = text.find('{', start)
        if idx == -1:
            break
        depth = 0
        in_str = False
        escape = False
        end = idx
        for i, ch in enumerate(text[idx:]):
            if escape:
                escape = False
                continue
            if ch == '\\' and in_str:
                escape = True
                continue
            if ch == '"':
                in_str = not in_str
            if not in_str:
                if ch == '{':
                    depth += 1
                elif ch == '}':
                    depth -= 1
                    if depth == 0:
                        end = idx + i
                        break
        candidate = text[idx:end + 1]
        try:
            json.loads(candidate)
            valid_json = candidate   # keep the last valid one found
        except Exception:
            pass
        start = idx + 1

    if valid_json:
        return valid_json

    return None


def safe_parse_ai_json(raw_text, fallback):
    """Parse AI response to JSON dict, returning fallback dict on failure."""
    extracted = extract_json_from_text(raw_text)
    if extracted:
        try:
            return json.loads(extracted)
        except Exception:
            pass
    return fallback

def analyze_upi_transactions(text):
    system_prompt = """
    You are a financial analysis AI. Analyze the provided UPI transactions and determine a financial 'score' out of 100 based on transaction consistency, volume, and amounts.
    
    You MUST output ONLY a valid JSON object with EXACTLY two keys: 'score' (number) and 'details' (string summary).
    Your output must be wrapped in <output> tags. Do NOT output the original transactions. Do NOT include any explanations or conversational text.
    
    Example:
    <output>
    {
      "score": 85,
      "details": "Consistent spend..."
    }
    </output>
    """
    user_prompt = f"Transactions to analyze:\n{text}\n\nProvide the JSON output now:"

    response = groq_client.chat.completions.create(
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        model="llama-3.1-8b-instant",
    )
    raw_response = response.choices[0].message.content
    return safe_parse_ai_json(raw_response, fallback={"score": 50, "details": "Score based on UPI transaction history."})

def match_schemes(score_data):
    system_prompt = """
    You are a government scheme advisor. Based on this financial score data, recommend 3-5 government or financial schemes suitable for a gig worker.
    
    You MUST output ONLY a valid JSON object with a single key 'matched_schemes'. The value should be a list of objects, each containing 'name', 'description', and 'eligibility'.
    Your output must be wrapped in <output> tags. Do NOT include any explanations or conversational text.
    
    Example:
    <output>
    {
      "matched_schemes": [...]
    }
    </output>
    """
    user_prompt = f"Financial Score Data:\n{score_data}\n\nProvide the JSON output now:"

    response = groq_client.chat.completions.create(
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        model="llama-3.1-8b-instant",
    )
    raw_response = response.choices[0].message.content
    return safe_parse_ai_json(raw_response, fallback={"matched_schemes": []})

LANGUAGE_MAP = {
    "en": "English",
    "hi": "Hindi",
    "ta": "Tamil",
    "te": "Telugu",
    "kn": "Kannada",
    "mr": "Marathi",
    "bn": "Bengali",
    "gu": "Gujarati",
    "pa": "Punjabi",
}

def generate_document_text(language, score_details):
    lang_name = LANGUAGE_MAP.get(language, language)  # map code to full name
    system_prompt = f"""
    You are a professional certificate generator. Generate a formal 'Proof of Work' financial certificate for a gig worker based on their financial history.
    Write ENTIRELY in {lang_name}. If {lang_name} is not English, write every word in {lang_name} script.
    
    Write a 2-3 paragraph professional assessment. Mention financial reliability, consistency of transactions, and creditworthiness. Return ONLY the body text. No headings, no markdown, no conversational text.
    """
    user_prompt = f"Financial Details:\n{score_details}\n\nGenerate the certificate body text now in {lang_name}:"

    response = groq_client.chat.completions.create(
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        model="llama-3.1-8b-instant",
    )
    return response.choices[0].message.content


# ─────────────────────────────────────────────
#  PREMIUM CERTIFICATE PDF GENERATOR
# ─────────────────────────────────────────────

# Color palette
NAVY      = colors.HexColor('#0A1628')
GOLD      = colors.HexColor('#C9A84C')
LIGHT_GOLD= colors.HexColor('#F5E6C8')
DARK_GREY = colors.HexColor('#2D3748')
MID_GREY  = colors.HexColor('#718096')
LIGHT_GREY= colors.HexColor('#F7FAFC')
WHITE     = colors.white
EMERALD   = colors.HexColor('#276749')
EMERALD_LIGHT = colors.HexColor('#C6F6D5')

OCCUPATION_LABELS = {
    "street_vendor": "Street Vendor",
    "domestic_worker": "Domestic Worker",
    "construction": "Construction Worker",
    "driver": "Auto / Taxi Driver",
    "delivery": "Delivery Agent",
    "farmer": "Farmer / Agricultural Worker",
    "migrant": "Migrant Worker",
    "other": "Informal Worker",
}

def _draw_decorative_border(c, width, height):
    """Draw a premium decorative border on the page canvas."""
    margin = 18
    # Outer border
    c.setStrokeColor(GOLD)
    c.setLineWidth(3)
    c.rect(margin, margin, width - 2 * margin, height - 2 * margin)
    # Inner border
    inner = margin + 7
    c.setLineWidth(0.8)
    c.rect(inner, inner, width - 2 * inner, height - 2 * inner)

    # Corner ornaments (small gold squares)
    sz = 5
    for x in [margin - sz/2, width - margin - sz/2]:
        for y in [margin - sz/2, height - margin - sz/2]:
            c.setFillColor(GOLD)
            c.rect(x, y, sz, sz, fill=1, stroke=0)

def _score_badge_color(score):
    if score >= 75:
        return colors.HexColor('#276749'), colors.HexColor('#C6F6D5')  # green
    elif score >= 50:
        return colors.HexColor('#744210'), colors.HexColor('#FEFCBF')  # amber
    else:
        return colors.HexColor('#9B2335'), colors.HexColor('#FED7D7')  # red

def _score_label(score):
    if score >= 75:
        return "EXCELLENT"
    elif score >= 50:
        return "GOOD"
    else:
        return "FAIR"


FONTS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'fonts')

LANGUAGE_FONTS = {
    'hi': os.path.join(FONTS_DIR, 'NotoSansDevanagari-Regular.ttf'),  # Hindi
    'mr': os.path.join(FONTS_DIR, 'NotoSansDevanagari-Regular.ttf'),  # Marathi
    'kn': os.path.join(FONTS_DIR, 'NotoSansKannada-Regular.ttf'),     # Kannada
    'ta': os.path.join(FONTS_DIR, 'NotoSansTamil-Regular.ttf'),       # Tamil
    'te': os.path.join(FONTS_DIR, 'NotoSansTelugu-Regular.ttf'),      # Telugu
    'en': os.path.join(FONTS_DIR, 'NotoSans-Regular.ttf'),            # English
}
DEFAULT_FONT = os.path.join(FONTS_DIR, 'NotoSans-Regular.ttf')


class PremiumCertificatePDF:
    """Builds a premium, styled Proof-of-Work certificate using ReportLab canvas."""

    def __init__(self, worker, score, body_text, language='en'):
        self.worker   = worker
        self.score    = score
        self.body     = body_text
        self.language = language
        self.buffer   = io.BytesIO()
        self.w, self.h = A4  # 595 x 842 pts

    def build(self):
        c = canvas.Canvas(self.buffer, pagesize=A4)
        w, h = self.w, self.h

        # ── Register language-specific Noto font ───────────────────────────
        from reportlab.pdfbase import pdfmetrics
        from reportlab.pdfbase.ttfonts import TTFont
        unicode_font = 'Helvetica'

        font_path = LANGUAGE_FONTS.get(self.language, DEFAULT_FONT)
        if not os.path.exists(font_path):
            font_path = DEFAULT_FONT

        if os.path.exists(font_path):
            try:
                font_name = f'NotoFont_{self.language}'
                pdfmetrics.registerFont(TTFont(font_name, font_path))
                unicode_font = font_name
            except Exception:
                pass

        # ── Background ──────────────────────────────────────
        c.setFillColor(WHITE)
        c.rect(0, 0, w, h, fill=1, stroke=0)

        # Navy header band
        c.setFillColor(NAVY)
        c.rect(0, h - 155, w, 155, fill=1, stroke=0)

        # Gold accent line under header
        c.setFillColor(GOLD)
        c.rect(0, h - 159, w, 4, fill=1, stroke=0)

        # Subtle light-grey bottom band
        c.setFillColor(colors.HexColor('#F0F4F8'))
        c.rect(0, 0, w, 90, fill=1, stroke=0)
        c.setFillColor(GOLD)
        c.rect(0, 90, w, 2, fill=1, stroke=0)

        # Decorative border
        _draw_decorative_border(c, w, h)

        # ── DIGNIFY Logo / App name ──────────────────────────
        c.setFillColor(GOLD)
        c.setFont("Helvetica-Bold", 22)
        c.drawCentredString(w / 2, h - 48, "DIGNIFY")
        c.setFont("Helvetica", 7)
        c.setFillColor(colors.HexColor('#A0AEC0'))
        c.drawCentredString(w / 2, h - 62, "FINANCIAL IDENTITY PLATFORM")

        # Thin gold separator in header
        c.setStrokeColor(GOLD)
        c.setLineWidth(0.5)
        c.line(60, h - 72, w - 60, h - 72)

        # ── Certificate title ────────────────────────────────
        c.setFillColor(WHITE)
        c.setFont("Helvetica-Bold", 16)
        c.drawCentredString(w / 2, h - 95, "PROOF OF WORK CERTIFICATE")

        c.setFont("Helvetica", 9)
        c.setFillColor(colors.HexColor('#90CDF4'))
        c.drawCentredString(w / 2, h - 112, "This document certifies the financial identity of an informal / gig economy worker")

        # Certificate number & date
        cert_no = f"WP-{datetime.datetime.utcnow().strftime('%Y%m%d')}-{str(self.worker.get('_id',''))[-6:].upper()}"
        issue_date = datetime.datetime.utcnow().strftime("%d %B %Y")
        c.setFont("Helvetica", 7.5)
        c.setFillColor(colors.HexColor('#718096'))
        c.drawString(36, h - 132, f"Certificate No: {cert_no}")
        c.drawRightString(w - 36, h - 132, f"Issued: {issue_date}")

        # ── Worker Info Section ──────────────────────────────
        top_y = h - 185
        left  = 36
        right = w - 36

        # Name block
        name = self.worker.get('name', 'Worker')
        c.setFont("Helvetica-Bold", 22)
        c.setFillColor(NAVY)
        c.drawCentredString(w / 2, top_y, name)

        # Gold underline
        name_w = c.stringWidth(name, "Helvetica-Bold", 22)
        lx = w / 2 - name_w / 2
        c.setStrokeColor(GOLD)
        c.setLineWidth(1.5)
        c.line(lx, top_y - 4, lx + name_w, top_y - 4)

        # ── Info table ───────────────────────────────────────
        occ_raw = self.worker.get('occupation', 'other')
        occupation = OCCUPATION_LABELS.get(occ_raw, occ_raw.replace('_', ' ').title())
        state       = self.worker.get('state', 'N/A')
        phone_num   = self.worker.get('phone', 'N/A')
        years       = self.worker.get('years_active', self.worker.get('years', 'N/A'))
        gig_platform= self.worker.get('gig_platform', 'none')
        gig_display = gig_platform.capitalize() if gig_platform != 'none' else 'None'

        info_y = top_y - 28
        info_items = [
            ("Occupation",    occupation),
            ("State",         state),
            ("Mobile",        phone_num),
            ("Years Active",  str(years)),
            ("Gig Platform",  gig_display),
        ]

        col_w = (w - 72) / 2
        cols = [info_items[:3], info_items[3:]]

        for col_idx, col_items in enumerate(cols):
            for row_idx, (label, value) in enumerate(col_items):
                x  = left + col_idx * (col_w + 10)
                y  = info_y - row_idx * 22

                c.setFillColor(colors.HexColor('#EDF2F7'))
                c.roundRect(x, y - 14, col_w, 18, 3, fill=1, stroke=0)

                c.setFont("Helvetica-Bold", 7)
                c.setFillColor(MID_GREY)
                c.drawString(x + 6, y - 5, label.upper())

                c.setFont("Helvetica", 9)
                c.setFillColor(DARK_GREY)
                c.drawString(x + 6 + c.stringWidth(label.upper() + "  ", "Helvetica-Bold", 7), y - 5, value)

        # ── Score Badge ──────────────────────────────────────
        score_val  = self.score.get('score', 0)
        fg, bg     = _score_badge_color(score_val)
        label_str  = _score_label(score_val)
        badge_x    = w / 2 - 55
        badge_y    = info_y - 75
        badge_w    = 110
        badge_h    = 70

        c.setFillColor(NAVY)
        c.roundRect(badge_x - 4, badge_y - 4, badge_w + 8, badge_h + 8, 10, fill=1, stroke=0)
        c.setFillColor(bg)
        c.roundRect(badge_x, badge_y, badge_w, badge_h, 8, fill=1, stroke=0)

        c.setFont("Helvetica-Bold", 36)
        c.setFillColor(fg)
        c.drawCentredString(w / 2, badge_y + 28, str(score_val))

        c.setFont("Helvetica-Bold", 8)
        c.drawCentredString(w / 2, badge_y + 14, "WORKPROOF SCORE")

        c.setFont("Helvetica-Bold", 7)
        c.setFillColor(fg)
        c.drawCentredString(w / 2, badge_y + 4, f"● {label_str}")

        c.setFont("Helvetica", 7)
        c.setFillColor(MID_GREY)
        c.drawCentredString(w / 2, badge_y - 12, "Score out of 100 · Based on UPI transaction history")

        # ── Gold divider ─────────────────────────────────────
        divider_y = badge_y - 28
        c.setStrokeColor(GOLD)
        c.setLineWidth(1)
        c.line(left, divider_y, right, divider_y)
        c.setFont("Helvetica-Bold", 8)
        c.setFillColor(GOLD)
        c.drawCentredString(w / 2, divider_y + 3, "  FINANCIAL ASSESSMENT  ")

        # ── Body text ────────────────────────────────────────
        body_y = divider_y - 18
        body_text = self.body.strip()

        # Use unicode font for Indian script support
        c.setFont(unicode_font, 9)
        c.setFillColor(DARK_GREY)
        max_width = w - 72
        line_h    = 14

        words = body_text.split()
        lines = []
        current = ""
        for word in words:
            test = (current + " " + word).strip()
            if c.stringWidth(test, unicode_font, 9) <= max_width:
                current = test
            else:
                if current:
                    lines.append(current)
                current = word
        if current:
            lines.append(current)

        for i, line in enumerate(lines[:14]):   # max 14 lines
            c.drawString(left, body_y - i * line_h, line)

        # ── Verification / Footer ────────────────────────────
        footer_y = 75
        c.setFont("Helvetica-Bold", 7.5)
        c.setFillColor(NAVY)
        c.drawString(left, footer_y, "DIGITALLY ISSUED BY DIGNIFY PLATFORM")

        c.setFont("Helvetica", 7)
        c.setFillColor(MID_GREY)
        c.drawString(left, footer_y - 12, f"Valid for 90 days from issue date · {issue_date}")
        c.drawString(left, footer_y - 22, "This document was generated using AI analysis of UPI transaction history.")

        c.drawRightString(right, footer_y, "dignify.app")
        c.setFont("Helvetica-Bold", 7)
        c.setFillColor(GOLD)
        c.drawRightString(right, footer_y - 12, f"Certificate No: {cert_no}")

        c.save()
        return self.buffer.getvalue()


def create_pdf_data_uri(body_text, worker=None, score=None):
    """Generate a premium PDF certificate and return a base64 data URI."""
    if worker is None:
        worker = {}
    if score is None:
        score = {'score': 0, 'details': body_text}

    pdf_bytes = PremiumCertificatePDF(worker, score, body_text).build()
    b64 = base64.b64encode(pdf_bytes).decode('utf-8')
    return f"data:application/pdf;base64,{b64}"
