import { useState, useEffect, useRef } from "react";

const PUB = import.meta.env.BASE_URL; // "/hajj-omra-pro/" sur GitHub Pages

/* ────────────────────────────────────────────────────────────
   IMAGES — Wikipedia REST API au runtime + cache localStorage.
   Fallback permanent : dégradés CSS (le site reste beau sans réseau).
──────────────────────────────────────────────────────────── */
const WIKI_IMG = {
  kaaba: "Kaaba",
  haram: "Masjid_al-Haram",
  nabawi: "Prophet's_Mosque",
  arafat: "Mount_Arafat",
  mina: "Mina,_Saudi_Arabia",
  madinah: "Medina",
};
const IMG_FALLBACK = {
  kaaba: "linear-gradient(135deg,#1a1408 0%,#3d2e14 45%,#0d0a05 100%)",
  haram: "linear-gradient(135deg,#241c0e 0%,#4a3a1a 50%,#120d06 100%)",
  nabawi: "linear-gradient(135deg,#0e1f16 0%,#1d4032 50%,#081209 100%)",
  arafat: "linear-gradient(135deg,#2a1f12 0%,#54401f 50%,#15100a 100%)",
  mina: "linear-gradient(135deg,#1f1a10 0%,#3f3520 50%,#100d08 100%)",
  madinah: "linear-gradient(135deg,#102018 0%,#225040 50%,#0a120c 100%)",
};
const _imgCache = (() => { try { return JSON.parse(localStorage.getItem("ho_imgs") || "{}"); } catch { return {}; } })();
const _saveImgCache = () => { try { localStorage.setItem("ho_imgs", JSON.stringify(_imgCache)); } catch {} };
async function fetchWikiImage(key) {
  if (_imgCache[key]) return _imgCache[key];
  try {
    const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(WIKI_IMG[key])}`);
    if (!r.ok) return null;
    const j = await r.json();
    const url = j.originalimage?.source || j.thumbnail?.source;
    if (url) { _imgCache[key] = url; _saveImgCache(); }
    return url || null;
  } catch { return null; }
}

/* ──────────────────────────── LANGUES ─────────────────────── */
const LANG = {
  fr: {
    nav: ["Rites", "Hôtels", "Checklist", "Invocations", "FAQ", "Visa", "Contact"],
    hero_badge: "Guide gratuit · FR / EN / AR",
    hero_h1: ["Préparez votre", "Hajj & Omra", "sereinement"],
    hero_p: "Rites étape par étape, programme de séjour personnalisé, hôtels à Makkah et Médine, checklist complète et invocations authentiques.",
    hero_cta: "Créer mon programme →",
    planner_title: "Planifiez votre pèlerinage",
    lbl_type: "🕋 Pèlerinage", lbl_depart: "🛫 Ville de départ", depart_ph: "Paris, Casablanca…",
    lbl_duration: "📅 Durée", days: n => `${n} jours`,
    lbl_budget: "💰 Budget", lbl_travelers: "👤 Voyageurs",
    travelers_fn: n => `${n} personne${n > 1 ? "s" : ""}`,
    generate_btn: "Générer mon programme 🕋",
    omra: "Omra", hajj: "Hajj",
    program_title: "Votre programme", back_home: "← Retour",
    print_btn: "🖨 Imprimer / PDF",
    budget_est: "Budget estimé par personne",
    budget_note: "Estimation indicative vol + hôtel + visa + repas, selon saison et proximité du Haram.",
    day: "Jour",
    hotels_reco: "Hôtels recommandés",
    rites_title: "Les rites étape par étape",
    rites_sub: "Chaque étape expliquée simplement, avec son invocation.",
    miqat_title: "Les Miqats (lieux d'ihram)",
    hotels_title: "Hôtels à Makkah & Médine",
    hotels_sub: "Sélection par budget, triée par distance au Haram.",
    dist_haram: "du Haram", per_night: "/nuit",
    book_btn: "Voir sur Booking",
    makkah: "Makkah", madinah: "Médine",
    checklist_title: "Checklist de préparation",
    checklist_sub: "Cochez au fur et à mesure — sauvegardé automatiquement sur votre appareil.",
    checklist_reset: "Réinitialiser",
    duas_title: "Invocations essentielles",
    duas_sub: "Textes authentiques avec translittération et traduction.",
    faq_title: "Questions fréquentes",
    contact_badge: "Contact",
    contact_title: "Une question sur votre pèlerinage ?",
    contact_desc: "Écrivez-nous, nous répondons rapidement à toutes les questions sur la préparation du Hajj et de la Omra.",
    contact_name: "Votre nom", contact_name_ph: "Prénom et nom",
    contact_email: "Votre email", contact_subject: "Sujet", contact_subject_ph: "Question sur la Omra…",
    contact_message: "Votre message", contact_message_ph: "Écrivez votre question ici…",
    contact_submit: "Envoyer le message →",
    footer_desc: "Guide complet et gratuit du Hajj et de la Omra. Rites, hôtels, checklist et invocations pour préparer votre pèlerinage sereinement.",
    footer_links: "Navigation", footer_resources: "Ressources",
    visa_title: "Visa & Prérequis", visa_sub: "Procédure visa Omra et conditions Hajj selon votre nationalité.", visa_omra_title: "Procédure visa Omra", visa_hajj_title: "Conditions & quota Hajj", visa_cost: "Frais de visa", visa_quota: "Quota national", visa_note: "Informations indicatives — vérifiez toujours auprès du Consulat d'Arabie Saoudite ou de nusuk.sa avant votre départ.",
    disclaimer: "Ce site est un guide informatif. Pour les questions religieuses, consultez un savant ou votre imam. Les visas Hajj passent obligatoirement par les agences agréées de votre pays.",
  },
  en: {
    nav: ["Rituals", "Hotels", "Checklist", "Duas", "FAQ", "Visa", "Contact"],
    hero_badge: "Free guide · FR / EN / AR",
    hero_h1: ["Prepare your", "Hajj & Umrah", "with peace of mind"],
    hero_p: "Step-by-step rituals, personalized stay program, hotels in Makkah and Madinah, complete checklist and authentic supplications.",
    hero_cta: "Create my program →",
    planner_title: "Plan your pilgrimage",
    lbl_type: "🕋 Pilgrimage", lbl_depart: "🛫 Departure city", depart_ph: "London, Casablanca…",
    lbl_duration: "📅 Duration", days: n => `${n} days`,
    lbl_budget: "💰 Budget", lbl_travelers: "👤 Travelers",
    travelers_fn: n => `${n} ${n > 1 ? "people" : "person"}`,
    generate_btn: "Generate my program 🕋",
    omra: "Umrah", hajj: "Hajj",
    program_title: "Your program", back_home: "← Back",
    print_btn: "🖨 Print / PDF",
    budget_est: "Estimated budget per person",
    budget_note: "Indicative estimate: flight + hotel + visa + meals, depending on season and distance to the Haram.",
    day: "Day",
    hotels_reco: "Recommended hotels",
    rites_title: "Rituals step by step",
    rites_sub: "Each step explained simply, with its supplication.",
    miqat_title: "The Miqats (ihram stations)",
    hotels_title: "Hotels in Makkah & Madinah",
    hotels_sub: "Selection by budget, sorted by distance to the Haram.",
    dist_haram: "from the Haram", per_night: "/night",
    book_btn: "View on Booking",
    makkah: "Makkah", madinah: "Madinah",
    checklist_title: "Preparation checklist",
    checklist_sub: "Tick as you go — automatically saved on your device.",
    checklist_reset: "Reset",
    duas_title: "Essential supplications",
    duas_sub: "Authentic texts with transliteration and translation.",
    faq_title: "Frequently asked questions",
    contact_badge: "Contact",
    contact_title: "A question about your pilgrimage?",
    contact_desc: "Write to us — we answer quickly all questions about preparing Hajj and Umrah.",
    contact_name: "Your name", contact_name_ph: "First and last name",
    contact_email: "Your email", contact_subject: "Subject", contact_subject_ph: "Question about Umrah…",
    contact_message: "Your message", contact_message_ph: "Write your question here…",
    contact_submit: "Send message →",
    footer_desc: "Complete free guide for Hajj and Umrah. Rituals, hotels, checklist and supplications to prepare your pilgrimage with peace of mind.",
    footer_links: "Navigation", footer_resources: "Resources",
    visa_title: "Visa & Requirements", visa_sub: "Umrah visa procedure and Hajj prerequisites by nationality.", visa_omra_title: "Umrah visa procedure", visa_hajj_title: "Hajj conditions & quota", visa_cost: "Visa fee", visa_quota: "National quota", visa_note: "Indicative information — always verify with the Saudi Consulate or nusuk.sa before departure.",
    disclaimer: "This site is an informative guide. For religious rulings, consult a scholar or your imam. Hajj visas must go through your country's licensed agencies.",
  },
  ar: {
    nav: ["المناسك", "الفنادق", "قائمة التحضير", "الأدعية", "الأسئلة", "التأشيرة", "اتصل بنا"],
    hero_badge: "دليل مجاني · فرنسي / إنجليزي / عربي",
    hero_h1: ["استعد لأداء", "الحج والعمرة", "بطمأنينة"],
    hero_p: "المناسك خطوة بخطوة، برنامج إقامة مخصص، فنادق مكة والمدينة، قائمة تحضير كاملة وأدعية مأثورة.",
    hero_cta: "أنشئ برنامجي ←",
    planner_title: "خطط لرحلتك",
    lbl_type: "🕋 النسك", lbl_depart: "🛫 مدينة المغادرة", depart_ph: "الدار البيضاء، باريس…",
    lbl_duration: "📅 المدة", days: n => `${n} أيام`,
    lbl_budget: "💰 الميزانية", lbl_travelers: "👤 المسافرون",
    travelers_fn: n => `${n} ${n > 1 ? "أشخاص" : "شخص"}`,
    generate_btn: "🕋 أنشئ برنامجي",
    omra: "العمرة", hajj: "الحج",
    program_title: "برنامجك", back_home: "→ رجوع",
    print_btn: "🖨 طباعة / PDF",
    budget_est: "الميزانية التقديرية للشخص",
    budget_note: "تقدير إرشادي: الطيران + الفندق + التأشيرة + الوجبات، حسب الموسم والقرب من الحرم.",
    day: "اليوم",
    hotels_reco: "الفنادق الموصى بها",
    rites_title: "المناسك خطوة بخطوة",
    rites_sub: "كل خطوة مشروحة ببساطة مع دعائها.",
    miqat_title: "المواقيت",
    hotels_title: "فنادق مكة والمدينة",
    hotels_sub: "اختيار حسب الميزانية، مرتب حسب المسافة من الحرم.",
    dist_haram: "من الحرم", per_night: "/ليلة",
    book_btn: "عرض على Booking",
    makkah: "مكة المكرمة", madinah: "المدينة المنورة",
    checklist_title: "قائمة التحضير",
    checklist_sub: "ضع علامة أثناء التقدم — يُحفظ تلقائيًا على جهازك.",
    checklist_reset: "إعادة تعيين",
    duas_title: "الأدعية الأساسية",
    duas_sub: "نصوص مأثورة مع الترجمة.",
    faq_title: "الأسئلة الشائعة",
    contact_badge: "اتصل بنا",
    contact_title: "سؤال حول رحلتك؟",
    contact_desc: "راسلنا، نجيب بسرعة على جميع الأسئلة حول التحضير للحج والعمرة.",
    contact_name: "اسمك", contact_name_ph: "الاسم الكامل",
    contact_email: "بريدك الإلكتروني", contact_subject: "الموضوع", contact_subject_ph: "سؤال حول العمرة…",
    contact_message: "رسالتك", contact_message_ph: "اكتب سؤالك هنا…",
    contact_submit: "← إرسال الرسالة",
    footer_desc: "دليل شامل ومجاني للحج والعمرة. المناسك والفنادق وقائمة التحضير والأدعية لتستعد لرحلتك بطمأنينة.",
    footer_links: "التنقل", footer_resources: "موارد",
    visa_title: "التأشيرة والمتطلبات", visa_sub: "إجراءات تأشيرة العمرة وشروط الحج حسب جنسيتك.", visa_omra_title: "إجراءات تأشيرة العمرة", visa_hajj_title: "شروط الحج والحصة", visa_cost: "رسوم التأشيرة", visa_quota: "الحصة الوطنية", visa_note: "معلومات إرشادية — تحقق دائمًا من قنصلية المملكة العربية السعودية أو nusuk.sa قبل سفرك.",
    disclaimer: "هذا الموقع دليل إرشادي. للمسائل الشرعية، استشر أهل العلم. تأشيرات الحج تتم حصريًا عبر الوكالات المعتمدة في بلدك.",
  },
};

/* ──────────────────────────── RITES ───────────────────────── */
const RITES = {
  omra: [
    { icon: "🥋", arName: "الإحرام", name: { fr: "L'Ihram au Miqat", en: "Ihram at the Miqat", ar: "الإحرام من الميقات" },
      desc: { fr: "Avant de franchir le miqat : ghusl recommandé, deux pièces de tissu blanc non cousues pour l'homme (vêtements normaux couvrants pour la femme), puis intention de la Omra : « Labbayka Allahumma 'Omratan ».", en: "Before crossing the miqat: recommended ghusl, two unstitched white cloths for men (normal covering clothes for women), then the intention: “Labbayka Allahumma 'Umratan”.", ar: "قبل تجاوز الميقات: يُستحب الاغتسال، ولبس إزار ورداء أبيضين للرجل، ثم نية العمرة: «لبيك اللهم عمرة»." } },
    { icon: "🗣", arName: "التلبية", name: { fr: "La Talbiyah", en: "The Talbiyah", ar: "التلبية" },
      desc: { fr: "Répétez la talbiyah en chemin vers Makkah : « Labbayka Allahumma labbayk… ». Les hommes à voix haute, les femmes à voix basse. On cesse en commençant le tawaf.", en: "Repeat the talbiyah on the way to Makkah: “Labbayka Allahumma labbayk…”. Men aloud, women quietly. Stop when starting tawaf.", ar: "ردد التلبية في الطريق إلى مكة: «لبيك اللهم لبيك…». يجهر الرجال وتُسِرّ النساء، وتُقطع عند بدء الطواف." } },
    { icon: "🕋", arName: "الطواف", name: { fr: "Le Tawaf (7 tours)", en: "Tawaf (7 circuits)", ar: "الطواف (٧ أشواط)" },
      desc: { fr: "7 tours autour de la Kaaba en partant de la Pierre Noire, Kaaba à votre gauche. Saluez la Pierre Noire à chaque tour (geste de la main si la foule empêche de la toucher).", en: "7 circuits around the Kaaba starting from the Black Stone, Kaaba on your left. Salute the Black Stone each circuit (hand gesture if the crowd prevents touching it).", ar: "سبعة أشواط حول الكعبة بدءًا من الحجر الأسود، والكعبة عن يسارك. استلم الحجر أو أشر إليه في كل شوط." } },
    { icon: "🕌", arName: "مقام إبراهيم", name: { fr: "2 rak'at au Maqam Ibrahim", en: "2 rak'ahs at Maqam Ibrahim", ar: "ركعتان خلف مقام إبراهيم" },
      desc: { fr: "Après le tawaf, priez deux rak'at derrière le Maqam Ibrahim si possible, sinon n'importe où dans la mosquée. Buvez ensuite de l'eau de Zamzam.", en: "After tawaf, pray two rak'ahs behind Maqam Ibrahim if possible, otherwise anywhere in the mosque. Then drink Zamzam water.", ar: "بعد الطواف صلِّ ركعتين خلف مقام إبراهيم إن تيسر، وإلا ففي أي مكان من المسجد، ثم اشرب من ماء زمزم." } },
    { icon: "⛰", arName: "السعي", name: { fr: "Le Sa'i (Safa ↔ Marwa)", en: "Sa'i (Safa ↔ Marwa)", ar: "السعي بين الصفا والمروة" },
      desc: { fr: "7 trajets entre Safa et Marwa, en commençant par Safa. Les hommes pressent le pas entre les deux repères verts. Multipliez les invocations.", en: "7 laps between Safa and Marwa, starting at Safa. Men hasten between the two green markers. Make plenty of du'a.", ar: "سبعة أشواط بين الصفا والمروة بدءًا بالصفا، ويُسرع الرجال بين العلمين الأخضرين، وأكثر من الدعاء." } },
    { icon: "✂️", arName: "الحلق أو التقصير", name: { fr: "Rasage ou coupe (Halq / Taqsir)", en: "Shaving or trimming (Halq / Taqsir)", ar: "الحلق أو التقصير" },
      desc: { fr: "L'homme se rase la tête (meilleur) ou raccourcit l'ensemble des cheveux ; la femme coupe l'équivalent d'une phalange. Votre Omra est accomplie — qu'Allah l'accepte !", en: "Men shave the head (best) or trim all the hair; women cut a fingertip's length. Your Umrah is complete — may Allah accept it!", ar: "يحلق الرجل رأسه (وهو الأفضل) أو يقصّر، وتقصّ المرأة قدر أنملة. تمت عمرتك — تقبل الله!" } },
  ],
  hajj: [
    { icon: "🥋", arName: "الإحرام", name: { fr: "Jour 8 — Ihram & Mina (Tarwiyah)", en: "Day 8 — Ihram & Mina (Tarwiyah)", ar: "اليوم ٨ — الإحرام ومنى (التروية)" },
      desc: { fr: "Le 8 Dhul-Hijjah, mettez l'ihram depuis votre lieu de résidence à Makkah avec l'intention du Hajj, puis rendez-vous à Mina. Priez-y Dhuhr, 'Asr, Maghrib, 'Isha et Fajr (raccourcies, non regroupées).", en: "On 8 Dhul-Hijjah, enter ihram from your residence in Makkah with the intention of Hajj, then go to Mina. Pray Dhuhr, 'Asr, Maghrib, 'Isha and Fajr there (shortened, not combined).", ar: "في الثامن من ذي الحجة أحرم بالحج من مكان إقامتك بمكة ثم اخرج إلى منى، وصلِّ بها الظهر والعصر والمغرب والعشاء والفجر قصرًا دون جمع." } },
    { icon: "🏔", arName: "عرفة", name: { fr: "Jour 9 — Le jour d'Arafat", en: "Day 9 — Day of Arafat", ar: "اليوم ٩ — يوم عرفة" },
      desc: { fr: "Le pilier du Hajj. Restez dans les limites d'Arafat du zénith jusqu'au coucher du soleil : prière Dhuhr+'Asr regroupées, puis invocations intenses, mains levées, face à la qibla.", en: "The pillar of Hajj. Stay within Arafat from noon until sunset: Dhuhr+'Asr combined, then intense supplication, hands raised, facing the qibla.", ar: "ركن الحج الأعظم. ابقَ داخل حدود عرفة من الزوال إلى الغروب: صلِّ الظهر والعصر جمعًا وقصرًا، ثم أكثر من الدعاء رافعًا يديك مستقبلًا القبلة." } },
    { icon: "🌙", arName: "مزدلفة", name: { fr: "Nuit à Muzdalifah", en: "Night at Muzdalifah", ar: "المبيت بمزدلفة" },
      desc: { fr: "Après le coucher du soleil, partez vers Muzdalifah : Maghrib+'Isha regroupées, nuit sur place, ramassez 7 cailloux (ou 49/70 pour tous les jours). Repartez après Fajr.", en: "After sunset, head to Muzdalifah: Maghrib+'Isha combined, overnight stay, collect 7 pebbles (or 49/70 for all days). Leave after Fajr.", ar: "بعد الغروب انطلق إلى مزدلفة: صلِّ المغرب والعشاء جمعًا، وبِت بها، والتقط ٧ حصيات (أو ٤٩/٧٠ لجميع الأيام)، وانطلق بعد الفجر." } },
    { icon: "🪨", arName: "رمي جمرة العقبة", name: { fr: "Jour 10 — Jamrat al-'Aqaba", en: "Day 10 — Jamrat al-'Aqaba", ar: "اليوم ١٠ — رمي جمرة العقبة" },
      desc: { fr: "Le jour de l'Aïd : lapidez la grande jamarah avec 7 cailloux en disant « Allahu Akbar » à chaque jet. La talbiyah cesse au premier jet.", en: "On Eid day: stone the large jamarah with 7 pebbles, saying “Allahu Akbar” with each throw. The talbiyah stops at the first throw.", ar: "يوم النحر: ارمِ جمرة العقبة الكبرى بسبع حصيات مكبرًا مع كل حصاة، وتنقطع التلبية مع أول حصاة." } },
    { icon: "🐑", arName: "الهدي", name: { fr: "Le sacrifice (Hady)", en: "The sacrifice (Hady)", ar: "الهدي" },
      desc: { fr: "Obligatoire pour le Hajj Tamattu' et Qiran. Aujourd'hui réglé simplement par coupon officiel (banque Al-Rajhi ou votre agence) — l'abattage est fait en votre nom.", en: "Required for Tamattu' and Qiran Hajj. Today easily settled via official voucher (Al-Rajhi bank or your agency) — slaughter is done on your behalf.", ar: "واجب على المتمتع والقارن. يُؤدى اليوم بسهولة عبر قسيمة رسمية (مصرف الراجحي أو وكالتك) ويُذبح نيابة عنك." } },
    { icon: "✂️", arName: "الحلق", name: { fr: "Rasage puis Tawaf al-Ifadah", en: "Shaving then Tawaf al-Ifadah", ar: "الحلق ثم طواف الإفاضة" },
      desc: { fr: "Rasez ou coupez les cheveux (première désacralisation), puis accomplissez le Tawaf al-Ifadah et le Sa'i du Hajj à Makkah — désacralisation complète.", en: "Shave or trim (first release from ihram), then perform Tawaf al-Ifadah and the Sa'i of Hajj in Makkah — complete release.", ar: "احلق أو قصّر (التحلل الأول)، ثم أدِّ طواف الإفاضة وسعي الحج بمكة — وبه التحلل الكامل." } },
    { icon: "⛺", arName: "أيام التشريق", name: { fr: "Jours 11-13 — Tashreeq à Mina", en: "Days 11-13 — Tashreeq in Mina", ar: "أيام ١١-١٣ — التشريق بمنى" },
      desc: { fr: "Nuits à Mina. Chaque après-midi, lapidez les 3 jamarat (petite, moyenne, grande) avec 7 cailloux chacune. Départ possible le 12 avant le coucher du soleil.", en: "Nights in Mina. Each afternoon, stone the 3 jamarat (small, middle, large) with 7 pebbles each. You may leave on the 12th before sunset.", ar: "المبيت بمنى. بعد الزوال كل يوم ارمِ الجمرات الثلاث (الصغرى فالوسطى فالكبرى) بسبع حصيات لكل منها. يجوز التعجل في اليوم الثاني عشر قبل الغروب." } },
    { icon: "🕋", arName: "طواف الوداع", name: { fr: "Tawaf al-Wada' (adieu)", en: "Tawaf al-Wada' (farewell)", ar: "طواف الوداع" },
      desc: { fr: "Dernier rite avant de quitter Makkah : 7 tours d'adieu autour de la Kaaba. Qu'Allah accepte votre Hajj — Hajj mabrour !", en: "Last rite before leaving Makkah: 7 farewell circuits around the Kaaba. May Allah accept your Hajj — Hajj mabrour!", ar: "آخر المناسك قبل مغادرة مكة: سبعة أشواط وداعًا للكعبة. تقبل الله حجكم — حج مبرور!" } },
  ],
};

const MIQATS = [
  { name: "Dhul-Hulayfah (Abyar 'Ali)", ar: "ذو الحليفة", from: { fr: "Venant de Médine", en: "Coming from Madinah", ar: "للقادمين من المدينة" }, dist: "≈ 450 km" },
  { name: "Al-Juhfah (Rabigh)", ar: "الجحفة", from: { fr: "Venant d'Égypte, Maghreb, Europe", en: "From Egypt, Maghreb, Europe", ar: "للقادمين من مصر والمغرب وأوروبا" }, dist: "≈ 183 km" },
  { name: "Qarn al-Manazil (As-Sayl)", ar: "قرن المنازل", from: { fr: "Venant du Najd / Émirats", en: "From Najd / UAE", ar: "للقادمين من نجد والإمارات" }, dist: "≈ 75 km" },
  { name: "Yalamlam", ar: "يلملم", from: { fr: "Venant du Yémen / Asie du Sud", en: "From Yemen / South Asia", ar: "للقادمين من اليمن وجنوب آسيا" }, dist: "≈ 92 km" },
  { name: "Dhat 'Irq", ar: "ذات عرق", from: { fr: "Venant d'Irak / Iran", en: "From Iraq / Iran", ar: "للقادمين من العراق وإيران" }, dist: "≈ 94 km" },
];

/* ──────────────────────────── BUDGETS ─────────────────────── */
const BUDGETS = {
  serré: { icon: "🎒", color: "#16A085", label: { fr: "Économique", en: "Budget", ar: "اقتصادي" }, omra: "≈ 1 200 – 1 800 €", hajj: "≈ 5 000 – 7 000 €" },
  moyen: { icon: "✈️", color: "#C8A84B", label: { fr: "Confort", en: "Comfort", ar: "مريح" }, omra: "≈ 2 000 – 3 500 €", hajj: "≈ 7 000 – 11 000 €" },
  riche: { icon: "💎", color: "#7B3FA8", label: { fr: "Premium", en: "Premium", ar: "فاخر" }, omra: "≈ 4 000 € +", hajj: "≈ 12 000 € +" },
};

/* ──────────────────────────── HÔTELS ──────────────────────── */
const HOTELS = {
  makkah: {
    serré: [
      { name: "Dar Al Eiman Ajyad", stars: 3, dist: "700 m", price: "40-90 €" },
      { name: "Al Kiswah Towers", stars: 3, dist: "3 km (navette)", price: "30-70 €" },
      { name: "Snood Al Azizia", stars: 3, dist: "4 km (navette)", price: "25-60 €" },
    ],
    moyen: [
      { name: "Anjum Hotel Makkah", stars: 4, dist: "600 m", price: "120-250 €" },
      { name: "M Hotel Makkah by Millennium", stars: 4, dist: "1,2 km", price: "100-200 €" },
      { name: "Pullman ZamZam Makkah", stars: 5, dist: "Face au Haram", price: "180-350 €" },
    ],
    riche: [
      { name: "Fairmont Makkah Clock Royal Tower", stars: 5, dist: "Face au Haram", price: "350-900 €" },
      { name: "Raffles Makkah Palace", stars: 5, dist: "Face au Haram", price: "500-1 200 €" },
      { name: "Conrad Makkah", stars: 5, dist: "300 m", price: "300-700 €" },
    ],
  },
  madinah: {
    serré: [
      { name: "Al Eiman Taibah", stars: 4, dist: "150 m", price: "50-100 €" },
      { name: "Dallah Taibah", stars: 4, dist: "100 m", price: "60-120 €" },
    ],
    moyen: [
      { name: "Pullman Zamzam Madina", stars: 5, dist: "200 m", price: "130-250 €" },
      { name: "Crowne Plaza Madinah", stars: 5, dist: "100 m", price: "140-260 €" },
    ],
    riche: [
      { name: "Anwar Al Madinah Mövenpick", stars: 5, dist: "Face au Haram", price: "250-550 €" },
      { name: "InterContinental Dar Al Iman", stars: 5, dist: "Face au Haram", price: "280-600 €" },
    ],
  },
};

/* ─────────────────────────── CHECKLIST ────────────────────── */
const CHECKLIST = [
  { icon: "📄", cat: { fr: "Documents", en: "Documents", ar: "الوثائق" }, items: [
    { fr: "Passeport valide 6 mois minimum", en: "Passport valid for at least 6 months", ar: "جواز سفر صالح لستة أشهر على الأقل" },
    { fr: "Visa Omra (e-visa) ou visa Hajj via agence agréée", en: "Umrah e-visa or Hajj visa via licensed agency", ar: "تأشيرة عمرة إلكترونية أو تأشيرة حج عبر وكالة معتمدة" },
    { fr: "Billets d'avion + réservations hôtel imprimées", en: "Flight tickets + printed hotel bookings", ar: "تذاكر الطيران + حجوزات الفنادق مطبوعة" },
    { fr: "Carnet de vaccination (méningite ACYW135 obligatoire)", en: "Vaccination record (ACYW135 meningitis required)", ar: "شهادة التطعيم (لقاح الحمى الشوكية ACYW135 إلزامي)" },
    { fr: "Assurance voyage / rapatriement", en: "Travel / repatriation insurance", ar: "تأمين السفر" },
    { fr: "Photocopies + photos d'identité supplémentaires", en: "Photocopies + extra ID photos", ar: "نسخ من الوثائق + صور شخصية إضافية" },
  ]},
  { icon: "🧳", cat: { fr: "Valise", en: "Luggage", ar: "الحقيبة" }, items: [
    { fr: "2 tenues d'ihram (homme) / vêtements amples couvrants (femme)", en: "2 ihram sets (men) / loose covering clothes (women)", ar: "إحرامان (للرجل) / ملابس فضفاضة ساترة (للمرأة)" },
    { fr: "Sandales confortables sans couture sur le cou-de-pied", en: "Comfortable sandals", ar: "صنادل مريحة" },
    { fr: "Ceinture d'ihram avec poche à documents", en: "Ihram belt with document pouch", ar: "حزام إحرام بجيب للوثائق" },
    { fr: "Crème solaire et parapluie/ombrelle", en: "Sunscreen and umbrella", ar: "واقي شمس ومظلة" },
    { fr: "Médicaments personnels + petite pharmacie", en: "Personal medication + small first-aid kit", ar: "الأدوية الشخصية + صيدلية صغيرة" },
    { fr: "Savon et déodorant sans parfum (état d'ihram)", en: "Unscented soap and deodorant (for ihram)", ar: "صابون ومزيل عرق بدون عطر (للإحرام)" },
    { fr: "Sac banane / pochette anti-vol", en: "Money belt / anti-theft pouch", ar: "حقيبة خصر آمنة" },
  ]},
  { icon: "📿", cat: { fr: "Spirituel", en: "Spiritual", ar: "روحانيات" },  items: [
    { fr: "Apprendre la talbiyah et les invocations des rites", en: "Learn the talbiyah and the rites' supplications", ar: "حفظ التلبية وأدعية المناسك" },
    { fr: "Liste personnelle de du'as (pour Arafat, le tawaf…)", en: "Personal du'a list (for Arafat, tawaf…)", ar: "قائمة أدعية شخصية (لعرفة والطواف…)" },
    { fr: "Régler ses dettes et demander pardon avant le départ", en: "Settle debts and seek forgiveness before leaving", ar: "قضاء الديون وطلب العفو قبل السفر" },
    { fr: "Mushaf de poche / application Coran", en: "Pocket mushaf / Quran app", ar: "مصحف جيب / تطبيق قرآن" },
  ]},
  { icon: "📱", cat: { fr: "Pratique", en: "Practical", ar: "عمليات" }, items: [
    { fr: "Application Nusuk installée (réservation Rawdah)", en: "Nusuk app installed (Rawdah booking)", ar: "تطبيق نسك (لحجز الروضة)" },
    { fr: "Carte SIM saoudienne / forfait international", en: "Saudi SIM card / international plan", ar: "شريحة سعودية / باقة دولية" },
    { fr: "Riyals en espèces + carte bancaire internationale", en: "Saudi riyals in cash + international bank card", ar: "ريالات نقدًا + بطاقة مصرفية دولية" },
    { fr: "Adaptateur électrique (prises type G)", en: "Power adapter (type G sockets)", ar: "محول كهربائي (مقابس نوع G)" },
  ]},
];

/* ─────────────────────────── INVOCATIONS ──────────────────── */
const DUAS = [
  { title: { fr: "La Talbiyah", en: "The Talbiyah", ar: "التلبية" },
    arabic: "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ",
    translit: "Labbayka Allahumma labbayk, labbayka la sharika laka labbayk, inna-l-hamda wa-n-ni'mata laka wa-l-mulk, la sharika lak",
    trans: { fr: "Me voici ô Allah, me voici. Me voici, Tu n'as aucun associé, me voici. La louange, la grâce et la royauté T'appartiennent. Tu n'as aucun associé.", en: "Here I am, O Allah, here I am. Here I am, You have no partner, here I am. Praise, grace and sovereignty belong to You. You have no partner." } },
  { title: { fr: "Entre le coin yéménite et la Pierre Noire", en: "Between the Yemeni corner and the Black Stone", ar: "بين الركن اليماني والحجر الأسود" },
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    translit: "Rabbana atina fi-d-dunya hasanah wa fi-l-akhirati hasanah wa qina 'adhaba-n-nar",
    trans: { fr: "Seigneur, accorde-nous un bien en ce monde et un bien dans l'au-delà, et protège-nous du châtiment du Feu.", en: "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire." } },
  { title: { fr: "En montant sur Safa et Marwa", en: "Ascending Safa and Marwa", ar: "عند الصعود على الصفا والمروة" },
    arabic: "إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللَّهِ",
    translit: "Inna-s-Safa wa-l-Marwata min sha'a'iri-Llah",
    trans: { fr: "Safa et Marwa font partie des rites prescrits par Allah. (Coran 2:158)", en: "Safa and Marwa are among the symbols of Allah. (Quran 2:158)" } },
  { title: { fr: "La meilleure invocation du jour d'Arafat", en: "Best supplication of the day of Arafat", ar: "خير دعاء يوم عرفة" },
    arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    translit: "La ilaha illa-Llahu wahdahu la sharika lah, lahu-l-mulku wa lahu-l-hamdu wa huwa 'ala kulli shay'in qadir",
    trans: { fr: "Nul ne mérite d'être adoré sauf Allah, Seul, sans associé. À Lui la royauté et la louange, et Il est capable de toute chose.", en: "None has the right to be worshipped except Allah alone, without partner. His is the dominion and praise, and He is able to do all things." } },
  { title: { fr: "En entrant dans la mosquée", en: "Entering the mosque", ar: "عند دخول المسجد" },
    arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    translit: "Allahumma-ftah li abwaba rahmatik",
    trans: { fr: "Ô Allah, ouvre-moi les portes de Ta miséricorde.", en: "O Allah, open for me the doors of Your mercy." } },
  { title: { fr: "En buvant l'eau de Zamzam", en: "Drinking Zamzam water", ar: "عند شرب ماء زمزم" },
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا وَاسِعًا وَشِفَاءً مِنْ كُلِّ دَاءٍ",
    translit: "Allahumma inni as'aluka 'ilman nafi'an wa rizqan wasi'an wa shifa'an min kulli da'",
    trans: { fr: "Ô Allah, je Te demande une science utile, une subsistance abondante et la guérison de toute maladie.", en: "O Allah, I ask You for beneficial knowledge, abundant provision and healing from every illness." } },
];

/* ──────────────────────────── FAQ ─────────────────────────── */
const FAQ = [
  { q: { fr: "Quelle est la différence entre le Hajj et la Omra ?", en: "What is the difference between Hajj and Umrah?", ar: "ما الفرق بين الحج والعمرة؟" },
    a: { fr: "Le Hajj est le grand pèlerinage, 5e pilier de l'islam, obligatoire une fois dans la vie pour celui qui en a la capacité, uniquement du 8 au 13 Dhul-Hijjah. La Omra est le petit pèlerinage, accomplissable toute l'année (ihram, tawaf, sa'i, rasage/coupe).", en: "Hajj is the major pilgrimage, the 5th pillar of Islam, obligatory once in a lifetime for those able, only from 8 to 13 Dhul-Hijjah. Umrah is the minor pilgrimage, possible all year round (ihram, tawaf, sa'i, shaving/trimming).", ar: "الحج هو الركن الخامس من أركان الإسلام، واجب مرة في العمر على المستطيع، في أيام محددة من ذي الحجة. أما العمرة فتؤدى في أي وقت من السنة (إحرام وطواف وسعي وحلق أو تقصير)." } },
  { q: { fr: "Combien coûte une Omra ?", en: "How much does Umrah cost?", ar: "كم تكلف العمرة؟" },
    a: { fr: "Pour 10 jours depuis l'Europe : environ 1 200-1 800 € en économique, 2 000-3 500 € en confort, 4 000 €+ en premium. Le Ramadan est la période la plus chère (×1,5 à ×2).", en: "For 10 days from Europe: about €1,200-1,800 budget, €2,000-3,500 comfort, €4,000+ premium. Ramadan is the most expensive period (×1.5 to ×2).", ar: "لعشرة أيام من أوروبا: حوالي 1200-1800 يورو اقتصادي، 2000-3500 يورو مريح، وأكثر من 4000 يورو فاخر. رمضان هو الموسم الأغلى." } },
  { q: { fr: "Quelle est la meilleure période pour la Omra ?", en: "When is the best time for Umrah?", ar: "ما هو أفضل وقت للعمرة؟" },
    a: { fr: "Janvier-février et septembre-octobre : climat doux (25-32°C) et affluence modérée. Le Ramadan offre une récompense immense (Omra = Hajj en récompense selon le hadith) mais forte affluence et prix élevés.", en: "January-February and September-October: mild weather (25-32°C) and moderate crowds. Ramadan brings immense reward (Umrah equals Hajj in reward per the hadith) but heavy crowds and high prices.", ar: "يناير-فبراير وسبتمبر-أكتوبر: طقس معتدل وازدحام أقل. وعمرة رمضان تعدل حجة كما في الحديث، لكن الازدحام والأسعار في أعلى مستوياتها." } },
  { q: { fr: "La femme doit-elle voyager avec un mahram ?", en: "Must a woman travel with a mahram?", ar: "هل يجب أن تسافر المرأة مع محرم؟" },
    a: { fr: "L'Arabie Saoudite n'exige plus de mahram pour le visa Omra des femmes. Sur le plan religieux, les avis divergent selon les écoles — consultez votre imam ou un savant de confiance.", en: "Saudi Arabia no longer requires a mahram for women's Umrah visas. Religiously, scholarly opinions differ — consult your imam or a trusted scholar.", ar: "لم تعد السعودية تشترط محرمًا لتأشيرة عمرة النساء. أما شرعًا فالمسألة خلافية بين أهل العلم — استشر إمامك أو عالمًا تثق به." } },
  { q: { fr: "Quels vaccins sont obligatoires ?", en: "Which vaccines are required?", ar: "ما هي اللقاحات الإلزامية؟" },
    a: { fr: "Le vaccin contre la méningite à méningocoques ACYW135 est obligatoire (certificat de moins de 3 ans, fait au moins 10 jours avant le départ). D'autres vaccins peuvent être recommandés selon votre pays.", en: "The ACYW135 meningococcal meningitis vaccine is mandatory (certificate under 3 years old, taken at least 10 days before departure). Other vaccines may be recommended depending on your country.", ar: "لقاح الحمى الشوكية الرباعي ACYW135 إلزامي (شهادة سارية لأقل من ثلاث سنوات، قبل السفر بعشرة أيام على الأقل)." } },
  { q: { fr: "Comment visiter la Rawdah à Médine ?", en: "How to visit the Rawdah in Madinah?", ar: "كيف أزور الروضة الشريفة؟" },
    a: { fr: "La visite de la Rawdah (entre la chambre du Prophète ﷺ et son minbar) se réserve obligatoirement et gratuitement via l'application officielle Nusuk, avec créneaux séparés hommes/femmes.", en: "Visiting the Rawdah (between the Prophet's ﷺ chamber and his minbar) must be booked for free via the official Nusuk app, with separate slots for men and women.", ar: "زيارة الروضة الشريفة تتطلب حجزًا مجانيًا عبر تطبيق نسك الرسمي، بمواعيد منفصلة للرجال والنساء." } },
];

/* ─────────────────────── LIENS RÉSERVATION ────────────────── */
const BOOK = {
  hotel: q => `https://www.booking.com/searchresults.fr.html?ss=${encodeURIComponent(q)}`,
  flights: (from, to) => `https://www.google.com/travel/flights?q=${encodeURIComponent(`vols ${from} vers ${to}`)}`,
  maps: q => `https://www.google.com/maps/search/${encodeURIComponent(q)}`,
};

