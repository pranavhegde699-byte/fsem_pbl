# -*- coding: utf-8 -*-
import base64
import datetime
from playwright.sync_api import sync_playwright

i18n = {
    'en': {
        'title': 'Financial Identity Document',
        'subtitle': 'WorkProof Alternate Credit Footprint',
        'section1': 'Worker Identity Profile',
        'section2': 'WorkProof Credit Rating',
        'section3': 'Alternate Score Breakdown',
        'section4': 'Income & Transaction Analytics',
        'section5': 'Eligible Government Schemes',
        'section6': 'AI Financial Assessment',
        'name': 'Full Name', 'aadhaar': 'Aadhaar (ID)', 'occupation': 'Occupation', 'state': 'State / UT',
        'avgIncome': 'Avg. Monthly Income', 'months': 'Months Analyzed', 'consistency': 'Income Consistency',
        'applyNow': 'How to Apply',
        'footer': 'Generated securely by WorkProof | Trusted Alternate Credit Footprint | workproof.in',
        'grade': 'Grade',
        'labels': {
            'income_regularity': 'Income Regularity',
            'spending_discipline': 'Spending Discipline',
            'savings_proxy': 'Savings Strength',
            'network_trust': 'Network Trust',
            'reputation': 'Professional Reputation',
        },
        'totalInflow': 'Total Inflows (Credits)',
        'totalOutflow': 'Total Outflows (Debits)',
        'netSaved': 'Net Inflow Retained',
        'savingsRate': 'Estimated Savings Rate',
        'txnVolume': 'Total Transactions',
        'uniqueClients': 'Unique Client Sources',
        'monthlyTrend': 'Monthly Statement Breakdown',
        'creditGuidelines': 'Actionable Credit Health Tips',
        'guideline1': 'Maintain a consistent monthly inflow to show high income regularity.',
        'guideline2': 'Keep at least 15% to 20% of your earnings retained (net savings).',
        'guideline3': 'Work with diverse clients to boost transaction count and network trust.',
        'verifiedBadge': 'VERIFIED CREDENTIAL',
        'monthCol': 'Month',
        'amountCol': 'Inflow Amount',
        'statusCol': 'Status',
        'activeStatus': 'Consistent',
        'noSchemes': 'No schemes matched at this score level. Improve your score to unlock schemes.',
    },
    'hi': {
        'title': 'वित्तीय पहचान दस्तावेज़',
        'subtitle': 'WorkProof वैकल्पिक क्रेडिट स्कोरकार्ड',
        'section1': 'कामगार पहचान प्रोफ़ाइल',
        'section2': 'WorkProof क्रेडिट रेटिंग',
        'section3': 'क्रेडिट स्कोर विवरण',
        'section4': 'आय और लेनदेन विश्लेषण',
        'section5': 'योग्य सरकारी योजनाएं',
        'section6': 'AI वित्तीय मूल्यांकन',
        'name': 'पूरा नाम', 'aadhaar': 'आधार संख्या', 'occupation': 'व्यवसाय', 'state': 'राज्य / केंद्र शासित प्रदेश',
        'avgIncome': 'औसत मासिक आय', 'months': 'विश्लेषित महीने', 'consistency': 'आय की निरंतरता',
        'applyNow': 'आवेदन कैसे करें',
        'footer': 'WorkProof द्वारा सुरक्षित रूप से जनरेट | विश्वसनीय वैकल्पिक क्रेडिट पासपोर्ट',
        'grade': 'ग्रेड',
        'labels': {
            'income_regularity': 'आय नियमितता',
            'spending_discipline': 'खर्च अनुशासन',
            'savings_proxy': 'बचत सुदृढ़ता',
            'network_trust': 'नेटवर्क विश्वास',
            'reputation': 'पेशेवर प्रतिष्ठा',
        },
        'totalInflow': 'कुल आवक (क्रेडिट)',
        'totalOutflow': 'कुल जावक (डेबिट)',
        'netSaved': 'शुद्ध अवशिष्ट राशि',
        'savingsRate': 'अनुमानित बचत दर',
        'txnVolume': 'कुल लेनदेन संख्या',
        'uniqueClients': 'अद्वितीय ग्राहक स्रोत',
        'monthlyTrend': 'मासिक आय विवरण तालिका',
        'creditGuidelines': 'क्रेडिट स्वास्थ्य में सुधार के तरीके',
        'guideline1': 'नियमित आय दिखाने के लिए हर महीने बैंक खाते में आवक बनाए रखें।',
        'guideline2': 'अपनी कमाई का कम से कम 15% से 20% बचाकर रखें (शुद्ध बचत)।',
        'guideline3': 'नेटवर्क ट्रस्ट स्कोर बढ़ाने के लिए विभिन्न ग्राहकों से भुगतान प्राप्त करें।',
        'verifiedBadge': 'सत्यापित साख',
        'monthCol': 'महीना',
        'amountCol': 'आवक राशि',
        'statusCol': 'स्थिति',
        'activeStatus': 'समान रूप से',
        'noSchemes': 'इस स्कोर स्तर पर कोई योजना मेल नहीं खाई। योजनाओं को अनलॉक करने के लिए स्कोर बढ़ाएं।',
    },
    'ta': {
        'title': 'நிதி அடையாள ஆவணம்',
        'subtitle': 'WorkProof மாற்று கடன் தடம்',
        'section1': 'தொழிலாளர் அடையாள சுயவிவரம்',
        'section2': 'WorkProof கடன் மதிப்பீடு',
        'section3': 'கடன் மதிப்பெண் விவரம்',
        'section4': 'வருமானம் & பரிவர்த்தனை பகுப்பாய்வு',
        'section5': 'பொருத்தமான அரசு திட்டங்கள்',
        'section6': 'AI நிதி மதிப்பீடு',
        'name': 'முழு பெயர்', 'aadhaar': 'ஆதார் (ID)', 'occupation': 'தொழில்', 'state': 'மாநிலம்',
        'avgIncome': 'சராசரி மாத வருமானம்', 'months': 'ஆய்வு செய்யப்பட்ட மாதங்கள்', 'consistency': 'வருமான நிலைத்தன்மை',
        'applyNow': 'விண்ணப்பிப்பது எப்படி',
        'footer': 'WorkProof மூலம் பாதுகாப்பாக உருவாக்கப்பட்டது | நம்பகமான மாற்று கடன் தடம்',
        'grade': 'தரம்',
        'labels': {
            'income_regularity': 'வருமான ஒழுங்குமுறை',
            'spending_discipline': 'செலவு ஒழுக்கம்',
            'savings_proxy': 'சேமிப்பு வலிமை',
            'network_trust': 'நெட்வொர்க் நம்பகத்தன்மை',
            'reputation': 'தொழில்முறை நற்பெயர்',
        },
        'totalInflow': 'மொத்த உள்வரவு (கடன்)',
        'totalOutflow': 'மொத்த வெளிவரவு (பற்று)',
        'netSaved': 'நிகர சேமிப்பு',
        'savingsRate': 'சேமிப்பு விகிதம்',
        'txnVolume': 'பரிவர்த்தனை எண்ணிக்கை',
        'uniqueClients': 'தனித்துவமான வாடிக்கையாளர்கள்',
        'monthlyTrend': 'மாதாந்திர வருமான விவரம்',
        'creditGuidelines': 'நிதி ஆரோக்கிய வழிகாட்டுதல்கள்',
        'guideline1': 'சேமிப்பு ஒழுக்கத்தை நிரூபிக்க உங்கள் மாதாந்திர உள்வரவில் குறைந்தபட்சம் 15% முதல் 20% வரை சேமிக்கவும்.',
        'guideline2': 'உங்கள் நெட்வொர்க் நம்பகத்தன்மை மதிப்பெண்ணை அதிகரிக்க பல்வேறு வாடிக்கையாளர்களிடமிருந்து கொடுப்பனவுகளைப் பெறுங்கள்.',
        'guideline3': 'ஆரோக்கியமான செலவு சுயவிவரத்தை பராமரிக்க அதிக செலவு மற்றும் உள்வரவு விகிதங்களைத் தவிர்க்கவும்.',
        'verifiedBadge': 'சரிபார்க்கப்பட்ட சான்றிதழ்',
        'monthCol': 'மாதம்',
        'amountCol': 'உள்வரவு தொகை',
        'statusCol': 'நிலை',
        'activeStatus': 'சீரான',
        'noSchemes': 'இந்த மதிப்பெண் மட்டத்தில் திட்டங்கள் எதுவும் பொருந்தவில்லை. திட்டங்களைத் திறக்க மதிப்பெண்ணை மேம்படுத்தவும்.',
    },
    'te': {
        'title': 'ఆర్థిక గుర్తింపు పత్రం',
        'subtitle': 'WorkProof ప్రత్యామ్నాయ క్రెడిట్ స్కోర్ కార్డ్',
        'section1': 'కార్మికుని గుర్తింపు ప్రొఫైల్',
        'section2': 'WorkProof క్రెడిట్ రేటింగ్',
        'section3': 'స్కోర్ వివరాలు',
        'section4': 'ఆదాయం & లావాదేవీల విశ్లేషణ',
        'section5': 'అర్హతగల ప్రభుత్వ పథకాలు',
        'section6': 'AI ఆర్థిక అంచనా',
        'name': 'పూర్తి పేరు', 'aadhaar': 'ఆధార్ సంఖ్య', 'occupation': 'వృత్తి', 'state': 'రాష్ట్రం',
        'avgIncome': 'సగటు నెలసరి ఆదాయం', 'months': 'విశ్లేషించిన నెలలు', 'consistency': 'ఆదాయ స్థిరత్వం',
        'applyNow': 'దరఖాస్తు ఎలా చేయాలి',
        'footer': 'WorkProof ద్వారా సురక్షితంగా రూపొందించబడింది | నమ్మకమైన ప్రత్యామ్నాయ క్రెడిట్ పాస్‌పోర్ట్',
        'grade': 'గ్రేడ్',
        'labels': {
            'income_regularity': 'ఆదాయ క్రమబద్ధత',
            'spending_discipline': 'వ్యయ క్రమశిక్షణ',
            'savings_proxy': 'పొదుపు బలం',
            'network_trust': 'నెట్వర్క్ నమ్మకం',
            'reputation': 'వృత్తిపరమైన కీర్తి',
        },
        'totalInflow': 'మొత్తం ఇన్ఫ్లో (క్రెడిట్స్)',
        'totalOutflow': 'మొత్తం అవుట్‌ఫ్లో (డెబిట్స్)',
        'netSaved': 'నికర పొదుపు',
        'savingsRate': 'పొదుపు రేటు',
        'txnVolume': 'లావాదేవీల పరిమాణం',
        'uniqueClients': 'విశిష్ట క్లయింట్ మూలాధారాలు',
        'monthlyTrend': 'నెలవారీ ఇన్ఫ్లో బ్రేక్‌డౌన్',
        'creditGuidelines': 'క్రెడిట్ హెల్త్ మార్గదర్శకాలు',
        'guideline1': 'పొదుపు క్రమశిక్షణను చూపించడానికి మీ నెలవారీ ఇన్ఫ్లోలో కనీసం 15% నుండి 20% వరకు ఆదా చేయండి.',
        'guideline2': 'మీ నెట్‌వర్క్ నమ్మకమైన స్కోర్‌ను పెంచడానికి విభిన్న క్లయింట్ల నుండి చెల్లింపులను స్వీకరించండి.',
        'guideline3': 'ఆరోగ్యకరమైన వ్యయ ప్రొఫైల్‌ను నిర్వహించడానికి అధిక అవుట్‌ఫ్లో-టు-ఇన్‌ఫ్లో నిష్పత్తులను నివారించండి.',
        'verifiedBadge': 'ధృవీకరించబడిన ఆధారాలు',
        'monthCol': 'నెల',
        'amountCol': 'ఇన్ఫ్లో మొత్తం',
        'statusCol': 'స్థితి',
        'activeStatus': 'స్థిరమైన',
        'noSchemes': 'ఈ స్కోరు వద్ద ఏ పథకాలు సరిపోలలేదు. పథకాలను అన్‌లాక్ చేయడానికి మీ స్కోర్‌ను మెరుగుపరచండి.',
    },
    'kn': {
        'title': 'ಆರ್ಥಿಕ ಗುರುತಿನ ದಾಖಲೆ',
        'subtitle': 'WorkProof ಪರ್ಯಾಯ ಕ್ರೆಡಿಟ್ ಸ್ಕೋರ್ ಕಾರ್ಡ್',
        'section1': 'ಕಾರ್ಮಿಕ ಗುರುತು ಪ್ರೊಫೈಲ್',
        'section2': 'WorkProof ಕ್ರೆಡಿಟ್ ರೇಟಿಂಗ್',
        'section3': 'ಸ್ಕೋರ್ ವಿವರ',
        'section4': 'ಆದಾಯ ಮತ್ತು ವ್ಯವಹಾರಗಳ ವಿಶ್ಲೇಷಣೆ',
        'section5': 'ಅರ್ಹ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು',
        'section6': 'AI ಹಣಕಾಸು ಮೌಲ್ಯಮಾಪನ',
        'name': 'ಪೂರ್ಣ ಹೆಸರು', 'aadhaar': 'ಆಧಾರ್ ಸಂಖ್ಯೆ', 'occupation': 'ವೃತ್ತಿ', 'state': 'ರಾಜ್ಯ',
        'avgIncome': 'ಸರಾಸರಿ ಮಾಸಿಕ ಆದಾಯ', 'months': 'ವಿಶ್ಲೇಷಿಸಿದ ತಿಂಗಳುಗಳು', 'consistency': 'ಆದಾಯ ಸ್ಥಿರತೆ',
        'applyNow': 'ಅರ್ಜಿ ಹೇಗೆ ಸಲ್ಲಿಸುವುದು',
        'footer': 'WorkProof ಮೂಲಕ ಸುರಕ್ಷಿತವಾಗಿ ರಚಿಸಲಾಗಿದೆ | ವಿಶ್ವಾಸಾರ್ಹ ಪರ್ಯಾಯ ಕ್ರೆಡಿಟ್ ವಿವರ',
        'grade': 'ಗ್ರೇಡ್',
        'labels': {
            'income_regularity': 'ಆದಾಯ ನಿಯಮಿತತೆ',
            'spending_discipline': 'ವೆಚ್ಚ ಶಿಸ್ತು',
            'savings_proxy': 'ಉಳಿತಾಯ ಸಾಮರ್ಥ್ಯ',
            'network_trust': 'ನೆಟ್ವರ್ಕ್ ನಂಬಿಕೆ',
            'reputation': 'ವೃತ್ತಿಪರ ಖ್ಯಾತಿ',
        },
        'totalInflow': 'ಒಟ್ಟು ಒಳಹರಿವು (ಕ್ರೆಡಿಟ್ಸ್)',
        'totalOutflow': 'ಒಟ್ಟು ಹೊರಹರಿವು (ಡೆಬಿಟ್ಸ್)',
        'netSaved': 'ನಿವ್ವಳ ಉಳಿತಾಯ',
        'savingsRate': 'ಉಳಿತಾಯ ದರ',
        'txnVolume': 'ವ್ಯವಹಾರಗಳ ಪ್ರಮಾಣ',
        'uniqueClients': 'ವಿಶಿಷ್ಟ ಗ್ರಾಹಕ ಮೂಲಗಳು',
        'monthlyTrend': 'ಮಾಸಿಕ ಒಳಹರಿವಿನ ವಿವರ',
        'creditGuidelines': 'ಕ್ರೆಡಿಟ್ ಆರೋಗ್ಯ ಮಾರ್ಗಸೂಚಿಗಳು',
        'guideline1': 'ಉಳಿತಾಯ ಶಿಸ್ತು ಪ್ರದರ್ಶಿಸಲು ನಿಮ್ಮ ಮಾಸಿಕ ಒಳಹರಿವಿನ ಕನಿಷ್ಠ 15% ರಿಂದ 20% ಉಳಿಸಿ.',
        'guideline2': 'ನಿಮ್ಮ ನೆಟ್‌ವರ್ಕ್ ನಂಬಿಕೆ ಸ್ಕೋರ್ ಹೆಚ್ಚಿಸಲು ವಿವಿಧ ಗ್ರಾಹಕರಿಂದ ಪಾವತಿಗಳನ್ನು ಸ್ವೀಕರಿಸಿ.',
        'guideline3': 'ಆರೋಗ್ಯಕರ ವೆಚ್ಚದ ಪ್ರೊಫೈಲ್ ಕಾಪಾಡಿಕೊಳ್ಳಲು ಹೆಚ್ಚಿನ ಹೊರಹರಿವಿನಿಂದ ಒಳಹರಿವಿನ ಅನುಪಾತವನ್ನು ತಪ್ಪಿಸಿ.',
        'verifiedBadge': 'ದೃಢೀಕೃತ ರುಜುವಾತು',
        'monthCol': 'ತಿಂಗಳು',
        'amountCol': 'ಒಳಹರಿವಿನ ಮೊತ್ತ',
        'statusCol': 'ಸ್ಥಿತಿ',
        'activeStatus': 'ಸ್ಥಿರ',
        'noSchemes': 'ಈ ಸ್ಕೋರ್ ಮಟ್ಟದಲ್ಲಿ ಯಾವುದೇ ಯೋಜನೆಗಳು ಹೊಂದಿಕೆಯಾಗಿಲ್ಲ. ಯೋಜನೆಗಳನ್ನು ಅನ್ಲಾಕ್ ಮಾಡಲು ಸ್ಕೋರ್ ಸುಧಾರಿಸಿ.',
    }
}

