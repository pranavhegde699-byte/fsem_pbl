import json
from groq import Groq
from django.conf import settings

groq_client = Groq(api_key=settings.GROQ_API_KEY) if hasattr(settings, 'GROQ_API_KEY') else Groq(api_key="YOUR_GROQ_API_KEY")

URBAN_STATES = {
    'delhi', 'mumbai', 'maharashtra', 'karnataka', 'tamil nadu', 'telangana',
    'gujarat', 'rajasthan', 'west bengal', 'andhra pradesh', 'uttar pradesh',
    'kerala', 'haryana', 'punjab', 'goa',
}

def is_urban(state):
    if not state: return True
    return state.lower().strip() in URBAN_STATES

def fallback_match_schemes(worker, total_score):
    matched = []
    occupation = (worker.get('occupation') or '').lower().strip()
    years_active = int(worker.get('years_active') or 0)
    state = worker.get('state', '')

    if occupation == 'street_vendor' and total_score >= 300 and is_urban(state):
        matched.append({
            'scheme_name': 'PM SVANidhi',
            'scheme_key': 'pm_svanidhi',
            'loan_amount': '₹10,000 – ₹50,000',
            'how_to_apply': 'Visit your nearest Urban Local Body (ULB) office or apply online at pmsvanidhi.mohua.gov.in with your Aadhaar card and this WorkProof document.',
            'eligible': True,
        })

    if total_score >= 500:
        matched.append({
            'scheme_name': 'MUDRA Shishu Loan',
            'scheme_key': 'mudra_shishu',
            'loan_amount': 'Up to ₹50,000',
            'how_to_apply': 'Visit any bank, MFI, or NBFC and apply under PM Mudra Yojana. Carry your Aadhaar, phone number, and this WorkProof Financial Identity document.',
            'eligible': True,
        })

    if total_score >= 650:
        matched.append({
            'scheme_name': 'MUDRA Kishore Loan',
            'scheme_key': 'mudra_kishore',
            'loan_amount': '₹50,000 – ₹5,00,000',
            'how_to_apply': f'Apply at a scheduled commercial bank or Small Finance Bank under MUDRA Kishore category. Your WorkProof score of {total_score} qualifies you for this tier.',
            'eligible': True,
        })

    if total_score >= 600 and years_active >= 2:
        matched.append({
            'scheme_name': 'PMEGP (Prime Minister Employment Generation Programme)',
            'scheme_key': 'pmegp',
            'loan_amount': 'Up to ₹25,00,000',
            'how_to_apply': 'Apply online at kviconline.gov.in or visit your nearest Khadi and Village Industries Commission (KVIC) / District Industries Centre (DIC) office.',
            'eligible': True,
        })

    return matched

def match_schemes(worker, total_score):
    lang_map = {'en': "English", 'hi': "Hindi", 'ta': "Tamil", 'te': "Telugu", 'kn': "Kannada"}
    requested_lang = lang_map.get(worker.get('language'), "English")
    
    prompt = f"""
You are an expert Indian Government Scheme Advisor for informal workers.
Based strictly on the worker's profile and their new "WorkProof Alternate Credit Score", provide a JSON array of exact government schemes they are eligible for.

WORKER PROFILE:
- Occupation: {worker.get('occupation', 'Unspecified')}
- State: {worker.get('state', 'Unspecified')}
- Years Active: {worker.get('years_active', 'Unknown')}
- WorkProof Score: {total_score} (Range: 0-850)

RULES:
- If Score < 300, they might not be eligible for much, perhaps just basic Jan Dhan or micro-schemes.
- Provide 1 to 4 highly relevant schemes.
- Use real scheme names (e.g. PM SVANidhi, MUDRA Shishu, MUDRA Kishore, PMEGP, PM Vishwakarma).
- IMPORTANT TRANSLATION INSTRUCTION: You MUST translate the "scheme_name", "loan_amount", and "how_to_apply" strings into {requested_lang}. Do not mix languages.

YOU MUST RESPOND ONLY WITH A VALID JSON OBJECT exactly matching this schema:
{{
  "schemes": [
    {{
      "scheme_name": "<String: Official name of the scheme>",
      "scheme_key": "<String: snake_case_key>",
      "loan_amount": "<String: Expected loan or benefit amount, e.g. 'Up to ₹50,000'>",
      "how_to_apply": "<String: Short 1-2 sentence instruction on where they need to go or apply online. Mention taking their WorkProof Document>",
      "eligible": true
    }}
  ]
}}
"""
    try:
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {'role': 'system', 'content': 'You are an API that outputs strict JSON matching the requested schema. No conversational text.'},
                {'role': 'user', 'content': prompt}
            ],
            model='llama-3.3-70b-versatile',
            temperature=0.1,
            response_format={"type": "json_object"}
        )
        parsed_response = json.loads(chat_completion.choices[0].message.content or '{"schemes":[]}')
        
        if 'schemes' in parsed_response and isinstance(parsed_response['schemes'], list):
            return parsed_response['schemes']
        raise Exception('Invalid schema returned from Groq')
    except Exception as e:
        print(f"[schemeRouter] Groq matching failed, using fallback: {e}")
        return fallback_match_schemes(worker, total_score)