/* ─────────────────────────── VISA & PRÉREQUIS ─────────────────────── */
const VISA_COUNTRIES = {
  fr: { flag: "🇫🇷", name: { fr: "France", en: "France", ar: "فرنسا" },
    omra: { cost: "≈ 300 – 500 SAR",
      steps: { fr: ["Créer un compte sur nusuk.sa (plateforme officielle saoudienne)", "Remplir le formulaire de visa Omra et payer en ligne (carte bancaire internationale)", "Recevoir le visa électronique par email sous 24-72h", "Télécharger l'app Nusuk et enregistrer le visa avant le départ"], en: ["Create an account on nusuk.sa (official Saudi platform)", "Fill in the Umrah visa form and pay online (international bank card)", "Receive e-visa by email within 24-72h", "Download the Nusuk app and register the visa before departure"], ar: ["إنشاء حساب على nusuk.sa (المنصة السعودية الرسمية)", "ملء نموذج تأشيرة العمرة والدفع عبر الإنترنت ببطاقة مصرفية دولية", "استلام التأشيرة الإلكترونية بالبريد خلال ٢٤-٧٢ ساعة", "تحميل تطبيق نسك وتسجيل التأشيرة قبل السفر"] } },
    hajj: { body: { fr: "Agences agréées par l'Ambassade d'Arabie Saoudite à Paris", en: "Agencies approved by the Saudi Embassy in Paris", ar: "وكالات معتمدة من سفارة المملكة في باريس" }, quota: "≈ 3 000 places/an",
      steps: { fr: ["Contacter une agence agréée par le Consulat Général d'Arabie Saoudite", "Fournir : passeport valide, vaccin méningite ACYW135, déclaration sur l'honneur de confession islamique", "Règle saoudienne : 1 Hajj autorisé tous les 5 ans minimum"], en: ["Contact an agency approved by the Saudi Consulate General", "Provide: valid passport, ACYW135 meningitis vaccine, sworn declaration of Muslim faith", "Saudi rule: 1 Hajj permitted every 5 years minimum"], ar: ["التواصل مع وكالة معتمدة من القنصلية السعودية العامة", "تقديم: جواز سفر ساري، لقاح الحمى الشوكية ACYW135، إقرار بالإسلام", "قاعدة سعودية: حجة واحدة مسموح بها كل خمس سنوات على الأقل"] } } },
  ma: { flag: "🇲🇦", name: { fr: "Maroc", en: "Morocco", ar: "المغرب" },
    omra: { cost: "≈ 200 – 400 SAR",
      steps: { fr: ["Via nusuk.sa (e-visa direct) ou agence marocaine agréée", "Passeport valide 6 mois minimum + vaccin méningite ACYW135 obligatoire", "Visa valable 90 jours, entrées multiples — paiement en ligne"], en: ["Via nusuk.sa (direct e-visa) or licensed Moroccan agency", "Passport valid 6+ months + ACYW135 meningitis vaccine required", "Visa valid 90 days, multiple entries — online payment"], ar: ["عبر nusuk.sa أو وكالة مغربية معتمدة", "جواز سفر صالح ٦ أشهر + لقاح الحمى الشوكية ACYW135 إلزامي", "التأشيرة صالحة ٩٠ يومًا بدخول متعدد — الدفع إلكترونيًا"] } },
    hajj: { body: { fr: "Ministère des Habous et des Affaires Islamiques (habous.gov.ma)", en: "Ministry of Habous and Islamic Affairs (habous.gov.ma)", ar: "وزارة الأوقاف والشؤون الإسلامية (habous.gov.ma)" }, quota: "≈ 33 000 places/an",
      steps: { fr: ["S'inscrire auprès du Ministère des Habous ou d'une agence agréée", "Dossier : passeport, acte de naissance, vaccin méningite, 2 photos", "Tirage au sort si le quota est dépassé — priorité aux non-hajjis"], en: ["Register with the Ministry of Habous or an approved agency", "File: passport, birth certificate, meningitis vaccine, 2 photos", "Lottery if quota exceeded — priority for first-time pilgrims"], ar: ["التسجيل لدى وزارة الأوقاف أو وكالة معتمدة", "الملف: جواز السفر وشهادة الميلاد ولقاح الحمى الشوكية وصورتان", "قرعة إذا تجاوز عدد المتقدمين الحصة — أولوية لمن لم يحج"] } } },
  dz: { flag: "🇩🇿", name: { fr: "Algérie", en: "Algeria", ar: "الجزائر" },
    omra: { cost: "≈ 200 – 400 SAR",
      steps: { fr: ["Via nusuk.sa ou agence agréée par l'ONHO (Algérie)", "Passeport valide 6 mois + vaccin méningite ACYW135", "Paiement par carte Mastercard / Visa internationale uniquement"], en: ["Via nusuk.sa or ONHO-approved agency (Algeria)", "Passport valid 6+ months + ACYW135 meningitis vaccine", "Payment by international Mastercard / Visa only"], ar: ["عبر nusuk.sa أو وكالة معتمدة من الديوان الوطني للحج والعمرة", "جواز سفر صالح ٦ أشهر + لقاح الحمى الشوكية ACYW135", "الدفع ببطاقة ماستركارد / فيزا دولية فقط"] } },
    hajj: { body: { fr: "Office National du Hadj et de la Omra — ONHO (onho.dz)", en: "National Office of Hajj and Umrah — ONHO (onho.dz)", ar: "الديوان الوطني للحج والعمرة (onho.dz)" }, quota: "≈ 36 000 places/an",
      steps: { fr: ["Inscription à l'ONHO en ligne (onho.dz) ou au bureau de wilaya", "Dossier : passeport, acte de naissance, vaccins, 2 photos", "Paiement intégral obligatoire à l'inscription — tirage au sort si surnombre"], en: ["Register with ONHO online (onho.dz) or at your wilaya office", "File: passport, birth certificate, vaccines, 2 photos", "Full payment required upon registration — lottery if oversubscribed"], ar: ["التسجيل في الديوان الوطني إلكترونيًا أو في مكتب الولاية", "الملف: جواز السفر وشهادة الميلاد واللقاحات وصورتان", "الدفع الكامل إلزامي عند التسجيل — قرعة إذا تجاوز العدد الحصة"] } } },
  tn: { flag: "🇹🇳", name: { fr: "Tunisie", en: "Tunisia", ar: "تونس" },
    omra: { cost: "≈ 200 – 400 SAR",
      steps: { fr: ["Via nusuk.sa ou agence tunisienne agréée", "Passeport + vaccin méningite ACYW135 + carte bancaire internationale"], en: ["Via nusuk.sa or licensed Tunisian agency", "Passport + ACYW135 meningitis vaccine + international bank card"], ar: ["عبر nusuk.sa أو وكالة تونسية معتمدة", "جواز السفر + لقاح الحمى الشوكية ACYW135 + بطاقة مصرفية دولية"] } },
    hajj: { body: { fr: "Ministère des Affaires Religieuses (affaires-religieuses.gov.tn)", en: "Ministry of Religious Affairs (affaires-religieuses.gov.tn)", ar: "وزارة الشؤون الدينية (affaires-religieuses.gov.tn)" }, quota: "≈ 10 500 places/an",
      steps: { fr: ["Inscription via le Ministère des Affaires Religieuses", "Tirage au sort national si le nombre d'inscrits dépasse le quota", "Priorité aux premières inscriptions et aux non-hajjis"], en: ["Register via Ministry of Religious Affairs", "National lottery if registered candidates exceed quota", "Priority for first registrations and first-time pilgrims"], ar: ["التسجيل عبر وزارة الشؤون الدينية", "قرعة وطنية إذا تجاوز عدد المسجلين الحصة", "الأولوية للمسجلين الجدد ومن لم يحجوا"] } } },
  be: { flag: "🇧🇪", name: { fr: "Belgique", en: "Belgium", ar: "بلجيكا" },
    omra: { cost: "≈ 300 – 500 SAR",
      steps: { fr: ["Via nusuk.sa (e-visa direct) ou agence agréée en Belgique", "Passeport belge valide + vaccin méningite ACYW135", "Aucun quota — visa Omra accessible toute l'année"], en: ["Via nusuk.sa (direct e-visa) or approved agency in Belgium", "Valid Belgian passport + ACYW135 meningitis vaccine", "No quota — Umrah visa available year-round"], ar: ["عبر nusuk.sa أو وكالة معتمدة في بلجيكا", "جواز سفر بلجيكي ساري + لقاح الحمى الشوكية ACYW135", "لا حصة — تأشيرة العمرة متاحة طوال العام"] } },
    hajj: { body: { fr: "Agences agréées par l'Ambassade d'Arabie Saoudite à Bruxelles", en: "Agencies approved by the Saudi Embassy in Brussels", ar: "وكالات معتمدة من سفارة المملكة في بروكسل" }, quota: "≈ 1 800 places/an",
      steps: { fr: ["Contacter une agence agréée par l'Ambassade saoudienne à Bruxelles", "Dossier : passeport, vaccins, attestation de foi islamique, photo", "Paiement intégral de la formule Hajj à l'agence"], en: ["Contact an agency approved by the Saudi Embassy in Brussels", "File: passport, vaccines, Islamic faith certificate, photo", "Full Hajj package payment to the agency"], ar: ["التواصل مع وكالة معتمدة من سفارة المملكة في بروكسل", "الملف: جواز السفر واللقاحات وشهادة إسلام والصورة", "دفع تكلفة باقة الحج كاملة للوكالة"] } } },
  ca: { flag: "🇨🇦", name: { fr: "Canada", en: "Canada", ar: "كندا" },
    omra: { cost: "≈ 300 – 500 SAR",
      steps: { fr: ["Via nusuk.sa ou agence canadienne agréée par le Consulat saoudien", "Passeport canadien valide + vaccin méningite ACYW135", "Paiement par carte Visa/Mastercard internationale"], en: ["Via nusuk.sa or Canadian agency approved by Saudi Consulate", "Valid Canadian passport + ACYW135 meningitis vaccine", "Payment by international Visa/Mastercard"], ar: ["عبر nusuk.sa أو وكالة كندية معتمدة من القنصلية السعودية", "جواز سفر كندي ساري + لقاح الحمى الشوكية ACYW135", "الدفع ببطاقة فيزا/ماستركارد دولية"] } },
    hajj: { body: { fr: "ISNA Canada + agences agréées par le Consulat saoudien", en: "ISNA Canada + agencies approved by Saudi Consulate", ar: "ISNA كندا + وكالات معتمدة من القنصلية السعودية" }, quota: "≈ 6 000 places/an",
      steps: { fr: ["Via une agence agréée par le Consulat général d'Arabie Saoudite (Toronto / Ottawa)", "Documents : passeport, vaccins, attestation de foi islamique, photo"], en: ["Via an agency approved by the Saudi Consulate General (Toronto / Ottawa)", "Documents: passport, vaccines, Islamic faith certificate, photo"], ar: ["عبر وكالة معتمدة من القنصلية السعودية العامة (تورونتو / أوتاوا)", "الوثائق: جواز السفر واللقاحات وشهادة إسلام والصورة"] } } },
  gb: { flag: "🇬🇧", name: { fr: "Royaume-Uni", en: "United Kingdom", ar: "المملكة المتحدة" },
    omra: { cost: "≈ 300 – 500 SAR",
      steps: { fr: ["Via nusuk.sa (e-visa direct) ou agence agréée au Royaume-Uni", "Passeport britannique valide + vaccin méningite ACYW135"], en: ["Via nusuk.sa (direct e-visa) or approved UK agency", "Valid British passport + ACYW135 meningitis vaccine"], ar: ["عبر nusuk.sa أو وكالة معتمدة في المملكة المتحدة", "جواز سفر بريطاني ساري + لقاح الحمى الشوكية ACYW135"] } },
    hajj: { body: { fr: "Muslim Council of Britain + agences agréées par l'Ambassade saoudienne", en: "Muslim Council of Britain + Saudi Embassy-approved agencies", ar: "مجلس المسلمين في بريطانيا + وكالات معتمدة من السفارة السعودية" }, quota: "≈ 25 000 places/an",
      steps: { fr: ["Contacter une agence agréée par l'Ambassade saoudienne à Londres", "Documents : passeport, vaccins, preuve d'identité islamique, photo"], en: ["Contact an agency approved by the Saudi Embassy in London", "Documents: passport, vaccines, proof of Islamic identity, photo"], ar: ["التواصل مع وكالة معتمدة من السفارة السعودية في لندن", "الوثائق: جواز السفر واللقاحات وما يثبت الهوية الإسلامية والصورة"] } } },
  sn: { flag: "🇸🇳", name: { fr: "Sénégal", en: "Senegal", ar: "السنغال" },
    omra: { cost: "≈ 200 – 400 SAR",
      steps: { fr: ["Via nusuk.sa ou agence sénégalaise agréée", "Passeport valide + vaccin méningite ACYW135 + preuve de foi islamique"], en: ["Via nusuk.sa or approved Senegalese agency", "Valid passport + ACYW135 meningitis vaccine + proof of Islamic faith"], ar: ["عبر nusuk.sa أو وكالة سنغالية معتمدة", "جواز سفر ساري + لقاح الحمى الشوكية ACYW135 + ما يثبت الإسلام"] } },
    hajj: { body: { fr: "Commissariat Général au Pèlerinage — CGP (Sénégal)", en: "General Commission for Pilgrimage — CGP (Senegal)", ar: "المفوضية العامة للحج بالسنغال" }, quota: "≈ 12 000 places/an",
      steps: { fr: ["Inscription auprès du Commissariat Général au Pèlerinage", "Tirage au sort national si le nombre d'inscrits dépasse le quota"], en: ["Register with the General Commission for Pilgrimage", "National lottery if registered candidates exceed quota"], ar: ["التسجيل في المفوضية العامة للحج", "قرعة وطنية إذا تجاوز عدد المسجلين الحصة"] } } },
};