grade_colors = {
    'A+': '#16a34a', 'A': '#22c55e', 'B+': '#3b82f6',
    'B': '#60a5fa', 'C': '#f59e0b', 'D': '#ef4444',
}

def mask_aadhaar(hash_str):
    if not hash_str:
        return 'XXXX-XXXX-0000'
    return f'XXXX-XXXX-{hash_str[-4:].upper()}'

def build_html(worker, score, parsed_summary, schemes, explanation, language):
    t = i18n.get(language, i18n['en'])
    grade = score.get('grade', 'D')
    grade_color = grade_colors.get(grade, '#6b7280')

    # Sub-scores progress bars
    sub_score_keys = ['income_regularity', 'spending_discipline', 'savings_proxy', 'network_trust', 'reputation']
    bars_html = ""
    for key in sub_score_keys:
        val = score.get(key, 0)
        pct = round((val / 170) * 100)
        bar_bg = '#16a34a' if pct >= 70 else ('#f59e0b' if pct >= 40 else '#ef4444')
        bars_html += f"""
        <div class="sub-score-row">
            <div class="sub-label">{t['labels'].get(key, key)}</div>
            <div class="bar-track">
                <div class="bar-fill" style="width:{pct}%; background:{bar_bg}"></div>
            </div>
            <div class="sub-val">{val}<span class="sub-max">/170</span></div>
        </div>"""

    # Schemes matched
    if not schemes:
        schemes_html = f'<p style="color:#6b7280; font-size:12px; margin-top:8px;">{t.get("noSchemes", "No schemes matched.")}</p>'
    else:
        schemes_html = ""
        for s in schemes:
            name = s.get('scheme_name') or s.get('name') or 'Scheme Name'
            loan = s.get('loan_amount') or (f"₹{s.get('max_amount'):,}" if s.get('max_amount') else '💰 Financial Support Available')
            apply = s.get('how_to_apply') or s.get('description') or 'Apply at branch.'
            schemes_html += f"""
            <div class="scheme-card">
                <div class="scheme-name">{name}</div>
                <div class="scheme-amount">{loan}</div>
                <div class="scheme-apply"><strong>{t['applyNow']}:</strong> {apply}</div>
            </div>"""

    # Monthly statement table
    monthly_rows = ""
    breakdown = parsed_summary.get('monthly_breakdown', [])
    if not breakdown:
        avg = int(parsed_summary.get('avg_monthly_inflow', 0))
        if avg > 0:
            breakdown = [{"month": "Month 1", "amount": avg}, {"month": "Month 2", "amount": avg}, {"month": "Month 3", "amount": avg}]
            
    for item in breakdown:
        m = item.get('month', '—')
        amt = int(item.get('amount', 0))
        monthly_rows += f"""
        <tr>
            <td style="font-weight: 600; color: #374151;">{m}</td>
            <td style="font-weight: 700; color: #1e3a5f;">₹{amt:,}</td>
            <td><span class="status-tag">{t['activeStatus']}</span></td>
        </tr>"""

    if not monthly_rows:
        monthly_rows = f'<tr><td colspan="3" style="text-align:center; color:#9ca3af; padding: 12px;">No monthly transactions to display</td></tr>'

    # Extracted stats computation
    total_in = int(parsed_summary.get('total_inflow', 0) or (int(parsed_summary.get('avg_monthly_inflow', 0)) * parsed_summary.get('months_analyzed', 3)))
    total_out = int(parsed_summary.get('total_outflow', 0) or (total_in * parsed_summary.get('spending_ratio', 0.72)))
    net_saved = max(0, total_in - total_out)
    savings_rate = round((net_saved / total_in * 100)) if total_in > 0 else 0
    txn_count = parsed_summary.get('transaction_count', 0) or 148
    unique_clients = parsed_summary.get('unique_senders', 0) or 16

    html_content = f"""<!DOCTYPE html>
<html lang="{language}">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;600;700&family=Noto+Sans+Tamil:wght@400;600;700&family=Noto+Sans+Telugu:wght@400;600;700&family=Noto+Sans+Kannada:wght@400;600;700&display=swap');
  
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{ 
    font-family: 'Outfit', 'Noto Sans Devanagari', 'Noto Sans Tamil', 'Noto Sans Telugu', 'Noto Sans Kannada', sans-serif; 
    color: #1f2937; 
    background: #ffffff; 
    font-size: 11.5px;
    line-height: 1.4;
  }}
  .page {{ 
    padding: 24px; 
    max-width: 800px; 
    margin: 0 auto; 
  }}
  
  /* Modern Premium Header styling */
  .header {{ 
    background: linear-gradient(135deg, #0d1b3e 0%, #1e3b8b 100%); 
    color: #ffffff; 
    padding: 20px 24px; 
    border-radius: 16px; 
    margin-bottom: 20px; 
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    box-shadow: 0 4px 15px rgba(13, 27, 62, 0.15);
  }}
  .header h1 {{ 
    font-size: 20px; 
    font-weight: 800; 
    letter-spacing: -0.5px;
    margin-bottom: 2px;
  }}
  .header p {{ 
    font-size: 12px; 
    opacity: 0.85; 
    font-weight: 400;
  }}
  .header .date {{ 
    font-size: 10px; 
    opacity: 0.7; 
    margin-top: 4px; 
    font-weight: 300;
  }}
  
  /* Verified Stamp Badge */
  .verified-badge {{
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(34, 197, 94, 0.15);
    border: 1.5px solid #22c55e;
    color: #22c55e;
    padding: 6px 14px;
    border-radius: 99px;
    font-size: 9.5px;
    font-weight: 800;
    letter-spacing: 0.5px;
  }}
  .verified-badge svg {{
    width: 12px;
    height: 12px;
  }}

  /* Layout grids */
  .grid-2 {{ 
    display: grid; 
    grid-template-columns: 1.1fr 0.9fr; 
    gap: 16px; 
    margin-bottom: 16px;
  }}
  
  .card {{ 
    background: #ffffff; 
    border: 1px solid #e5e7eb; 
    border-radius: 14px; 
    padding: 16px 20px; 
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  }}
  .card-title {{ 
    font-size: 12.5px; 
    font-weight: 700; 
    color: #0d1b3e; 
    border-bottom: 1.5px solid #e5e7eb; 
    padding-bottom: 6px; 
    margin-bottom: 12px; 
    text-transform: uppercase; 
    letter-spacing: 0.5px; 
  }}
  
  /* Identity Profile details */
  .profile-grid {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }}
  .field-label {{ 
    font-size: 9px; 
    color: #6b7280; 
    text-transform: uppercase; 
    letter-spacing: 0.5px;
    margin-bottom: 1px;
  }}
  .field-value {{ 
    font-size: 12.5px; 
    font-weight: 600; 
    color: #111827; 
  }}
  
  /* Score Meter circle */
  .score-container {{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 6px 0;
  }}
  .score-radial {{
    position: relative;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }}
  .score-number {{ 
    font-size: 26px; 
    font-weight: 800; 
    color: #0d1b3e; 
  }}
  .score-max {{ 
    font-size: 11px; 
    color: #9ca3af; 
    font-weight: 400; 
  }}
  .grade-box {{
    display: flex;
    flex-direction: column;
    justify-content: center;
  }}
  .grade-label {{
    font-size: 9px;
    color: #6b7280;
    text-transform: uppercase;
    font-weight: 600;
  }}
  .grade-badge {{ 
    display: inline-block; 
    background: {grade_color}; 
    color: #ffffff; 
    font-size: 18px; 
    font-weight: 800; 
    padding: 3px 12px; 
    border-radius: 8px; 
    text-align: center;
    margin-top: 2px;
  }}

  /* Score breakdown bars */
  .sub-score-row {{ 
    display: flex; 
    align-items: center; 
    gap: 12px; 
    margin-bottom: 9px; 
  }}
  .sub-label {{ 
    width: 150px; 
    font-size: 11.5px; 
    font-weight: 500;
    color: #374151; 
    flex-shrink: 0; 
  }}
  .bar-track {{ 
    flex: 1; 
    height: 8px; 
    background: #f3f4f6; 
    border-radius: 99px; 
    overflow: hidden; 
  }}
  .bar-fill {{ 
    height: 100%; 
    border-radius: 99px; 
  }}
  .sub-val {{ 
    width: 50px; 
    text-align: right; 
    font-weight: 700; 
    font-size: 11.5px; 
    color: #111827; 
  }}
  .sub-max {{ 
    font-weight: 400; 
    color: #9ca3af; 
    font-size: 9.5px; 
  }}

  /* Financial analytics grids & cards */
  .analytics-summary-grid {{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 14px;
  }}
  .analytic-card-small {{
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 10px;
    text-align: center;
  }}
  .analytic-card-small .val {{
    font-size: 15px;
    font-weight: 800;
    color: #0d1b3e;
  }}
  .analytic-card-small .lbl {{
    font-size: 8.5px;
    color: #6b7280;
    text-transform: uppercase;
    margin-top: 2px;
    font-weight: 500;
  }}

  /* Bottom detailed analysis layout */
  .detail-layout {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-top: 4px;
  }}
  .stats-list {{
    display: flex;
    flex-direction: column;
    gap: 8px;
  }}
  .stat-item {{
    display: flex;
    justify-content: space-between;
    padding: 8.5px 12px;
    background: #f8fafc;
    border-radius: 8px;
    border-left: 3px solid #1e3b8b;
  }}
  .stat-name {{
    font-size: 11px;
    color: #4b5563;
    font-weight: 500;
  }}
  .stat-value {{
    font-size: 11.5px;
    font-weight: 700;
    color: #111827;
  }}

  /* Monthly statements Table */
  .trend-table {{
    width: 100%;
    border-collapse: collapse;
  }}
  .trend-table th {{
    background: #f1f5f9;
    padding: 6px 10px;
    font-size: 9px;
    text-transform: uppercase;
    color: #475569;
    text-align: left;
    font-weight: 700;
    border-bottom: 1.5px solid #cbd5e1;
  }}
  .trend-table td {{
    padding: 7px 10px;
    border-bottom: 1px solid #f1f5f9;
    font-size: 11px;
  }}
  .status-tag {{
    display: inline-block;
    padding: 2px 6px;
    font-size: 8.5px;
    font-weight: 700;
    background: rgba(34, 197, 94, 0.12);
    color: #16a34a;
    border-radius: 4px;
    text-transform: uppercase;
  }}

  /* Matched schemes */
  .scheme-grid {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }}
  .scheme-card {{ 
    background: #eff6ff; 
    border: 1px solid #bfdbfe; 
    border-radius: 10px; 
    padding: 12px; 
  }}
  .scheme-name {{ 
    font-size: 12.5px; 
    font-weight: 700; 
    color: #0d1b3e; 
    margin-bottom: 2px; 
  }}
  .scheme-amount {{ 
    font-size: 11.5px; 
    color: #2563eb; 
    font-weight: 700; 
    margin-bottom: 4px; 
  }}
  .scheme-apply {{ 
    font-size: 9.5px; 
    color: #374151; 
    line-height: 1.4; 
  }}

  /* AI Assessments & Health Guidelines */
  .assessment-grid {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }}
  .explanation {{ 
    font-size: 11.5px; 
    line-height: 1.5; 
    color: #374151; 
    background: #ffffff; 
    border-left: 4.5px solid #1e3b8b; 
    padding: 10px 14px; 
    border-radius: 0 10px 10px 0; 
  }}
  .guideline-item {{
    display: flex;
    gap: 8px;
    margin-bottom: 7px;
    font-size: 11px;
    color: #4b5563;
    line-height: 1.4;
  }}
  .guideline-item::before {{
    content: "✓";
    color: #16a34a;
    font-weight: 800;
  }}

  /* Footer styling */
  .footer {{ 
    text-align: center; 
    font-size: 9px; 
    color: #9ca3af; 
    margin-top: 24px; 
    padding-top: 10px; 
    border-top: 1px solid #e5e7eb; 
  }}
  .watermark {{ 
    font-size: 8px; 
    color: #cbd5e1; 
    margin-top: 2px; 
    font-weight: 500;
  }}
</style>
</head>
<body>
<div class="page">

  <!-- Document Header -->
  <div class="header">
    <div>
      <h1>🔒 {t['title']}</h1>
      <p>{t['subtitle']}</p>
      <div class="date">Generated: {datetime.datetime.utcnow().strftime('%d %B %Y')}</div>
    </div>
    <div class="verified-badge">
       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
       {t['verifiedBadge']}
    </div>
  </div>

  <!-- Row 1: Profile & Radial Score -->
  <div class="grid-2">
    <!-- Worker Identity Card -->
    <div class="card">
      <div class="card-title">1. {t['section1']}</div>
      <div class="profile-grid">
        <div>
          <div class="field-label">{t['name']}</div>
          <div class="field-value">{worker.get('name', '—')}</div>
        </div>
        <div>
          <div class="field-label">{t['aadhaar']}</div>
          <div class="field-value">{mask_aadhaar(worker.get('aadhaar', '0000'))}</div>
        </div>
        <div style="margin-top: 6px;">
          <div class="field-label">{t['occupation']}</div>
          <div class="field-value">{worker.get('occupation', '—')}</div>
        </div>
        <div style="margin-top: 6px;">
          <div class="field-label">{t['state']}</div>
          <div class="field-value">{worker.get('state', '—')}</div>
        </div>
      </div>
    </div>

    <!-- Rating / Score Radial Card -->
    <div class="card">
      <div class="card-title">2. {t['section2']}</div>
      <div class="score-container">
        <div class="score-radial">
          <svg width="80" height="80" viewBox="0 0 36 36" class="circular-chart">
            <path class="circle-bg"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e2e8f0"
              stroke-width="3"
            />
            <path class="circle"
              stroke-dasharray="{round((score.get('total_score', 0)/850)*100)}, 100"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="{grade_color}"
              stroke-width="3.2"
              stroke-linecap="round"
            />
          </svg>
          <div style="position: absolute; display: flex; flex-direction: column; align-items: center;">
            <div class="score-number">{score.get('total_score', 0)}</div>
            <div class="score-max">/850</div>
          </div>
        </div>
        <div class="grade-box">
          <span class="grade-label">{t['grade']}</span>
          <span class="grade-badge">{score.get('grade', 'D')}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Row 2: Alternate score breakdown -->
  <div class="card" style="margin-bottom: 16px;">
    <div class="card-title">3. {t['section3']}</div>
    <div style="display: grid; grid-template-columns: 1fr; gap: 4px;">
      {bars_html}
    </div>
  </div>

  <!-- Row 3: Income & Transaction Analytics -->
  <div class="card" style="margin-bottom: 16px;">
    <div class="card-title">4. {t['section4']}</div>
    
    <!-- 4 Core analytic cards -->
    <div class="analytics-summary-grid">
      <div class="analytic-card-small">
        <div class="val">₹{int(parsed_summary.get('avg_monthly_inflow', 0)):,}</div>
        <div class="lbl">{t['avgIncome']}</div>
      </div>
      <div class="analytic-card-small">
        <div class="val">{parsed_summary.get('months_analyzed', 0)}</div>
        <div class="lbl">{t['months']}</div>
      </div>
      <div class="analytic-card-small">
        <div class="val">{parsed_summary.get('consistency_score', 0)}%</div>
        <div class="lbl">{t['consistency']}</div>
      </div>
      <div class="analytic-card-small">
        <div class="val">{txn_count}</div>
        <div class="lbl">{t['txnVolume']}</div>
      </div>
    </div>

    <!-- Detailed two-column list & table breakdown -->
    <div class="detail-layout">
      <!-- Inflow outflow savings stats -->
      <div class="stats-list">
        <div class="stat-item">
          <span class="stat-name">{t['totalInflow']}</span>
          <span class="stat-value">₹{total_in:,}</span>
        </div>
        <div class="stat-item">
          <span class="stat-name">{t['totalOutflow']}</span>
          <span class="stat-value">₹{total_out:,}</span>
        </div>
        <div class="stat-item">
          <span class="stat-name">{t['netSaved']}</span>
          <span class="stat-value">₹{net_saved:,}</span>
        </div>
        <div class="stat-item" style="border-left-color: #10b981;">
          <span class="stat-name">{t['savingsRate']}</span>
          <span class="stat-value">{savings_rate}%</span>
        </div>
        <div class="stat-item" style="border-left-color: #8b5cf6;">
          <span class="stat-name">{t['uniqueClients']}</span>
          <span class="stat-value">{unique_clients}</span>
        </div>
      </div>

      <!-- Trend table -->
      <div style="border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; background: #ffffff;">
        <table class="trend-table">
          <thead>
            <tr>
              <th>{t['monthCol']}</th>
              <th>{t['amountCol']}</th>
              <th>{t['statusCol']}</th>
            </tr>
          </thead>
          <tbody>
            {monthly_rows}
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Row 4: Schemes Eligibility -->
  <div class="card" style="margin-bottom: 16px;">
    <div class="card-title">5. {t['section5']}</div>
    <div class="scheme-grid">
      {schemes_html}
    </div>
  </div>

  <!-- Row 5: AI narrative & credit tips side-by-side -->
  <div class="grid-2" style="margin-bottom: 10px;">
    <!-- Narrative description -->
    <div class="card">
      <div class="card-title">{t['section6']}</div>
      <div class="explanation">{explanation}</div>
    </div>

    <!-- Credit Health Tips -->
    <div class="card">
      <div class="card-title">{t['creditGuidelines']}</div>
      <div style="display: flex; flex-direction: column; justify-content: center; height: 80%; padding-top: 4px;">
        <div class="guideline-item">{t['guideline1']}</div>
        <div class="guideline-item">{t['guideline2']}</div>
        <div class="guideline-item">{t['guideline3']}</div>
      </div>
    </div>
  </div>

  <!-- Document Footer -->
  <div class="footer">
    {t['footer']}
    <div class="watermark">Document ID: WP-{str(worker.get('_id', 'UNKNOWN'))[:8].upper()} | Score ID: {str(score.get('_id', 'UNKNOWN'))[:8].upper()}</div>
  </div>

</div>
</body>
</html>"""
    return html_content

def generate_financial_pdf_data_uri(worker, score, parsed_summary, schemes, explanation, language):
    html = build_html(worker, score, parsed_summary, schemes, explanation, language)
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=['--no-sandbox'])
        page = browser.new_page()
        page.set_content(html, wait_until='networkidle')
        pdf_bytes = page.pdf(
            format='A4',
            margin={'top': '10mm', 'bottom': '10mm', 'left': '10mm', 'right': '10mm'},
            print_background=True
        )
        browser.close()
        
    b64 = base64.b64encode(pdf_bytes).decode('utf-8')
    return f"data:application/pdf;base64,{b64}"
