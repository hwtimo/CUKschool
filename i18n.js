/**
 * CUK School — Internationalization System
 *
 * Usage in HTML:
 *   data-i18n="key"           → sets textContent
 *   data-i18n-html="key"      → sets innerHTML
 *   data-i18n-ph="key"        → sets placeholder
 *   data-i18n-aria="key"      → sets aria-label
 *   data-i18n-title="key"     → sets document title (on <title>)
 *   class="i18n-ko"           → visible only when lang=ko
 *   class="i18n-en"           → visible only when lang=en
 *
 * API:
 *   i18n.setLang('ko' | 'en')
 *   i18n.getLang() → 'ko' | 'en'
 *   i18n.t('key') → translated string
 */

const i18n = (() => {
  const dict = {
    // ── Navigation ──────────────────────────────────
    "nav.home":           { ko: "홈",            en: "Home" },
    "nav.about":          { ko: "학교안내",       en: "About" },
    "nav.about.intro":    { ko: "학교 소개",      en: "Introduction" },
    "nav.about.teachers": { ko: "선생님들",       en: "Teachers" },
    "nav.about.schedule": { ko: "학사 일정",      en: "Schedule" },
    "nav.about.gallery":  { ko: "갤러리",         en: "Gallery" },
    "nav.classes":        { ko: "학급안내",       en: "Classes" },
    "nav.classes.danbi":  { ko: "단비반 (유치)",   en: "Danbi (K)" },
    "nav.classes.hanbyul":{ ko: "한별반 (초급)",   en: "Hanbyul (Beg.)" },
    "nav.classes.gaon":   { ko: "가온반 (청소년)", en: "Gaon (Youth)" },
    "nav.classes.goeup":  { ko: "고급반 (고등)",   en: "Goeup (Adv.)" },
    "nav.register":       { ko: "등록",           en: "Register" },
    "nav.notices":        { ko: "공지사항",        en: "Notices" },
    "nav.contact":        { ko: "연락처",          en: "Contact" },

    // ── Hero ────────────────────────────────────────
    "hero.subtitle":      { ko: "랭리 캠퍼스", en: "Langley Campus" },
    "hero.tagline":       { ko: "\"한국의 말, 문화, 역사와 함께 가자!!\"", en: "\"Preserving Korean Language, Culture & History Together\"" },
    "hero.desc":          { ko: "기독교 정신을 바탕으로 한인 자녀들의 한국어·문화 교육", en: "Korean language & culture education grounded in Christian values" },
    "hero.cta.register":  { ko: "등록 안내",  en: "Register" },
    "hero.cta.contact":   { ko: "문의하기",   en: "Contact Us" },

    // ── Home — Intro ────────────────────────────────
    "home.intro.title":   { ko: "학교 소개",      en: "About Our School" },
    "home.intro.sub":     { ko: "교육목표 및 비전", en: "Mission & Vision" },
    "home.mission":       { ko: "기독교 신앙 안에서 한국어와 문화, 정체성을 함께 배우는 공동체입니다.", en: "A faith-rooted community where Korean language, culture, and identity grow together." },
    "home.info.time.label":    { ko: "수업 시간", en: "Class Time" },
    "home.info.time.val":      { ko: "매주 토요일 오전 9:30 – 12:00", en: "Every Saturday 9:30 AM – 12:00 PM" },
    "home.info.loc.label":     { ko: "위치",     en: "Location" },
    "home.info.contact.label": { ko: "문의",     en: "Contact" },

    // ── Home — Notices ──────────────────────────────
    "home.notices.title":      { ko: "공지사항",               en: "Notices" },
    "home.notices.sub":        { ko: "학교 소식",               en: "School News" },
    "home.notices.empty":      { ko: "공지사항이 곧 업데이트됩니다.", en: "Notices will be updated soon." },
    "home.notices.viewall":    { ko: "공지사항 전체 보기",        en: "View All Notices" },

    // ── Programs ────────────────────────────────────
    "programs.title":          { ko: "교육 프로그램",           en: "Programs" },
    "programs.sub":            { ko: "체계적 커리큘럼과 즐거운 배움", en: "Structured Curriculum & Joyful Learning" },
    "programs.time":           { ko: "매주 토요일 오전 9:30 – 12:00", en: "Every Saturday 9:30 AM – 12:00 PM" },
    "programs.features.title": { ko: "프로그램 특징",           en: "Program Features" },
    "programs.feat.curriculum":     { ko: "통합 커리큘럼",      en: "Integrated Curriculum" },
    "programs.feat.curriculum.desc":{ ko: "듣기 · 말하기 · 읽기 · 쓰기 균형 학습", en: "Balanced listening, speaking, reading & writing" },
    "programs.feat.parents":        { ko: "학부모 소통",        en: "Parent Communication" },
    "programs.feat.parents.desc":   { ko: "월간 뉴스레터 및 오픈 클래스", en: "Monthly newsletters & open classes" },
    "programs.feat.assess":         { ko: "평가 및 피드백",      en: "Assessment & Feedback" },
    "programs.feat.assess.desc":    { ko: "분기별 학습 리포트 발송", en: "Quarterly learning reports" },
    "programs.detail":         { ko: "자세히 보기", en: "Learn More" },

    // ── Class cards ─────────────────────────────────
    "class.danbi.name":      { ko: "단비반",  en: "Danbi" },
    "class.danbi.level":     { ko: "유치",    en: "Kindergarten" },
    "class.danbi.age":       { ko: "4 – 6세", en: "Ages 4–6" },
    "class.danbi.goal":      { ko: "놀이 중심 한국어 습득, 흥미 유발", en: "Play-based Korean acquisition & interest building" },
    "class.danbi.cur1":      { ko: "오감 발달: 미술·동요·율동을 통한 자연스러운 한국어 노출", en: "Sensory development: natural Korean exposure through art, songs & movement" },
    "class.danbi.cur2":      { ko: "기초 어휘 습득 및 인사 예절 배우기", en: "Basic vocabulary & learning greetings and manners" },

    "class.hanbyul.name":    { ko: "한별반",  en: "Hanbyul" },
    "class.hanbyul.level":   { ko: "초급",    en: "Beginner" },
    "class.hanbyul.age":     { ko: "7 – 10세", en: "Ages 7–10" },
    "class.hanbyul.goal":    { ko: "한글 자모음 기초 다지기, 읽기/쓰기 완성", en: "Hangul foundations & reading/writing mastery" },
    "class.hanbyul.cur1":    { ko: "한글 기초: 자모음 원리 이해, 기초 낱말 읽기/쓰기", en: "Hangul basics: consonants & vowels, reading & writing words" },
    "class.hanbyul.cur2":    { ko: "일상 생활 회화 및 기초 동화 읽기", en: "Daily conversation & basic story reading" },

    "class.gaon.name":       { ko: "가온반",  en: "Gaon" },
    "class.gaon.level":      { ko: "청소년",  en: "Youth" },
    "class.gaon.age":        { ko: "11 – 15세", en: "Ages 11–15" },
    "class.gaon.goal":       { ko: "이중언어(한·영) 활용 강화, 정체성 확립", en: "Bilingual skills & Korean-Canadian identity" },
    "class.gaon.cur1":       { ko: "한국사와 나의 역사 연결하기", en: "Connecting Korean history with personal history" },
    "class.gaon.cur2":       { ko: "이중언어 토론 및 프로젝트", en: "Bilingual discussions & projects" },

    "class.goeup.name":      { ko: "고급반",  en: "Goeup" },
    "class.goeup.level":     { ko: "고급",    en: "Advanced" },
    "class.goeup.age":       { ko: "16 – 18세", en: "Ages 16–18" },
    "class.goeup.goal":      { ko: "한국어 능력시험 대비 및 심화 학습", en: "TOPIK prep & advanced Korean" },
    "class.goeup.cur1":      { ko: "한국 문학·역사·시사 주제 탐구", en: "Korean literature, history & current affairs" },
    "class.goeup.cur2":      { ko: "심화 에세이 및 발표·토론 프로젝트", en: "Advanced essays, presentations & debates" },

    "class.goals":           { ko: "학습 목표", en: "Learning Goals" },
    "class.curriculum":      { ko: "주요 커리큘럼", en: "Curriculum" },

    // ── Teachers ────────────────────────────────────
    "teachers.title":        { ko: "선생님들",              en: "Teachers" },
    "teachers.sub":          { ko: "전문성과 사랑을 겸비한 교사진", en: "Dedicated Teaching Staff" },
    "teachers.intro":        { ko: "최고의 교사진이 아이들의 꿈과 성장을 함께합니다.", en: "Our teachers combine expertise and care to support every child." },
    "teachers.staff":        { ko: "교사진 구성",            en: "Teaching Staff" },
    "teachers.exec":         { ko: "이사진",                 en: "Board" },
    "teachers.exec.desc":    { ko: "학부모 이사",             en: "Parent Executives" },
    "teachers.teacher":      { ko: "교사",                   en: "Teachers" },
    "teachers.teacher.desc": { ko: "자격증 보유 교사진",      en: "Certified Teachers" },
    "teachers.ta":           { ko: "보조교사",                en: "Assistants" },
    "teachers.ta.desc":      { ko: "학생 봉사자",             en: "Student Volunteers" },

    // ── Schedule ────────────────────────────────────
    "schedule.title":        { ko: "학사 일정",      en: "Schedule" },
    "schedule.sub":          { ko: "2026 연간 일정",   en: "2026 Academic Calendar" },
    "schedule.regular":      { ko: "기본 수업 시간",   en: "Regular Class Time" },
    "schedule.day":          { ko: "매주 토요일",      en: "Every Saturday" },
    "schedule.time.desc":    { ko: "오전 9시 30분 – 정오", en: "9:30 AM – 12:00 PM" },
    "schedule.calendar":     { ko: "연간 일정표",      en: "Annual Calendar" },
    "schedule.coming":       { ko: "상세 일정은 곧 업데이트될 예정입니다.", en: "Detailed schedule will be updated soon." },
    "schedule.cta":          { ko: "일정 문의는 언제든 연락 주세요.", en: "Contact us anytime for schedule questions." },

    // ── Registration ────────────────────────────────
    "reg.title":             { ko: "등록 안내",      en: "Registration" },
    "reg.sub":               { ko: "온라인 등록 및 수업료 안내", en: "Online Enrollment & Tuition" },
    "reg.step1":             { ko: "온라인 신청",    en: "Apply Online" },
    "reg.step1.desc":        { ko: "구글 폼으로 등록 신청서를 제출해 주세요.", en: "Submit your application via Google Forms." },
    "reg.step2":             { ko: "등록 확인",      en: "Confirmation" },
    "reg.step2.desc":        { ko: "제출 후 확인 연락을 드립니다.", en: "We will contact you to confirm." },
    "reg.step3":             { ko: "등록금 납부",    en: "Payment" },
    "reg.step3.desc":        { ko: "확인 후 등록금을 납부해 주세요.", en: "Complete payment after confirmation." },
    "reg.eligibility":       { ko: "모집 대상",      en: "Eligibility" },
    "reg.tuition":           { ko: "등록금 안내",    en: "Tuition" },
    "reg.tbl.class":         { ko: "반",             en: "Class" },
    "reg.tbl.age":           { ko: "대상 연령",      en: "Age" },
    "reg.tbl.desc":          { ko: "설명",           en: "Description" },
    "reg.tbl.item":          { ko: "항목",           en: "Item" },
    "reg.tbl.amount":        { ko: "금액",           en: "Amount" },
    "reg.tbl.notes":         { ko: "비고",           en: "Notes" },
    "reg.tuition.fee":       { ko: "수업료",         en: "Tuition" },
    "reg.tuition.reg":       { ko: "입학금",         en: "Reg. Fee" },
    "reg.tba":               { ko: "추후 공지",      en: "TBA" },
    "reg.tuition.note1":     { ko: "1년 기준 (30주)", en: "Per year (30 weeks)" },
    "reg.tuition.note2":     { ko: "신입생 1회",     en: "New students, once" },
    "reg.discount":          { ko: "2자녀 이상 등록 시 할인이 적용될 수 있습니다.", en: "Discounts may apply for 2+ children." },
    "reg.cta.title":         { ko: "온라인 등록 신청", en: "Apply Online" },
    "reg.cta.desc":          { ko: "구글 폼에서 등록 신청서를 작성해 주세요.", en: "Fill out the registration form on Google Forms." },
    "reg.cta.btn":           { ko: "등록 신청서 작성하기", en: "Open Registration Form" },
    "reg.cta.fallback":      { ko: "폼이 열리지 않으면 전화 주세요: 778-325-1120", en: "If the form doesn't load, call us: 778-325-1120" },
    "reg.intro":             { ko: "CUK School에 관심을 가져주셔서 감사합니다. 아래 등록 안내를 확인해주시고, 궁금한 점이 있으시면 언제든지 문의해 주세요.", en: "We are glad to welcome new students and families to CUK School. Please review the registration information below and contact us if you have any questions." },
    "reg.how.title":         { ko: "등록 절차",      en: "How to Register" },
    "reg.how.1":             { ko: "학급 안내를 확인합니다",  en: "Review class information" },
    "reg.how.2":             { ko: "등록 신청서를 작성합니다", en: "Complete the registration form" },
    "reg.how.3":             { ko: "확인 및 후속 안내를 기다립니다", en: "Wait for confirmation and follow-up guidance" },
    "reg.how.4":             { ko: "반 배정 또는 일정 확인 후 등록을 마무리합니다", en: "Finalize enrollment after placement or schedule confirmation" },
    "reg.notes.title":       { ko: "참고 사항",      en: "Important Notes" },
    "reg.note.1":            { ko: "반 배정은 연령과 한국어 수준에 따라 달라질 수 있습니다.", en: "Class placement may vary depending on age and language level." },
    "reg.note.2":            { ko: "일부 수업 정보는 학기 시작 전에 조정될 수 있습니다.", en: "Some class details may be updated before the term begins." },
    "reg.note.3":            { ko: "최종 확인 및 안내 사항은 개별적으로 전달됩니다.", en: "Families will be contacted with final confirmation and next steps." },
    "reg.tuition.text":      { ko: "등록금 안내는 추후 공지됩니다.", en: "Tuition details will be announced soon." },
    "reg.questions.title":   { ko: "등록 관련 문의", en: "Registration Questions" },
    "reg.questions":         { ko: "등록, 반 배정, 수업 일정과 관련한 문의는 연락처를 통해 문의해 주세요.", en: "If you have questions about registration, class placement, or schedule, please contact us." },

    // ── Notices ─────────────────────────────────────
    "notices.title":         { ko: "공지사항",             en: "Notices" },
    "notices.sub":           { ko: "학교 소식과 안내",      en: "News & Announcements" },
    "notices.empty":         { ko: "현재 공지사항이 없습니다.", en: "No announcements at this time." },
    "notices.empty.sub":     { ko: "공지사항이 있을 때 이곳에 업데이트됩니다.", en: "Updates will appear here when available." },
    "notices.intro":         { ko: "학교의 중요한 소식과 공지사항은 이 페이지에서 확인하실 수 있습니다.", en: "Please check this page for important school updates and announcements." },
    "notices.empty.msg":     { ko: "새 공지사항은 이곳에 안내됩니다.", en: "New notices will be posted here." },
    "notices.modal.close":   { ko: "닫기", en: "Close" },

    // ── Contact ─────────────────────────────────────
    "contact.title":         { ko: "연락처",  en: "Contact" },
    "contact.sub":           { ko: "등록 및 상담 환영", en: "Inquiries Welcome" },
    "contact.loc":           { ko: "교육 장소", en: "Location" },
    "contact.addr":          { ko: "주소",    en: "Address" },
    "contact.phone":         { ko: "전화",    en: "Phone" },
    "contact.email":         { ko: "이메일",  en: "Email" },
    "contact.hours":         { ko: "토요일 9:00 AM – 1:00 PM", en: "Saturday 9:00 AM – 1:00 PM" },
    "contact.reply":         { ko: "24시간 이내 답변", en: "Reply within 24 hours" },
    "contact.directions":    { ko: "찾아오시는 길", en: "Directions" },
    "contact.dir1":          { ko: "랭리 중심부의 최적 교육 환경",               en: "Central Langley location" },
    "contact.dir2":          { ko: "접근성 좋은 JL International Education Institute", en: "Easily accessible institute" },
    "contact.dir3":          { ko: "방문 시 주차 안내 표지 확인",               en: "Check parking signs when visiting" },
    "contact.form.title":    { ko: "문의하기", en: "Send a Message" },
    "contact.form.desc":     { ko: "궁금하신 점이 있으시면 아래 양식을 작성해 주세요.", en: "Fill out the form below and we'll respond within 24 hours." },
    "contact.form.name":     { ko: "이름",    en: "Name" },
    "contact.form.email":    { ko: "문의자 이메일",  en: "Sender's Email" },
    "contact.form.phone":    { ko: "전화번호", en: "Phone" },
    "contact.form.type":     { ko: "문의 유형", en: "Type" },
    "contact.form.type.select":{ ko: "선택해 주세요", en: "Select" },
    "contact.form.type.enroll":{ ko: "입학 문의",   en: "Enrollment" },
    "contact.form.type.cur": { ko: "커리큘럼",  en: "Curriculum" },
    "contact.form.type.sched":{ ko: "일정 문의", en: "Schedule" },
    "contact.form.type.gen": { ko: "일반 문의", en: "General" },
    "contact.form.subject":  { ko: "제목",    en: "Subject" },
    "contact.form.msg":      { ko: "문의 내용", en: "Message" },
    "contact.form.send":     { ko: "문의하기", en: "Send Message" },
    "contact.form.sending":  { ko: "전송 중…", en: "Sending…" },
    "contact.form.success":  { ko: "감사합니다! 문의가 접수되었습니다.", en: "Thank you! Your message has been sent." },
    "contact.form.error":    { ko: "오류가 발생했습니다. 다시 시도해 주세요.", en: "Something went wrong. Please try again." },

    // ── Shared ──────────────────────────────────────
    "shared.contact.cta":    { ko: "문의하기",     en: "Contact Us" },
    "shared.viewall":        { ko: "전체 보기",    en: "View All" },
    "shared.register.cta":   { ko: "지금 등록하기", en: "Register Now" },
    "shared.schedule.cta":   { ko: "학사 일정 보기", en: "View Schedule" },
    "shared.tba":            { ko: "추후 공지",    en: "TBA" },
    "shared.practical.time": { ko: "수업 시간",    en: "Class Time" },
    "shared.practical.size": { ko: "정원",         en: "Class Size" },
    "shared.practical.term": { ko: "학기",         en: "School Term" },
    "shared.practical.tuition":{ ko: "수업료",     en: "Tuition" },
    "shared.practical.status":{ ko: "등록 현황",   en: "Registration Status" },

    // ── Danbi detail ────────────────────────────────
    "danbi.hero.desc":       { ko: "따뜻하고 즐거운 분위기에서 시작하는 첫 한국어 배움.", en: "A warm and playful first step into Korean learning." },
    "danbi.hero.age":        { ko: "유치원 연령의 어린이와 한국어를 처음 접하는 학생들을 위한 반입니다.", en: "For kindergarten-aged learners and young beginners." },
    "danbi.overview.title":  { ko: "반 소개", en: "Class Overview" },
    "danbi.overview":        { ko: "단비반은 <strong>한국어를 처음 배우기 시작하는 어린 학생들</strong>을 위한 반입니다. <strong>노래, 이야기, 신체 활동, 놀이</strong>, 그리고 반복적인 교실 루틴을 통해 아이들이 한국어를 <strong>자연스럽게 듣고 말하는 데</strong> 익숙해질 수 있도록 돕습니다. <strong>따뜻하고 격려하는 환경</strong> 속에서 한국어에 대한 <strong>좋은 첫 경험</strong>을 쌓는 데 중점을 둡니다.", en: "Danbi Class is designed for <strong>young learners beginning their Korean language journey</strong>. Through <strong>songs, stories, movement, and play</strong>, students build comfort with <strong>listening to and using Korean</strong> in a natural way. The class focuses on creating a <strong>positive first experience</strong> with Korean in a <strong>warm and encouraging environment</strong>." },
    "danbi.focus.title":     { ko: "학습 중점", en: "Learning Focus" },
    "danbi.focus.1":         { ko: "일상 루틴을 통한 듣기와 말하기", en: "Listening and speaking through daily routine" },
    "danbi.focus.2":         { ko: "기초 한국어 어휘", en: "Basic Korean vocabulary" },
    "danbi.focus.3":         { ko: "노래, 이야기, 교실 표현 익히기", en: "Songs, stories, and classroom expressions" },
    "danbi.focus.4":         { ko: "초기 문해 준비", en: "Early literacy readiness" },
    "danbi.focus.5":         { ko: "사회적 상호작용과 자신감 기르기", en: "Social interaction and confidence" },
    "danbi.activities.title":{ ko: "주요 학습 활동", en: "Sample Learning Activities" },
    "danbi.act.1":           { ko: "그림책을 활용한 이야기 시간", en: "Storytime with picture books" },
    "danbi.act.2":           { ko: "한국어 동요와 챈트", en: "Korean songs and chants" },
    "danbi.act.3":           { ko: "어휘 게임과 짝맞추기 활동", en: "Vocabulary games and matching activities" },
    "danbi.act.4":           { ko: "한글 글자와 소리에 대한 기초 노출", en: "Letter and sound exposure" },
    "danbi.act.5":           { ko: "만들기와 주제 중심 체험 활동", en: "Craft and hands-on themed activities" },
    "danbi.act.6":           { ko: "간단한 짝 활동과 모둠 참여", en: "Simple partner and group participation" },
    "danbi.atmosphere.title":{ ko: "수업 분위기", en: "Teaching Approach" },
    "danbi.atmosphere":      { ko: "단비반은 어린 학생들이 편안함과 안정감을 느끼며 한국어를 시도해볼 수 있도록 돕는 따뜻하고 놀이 중심의 학습 환경을 제공합니다. 수업은 연령에 맞게 활동적이고 흥미롭게 구성되며, 반복과 루틴을 통해 친숙함과 자신감을 쌓을 수 있도록 돕습니다.", en: "Danbi Class offers a nurturing and playful classroom environment where young learners feel safe, welcomed, and encouraged to try Korean. Lessons are designed to be active, engaging, and age-appropriate, with lots of repetition and routine to help students build familiarity and confidence." },
    "danbi.practical.note":  { ko: "수업 시간 및 등록금에 대한 자세한 내용은 추후 공지됩니다.", en: "Detailed class schedule and tuition information will be announced soon." },

    // ── Hanbyeol detail ─────────────────────────────
    "hanbyeol.hero.desc":      { ko: "꾸준하고 활동적인 배움을 통해 한국어 자신감을 키우는 반.", en: "Building confidence in Korean through steady and active learning." },
    "hanbyeol.hero.age":       { ko: "보다 체계적인 언어 학습이 가능한 초등 저학년 학생들을 위한 반입니다.", en: "For lower elementary students who are ready for more structured language development." },
    "hanbyeol.overview.title": { ko: "반 소개", en: "Class Overview" },
    "hanbyeol.overview":       { ko: "한별반은 <strong>한국어에 대한 초기 노출 단계를 넘어</strong>, 보다 <strong>체계적인 연습</strong>을 통해 실력을 키워가고자 하는 학생들을 위한 반입니다. <strong>상호작용 중심의 활동</strong>, 지도형 학습, 그리고 일관된 수업 루틴을 통해 <strong>말하기, 듣기, 초기 읽기, 참여 능력</strong>을 함께 기릅니다.", en: "Hanbyeol Class is designed for students who are ready to <strong>grow beyond early exposure</strong> and build stronger Korean skills through <strong>structured practice</strong>. The class supports <strong>speaking, listening, early reading, and participation</strong> through <strong>interactive activities</strong>, guided learning, and consistent classroom routines." },
    "hanbyeol.focus.title":    { ko: "학습 중점", en: "Learning Focus" },
    "hanbyeol.focus.1":        { ko: "말하기와 듣기 능력 향상", en: "Speaking and listening development" },
    "hanbyeol.focus.2":        { ko: "어휘 확장과 문장 만들기", en: "Vocabulary and sentence building" },
    "hanbyeol.focus.3":        { ko: "초기 읽기와 쓰기", en: "Early reading and writing" },
    "hanbyeol.focus.4":        { ko: "수업 참여와 발표·토의", en: "Classroom participation and discussion" },
    "hanbyeol.focus.5":        { ko: "한국어 사용의 자신감과 꾸준함", en: "Confidence and consistency in Korean use" },
    "hanbyeol.activities.title":{ ko: "주요 학습 활동", en: "Sample Learning Activities" },
    "hanbyeol.act.1":          { ko: "짧은 글 함께 읽기", en: "Guided reading of short texts" },
    "hanbyeol.act.2":          { ko: "어휘 및 문장 연습", en: "Vocabulary and sentence practice" },
    "hanbyeol.act.3":          { ko: "말하기 게임과 짝 활동", en: "Speaking games and partner activities" },
    "hanbyeol.act.4":          { ko: "간단한 쓰기 연습", en: "Simple writing exercises" },
    "hanbyeol.act.5":          { ko: "모둠 토의와 발표 연습", en: "Group discussion and presentation practice" },
    "hanbyeol.act.6":          { ko: "문화 주제 활동과 프로젝트", en: "Cultural themes and classroom projects" },
    "hanbyeol.atmosphere.title":{ ko: "수업 분위기", en: "Teaching Approach" },
    "hanbyeol.atmosphere":     { ko: "한별반은 학생들이 한국어를 적극적으로 사용하면서 더 좋은 언어 습관을 만들어갈 수 있도록 돕는 격려적이고 상호작용 중심의 학습 환경을 제공합니다. 수업은 체계성과 참여의 균형을 이루며, 학생들이 자신감, 이해력, 표현력을 꾸준히 키워갈 수 있도록 돕습니다.", en: "Hanbyeol Class provides an encouraging and interactive environment where students can actively use Korean while building stronger language habits. Lessons balance structure and participation, helping students grow steadily in confidence, comprehension, and expression." },
    "hanbyeol.practical.note": { ko: "보다 자세한 수업 안내는 추후 업데이트될 예정입니다.", en: "More detailed class information will be shared soon." },

    // ── Gaon detail ─────────────────────────────────
    "gaon.hero.desc":          { ko: "집중 있는 학습과 깊이 있는 표현을 통해 한국어 실력을 확장하는 반.", en: "Deepening Korean language skills through focused learning and meaningful expression." },
    "gaon.hero.age":           { ko: "읽기, 쓰기, 이해, 의사소통 능력을 더욱 발전시키고자 하는 중·고등 연령 학생들을 위한 반입니다.", en: "For secondary students ready to strengthen reading, writing, comprehension, and communication." },
    "gaon.overview.title":     { ko: "반 소개", en: "Class Overview" },
    "gaon.overview":           { ko: "가온반은 보다 <strong>높은 수준의 한국어 학습</strong>이 가능한 <strong>중·고등 연령의 학생들</strong>을 위한 반입니다. <strong>읽기, 쓰기, 이해, 자기표현 능력</strong>을 강화하는 데 중점을 두며, <strong>한국어와 한국 문화</strong>를 보다 깊이 있게 이해할 수 있도록 돕습니다.", en: "Gaon Class is designed for <strong>older students ready for more advanced Korean learning</strong>. The class focuses on building stronger <strong>reading, writing, comprehension, and self-expression</strong> skills while helping students engage more deeply with <strong>Korean language and culture</strong>." },
    "gaon.focus.title":        { ko: "학습 중점", en: "Learning Focus" },
    "gaon.focus.1":            { ko: "읽기 이해", en: "Reading comprehension" },
    "gaon.focus.2":            { ko: "문단 쓰기와 글쓰기 표현", en: "Paragraph writing and written expression" },
    "gaon.focus.3":            { ko: "명확하고 자신감 있는 말하기", en: "Speaking with clarity and confidence" },
    "gaon.focus.4":            { ko: "어휘 확장과 문법 이해", en: "Vocabulary expansion and grammar awareness" },
    "gaon.focus.5":            { ko: "한국어와 한국 문화에 대한 심화 이해", en: "Deeper understanding of Korean language and culture" },
    "gaon.activities.title":   { ko: "주요 학습 활동", en: "Sample Learning Activities" },
    "gaon.act.1":              { ko: "짧은 글 읽기와 내용 토의", en: "Reading and discussing short passages" },
    "gaon.act.2":              { ko: "독후 반응 쓰기와 짧은 글쓰기", en: "Writing responses and short compositions" },
    "gaon.act.3":              { ko: "어휘와 문법의 실제 적용", en: "Vocabulary and grammar application" },
    "gaon.act.4":              { ko: "발표와 토론 활동", en: "Presentation and discussion activities" },
    "gaon.act.5":              { ko: "문화 주제 학습과 생각 나누기", en: "Cultural topics and reflection" },
    "gaon.act.6":              { ko: "구조화된 말하기와 표현 연습", en: "Structured speaking and expression practice" },
    "gaon.atmosphere.title":   { ko: "수업 분위기", en: "Teaching Approach" },
    "gaon.atmosphere":         { ko: "가온반은 학생들이 보다 주도적이고 깊이 있게 한국어를 익혀갈 수 있도록 돕는 집중적이면서도 따뜻한 학습 환경을 제공합니다. 수업은 목표 지향적이고 체계적으로 운영되며, 동시에 학생들이 부담 없이 참여하면서 실력과 자신감을 함께 키워갈 수 있도록 구성됩니다.", en: "Gaon Class offers a focused and supportive environment for students who are ready to engage with Korean more independently and thoughtfully. Instruction is structured and goal-oriented while remaining approachable and encouraging, so students can continue developing both skill and confidence." },
    "gaon.practical.note":     { ko: "수업 일정과 등록금에 대한 최종 안내는 확정 후 공지됩니다.", en: "Final schedule and tuition details will be posted once confirmed." },

    // ── Goeup detail ────────────────────────────────
    "goeup.hero.desc":         { ko: "심화 학습과 진정한 한국어 표현으로 언어 능력을 완성하는 반.", en: "Completing Korean proficiency through advanced learning and authentic expression." },
    "goeup.hero.age":          { ko: "더 높은 수준의 한국어 읽기, 쓰기, 말하기를 발전시키고자 하는 고등 연령 학생들을 위한 반입니다.", en: "For senior students looking to develop advanced Korean reading, writing, and communication." },
    "goeup.overview.title":    { ko: "반 소개", en: "Class Overview" },
    "goeup.overview":          { ko: "고급반은 한국어 학습에서 <strong>더 높은 수준의 도전</strong>을 원하는 <strong>고등 연령 학생들</strong>을 위한 반입니다. <strong>심화된 읽기와 쓰기</strong>, <strong>문화와 역사에 대한 비판적 사고</strong>, 그리고 <strong>다양한 주제에 걸친 유창한 의사소통 능력</strong>을 키우는 데 중점을 둡니다. 학생들이 한국어를 <strong>학문적·개인적으로 더 깊이 활용</strong>할 수 있도록 준비시키는 것을 목표로 합니다.", en: "Goeup Class is designed for older students ready for <strong>more advanced challenges in Korean language learning</strong>. The class focuses on <strong>deepening reading and writing skills</strong>, developing <strong>critical thinking about Korean culture and history</strong>, and building <strong>fluent communication across a range of topics</strong>." },
    "goeup.focus.title":       { ko: "학습 중점", en: "Learning Focus" },
    "goeup.focus.1":           { ko: "심화 읽기 및 텍스트 분석", en: "Advanced reading and text analysis" },
    "goeup.focus.2":           { ko: "구조적인 글쓰기와 에세이 작성", en: "Structured writing and essay composition" },
    "goeup.focus.3":           { ko: "유창하고 정확한 말하기", en: "Fluent and accurate speaking" },
    "goeup.focus.4":           { ko: "어휘 심화 및 문법 완성", en: "Advanced vocabulary and grammar mastery" },
    "goeup.focus.5":           { ko: "한국 문화, 역사, 시사에 대한 비판적 이해", en: "Critical understanding of Korean culture, history, and current events" },
    "goeup.activities.title":  { ko: "주요 학습 활동", en: "Sample Learning Activities" },
    "goeup.act.1":             { ko: "장편 텍스트 및 기사 읽기와 분석", en: "Reading and analyzing longer texts and articles" },
    "goeup.act.2":             { ko: "논증적 에세이와 주제 중심 글쓰기", en: "Argumentative essays and topic-based writing" },
    "goeup.act.3":             { ko: "어휘·문법의 정밀한 활용", en: "Precise vocabulary and grammar use" },
    "goeup.act.4":             { ko: "토론, 발표, 심화 대화", en: "Debate, presentations, and extended conversation" },
    "goeup.act.5":             { ko: "한국 문화·역사 심층 탐구", en: "In-depth study of Korean culture and history" },
    "goeup.act.6":             { ko: "독립적 프로젝트와 창의적 표현", en: "Independent projects and creative expression" },
    "goeup.atmosphere.title":  { ko: "수업 분위기", en: "Teaching Approach" },
    "goeup.atmosphere":        { ko: "고급반은 한국어를 더 높은 수준으로 발전시키려는 학생들이 깊이 있고 도전적인 학습에 참여할 수 있도록 돕는 집중적이고 지지적인 학습 환경을 제공합니다. 수업은 목표 지향적이고 학업적으로 엄격하게 운영되면서도, 학생들이 자신감 있게 참여하고 진정성 있는 한국어 표현을 계발할 수 있도록 격려하는 방식으로 진행됩니다.", en: "Goeup Class provides a focused and supportive learning environment where students who are ready for higher-level Korean can engage with challenging and meaningful content. Instruction is goal-oriented and academically rigorous while remaining encouraging, helping students participate with confidence and develop authentic Korean expression." },
    "goeup.practical.note":    { ko: "수업 일정과 등록금에 대한 최종 안내는 확정 후 공지됩니다.", en: "Final schedule and tuition details will be posted once confirmed." },

    // ── School Info (programs page) ─────────────────
    "school.mission.title":    { ko: "우리의 목표", en: "Our Mission" },
    "school.mission":          { ko: "CUK School은 따뜻하고 지지적인 학습 환경 속에서 학생들이 한국어 실력과 자신감, 그리고 문화적 이해를 함께 키워갈 수 있도록 돕는 것을 목표로 합니다.", en: "At CUK School, we aim to help students grow in Korean language, confidence, and cultural understanding through a warm, supportive, and engaging learning environment." },
    "school.values.title":     { ko: "우리의 가치", en: "Our Values" },
    "school.val.1":            { ko: "따뜻하고 존중하는 공동체", en: "Warm and respectful community" },
    "school.val.2":            { ko: "즐겁고 의미 있는 배움", en: "Joyful and meaningful learning" },
    "school.val.3":            { ko: "꾸준한 언어 성장", en: "Steady language growth" },
    "school.val.4":            { ko: "참여를 통한 자신감 형성", en: "Confidence through participation" },
    "school.val.5":            { ko: "한국어와 한국 문화의 연결", en: "Connection to Korean language and culture" },
    "school.env.title":        { ko: "학습 환경", en: "Learning Environment" },
    "school.env":              { ko: "학생들이 환영받는다고 느끼고, 격려받으며, 스스로 참여할 준비가 되는 교실 환경을 제공합니다.", en: "We provide a classroom environment where students feel welcomed, encouraged, and ready to participate." },
    "school.why.title":        { ko: "CUK School을 선택하는 이유", en: "Why Families Choose CUK School" },
    "school.why.1":            { ko: "연령에 맞는 한국어 학습", en: "Age-appropriate Korean learning" },
    "school.why.2":            { ko: "체계적이면서도 따뜻한 수업", en: "Supportive and structured classes" },
    "school.why.3":            { ko: "가족에게도 편안한 공동체 분위기", en: "A welcoming community for families" },
    "school.why.4":            { ko: "한국어와 한국 문화를 자연스럽게 이어주는 배움", en: "Meaningful connection to Korean language and culture" },

    // ── Schedule content ────────────────────────────
    "schedule.intro":          { ko: "학사 일정과 주요 날짜에 대한 안내는 이곳에 업데이트됩니다.", en: "Academic schedule updates and important dates will be shared here." },
    "schedule.empty":          { ko: "학사 일정의 자세한 내용은 추후 공지됩니다.", en: "Detailed schedule information will be posted soon." },
  };

  let currentLang = 'ko';

  function t(key) {
    const entry = dict[key];
    if (!entry) return key;
    return entry[currentLang] || entry.ko || key;
  }

  function applyToDOM() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      el.innerHTML = t(el.dataset.i18nHtml);
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      el.placeholder = t(el.dataset.i18nPh);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      el.setAttribute('aria-label', t(el.dataset.i18nAria));
    });
    document.querySelectorAll('.i18n-ko').forEach(el => {
      el.hidden = currentLang !== 'ko';
    });
    document.querySelectorAll('.i18n-en').forEach(el => {
      el.hidden = currentLang !== 'en';
    });
    document.documentElement.lang = currentLang;
    document.body.dataset.lang = currentLang;
  }

  function setLang(lang) {
    if (lang !== 'ko' && lang !== 'en') return;
    currentLang = lang;
    try { localStorage.setItem('cuk-lang', lang); } catch(e) {}
    applyToDOM();
    document.querySelectorAll('.lang-btn').forEach(b => {
      b.classList.toggle('is-active', b.dataset.lang === lang);
      b.setAttribute('aria-pressed', b.dataset.lang === lang);
    });
  }

  function getLang() { return currentLang; }

  function init() {
    let saved = 'ko';
    try { saved = localStorage.getItem('cuk-lang') || 'ko'; } catch(e) {}
    setLang(saved);
  }

  return { t, setLang, getLang, init };
})();