/* ──────────────────── PROGRAMMES GÉNÉRÉS ──────────────────── */
function buildOmraProgram(days, T, lang) {
  const t = (fr, en, ar) => ({ fr, en, ar }[lang] || fr);
  const makkahDays = Math.max(3, Math.ceil(days * 0.55));
  const madinahDays = Math.max(2, days - makkahDays - 1);
  const prog = [
    { d: 1, icon: "🛬", title: t("Arrivée à Jeddah → Makkah", "Arrival in Jeddah → Makkah", "الوصول إلى جدة ← مكة"), items: [
      t("Ihram avant le miqat (en avion : annoncé ~30 min avant)", "Ihram before the miqat (announced ~30 min before on the plane)", "الإحرام قبل الميقات (يُعلن عنه في الطائرة قبل ~30 دقيقة)"),
      t("Transfert Jeddah → Makkah (~1h30, taxi ou train Haramain)", "Transfer Jeddah → Makkah (~1.5h, taxi or Haramain train)", "الانتقال من جدة إلى مكة (~ساعة ونصف، تاكسي أو قطار الحرمين)"),
      t("Installation à l'hôtel, repos", "Hotel check-in, rest", "الاستقرار في الفندق والراحة"),
    ]},
    { d: 2, icon: "🕋", title: t("Accomplissement de la Omra", "Performing Umrah", "أداء العمرة"), items: [
      t("Tawaf (7 tours) puis 2 rak'at au Maqam Ibrahim", "Tawaf (7 circuits) then 2 rak'ahs at Maqam Ibrahim", "الطواف ثم ركعتان خلف مقام إبراهيم"),
      t("Eau de Zamzam puis Sa'i entre Safa et Marwa", "Zamzam water then Sa'i between Safa and Marwa", "ماء زمزم ثم السعي بين الصفا والمروة"),
      t("Halq / Taqsir — votre Omra est accomplie", "Halq / Taqsir — your Umrah is complete", "الحلق أو التقصير — تمت عمرتك"),
    ]},
  ];
  for (let d = 3; d <= makkahDays; d++) prog.push({ d, icon: "🕌", title: t(`Makkah — prières au Haram`, `Makkah — prayers at the Haram`, `مكة — الصلاة في الحرم`), items: [
    t("5 prières au Masjid al-Haram, tawaf surérogatoires", "5 prayers at Masjid al-Haram, voluntary tawaf", "الصلوات الخمس في المسجد الحرام وطواف نافلة"),
    d === 3 ? t("Visite : Jabal an-Nour (grotte Hira), Jabal Thawr, musée des Deux Saintes Mosquées", "Visit: Jabal an-Nour (Hira cave), Jabal Thawr, Two Holy Mosques museum", "زيارة: جبل النور وجبل ثور ومتحف الحرمين") : t("Lecture du Coran, repos, achats (dattes, zamzam à emporter)", "Quran reading, rest, shopping (dates, zamzam to take home)", "قراءة القرآن والراحة والتسوق"),
  ]});
  prog.push({ d: makkahDays + 1, icon: "🚄", title: t("Trajet Makkah → Médine", "Makkah → Madinah journey", "الانتقال من مكة إلى المدينة"), items: [
    t("Train Haramain (~2h30) ou bus (~5h)", "Haramain train (~2.5h) or bus (~5h)", "قطار الحرمين (~ساعتان ونصف) أو الحافلة (~5 ساعات)"),
    t("Installation à l'hôtel près du Masjid an-Nabawi", "Check-in near Masjid an-Nabawi", "الاستقرار قرب المسجد النبوي"),
    t("Salat au Masjid an-Nabawi et salutation au Prophète ﷺ", "Prayer at Masjid an-Nabawi and greeting the Prophet ﷺ", "الصلاة في المسجد النبوي والسلام على النبي ﷺ"),
  ]});
  for (let d = makkahDays + 2; d <= makkahDays + madinahDays; d++) prog.push({ d, icon: "🌿", title: t("Médine — Masjid an-Nabawi", "Madinah — Masjid an-Nabawi", "المدينة — المسجد النبوي"), items: [
    d === makkahDays + 2 ? t("Rawdah (réservation via app Nusuk), cimetière al-Baqi'", "Rawdah (book via Nusuk app), al-Baqi' cemetery", "الروضة الشريفة (حجز عبر نسك) والبقيع") : t("Visite : mosquée Quba (récompense d'une Omra), Uhud, mosquée Qiblatayn", "Visit: Quba mosque (reward of an Umrah), Uhud, Qiblatayn mosque", "زيارة: مسجد قباء وأُحد ومسجد القبلتين"),
    t("Prières au Masjid an-Nabawi", "Prayers at Masjid an-Nabawi", "الصلوات في المسجد النبوي"),
  ]});
  prog.push({ d: days, icon: "🛫", title: t("Départ", "Departure", "المغادرة"), items: [
    t("Transfert aéroport (Médine MED ou retour Jeddah JED)", "Airport transfer (Madinah MED or back to Jeddah JED)", "الانتقال إلى المطار (المدينة أو جدة)"),
    t("Qu'Allah accepte votre Omra — Omra mabroura !", "May Allah accept your Umrah!", "تقبل الله عمرتكم — عمرة مبرورة!"),
  ]});
  return prog;
}

