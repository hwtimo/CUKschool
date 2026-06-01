/**
 * CUK School — Notices Data
 *
 * 공지사항 추가 방법:
 * 아래 배열에 객체를 추가하면 notices.html과 index.html에 자동으로 표시됩니다.
 * 가장 위 항목이 최신순으로 표시됩니다.
 *
 * 필드 설명:
 *   id        : 고유 번호 (숫자, 순서대로)
 *   date      : 날짜 문자열 (예: "2026.03.14")
 *   badge     : CSS 클래스 접미사 — recruit | new | event | info
 *   badgeKo/En: 뱃지 텍스트 (한/영)
 *   titleKo/En: 제목 (한/영)
 *   summaryKo/En: 짧은 요약 (한/영)
 *   image     : 이미지 경로 (없으면 null)
 *   imageAlt  : 이미지 alt 텍스트
 *   detailKo/En: 모달에서 보여줄 상세 내용 HTML (한/영)
 */

const noticesData = [
  {
    id: 1,
    date: "2026.03.14",
    badge: "recruit",
    badgeKo: "학생모집",
    badgeEn: "Enrollment",
    titleKo: "2026–27학년 학생 모집 안내",
    titleEn: "2026–27 Student Enrollment Open",
    summaryKo: "캐나다 유니티 코리안 스쿨 랭리 캠퍼스에서 2026–27학년도 신입생을 모집합니다.",
    summaryEn: "Canada Unity Korean School (Langley Campus) is now accepting new students for the 2026–27 school year.",
    image: "uploads/27poster.jpg",
    imageAlt: "2026–27학년 학생 모집 포스터",
    detailKo: `
      <table style="width:100%;border-collapse:collapse;font-size:0.95rem;line-height:1.8;">
        <tr><td style="padding:6px 12px 6px 0;color:#888;white-space:nowrap;vertical-align:top;">모집연령</td><td style="padding:6px 0;font-weight:600;">2023년생 ~ Gr. 12</td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#888;white-space:nowrap;vertical-align:top;">수업시간</td><td style="padding:6px 0;font-weight:600;">토요일 오전 9:30 – 12:00 (정오)</td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#888;white-space:nowrap;vertical-align:top;">수강료</td><td style="padding:6px 0;font-weight:600;">입학금 $80 / 등록금(1년 30주) $400 / 둘째 $360</td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#888;white-space:nowrap;vertical-align:top;">수업장소</td><td style="padding:6px 0;font-weight:600;">JL International Education Institute Langley Branch<br><span style="font-weight:400;">8790 204 st. #201, Langley Twp, BC V1M 2Y5</span></td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#888;white-space:nowrap;vertical-align:top;">개강일</td><td style="padding:6px 0;font-weight:600;">2026년 9월 12일</td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#888;white-space:nowrap;vertical-align:top;">등록문의</td><td style="padding:6px 0;font-weight:600;">778-325-1120 / 604-910-5969</td></tr>
      </table>
      <p style="margin-top:16px;font-size:0.9rem;color:#666;">QR코드를 이용하여 등록해 주세요. 문의는 전화 또는 이메일로 연락 주시기 바랍니다.</p>
    `,
    detailEn: `
      <table style="width:100%;border-collapse:collapse;font-size:0.95rem;line-height:1.8;">
        <tr><td style="padding:6px 12px 6px 0;color:#888;white-space:nowrap;vertical-align:top;">Ages</td><td style="padding:6px 0;font-weight:600;">Born 2023 – Grade 12</td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#888;white-space:nowrap;vertical-align:top;">Class Time</td><td style="padding:6px 0;font-weight:600;">Saturdays 9:30 AM – 12:00 PM (noon)</td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#888;white-space:nowrap;vertical-align:top;">Tuition</td><td style="padding:6px 0;font-weight:600;">Registration $80 / Annual (30 weeks) $400 / 2nd child $360</td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#888;white-space:nowrap;vertical-align:top;">Location</td><td style="padding:6px 0;font-weight:600;">JL International Education Institute Langley Branch<br><span style="font-weight:400;">8790 204 st. #201, Langley Twp, BC V1M 2Y5</span></td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#888;white-space:nowrap;vertical-align:top;">Start Date</td><td style="padding:6px 0;font-weight:600;">September 12, 2026</td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#888;white-space:nowrap;vertical-align:top;">Inquiries</td><td style="padding:6px 0;font-weight:600;">778-325-1120 / 604-910-5969</td></tr>
      </table>
      <p style="margin-top:16px;font-size:0.9rem;color:#666;">Scan the QR code to register. Contact us by phone or email for inquiries.</p>
    `
  }

  /*
  ─── 공지사항 추가 예시 ───────────────────────────────────────────
  ,{
    id: 2,
    date: "2026.08.01",
    badge: "event",
    badgeKo: "행사",
    badgeEn: "Event",
    titleKo: "개강 오리엔테이션 안내",
    titleEn: "Orientation Day Notice",
    summaryKo: "2026년 9월 5일 오전 10시, 신입생 오리엔테이션이 진행됩니다.",
    summaryEn: "New student orientation on September 5, 2026 at 10 AM.",
    image: null,
    imageAlt: "",
    detailKo: "<p>오리엔테이션 상세 내용...</p>",
    detailEn: "<p>Orientation details...</p>"
  }
  ──────────────────────────────────────────────────────────────── */
];