function buildHajjProgram(T, lang) {
  const t = (fr, en, ar) => ({ fr, en, ar }[lang] || fr);
  return [
    { d: t("J-2 à J-1", "D-2 to D-1", "قبل يومين"), icon: "🛬", title: t("Arrivée & Omra (Tamattu')", "Arrival & Umrah (Tamattu')", "الوصول والعمرة (تمتع)"), items: [t("Arrivée à Makkah, Omra complète, puis désacralisation", "Arrive in Makkah, full Umrah, then exit ihram", "الوصول إلى مكة وأداء العمرة ثم التحلل")] },
    { d: t("8 Dhul-Hijjah", "8 Dhul-Hijjah", "٨ ذو الحجة"), icon: "⛺", title: t("Tarwiyah — Mina", "Tarwiyah — Mina", "يوم التروية — منى"), items: [t("Ihram du Hajj, départ vers Mina, 5 prières raccourcies sur place", "Hajj ihram, depart to Mina, 5 shortened prayers there", "الإحرام بالحج والخروج إلى منى وأداء الصلوات قصرًا")] },
    { d: t("9 Dhul-Hijjah", "9 Dhul-Hijjah", "٩ ذو الحجة"), icon: "🏔", title: t("Arafat — le pilier du Hajj", "Arafat — the pillar of Hajj", "يوم عرفة — الركن الأعظم"), items: [t("Wuquf du zénith au coucher : Dhuhr+'Asr regroupées, invocations intenses", "Wuquf from noon to sunset: combined Dhuhr+'Asr, intense du'a", "الوقوف من الزوال إلى الغروب: الظهر والعصر جمعًا وإكثار من الدعاء"), t("Après le coucher : route vers Muzdalifah, nuit sur place, ramassage des cailloux", "After sunset: to Muzdalifah, overnight, collect pebbles", "بعد الغروب: مزدلفة والمبيت بها والتقاط الحصى")] },
    { d: t("10 Dhul-Hijjah", "10 Dhul-Hijjah", "١٠ ذو الحجة"), icon: "🪨", title: t("Jour de l'Aïd", "Eid day", "يوم النحر"), items: [t("Jamrat al-'Aqaba (7 cailloux), sacrifice (coupon), rasage", "Jamrat al-'Aqaba (7 pebbles), sacrifice (voucher), shaving", "رمي جمرة العقبة ثم الهدي ثم الحلق"), t("Tawaf al-Ifadah + Sa'i à Makkah, retour à Mina", "Tawaf al-Ifadah + Sa'i in Makkah, back to Mina", "طواف الإفاضة والسعي ثم العودة إلى منى")] },
    { d: t("11-13 Dhul-Hijjah", "11-13 Dhul-Hijjah", "١١-١٣ ذو الحجة"), icon: "⛺", title: t("Jours de Tashreeq", "Tashreeq days", "أيام التشريق"), items: [t("Nuits à Mina, lapidation des 3 jamarat chaque après-midi", "Nights in Mina, stoning the 3 jamarat each afternoon", "المبيت بمنى ورمي الجمرات الثلاث بعد الزوال"), t("Départ possible le 12 avant le coucher du soleil (ta'ajjul)", "Possible departure on the 12th before sunset (ta'ajjul)", "يجوز التعجل في الثاني عشر قبل الغروب")] },
    { d: t("Avant le départ", "Before leaving", "قبل المغادرة"), icon: "🕋", title: t("Tawaf al-Wada'", "Tawaf al-Wada'", "طواف الوداع"), items: [t("7 tours d'adieu — Hajj mabrour, qu'Allah l'accepte !", "7 farewell circuits — Hajj mabrour!", "سبعة أشواط وداعًا — حج مبرور وسعي مشكور!")] },
  ];
}

/* ════════════════════════ COMPOSANT ═══════════════════════ */
export default function App() {
  const [lang, setLang] = useState("fr");
  const [theme, setTheme] = useState("dark");
  const [view, setView] = useState("home"); // home | program
  const [ptype, setPtype] = useState("omra");
  const [departCity, setDepartCity] = useState("");
  const [duration, setDuration] = useState(10);
  const [budget, setBudget] = useState("moyen");
  const [travelers, setTravelers] = useState(2);
  const [heroIdx, setHeroIdx] = useState(0);
  const [imgs, setImgs] = useState({ ..._imgCache });
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [hotelCity, setHotelCity] = useState("makkah");
  const [checked, setChecked] = useState(() => { try { return JSON.parse(localStorage.getItem("ho_check") || "{}"); } catch { return {}; } });
  const [visaCountry, setVisaCountry] = useState("fr");

  const T = LANG[lang];
  const isRTL = lang === "ar";
  const isLight = theme === "light";
  const tr = obj => obj[lang] || obj.fr;

  const ritesRef = useRef(null), hotelsRef = useRef(null), checkRef = useRef(null), duasRef = useRef(null), faqRef = useRef(null), visaRef = useRef(null), contactRef = useRef(null), plannerRef = useRef(null);
  const navRefs = [ritesRef, hotelsRef, checkRef, duasRef, faqRef, visaRef, contactRef];

  const HERO_KEYS = ["kaaba", "nabawi", "arafat"];
  useEffect(() => { const id = setInterval(() => setHeroIdx(i => (i + 1) % HERO_KEYS.length), 6000); return () => clearInterval(id); }, []);
  useEffect(() => { HERO_KEYS.concat(["haram", "madinah", "mina"]).forEach(k => { if (!imgs[k]) fetchWikiImage(k).then(u => u && setImgs(m => ({ ...m, [k]: u }))); }); }, []);
  useEffect(() => { try { localStorage.setItem("ho_check", JSON.stringify(checked)); } catch {} }, [checked]);

  const ST = isLight
    ? { bg: "#F3EFE3", text: "#1A2210", textMuted: "#556B4A", cardBg: "rgba(255,255,255,.72)", cardBorder: "rgba(40,80,40,.12)", headerBg: "rgba(243,239,227,.92)", heroMuted: "rgba(248,250,252,.78)", divider: "rgba(40,80,40,.1)", footerBg: "#EAE5D5" }
    : { bg: "#070E09", text: "#F2EDD5", textMuted: "#8AA67E", cardBg: "rgba(255,248,225,.04)", cardBorder: "rgba(200,168,75,.14)", headerBg: "rgba(10,16,12,.9)", heroMuted: "rgba(242,237,213,.75)", divider: "rgba(200,168,75,.12)", footerBg: "#050C07" };

  const GOLD = "#C8A84B";   // or islamique classique
  const GREEN = "#27AE60";  // vert islamique profond

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600;700;800&family=Amiri:wght@400;700&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    html{scroll-behavior:smooth;}
    body{background:${ST.bg};font-family:'Inter',sans-serif;color:${ST.text};}
    ::-webkit-scrollbar{width:6px;}::-webkit-scrollbar-thumb{background:rgba(200,168,75,.25);border-radius:3px;}::-webkit-scrollbar-track{background:transparent;}
    @keyframes fadeIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
    .fade-in{animation:fadeIn .7s ease forwards;}
    input,textarea,select{background:${isLight ? "rgba(26,18,8,.05)" : "rgba(255,255,255,.06)"};border:1px solid ${isLight ? "rgba(26,18,8,.16)" : "rgba(255,255,255,.12)"};border-radius:12px;color:${ST.text};padding:12px 14px;font-size:14px;font-family:'Inter',sans-serif;outline:none;width:100%;transition:border-color .2s;color-scheme:${isLight ? "light" : "dark"};}
    input:focus,textarea:focus,select:focus{border-color:${GOLD};}
    input::placeholder,textarea::placeholder{color:${isLight ? "rgba(107,93,69,.55)" : "rgba(168,156,133,.5)"};}
    .arabic{font-family:'Amiri',serif;}
    .ho-burger{display:none;background:transparent;border:1px solid rgba(200,168,75,.25);border-radius:10px;font-size:17px;padding:7px 11px;cursor:pointer;align-items:center;justify-content:center;line-height:1;}
    @media (max-width:980px){
      .ho-nav-desktop{display:none !important;}
      .ho-burger{display:flex;}
    }
    @media (max-width:860px){
      .ho-contact-grid{grid-template-columns:1fr !important;}
      .ho-footer-grid{grid-template-columns:1fr 1fr !important;gap:30px !important;}
      .ho-planner-grid{grid-template-columns:1fr 1fr !important;}
    }
    @media (max-width:640px){
      .ho-header{left:10px !important;right:10px !important;padding:0 10px !important;}
      .ho-logo-tag{display:none !important;}
      .ho-footer-grid{grid-template-columns:1fr !important;}
      .ho-planner-grid{grid-template-columns:1fr !important;}
    }
    @media print{
      .no-print{display:none !important;}
      body{background:white;color:black;}
    }
  `;

  const sectionTitle = (badge, title, sub) => (
    <div style={{ textAlign: "center", marginBottom: 40, direction: isRTL ? "rtl" : "ltr" }}>
      <div style={{ display: "inline-block", fontSize: 11, color: GOLD, textTransform: "uppercase", letterSpacing: "2px", fontWeight: 700, background: "rgba(200,168,75,.1)", border: "1px solid rgba(200,168,75,.22)", borderRadius: 30, padding: "7px 20px", marginBottom: 18 }}>✦ {badge}</div>
      <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(26px,3.6vw,42px)", fontWeight: 900, color: ST.text, marginBottom: 12 }}>{title}</h2>
      {sub && <p style={{ fontSize: 15, color: ST.textMuted, maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>{sub}</p>}
    </div>
  );

  const program = ptype === "omra" ? buildOmraProgram(duration, T, lang) : buildHajjProgram(T, lang);

  return (
    <>
      <style>{css}</style>
      <div dir={isRTL ? "rtl" : "ltr"} style={{ background: ST.bg, color: ST.text, minHeight: "100vh" }}>

        {/* HEADER */}
        <header className="ho-header no-print" style={{ position: "fixed", top: 14, left: 24, right: 24, zIndex: 200, background: ST.headerBg, backdropFilter: "blur(22px)", border: "1px solid rgba(200,168,75,.22)", borderRadius: 18, padding: "0 14px", minHeight: 64, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 18px 50px rgba(0,0,0,.28)" }}>
          <button style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", background: "transparent", border: "none", padding: "8px 4px", fontFamily: "'Inter',sans-serif" }} onClick={() => { setView("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
            <img src={`${PUB}logo-kaaba.svg`} alt="manasik.info" style={{ width: 44, height: 44, borderRadius: 14, display: "block", boxShadow: "0 12px 30px rgba(200,168,75,.3)" }} />
            <div style={{ textAlign: isRTL ? "right" : "left" }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 900, color: ST.text, letterSpacing: "-.3px", lineHeight: 1 }}>manasik<span style={{ color: GOLD }}>.info</span></div>
              <div className="ho-logo-tag" style={{ fontSize: 9, color: ST.textMuted, letterSpacing: "2px", textTransform: "uppercase", marginTop: 4 }}>Guide Hajj & Omra · FR EN AR</div>
            </div>
          </button>

          {view === "home" && (
            <nav className="ho-nav-desktop" style={{ display: "flex", gap: 4, padding: 5, borderRadius: 14, background: isLight ? "rgba(255,255,255,.5)" : "rgba(255,247,234,.06)", border: "1px solid rgba(200,168,75,.12)" }}>
              {T.nav.map((label, i) => (
                <button key={label} onClick={() => navRefs[i].current?.scrollIntoView({ behavior: "smooth", block: "start" })} style={{ background: "transparent", border: "none", padding: "9px 12px", borderRadius: 11, fontSize: 13, color: ST.textMuted, cursor: "pointer", fontWeight: 700, fontFamily: "'Inter',sans-serif" }}
                  onMouseEnter={e => { e.currentTarget.style.color = ST.text; }} onMouseLeave={e => { e.currentTarget.style.color = ST.textMuted; }}>{label}</button>
              ))}
            </nav>
          )}

          <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
            {["fr", "en", "ar"].map(l => (
              <button key={l} onClick={() => setLang(l)} style={{ padding: "6px 9px", borderRadius: 9, border: `1px solid ${lang === l ? GOLD : "rgba(200,168,75,.18)"}`, background: lang === l ? "rgba(200,168,75,.13)" : "transparent", color: lang === l ? GOLD : ST.textMuted, fontSize: 10, fontWeight: lang === l ? 800 : 600, cursor: "pointer", fontFamily: "'Inter',sans-serif", textTransform: "uppercase", letterSpacing: "1px" }}>{l}</button>
            ))}
            <button onClick={() => setTheme(t => t === "dark" ? "light" : "dark")} style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid rgba(200,168,75,.2)", background: "transparent", color: ST.textMuted, fontSize: 15, cursor: "pointer" }}>{theme === "dark" ? "☀️" : "🌙"}</button>
            {view === "home" && (
              <button className="ho-burger" onClick={() => setShowMobileNav(s => !s)} aria-label="Menu" style={{ color: ST.text }}>{showMobileNav ? "✕" : "☰"}</button>
            )}
          </div>

          {view === "home" && showMobileNav && (
            <div style={{ position: "absolute", top: "calc(100% + 10px)", left: 0, right: 0, background: isLight ? "rgba(250,246,238,.98)" : "rgba(20,24,17,.97)", backdropFilter: "blur(22px)", border: "1px solid rgba(200,168,75,.22)", borderRadius: 16, padding: 10, display: "flex", flexDirection: "column", gap: 2, boxShadow: "0 24px 60px rgba(0,0,0,.35)", direction: isRTL ? "rtl" : "ltr" }}>
              {T.nav.map((label, i) => (
                <button key={label} onClick={() => { setShowMobileNav(false); navRefs[i].current?.scrollIntoView({ behavior: "smooth", block: "start" }); }} style={{ background: "transparent", border: "none", padding: "13px 16px", borderRadius: 11, fontSize: 14, color: ST.text, cursor: "pointer", fontWeight: 700, fontFamily: "'Inter',sans-serif", textAlign: isRTL ? "right" : "left" }}>{label}</button>
              ))}
            </div>
          )}
        </header>

        {view === "home" && (
          <>
            {/* HERO */}
            <section style={{ position: "relative", minHeight: "92vh", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {HERO_KEYS.map((k, i) => (
                <div key={k} style={{ position: "absolute", inset: 0, background: IMG_FALLBACK[k], backgroundImage: imgs[k] ? `url(${imgs[k]})` : undefined, backgroundSize: "cover", backgroundPosition: "center", opacity: heroIdx === i ? 1 : 0, transform: heroIdx === i ? "scale(1.05)" : "scale(1)", transition: "opacity 1.6s ease, transform 7s ease" }} />
              ))}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(8,10,6,.25) 0%,rgba(8,10,6,.55) 50%,rgba(16,19,14,.97) 100%)" }} />
              <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 820, padding: "110px 28px 60px", direction: isRTL ? "rtl" : "ltr" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(200,168,75,.12)", border: "1px solid rgba(200,168,75,.28)", borderRadius: 30, padding: "7px 20px", fontSize: 11, color: GOLD, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", marginBottom: 28 }}>🕋 {T.hero_badge}</div>
                <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(40px,7vw,76px)", fontWeight: 900, lineHeight: 1.07, marginBottom: 20, color: "#F8FAFC" }}>
                  {T.hero_h1[0]}<br /><span style={{ background: "linear-gradient(135deg,#D4A574,#F0C896)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{T.hero_h1[1]}</span><br />{T.hero_h1[2]}
                </h1>
                <p style={{ fontSize: "clamp(15px,2vw,18px)", color: ST.heroMuted, lineHeight: 1.7, marginBottom: 36, maxWidth: 580, margin: "0 auto 36px" }}>{T.hero_p}</p>
                <button onClick={() => plannerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })} style={{ background: "linear-gradient(135deg,#D4A574,#B8834A)", color: "white", border: "none", padding: "16px 38px", borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: "pointer", fontFamily: "'Inter',sans-serif", boxShadow: "0 8px 32px rgba(200,168,75,.4)", transition: "transform .2s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"} onMouseLeave={e => e.currentTarget.style.transform = "none"}>{T.hero_cta}</button>
              </div>
            </section>

            {/* PLANNER */}
            <div ref={plannerRef} style={{ position: "relative", zIndex: 50, padding: "0 24px", marginTop: -70 }}>
              <div style={{ maxWidth: 980, margin: "0 auto", background: isLight ? "rgba(255,255,255,.9)" : "rgba(22,26,18,.92)", backdropFilter: "blur(28px)", border: "1px solid rgba(200,168,75,.25)", borderRadius: 24, padding: "26px 28px", boxShadow: "0 24px 72px rgba(0,0,0,.5)", direction: isRTL ? "rtl" : "ltr" }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 900, marginBottom: 20, color: ST.text }}>🕋 {T.planner_title}</div>
                <div className="ho-planner-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 18 }}>
                  <div>
                    <div style={{ fontSize: 10, color: GOLD, textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 700, marginBottom: 8 }}>{T.lbl_type}</div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {["omra", "hajj"].map(p => (
                        <button key={p} onClick={() => setPtype(p)} style={{ flex: 1, padding: "11px 8px", borderRadius: 11, border: `1px solid ${ptype === p ? GOLD : "rgba(200,168,75,.18)"}`, background: ptype === p ? "rgba(200,168,75,.16)" : "transparent", color: ptype === p ? GOLD : ST.textMuted, fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>{T[p]}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: GOLD, textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 700, marginBottom: 8 }}>{T.lbl_depart}</div>
                    <input value={departCity} onChange={e => setDepartCity(e.target.value)} placeholder={T.depart_ph} />
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: GOLD, textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 700, marginBottom: 8 }}>{T.lbl_duration}</div>
                    {ptype === "omra" ? (
                      <select value={duration} onChange={e => setDuration(+e.target.value)}>
                        {[7, 10, 14, 21].map(d => <option key={d} value={d}>{T.days(d)}</option>)}
                      </select>
                    ) : (
                      <div style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid rgba(200,168,75,.18)", fontSize: 13, color: ST.textMuted }}>8 → 13 Dhul-Hijjah</div>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: GOLD, textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 700, marginBottom: 8 }}>{T.lbl_travelers}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 12, border: "1px solid rgba(200,168,75,.18)" }}>
                      <button onClick={() => setTravelers(n => Math.max(1, n - 1))} style={{ width: 26, height: 26, borderRadius: 8, border: "1px solid rgba(200,168,75,.3)", background: "transparent", color: GOLD, cursor: "pointer", fontSize: 14, fontWeight: 800 }}>−</button>
                      <span style={{ flex: 1, textAlign: "center", fontSize: 13, fontWeight: 700 }}>{T.travelers_fn(travelers)}</span>
                      <button onClick={() => setTravelers(n => Math.min(20, n + 1))} style={{ width: 26, height: 26, borderRadius: 8, border: "1px solid rgba(200,168,75,.3)", background: "transparent", color: GOLD, cursor: "pointer", fontSize: 14, fontWeight: 800 }}>+</button>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-end", flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 260px" }}>
                    <div style={{ fontSize: 10, color: GOLD, textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 700, marginBottom: 8 }}>{T.lbl_budget}</div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {Object.entries(BUDGETS).map(([key, val]) => (
                        <button key={key} onClick={() => setBudget(key)} title={tr(val.label)} style={{ flex: 1, padding: "10px 8px", borderRadius: 11, border: `1px solid ${budget === key ? val.color : "rgba(200,168,75,.18)"}`, background: budget === key ? `${val.color}22` : "transparent", color: budget === key ? val.color : ST.textMuted, fontSize: 17, cursor: "pointer" }}>{val.icon}</button>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => { setView("program"); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ background: "linear-gradient(135deg,#10B981,#059669)", color: "white", border: "none", padding: "14px 28px", borderRadius: 14, fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "'Inter',sans-serif", boxShadow: "0 6px 24px rgba(16,185,129,.35)", whiteSpace: "nowrap" }}>{T.generate_btn}</button>
                </div>
              </div>
            </div>

            {/* RITES */}
            <section ref={ritesRef} style={{ padding: "90px 24px 60px", maxWidth: 1100, margin: "0 auto" }}>
              {sectionTitle("Hajj & Omra", T.rites_title, T.rites_sub)}
              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 34 }}>
                {["omra", "hajj"].map(p => (
                  <button key={p} onClick={() => setPtype(p)} style={{ padding: "11px 32px", borderRadius: 24, border: `1px solid ${ptype === p ? GOLD : "rgba(200,168,75,.2)"}`, background: ptype === p ? "rgba(200,168,75,.15)" : "transparent", color: ptype === p ? GOLD : ST.textMuted, fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>{T[p]}</button>
                ))}
              </div>
              <div style={{ display: "grid", gap: 14, direction: isRTL ? "rtl" : "ltr" }}>
                {RITES[ptype].map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 18, background: ST.cardBg, border: `1px solid ${ST.cardBorder}`, borderRadius: 18, padding: "20px 22px", alignItems: "flex-start" }}>
                    <div style={{ flexShrink: 0, width: 46, height: 46, borderRadius: 14, background: "rgba(200,168,75,.12)", border: "1px solid rgba(200,168,75,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 21 }}>{r.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap", marginBottom: 7 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: GREEN, background: "rgba(52,211,153,.1)", border: "1px solid rgba(52,211,153,.2)", borderRadius: 8, padding: "2px 9px" }}>{i + 1}</span>
                        <h3 style={{ fontSize: 16, fontWeight: 800, color: ST.text }}>{tr(r.name)}</h3>
                        <span className="arabic" style={{ fontSize: 17, color: GOLD }}>{r.arName}</span>
                      </div>
                      <p style={{ fontSize: 14, color: ST.textMuted, lineHeight: 1.7 }}>{tr(r.desc)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* MIQATS */}
              <div style={{ marginTop: 54 }}>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 800, color: ST.text, marginBottom: 20, textAlign: "center" }}>📍 {T.miqat_title}</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12, direction: isRTL ? "rtl" : "ltr" }}>
                  {MIQATS.map(m => (
                    <div key={m.name} style={{ background: ST.cardBg, border: `1px solid ${ST.cardBorder}`, borderRadius: 16, padding: "16px 18px" }}>
                      <div style={{ fontWeight: 800, fontSize: 14, color: ST.text, marginBottom: 3 }}>{m.name}</div>
                      <div className="arabic" style={{ fontSize: 16, color: GOLD, marginBottom: 8 }}>{m.ar}</div>
                      <div style={{ fontSize: 12, color: ST.textMuted, lineHeight: 1.6 }}>{tr(m.from)}</div>
                      <div style={{ fontSize: 11, color: GREEN, fontWeight: 700, marginTop: 6 }}>{m.dist} → Makkah</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* HOTELS */}
            <section ref={hotelsRef} style={{ padding: "70px 24px", background: isLight ? "rgba(73,54,31,.04)" : "rgba(255,247,234,.02)" }}>
              <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                {sectionTitle("Hébergement", T.hotels_title, T.hotels_sub)}
                <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 34 }}>
                  {["makkah", "madinah"].map(c => (
                    <button key={c} onClick={() => setHotelCity(c)} style={{ padding: "11px 32px", borderRadius: 24, border: `1px solid ${hotelCity === c ? GOLD : "rgba(200,168,75,.2)"}`, background: hotelCity === c ? "rgba(200,168,75,.15)" : "transparent", color: hotelCity === c ? GOLD : ST.textMuted, fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>{c === "makkah" ? "🕋" : "🕌"} {T[c]}</button>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 18, direction: isRTL ? "rtl" : "ltr" }}>
                  {Object.entries(BUDGETS).map(([tier, b]) => (
                    <div key={tier} style={{ background: ST.cardBg, border: `1px solid ${ST.cardBorder}`, borderRadius: 20, padding: 20 }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 7, borderRadius: 999, padding: "6px 14px", background: `${b.color}1A`, color: b.color, border: `1px solid ${b.color}44`, fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 16 }}>{b.icon} {tr(b.label)}</div>
                      {HOTELS[hotelCity][tier].map(h => (
                        <div key={h.name} style={{ padding: "13px 0", borderBottom: `1px solid ${ST.divider}` }}>
                          <div style={{ fontWeight: 800, fontSize: 14, color: ST.text, marginBottom: 4 }}>{h.name}</div>
                          <div style={{ fontSize: 12, color: ST.textMuted, display: "flex", gap: 10, flexWrap: "wrap" }}>
                            <span style={{ color: GOLD }}>{"★".repeat(h.stars)}</span>
                            <span>📍 {h.dist} {T.dist_haram}</span>
                            <span style={{ color: GREEN, fontWeight: 700 }}>{h.price}{T.per_night}</span>
                          </div>
                          <a href={BOOK.hotel(`${h.name} ${hotelCity === "makkah" ? "Makkah" : "Madinah"}`)} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 8, fontSize: 12, fontWeight: 700, color: "#0EA5E9", textDecoration: "none" }}>{T.book_btn} →</a>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* CHECKLIST */}
            <section ref={checkRef} style={{ padding: "70px 24px", maxWidth: 1100, margin: "0 auto" }}>
              {sectionTitle("Préparation", T.checklist_title, T.checklist_sub)}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18, direction: isRTL ? "rtl" : "ltr" }}>
                {CHECKLIST.map((cat, ci) => (
                  <div key={ci} style={{ background: ST.cardBg, border: `1px solid ${ST.cardBorder}`, borderRadius: 20, padding: 20 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: ST.text, marginBottom: 14, display: "flex", alignItems: "center", gap: 9 }}>{cat.icon} {tr(cat.cat)}</div>
                    {cat.items.map((item, ii) => {
                      const key = `${ci}-${ii}`;
                      return (
                        <label key={key} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 0", cursor: "pointer", fontSize: 13, color: checked[key] ? ST.textMuted : ST.text, textDecoration: checked[key] ? "line-through" : "none", lineHeight: 1.5 }}>
                          <input type="checkbox" checked={!!checked[key]} onChange={() => setChecked(c => ({ ...c, [key]: !c[key] }))} style={{ width: 17, height: 17, accentColor: GREEN, flexShrink: 0, marginTop: 1 }} />
                          {tr(item)}
                        </label>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div style={{ textAlign: "center", marginTop: 22 }}>
                <button onClick={() => setChecked({})} style={{ background: "transparent", border: "1px solid rgba(200,168,75,.25)", color: ST.textMuted, padding: "9px 22px", borderRadius: 12, fontSize: 13, cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>↺ {T.checklist_reset}</button>
              </div>
            </section>

            {/* DUAS */}
            <section ref={duasRef} style={{ padding: "70px 24px", background: isLight ? "rgba(73,54,31,.04)" : "rgba(255,247,234,.02)" }}>
              <div style={{ maxWidth: 900, margin: "0 auto" }}>
                {sectionTitle("Adhkar", T.duas_title, T.duas_sub)}
                <div style={{ display: "grid", gap: 16 }}>
                  {DUAS.map((d, i) => (
                    <div key={i} style={{ background: ST.cardBg, border: `1px solid ${ST.cardBorder}`, borderRadius: 20, padding: "22px 26px" }}>
                      <div style={{ fontSize: 12, color: GOLD, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: 14, direction: isRTL ? "rtl" : "ltr" }}>📿 {tr(d.title)}</div>
                      <div className="arabic" dir="rtl" style={{ fontSize: 24, lineHeight: 2, color: ST.text, marginBottom: 12, textAlign: "center" }}>{d.arabic}</div>
                      <div style={{ fontSize: 13, color: GREEN, fontStyle: "italic", marginBottom: 8, textAlign: "center" }}>{d.translit}</div>
                      {lang !== "ar" && <div style={{ fontSize: 13.5, color: ST.textMuted, lineHeight: 1.7, textAlign: "center" }}>{d.trans[lang] || d.trans.fr}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section ref={faqRef} style={{ padding: "70px 24px", maxWidth: 860, margin: "0 auto" }}>
              {sectionTitle("FAQ", T.faq_title)}
              <div style={{ display: "grid", gap: 12, direction: isRTL ? "rtl" : "ltr" }}>
                {FAQ.map((f, i) => (
                  <div key={i} style={{ background: ST.cardBg, border: `1px solid ${openFaq === i ? "rgba(200,168,75,.35)" : ST.cardBorder}`, borderRadius: 16, overflow: "hidden" }}>
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, padding: "17px 22px", background: "transparent", border: "none", cursor: "pointer", fontFamily: "'Inter',sans-serif", textAlign: isRTL ? "right" : "left" }}>
                      <span style={{ fontSize: 14.5, fontWeight: 700, color: ST.text }}>{tr(f.q)}</span>
                      <span style={{ color: GOLD, fontSize: 18, flexShrink: 0 }}>{openFaq === i ? "−" : "+"}</span>
                    </button>
                    {openFaq === i && <div style={{ padding: "0 22px 18px", fontSize: 14, color: ST.textMuted, lineHeight: 1.75 }}>{tr(f.a)}</div>}
                  </div>
                ))}
              </div>
            </section>

            {/* VISA */}
            <section ref={visaRef} style={{ padding: "70px 24px", maxWidth: 1000, margin: "0 auto" }}>
              {sectionTitle("Visa & Prérequis", T.visa_title, T.visa_sub)}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 32, direction: isRTL ? "rtl" : "ltr" }}>
                {Object.entries(VISA_COUNTRIES).map(([key, c]) => (
                  <button key={key} onClick={() => setVisaCountry(key)} style={{ padding: "9px 16px", borderRadius: 24, border: `1px solid ${visaCountry === key ? GOLD : "rgba(200,168,75,.2)"}`, background: visaCountry === key ? "rgba(200,168,75,.15)" : "transparent", color: visaCountry === key ? GOLD : ST.textMuted, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>
                    {VISA_COUNTRIES[key].flag} {tr(VISA_COUNTRIES[key].name)}
                  </button>
                ))}
              </div>
              {(() => {
                const c = VISA_COUNTRIES[visaCountry];
                return (
                  <div className="ho-contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, direction: isRTL ? "rtl" : "ltr" }}>
                    <div style={{ background: ST.cardBg, border: `1px solid ${ST.cardBorder}`, borderRadius: 20, padding: 22 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: GREEN, marginBottom: 14 }}>🕋 {T.omra} — {T.visa_omra_title}</div>
                      <div style={{ fontSize: 12, color: GOLD, fontWeight: 700, marginBottom: 14, background: "rgba(200,168,75,.08)", borderRadius: 8, padding: "6px 10px", display: "inline-block" }}>💰 {T.visa_cost} : {c.omra.cost}</div>
                      <ul style={{ listStyle: "none", display: "grid", gap: 10 }}>
                        {tr(c.omra.steps).map((step, i) => (
                          <li key={i} style={{ fontSize: 13, color: ST.textMuted, lineHeight: 1.6, paddingInlineStart: 22, position: "relative" }}>
                            <span style={{ position: "absolute", insetInlineStart: 0, color: GREEN, fontWeight: 800 }}>{i + 1}.</span>{step}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div style={{ background: ST.cardBg, border: `1px solid ${ST.cardBorder}`, borderRadius: 20, padding: 22 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: GOLD, marginBottom: 14 }}>🏔 {T.hajj} — {T.visa_hajj_title}</div>
                      <div style={{ fontSize: 12, color: ST.textMuted, marginBottom: 6, lineHeight: 1.6 }}>🏛 {tr(c.hajj.body)}</div>
                      <div style={{ fontSize: 12, color: GOLD, fontWeight: 700, marginBottom: 14, background: "rgba(200,168,75,.08)", borderRadius: 8, padding: "6px 10px", display: "inline-block" }}>📊 {T.visa_quota} : {c.hajj.quota}</div>
                      <ul style={{ listStyle: "none", display: "grid", gap: 10 }}>
                        {tr(c.hajj.steps).map((step, i) => (
                          <li key={i} style={{ fontSize: 13, color: ST.textMuted, lineHeight: 1.6, paddingInlineStart: 22, position: "relative" }}>
                            <span style={{ position: "absolute", insetInlineStart: 0, color: GOLD, fontWeight: 800 }}>{i + 1}.</span>{step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })()}
              <div style={{ marginTop: 20, padding: "14px 18px", background: "rgba(200,168,75,.07)", border: "1px solid rgba(200,168,75,.18)", borderRadius: 14, fontSize: 12, color: ST.textMuted, lineHeight: 1.7, direction: isRTL ? "rtl" : "ltr" }}>
                ℹ️ {T.visa_note}
              </div>
            </section>

            {/* CONTACT */}
            <section ref={contactRef} style={{ background: isLight ? "rgba(73,54,31,.04)" : "rgba(255,247,234,.02)", padding: "80px 24px" }}>
              <div className="ho-contact-grid" style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(260px,.8fr) minmax(320px,1.2fr)", gap: 34, alignItems: "start", direction: isRTL ? "rtl" : "ltr" }}>
                <div>
                  <div style={{ fontSize: 12, color: GOLD, textTransform: "uppercase", letterSpacing: "2px", fontWeight: 800, marginBottom: 14 }}>✦ {T.contact_badge}</div>
                  <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,3.6vw,40px)", lineHeight: 1.1, fontWeight: 900, color: ST.text, marginBottom: 16 }}>{T.contact_title}</h2>
                  <p style={{ fontSize: 15, color: ST.textMuted, lineHeight: 1.8 }}>{T.contact_desc}</p>
                </div>
                <form action="https://formsubmit.co/mouad.ouhaddou@gmail.com" method="POST" style={{ background: ST.cardBg, border: `1px solid ${ST.cardBorder}`, borderRadius: 22, padding: 24, display: "grid", gap: 14 }}>
                  <input type="hidden" name="_subject" value="Nouveau message depuis manasik.info" />
                  <input type="hidden" name="_template" value="table" />
                  <input type="hidden" name="_captcha" value="false" />
                  <input type="text" name="_honey" style={{ display: "none" }} tabIndex="-1" autoComplete="off" />
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 12 }}>
                    <label style={{ display: "grid", gap: 7, fontSize: 12, color: ST.textMuted, fontWeight: 700 }}>{T.contact_name}<input required name="nom" placeholder={T.contact_name_ph} /></label>
                    <label style={{ display: "grid", gap: 7, fontSize: 12, color: ST.textMuted, fontWeight: 700 }}>{T.contact_email}<input required type="email" name="email" placeholder="votre@email.com" /></label>
                  </div>
                  <label style={{ display: "grid", gap: 7, fontSize: 12, color: ST.textMuted, fontWeight: 700 }}>{T.contact_subject}<input required name="sujet" placeholder={T.contact_subject_ph} /></label>
                  <label style={{ display: "grid", gap: 7, fontSize: 12, color: ST.textMuted, fontWeight: 700 }}>{T.contact_message}<textarea required name="message" rows="6" placeholder={T.contact_message_ph} style={{ resize: "vertical", minHeight: 130 }} /></label>
                  <button type="submit" style={{ background: "linear-gradient(135deg,#D4A574,#B8834A)", color: "white", border: "none", padding: "14px 22px", borderRadius: 14, fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'Inter',sans-serif", justifySelf: "start", boxShadow: "0 8px 26px rgba(200,168,75,.28)" }}>{T.contact_submit}</button>
                </form>
              </div>
            </section>
          </>
        )}

        {/* PROGRAM VIEW */}
        {view === "program" && (
          <section style={{ padding: "110px 24px 80px", maxWidth: 880, margin: "0 auto", direction: isRTL ? "rtl" : "ltr" }} className="fade-in">
            <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 26 }}>
              <button onClick={() => setView("home")} style={{ background: "transparent", border: "1px solid rgba(200,168,75,.25)", color: ST.textMuted, padding: "9px 18px", borderRadius: 11, fontSize: 13, cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>{T.back_home}</button>
              <button onClick={() => window.print()} style={{ background: "linear-gradient(135deg,#D4A574,#B8834A)", color: "white", border: "none", padding: "10px 22px", borderRadius: 11, fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>{T.print_btn}</button>
            </div>

            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,4.5vw,44px)", fontWeight: 900, color: ST.text, marginBottom: 8 }}>
              {T.program_title} — {T[ptype]} 🕋
            </h1>
            <div style={{ fontSize: 14, color: ST.textMuted, marginBottom: 28 }}>
              {departCity && <>🛫 {departCity} · </>}{ptype === "omra" ? T.days(duration) : "8-13 Dhul-Hijjah"} · {T.travelers_fn(travelers)} · {BUDGETS[budget].icon} {tr(BUDGETS[budget].label)}
            </div>

            {/* Budget estimate */}
            <div style={{ background: `${BUDGETS[budget].color}11`, border: `1px solid ${BUDGETS[budget].color}33`, borderRadius: 18, padding: "18px 22px", marginBottom: 30 }}>
              <div style={{ fontSize: 11, color: BUDGETS[budget].color, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: 6 }}>{BUDGETS[budget].icon} {T.budget_est}</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: ST.text, marginBottom: 6 }} dir="ltr">{BUDGETS[budget][ptype]}</div>
              <div style={{ fontSize: 12, color: ST.textMuted, lineHeight: 1.6 }}>{T.budget_note}</div>
            </div>

            {/* Timeline */}
            <div style={{ display: "grid", gap: 14, marginBottom: 40 }}>
              {program.map((p, i) => (
                <div key={i} style={{ display: "flex", gap: 16, background: ST.cardBg, border: `1px solid ${ST.cardBorder}`, borderRadius: 18, padding: "18px 20px" }}>
                  <div style={{ flexShrink: 0, textAlign: "center" }}>
                    <div style={{ width: 46, height: 46, borderRadius: 14, background: "rgba(200,168,75,.12)", border: "1px solid rgba(200,168,75,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{p.icon}</div>
                    <div style={{ fontSize: 10, color: GOLD, fontWeight: 800, marginTop: 6, textTransform: "uppercase" }}>{typeof p.d === "number" ? `${T.day} ${p.d}` : p.d}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: ST.text, marginBottom: 8 }}>{p.title}</h3>
                    <ul style={{ listStyle: "none", display: "grid", gap: 5 }}>
                      {p.items.map((it, j) => <li key={j} style={{ fontSize: 13.5, color: ST.textMuted, lineHeight: 1.6, paddingInlineStart: 18, position: "relative" }}><span style={{ position: "absolute", insetInlineStart: 0, color: GREEN }}>✓</span>{it}</li>)}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Hotels reco */}
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 800, color: ST.text, marginBottom: 18 }}>🏨 {T.hotels_reco} — {tr(BUDGETS[budget].label)}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16, marginBottom: 36 }}>
              {["makkah", "madinah"].map(city => (
                <div key={city} style={{ background: ST.cardBg, border: `1px solid ${ST.cardBorder}`, borderRadius: 18, padding: 18 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: GOLD, marginBottom: 12 }}>{city === "makkah" ? "🕋" : "🕌"} {T[city]}</div>
                  {HOTELS[city][budget].map(h => (
                    <div key={h.name} style={{ padding: "10px 0", borderBottom: `1px solid ${ST.divider}` }}>
                      <div style={{ fontWeight: 700, fontSize: 13.5, color: ST.text }}>{h.name} <span style={{ color: GOLD, fontSize: 11 }}>{"★".repeat(h.stars)}</span></div>
                      <div style={{ fontSize: 12, color: ST.textMuted, marginTop: 3 }}>📍 {h.dist} {T.dist_haram} · <span style={{ color: GREEN, fontWeight: 700 }}>{h.price}{T.per_night}</span></div>
                      <a className="no-print" href={BOOK.hotel(`${h.name} ${city === "makkah" ? "Makkah" : "Madinah"}`)} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 700, color: "#0EA5E9", textDecoration: "none" }}>{T.book_btn} →</a>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Flight links */}
            {departCity && (
              <div className="no-print" style={{ background: "rgba(14,165,233,.07)", border: "1px solid rgba(14,165,233,.18)", borderRadius: 16, padding: "16px 20px", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: ST.text }}>✈️ {departCity} → Jeddah / Madinah :</span>
                <a href={BOOK.flights(departCity, "Jeddah")} target="_blank" rel="noopener noreferrer" style={{ padding: "8px 16px", borderRadius: 20, background: "#0EA5E9", color: "white", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>Google Flights</a>
                <a href={`https://www.skyscanner.fr/transport/vols/${encodeURIComponent(departCity)}/jed/`} target="_blank" rel="noopener noreferrer" style={{ padding: "8px 16px", borderRadius: 20, background: "#00A3BE", color: "white", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>Skyscanner</a>
              </div>
            )}
          </section>
        )}

        {/* FOOTER */}
        <footer className="no-print" style={{ background: ST.footerBg, borderTop: `1px solid ${ST.divider}`, padding: "60px 24px 28px", direction: isRTL ? "rtl" : "ltr" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div className="ho-footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.4fr", gap: 40, marginBottom: 40 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <img src={`${PUB}logo-kaaba.svg`} alt="manasik.info" style={{ width: 30, height: 30, borderRadius: 10 }} />
                  <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 900, color: ST.text }}>manasik<span style={{ color: GOLD }}>.info</span></span>
                </div>
                <p style={{ fontSize: 13, color: ST.textMuted, lineHeight: 1.8, maxWidth: 380 }}>{T.footer_desc}</p>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: ST.text, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 14 }}>{T.footer_links}</div>
                {T.nav.map((label, i) => (
                  <button key={label} onClick={() => { setView("home"); setTimeout(() => navRefs[i].current?.scrollIntoView({ behavior: "smooth" }), 80); }} style={{ display: "block", background: "transparent", border: "none", padding: "5px 0", fontSize: 13, color: ST.textMuted, cursor: "pointer", fontFamily: "'Inter',sans-serif", textAlign: isRTL ? "right" : "left" }}>{label}</button>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: ST.text, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 14 }}>{T.footer_resources}</div>
                <a href="https://www.nusuk.sa/" target="_blank" rel="noopener noreferrer" style={{ display: "block", padding: "5px 0", fontSize: 13, color: ST.textMuted, textDecoration: "none" }}>Nusuk (officiel) ↗</a>
                <a href="https://visa.mofa.gov.sa/" target="_blank" rel="noopener noreferrer" style={{ display: "block", padding: "5px 0", fontSize: 13, color: ST.textMuted, textDecoration: "none" }}>Visa Arabie Saoudite ↗</a>
                <a href="https://sar.hhr.sa/" target="_blank" rel="noopener noreferrer" style={{ display: "block", padding: "5px 0", fontSize: 13, color: ST.textMuted, textDecoration: "none" }}>Train Haramain ↗</a>
                <p style={{ fontSize: 11.5, color: ST.textMuted, lineHeight: 1.7, marginTop: 14, opacity: .8 }}>{T.disclaimer}</p>
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${ST.divider}`, paddingTop: 22, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, fontSize: 12, color: ST.textMuted }}>
              <span>© {new Date().getFullYear()} manasik.info</span>
              <span className="arabic" style={{ fontSize: 14 }}>تقبل الله منا ومنكم</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
