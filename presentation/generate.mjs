#!/usr/bin/env node
/*
 * Build script cho slide deck thuyết trình video demo (CS112 - Tô màu đồ thị).
 *
 * Cách chạy lại từ đầu:
 *   cd presentation
 *   npm install            # chỉ cần một lần, cài pptxgenjs cục bộ trong presentation/
 *   node generate.mjs      # sinh algorithm-visualizer-video.pptx + docs/kich-ban-thuyet-trinh.md
 *   soffice --headless --convert-to pdf --outdir . algorithm-visualizer-video.pptx
 *                           # sinh algorithm-visualizer-video.pdf để xem nhanh không cần PowerPoint
 *
 * Toàn bộ nội dung slide (bullet, bảng, mã giả, lời đọc, cue demo, thời lượng) khai báo trong
 * mảng SLIDES dưới đây. Đây là NGUỒN DUY NHẤT: cả file .pptx và docs/kich-ban-thuyet-trinh.md
 * được sinh từ cùng mảng này, nên không thể lệch nhau.
 */
import PptxGenJS from 'pptxgenjs';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Thiết kế: trắng / đen / xám, giống tông shadcn của app. Font Noto Sans có đủ
// dấu tiếng Việt và có sẵn trên máy build (fc-list :lang=vi xác nhận); dùng
// Noto Sans Mono cho mã giả/JSON để giữ canh cột.
// ---------------------------------------------------------------------------
const FONT = 'Noto Sans';
const FONT_MONO = 'Noto Sans Mono';
const C = {
  bg: 'FFFFFF',
  ink: '0A0A0A',
  sub: '52525B',
  mute: '71717A',
  line: 'D4D4D8',
  panel: 'F4F4F5',
  panelBorder: 'E4E4E7',
  badgeBg: '18181B',
  badgeFg: 'FFFFFF',
  headRowBg: '18181B',
  headRowFg: 'FFFFFF',
};

const SLIDE_W = 13.333;
const SLIDE_H = 7.5;
const MARGIN_X = 0.55;
const CONTENT_TOP = 1.55;
const CONTENT_BOTTOM = 7.05;
const FULL_W = SLIDE_W - 2 * MARGIN_X;
const SIDE_X = MARGIN_X + 7.25;
const SIDE_W = SLIDE_W - MARGIN_X - SIDE_X;
const MAIN_W = SIDE_X - 0.35 - MARGIN_X;

// ---------------------------------------------------------------------------
// Tiện ích vẽ
// ---------------------------------------------------------------------------

function addChrome(slide, pptx, { kicker, title, demo, index, total }) {
  slide.background = { color: C.bg };
  if (kicker) {
    slide.addText(kicker.toUpperCase(), {
      x: MARGIN_X, y: 0.32, w: FULL_W - 2.4, h: 0.3,
      fontFace: FONT, fontSize: 11, color: C.mute, bold: true, charSpacing: 1,
    });
  }
  slide.addText(title, {
    x: MARGIN_X, y: 0.6, w: FULL_W - (demo ? 2.5 : 0), h: 0.8,
    fontFace: FONT, fontSize: 25, color: C.ink, bold: true, valign: 'top',
  });
  slide.addShape(pptx.ShapeType.line, {
    x: MARGIN_X, y: CONTENT_TOP - 0.12, w: FULL_W, h: 0,
    line: { color: C.line, width: 1 },
  });
  if (demo) {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: SLIDE_W - MARGIN_X - 2.35, y: 0.42, w: 2.35, h: 0.46,
      rectRadius: 0.08, fill: { color: C.badgeBg }, line: { type: 'none' },
    });
    slide.addText('▶ DEMO TRỰC TIẾP', {
      x: SLIDE_W - MARGIN_X - 2.35, y: 0.42, w: 2.35, h: 0.46,
      fontFace: FONT, fontSize: 11, bold: true, color: C.badgeFg,
      align: 'center', valign: 'middle',
    });
  }
  slide.addText(`${index} / ${total}`, {
    x: SLIDE_W - MARGIN_X - 0.9, y: SLIDE_H - 0.42, w: 0.9, h: 0.3,
    fontFace: FONT, fontSize: 10, color: C.mute, align: 'right',
  });
  slide.addText('CS112 · Tô màu đồ thị (bài Sở thú)', {
    x: MARGIN_X, y: SLIDE_H - 0.42, w: 6, h: 0.3,
    fontFace: FONT, fontSize: 10, color: C.mute,
  });
}

function bulletParas(items, { fontSize = 16, color = C.ink } = {}) {
  return items.map((it) => {
    const text = typeof it === 'string' ? it : it.text;
    const bold = typeof it === 'object' && it.bold;
    const sz = (typeof it === 'object' && it.fontSize) || fontSize;
    const col = (typeof it === 'object' && it.color) || color;
    return {
      text,
      options: {
        bullet: { code: '2022', indent: 18 },
        fontFace: FONT, fontSize: sz, color: col, bold: !!bold,
        paraSpaceAfter: 10, breakLine: true,
      },
    };
  });
}

function renderBullets(slide, items, x, y, w, opts = {}) {
  const h = opts.h || (CONTENT_BOTTOM - y);
  slide.addText(bulletParas(items, opts), {
    x, y, w, h, valign: 'top', fontFace: FONT, lineSpacing: opts.lineSpacing || 22,
  });
}

function heightForTable(rows, fontSize = 12) {
  const rowH = fontSize >= 13 ? 0.42 : 0.36;
  return Math.min(rows * rowH + 0.15, CONTENT_BOTTOM - CONTENT_TOP);
}

function renderTable(slide, pptx, { headers, rows, widths }, x, y, w, opts = {}) {
  const fontSize = opts.fontSize || 12;
  const body = rows.map((r) =>
    r.map((cell) => ({
      text: String(cell),
      options: {
        fontFace: opts.mono ? FONT_MONO : FONT, fontSize, color: C.ink,
        align: opts.align || 'left', valign: 'middle',
      },
    }))
  );
  const head = headers.map((h2) => ({
    text: h2,
    options: {
      fontFace: FONT, fontSize, bold: true, color: C.headRowFg,
      fill: { color: C.headRowBg }, align: opts.align || 'left', valign: 'middle',
    },
  }));
  const h = heightForTable(rows.length + 1, fontSize);
  slide.addTable([head, ...body], {
    x, y, w, h,
    colW: widths,
    border: { type: 'solid', color: C.panelBorder, pt: 0.75 },
    autoPage: false,
    rowH: h / (rows.length + 1),
  });
  return y + h;
}

function renderCode(slide, pptx, lines, x, y, w, opts = {}) {
  const fontSize = opts.fontSize || 13;
  const lineH = opts.lineH || 0.28;
  const h = lines.length * lineH + 0.3;
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.06,
    fill: { color: C.panel }, line: { color: C.panelBorder, width: 0.75 },
  });
  slide.addText(
    lines.map((l) => ({ text: l, options: { breakLine: true } })),
    {
      x: x + 0.22, y: y + 0.14, w: w - 0.44, h: h - 0.28,
      fontFace: FONT_MONO, fontSize, color: C.ink, valign: 'top', lineSpacing: fontSize + 6,
    }
  );
  return y + h;
}

function renderQuotes(slide, pptx, quotes, x, y, w) {
  let cy = y;
  for (const q of quotes) {
    const lines = Math.ceil(q.text.length / 58) + (q.label ? 1 : 0);
    const h = lines * 0.26 + 0.3;
    slide.addShape(pptx.ShapeType.rect, {
      x, y: cy, w: 0.06, h, fill: { color: C.ink }, line: { type: 'none' },
    });
    if (q.label) {
      slide.addText(q.label, {
        x: x + 0.22, y: cy, w: w - 0.3, h: 0.24,
        fontFace: FONT, fontSize: 11, bold: true, color: C.sub,
      });
    }
    slide.addText(`“${q.text}”`, {
      x: x + 0.22, y: cy + (q.label ? 0.24 : 0), w: w - 0.3, h: h - (q.label ? 0.24 : 0),
      fontFace: FONT, italic: true, fontSize: 13, color: C.ink, valign: 'top', lineSpacing: 16,
    });
    cy += h + 0.14;
  }
  return cy;
}

function drawCrownGraph(slide, pptx, x, y, w, h, opts = {}) {
  const topY = y + h * 0.18;
  const botY = y + h * 0.75;
  const xs = [x + w * 0.18, x + w * 0.5, x + w * 0.82];
  const nodes = {
    A1: [xs[0], topY], A2: [xs[1], topY], A3: [xs[2], topY],
    B1: [xs[0], botY], B2: [xs[1], botY], B3: [xs[2], botY],
  };
  const edges = [['A1', 'B2'], ['A1', 'B3'], ['A2', 'B1'], ['A2', 'B3'], ['A3', 'B1'], ['A3', 'B2']];
  const highlightEdges = opts.highlightEdges || [];
  const r = 0.34;
  for (const [a, b] of edges) {
    const [x1, y1] = nodes[a];
    const [x2, y2] = nodes[b];
    const isHi = highlightEdges.some(([ha, hb]) => (ha === a && hb === b) || (ha === b && hb === a));
    slide.addShape(pptx.ShapeType.line, {
      x: Math.min(x1, x2), y: Math.min(y1, y2),
      w: Math.abs(x2 - x1), h: Math.abs(y2 - y1),
      line: { color: isHi ? C.ink : C.line, width: isHi ? 2.25 : 1.25, dashType: isHi ? 'solid' : 'solid' },
      // Bounding box top is always y1 (A-row is always above B-row here); the box's
      // natural diagonal runs top-left -> bottom-right, so flip horizontally whenever
      // the top endpoint (x1) is to the RIGHT of the bottom endpoint (x2).
      flipH: x1 > x2,
    });
  }
  const colors = opts.coloring || {};
  const order = opts.order || null;
  // Visit/input order for numbering is A1,B1,A2,B2,A3,B3 (bao-cao §4.1-4.3 — this is
  // the order greedy/backtracking/exhaustive actually traverse), which is NOT the same
  // as the drawing order above (A-row then B-row) used only to lay out the two rows.
  const VISIT_ORDER = ['A1', 'B1', 'A2', 'B2', 'A3', 'B3'];
  for (const [name, [cx, cy]] of Object.entries(nodes)) {
    const visitIndex = VISIT_ORDER.indexOf(name) + 1;
    const fill = colors[name] === 0 ? C.ink : colors[name] === 1 ? C.panel : C.bg;
    const fontCol = colors[name] === 0 ? C.badgeFg : C.ink;
    slide.addShape(pptx.ShapeType.ellipse, {
      x: cx - r, y: cy - r, w: 2 * r, h: 2 * r,
      fill: { color: fill }, line: { color: C.ink, width: 1.5 },
    });
    slide.addText(name, {
      x: cx - r, y: cy - r, w: 2 * r, h: 2 * r,
      align: 'center', valign: 'middle', fontFace: FONT, fontSize: 12, bold: true, color: fontCol,
    });
    if (order) {
      slide.addText(String(visitIndex), {
        x: cx + r - 0.06, y: cy - r - 0.22, w: 0.4, h: 0.3,
        align: 'center', fontFace: FONT, fontSize: 11, bold: true, color: C.sub,
      });
    }
  }
}

function heightForBullets(n, fontSize = 16) {
  const per = fontSize >= 16 ? 0.52 : 0.44;
  return n * per + 0.1;
}

// ---------------------------------------------------------------------------
// Dữ liệu 35 slide. Mỗi slide: kicker, title, blocks (nội dung chính, cột trái
// hoặc toàn chiều ngang), side (cột phải, tuỳ chọn), demo (true nếu cảnh này
// cắt sang demo trực tiếp), durationSec (thời lượng mục tiêu riêng slide này,
// CHƯA tính phần demo — phần demo cộng thêm ghi rõ trong notes), notes (lời
// đọc đầy đủ tiếng Việt + cue demo trong dấu [] + thời lượng tổng).
// ---------------------------------------------------------------------------

const SLIDES = [];

// ---- 1. Trang bìa ---------------------------------------------------------
SLIDES.push({
  kind: 'title',
  title: 'TÔ MÀU ĐỒ THỊ (BÀI TOÁN SỞ THÚ)',
  subtitle: 'Thiết kế, so sánh năm chiến lược giải và demo minh họa từng bước',
  meta: [
    'Môn: CS112 — Phân tích và Thiết kế Thuật toán, lớp CS112.F31',
    'Giảng viên: [SV XÁC NHẬN]',
    'Sinh viên: [SV XÁC NHẬN — Họ tên] · MSSV [SV XÁC NHẬN]',
    'Demo trực tuyến: algorithm-visualizer.hieutk.dev',
  ],
  durationSec: 19,
  notes:
    'Thời lượng: ~19s.\n' +
    'Lời đọc: "Xin chào cô. Em là [SV XÁC NHẬN — họ tên], mã số sinh viên [SV XÁC NHẬN]. Đây là ' +
    'video demo bài tập lớn: bài toán tô màu đồ thị, hay bài toán Sở thú, với năm chiến lược giải ' +
    'và minh họa từng bước."\n' +
    '[CHUYỂN SANG DEMO: mở algorithm-visualizer.hieutk.dev, đứng yên 2 giây ở trang chủ trước khi quay lại slide]\n' +
    '[SV XÁC NHẬN: điền họ tên, MSSV, tên giảng viên trước khi trình bày]',
});

// ---- 2. Lý do chọn đề tài + nguồn gốc ------------------------------------
SLIDES.push({
  kicker: 'Chương 1 · Giới thiệu bài toán',
  title: 'Lý do chọn đề tài và nguồn gốc',
  durationSec: 42,
  blocks: [
    { type: 'bullets', items: [
      'Nhận xét của cô sau bài thi: phần thiết kế thuật toán của nhiều bạn còn yếu, dù dạng bài "Sở thú là bài tô màu đồ thị" không mới.',
      'Gợi ý từ AI: ba mô hình (Claude, Codex/GPT, Grok) cùng đề xuất chọn tô màu đồ thị, vì có nhiều cách giải để so sánh và trạng thái từng bước dễ minh họa.',
      '[SV XÁC NHẬN] — đây phải là lý do thật của sinh viên; nội dung trên là bản nháp từ lịch sử làm việc.',
    ], fontSize: 16 },
  ],
  side: { type: 'table', title: 'Nguồn gốc', headers: ['Nguồn', 'Ghi chú'], widths: [1.9, 2.9], fontSize: 12, rows: [
    ['Bài toán 4 màu', 'Guthrie 1852, Appel–Haken chứng minh 1976'],
    ['Levitin §1.3, §12.1', 'Giới thiệu & backtracking m màu'],
    ['Bài Sở thú', 'Đề thi, buổi ôn tập của môn'],
    ['Welsh–Powell (1967)', 'Heuristic theo degree'],
    ['DSATUR — Brélaz (1979)', 'Heuristic theo độ bão hòa'],
  ]},
  notes:
    'Thời lượng: ~35s.\n' +
    'Lời đọc: "Lý do đầu tiên: cô nhận xét thiết kế thuật toán của nhiều bạn còn yếu, và nêu đúng ví dụ ' +
    'Sở thú là bài tô màu đồ thị. Lý do thứ hai: ba mô hình AI em cho tranh luận đều đề xuất tô màu đồ ' +
    'thị, vì có nhiều cách giải để so sánh và trạng thái từng bước dễ minh họa. Bài toán bắt nguồn từ ' +
    'bài toán bốn màu của Guthrie, trình bày trong sách Levitin, với hai heuristic nổi tiếng Welsh–Powell ' +
    'và DSATUR."\n' +
    '[SV XÁC NHẬN: viết lại lý do bằng lời của chính mình trước khi quay]',
});

// ---- 3. Ứng dụng thực tế ---------------------------------------------------
SLIDES.push({
  kicker: 'Chương 1 · Giới thiệu bài toán',
  title: 'Ứng dụng thực tế',
  durationSec: 20,
  blocks: [
    { type: 'table', headers: ['Ứng dụng', 'Ánh xạ sang tô màu đồ thị'], widths: [3.0, 6.8], fontSize: 14, rows: [
      ['Xếp lịch thi', 'Môn = vertex; hai môn chung sinh viên = edge; ca thi = màu'],
      ['Sở thú / xếp phòng', 'Loài/khách kỵ nhau không ở chung chuồng/phòng'],
      ['Cấp phát thanh ghi (compiler)', 'Biến "sống" cùng lúc không dùng chung thanh ghi'],
      ['Phân tần số trạm phát sóng', 'Hai trạm gần nhau phải khác tần số'],
      ['Giải Sudoku', 'Bài toán tô 9 màu trên đồ thị 81 vertex'],
    ]},
  ],
  notes:
    'Thời lượng: ~16s.\n' +
    'Lời đọc: "Tô màu đồ thị có nhiều ứng dụng: xếp lịch thi, phân chuồng sở thú hay phân phòng khách, ' +
    'cấp phát thanh ghi trong trình biên dịch, phân tần số trạm phát sóng — và ngay cả Sudoku cũng là ' +
    'một bài toán tô chín màu trên đồ thị tám mươi mốt vertex."',
});

// ---- 4. Phát biểu bài toán -------------------------------------------------
SLIDES.push({
  kicker: 'Chương 2 · Mô tả và mô hình bài toán',
  title: 'Phát biểu bài toán (kiểu đề thi / Wecode)',
  durationSec: 20,
  blocks: [
    { type: 'bullets', items: [
      { text: 'Bài toán k-coloring (mặc định):', bold: true },
      'Sở thú cần xếp n loài thú vào các chuồng. Có danh sách các cặp loài "kỵ nhau", không được nhốt chung. Sở thú hiện có k chuồng. Có xếp được tất cả các loài vào k chuồng, sao cho không chuồng nào chứa hai loài kỵ nhau, hay không? Nếu có, hãy chỉ ra cách xếp.',
      { text: 'Mở rộng — tìm chromatic number χ(G):', bold: true },
      'Không cho trước k. Hỏi cần ít nhất bao nhiêu chuồng, và chỉ ra một cách xếp dùng đúng số chuồng đó.',
    ], fontSize: 16 },
  ],
  notes:
    'Thời lượng: ~16s.\n' +
    'Lời đọc: "Bài toán bắt đầu từ một sở thú: có những loài không thể nhốt chung chuồng. Với k chuồng, ' +
    'có xếp được tất cả các loài sao cho không chuồng nào có hai loài kỵ nhau hay không. App còn có chế ' +
    'độ mở rộng: tìm chromatic number, tức số chuồng ít nhất cần dùng."',
});

// ---- 5. Mô hình hóa ---------------------------------------------------------
SLIDES.push({
  kicker: 'Chương 2 · Mô tả và mô hình bài toán',
  title: 'Mô hình hóa bằng đồ thị',
  durationSec: 32,
  blocks: [
    { type: 'bullets', items: [
      'Đồ thị vô hướng G = (V, E): mỗi loài là một vertex; mỗi cặp kỵ nhau là một edge; mỗi chuồng là một màu.',
      'Tô màu hợp lệ: hàm c: V → {0,…,k−1} sao cho (u,v) ∈ E ⇒ c(u) ≠ c(v).',
      'k-coloring (k ≥ 3) thuộc lớp NP-đầy đủ (Karp, 1972). k = 2 giải được trong thời gian đa thức — tương đương kiểm tra đồ thị hai phía.',
    ], fontSize: 16 },
  ],
  side: { type: 'table', title: 'Ba khái niệm cần phân biệt', headers: ['Khái niệm', 'Câu hỏi'], widths: [2.0, 2.8], fontSize: 11.5, rows: [
    ['Tô màu hợp lệ', 'Một cách gán cho trước có đúng không? (checker)'],
    ['k-coloring', 'Có tô được bằng k màu không? (mặc định)'],
    ['Chromatic number χ(G)', 'Số màu nhỏ nhất là bao nhiêu? (chromatic)'],
  ]},
  notes:
    'Thời lượng: ~32s.\n' +
    'Lời đọc: "Em mô hình hoá bài toán bằng đồ thị: mỗi loài là một vertex, mỗi cặp kỵ nhau là một edge, ' +
    'mỗi chuồng là một màu. Cần phân biệt ba khái niệm: tô màu hợp lệ do checker kiểm tra, bài toán k ' +
    'màu — app gọi là k-coloring — và chromatic number χ(G), tức chế độ chromatic. Với k từ 3 bài toán ' +
    'thuộc lớp NP-đầy đủ; k bằng 2 giải được trong thời gian đa thức."',
});

// ---- 6. Input/Output/Ràng buộc ---------------------------------------------
SLIDES.push({
  kicker: 'Chương 2 · Mô tả và mô hình bài toán',
  title: 'Input, Output và ràng buộc',
  durationSec: 30,
  blocks: [
    { type: 'bullets', items: [
      { text: 'Input (JSON, định nghĩa bằng Zod):', bold: true },
      '{ nodes, edges, colors, mode? } — nodes quyết định thứ tự duyệt của greedy/backtracking/exhaustive search.',
      { text: 'Output:', bold: true },
      '{ found, coloring, heuristic?, colorsUsed?, chromaticExact? } — heuristic báo "chưa tìm được" không khẳng định vô nghiệm.',
    ], fontSize: 15 },
  ],
  side: { type: 'table', title: 'Ràng buộc chính', headers: ['Đại lượng', 'Giá trị'], widths: [2.0, 2.8], fontSize: 11, rows: [
    ['Số vertex n', '0 ≤ n ≤ 320'],
    ['Số edge m', '≤ 8.000'],
    ['Số màu k', '1 ≤ k ≤ 10 (chỉ k-coloring)'],
    ['Backtracking', 'n ≤ 9 (k-coloring), ≤ 10 (χ)'],
    ['Exhaustive search', 'kⁿ ≤ 200.000 (k-coloring); Σkⁿ ≤ 200.000 (χ, ~n ≤ 6)'],
  ]},
  notes:
    'Thời lượng: ~20s.\n' +
    'Lời đọc: "Dữ liệu vào là JSON: vertex, edge, số màu k, chế độ. Thứ tự vertex là thứ tự duyệt của ' +
    'greedy, backtracking, exhaustive search. Found=false từ heuristic chỉ nghĩa chưa tìm được, không ' +
    'khẳng định vô nghiệm; từ thuật toán chính xác thì khẳng định chắc chắn. App giới hạn 320 vertex ' +
    'cho heuristic, 9–10 cho backtracking, một ngưỡng an toàn kⁿ cho exhaustive search."',
});

// ---- 7. Ví dụ Input/Output --------------------------------------------------
SLIDES.push({
  kicker: 'Chương 2 · Mô tả và mô hình bài toán',
  title: 'Ví dụ Input / Output',
  durationSec: 21,
  blocks: [
    { type: 'table', headers: ['#', 'Đồ thị', 'k', 'Output đúng'], widths: [0.5, 3.5, 0.6, 5.7], fontSize: 13, rows: [
      ['1', 'Tam giác A–B–C', '3', 'found=true, ví dụ A=0, B=1, C=2'],
      ['2', 'Tam giác A–B–C', '2', 'found=false (chính xác: vô nghiệm; heuristic: chưa tìm được)'],
      ['3', 'Đồ thị vương miện 6 vertex (ví dụ chung)', '2', 'found=true, coloring=[0,1,0,1,0,1] (greedy/WP báo chưa tìm được)'],
      ['4', 'Đồ thị rỗng, n = 0', '1', 'found=true, coloring=[]'],
      ['5', 'colors = 0', '—', 'Bị từ chối vì dữ liệu không hợp lệ'],
    ]},
  ],
  notes:
    'Thời lượng: ~21s.\n' +
    'Lời đọc: "Một tam giác cần đúng ba màu; với hai màu thì vô nghiệm. Đồ thị vương miện — ví dụ chung ' +
    'của toàn bài — tô được bằng hai màu nhưng greedy và Welsh–Powell lại thất bại. Dữ liệu sai như ' +
    'số màu bằng không bị app từ chối ngay."',
});

// ---- 8. Cấu trúc dữ liệu ----------------------------------------------------
SLIDES.push({
  kicker: 'Chương 3 · Thiết kế cấu trúc dữ liệu và thuật toán',
  title: 'Cấu trúc dữ liệu',
  durationSec: 22,
  blocks: [
    { type: 'bullets', items: [
      'Danh sách vertex có thứ tự (nodes) — quyết định thứ tự duyệt.',
      'Tập edge dạng Set<string> các cặp vertex — kiểm tra kề nhau trong O(1).',
      'Mảng màu color[v], với null là chưa tô.',
      'Tập màu bị cấm của vertex v: các màu đang có ở vertex kề v.',
      'Độ bão hòa sat(v) (chỉ DSATUR): số màu khác nhau ở các vertex kề v.',
      'Trace từng bước: lineId mã giả, trạng thái đồ thị, state-space tree (treeNodes), lời giải thích.',
    ], fontSize: 15 },
  ],
  notes:
    'Thời lượng: ~16s.\n' +
    'Lời đọc: "Danh sách vertex có thứ tự quyết định thứ tự duyệt; tập edge lưu dạng tập hợp để kiểm ' +
    'tra kề nhau nhanh; độ bão hòa dùng riêng cho DSATUR. Quan trọng nhất là bản ghi trace từng bước — ' +
    'chính là thứ Player dùng để minh họa."',
});

// ---- 9. Phân tích đặc trưng --------------------------------------------------
SLIDES.push({
  kicker: 'Chương 3 · Thiết kế cấu trúc dữ liệu và thuật toán',
  title: 'Phân tích đặc trưng — ý tưởng giải',
  durationSec: 32,
  blocks: [
    { type: 'bullets', items: [
      'Lower bound: một clique kích thước ω cần ít nhất ω màu (tam giác cần 3 màu).',
      'Upper bound: mọi đồ thị tô được bằng Δ+1 màu (Δ = degree lớn nhất).',
      'Thứ tự duyệt quyết định chất lượng greedy — luôn có thứ tự cho đúng χ(G), nhưng cũng có thứ tự xấu.',
      'Ưu tiên vertex "khó" trước (degree cao / bị ràng buộc nhiều) để tránh hết màu.',
      'Không gian tìm kiếm có kⁿ cách gán; backtracking pruning sớm để duyệt ít hơn exhaustive search.',
    ], fontSize: 14.5 },
  ],
  side: { type: 'diagram', kind: 'crown', title: 'Thứ tự xấu cho greedy', caption: 'Đồ thị vương miện 6 vertex, χ=2 — thứ tự xen kẽ A1,B1,A2,B2,A3,B3: ở k-coloring (k=2) greedy bị bế tắc; ở chromatic mode greedy dùng 3 màu thay vì 2.',
    order: true, coloring: {} },
  notes:
    'Thời lượng: ~32s.\n' +
    'Lời đọc: "Một clique kích thước ω cần ít nhất ω màu — lower bound. Mọi đồ thị tô được bằng Δ cộng ' +
    '1 màu — upper bound. Thứ tự duyệt quyết định chất lượng greedy: trên vương miện bên phải, thứ tự ' +
    'xen kẽ A1, B1, A2, B2 khiến greedy bị bế tắc ở k bằng hai, còn ở chromatic mode thì dùng ba màu thay ' +
    'vì hai. Nên ưu tiên vertex khó trước; pruning sớm giúp backtracking duyệt ít hơn exhaustive search."',
});

// ---- 10. Greedy & Welsh–Powell ------------------------------------------------
SLIDES.push({
  kicker: 'Chương 3 · Năm thuật toán',
  title: 'Thuật toán 1–2: Greedy và Welsh–Powell',
  durationSec: 28,
  blocks: [
    { type: 'bullets', items: [
      { text: 'Greedy:', bold: true },
      'Xét vertex theo thứ tự cho sẵn; gán màu nhỏ nhất chưa có ở vertex kề; không có màu → "chưa tìm được".',
      { text: 'Welsh–Powell:', bold: true },
      'order ← vertex sắp theo degree giảm dần, rồi chạy Greedy(order). Trên vương miện mọi vertex cùng degree 2 → thứ tự không đổi → gặp đúng khó khăn của greedy.',
      { text: 'Độ phức tạp (lý thuyết / trong app):', bold: true },
      'Greedy: O(n·k+m) / O(n·(n+k)).  Welsh–Powell: O(n log n+n·k+m) / O(n²+n·k).',
    ], fontSize: 13.5 },
  ],
  side: { type: 'code-stack', blocks: [
    { title: 'Greedy — pseudocode.ts (nguyên văn)', lines: [
      '1. Xét các đỉnh theo thứ tự cho trước',
      '2. Gán màu nhỏ nhất trong k màu chưa',
      '   dùng ở các đỉnh kề đã tô',
      '3. Nếu không còn màu nào khả dụng: dừng',
      '   — heuristic chưa tìm được, không',
      '   chứng minh vô nghiệm',
      '4. Trả về cách tô nếu tô được hết mọi',
      '   đỉnh',
    ] },
    { title: 'Welsh–Powell — pseudocode.ts (nguyên văn)', lines: [
      '1. Sắp các đỉnh theo bậc giảm dần',
      '2. Gán màu nhỏ nhất trong k màu chưa',
      '   dùng ở các đỉnh kề đã tô',
      '3. Nếu không còn màu nào khả dụng: dừng',
      '   — heuristic chưa tìm được, không',
      '   chứng minh vô nghiệm',
      '4. Trả về cách tô nếu tô được hết mọi',
      '   đỉnh',
    ] },
  ] },
  notes:
    'Thời lượng: ~22s.\n' +
    'Lời đọc: "Greedy tô mỗi vertex bằng màu nhỏ nhất chưa dùng ở vertex kề — không bảo đảm tìm được ' +
    'cách tô dù nó tồn tại. Welsh–Powell chỉ khác ở một điểm: sắp vertex theo degree giảm dần trước. ' +
    'Nhưng trên vương miện mọi vertex cùng degree hai, nên thứ tự không đổi — Welsh–Powell gặp đúng ' +
    'khó khăn của greedy."',
});

// ---- 11. DSATUR -------------------------------------------------------------
SLIDES.push({
  kicker: 'Chương 3 · Năm thuật toán',
  title: 'Thuật toán 3: DSATUR (Brélaz, 1979)',
  durationSec: 28,
  blocks: [
    { type: 'bullets', items: [
      'Mở rộng ngoài sách — chọn vertex chưa tô có độ bão hòa sat(v) lớn nhất; hòa thì chọn degree lớn hơn.',
      'Tính chất đã biết: DSATUR luôn tô đúng bằng 2 màu trên đồ thị hai phía → thành công trên ví dụ chung, trong khi greedy thất bại.',
      'Độ phức tạp lý thuyết O(n²+m); trong app O(n³+n·k) vì mỗi vòng tính lại độ bão hòa bằng cách quét mọi cặp vertex.',
    ], fontSize: 15 },
  ],
  side: { type: 'code', title: 'Mã giả', lines: [
    '1. sat(v) ← 0 cho mọi vertex',
    '2. Chọn vertex chưa tô có sat(v) lớn',
    '   nhất; hòa → degree lớn hơn',
    '3. Gán màu nhỏ nhất chưa có ở vertex kề',
    '4. Không còn màu: dừng — chưa tìm',
    '   được, không chứng minh vô nghiệm',
    '5. Trả về cách tô nếu tô được hết',
  ], fontSize: 12 },
  notes:
    'Thời lượng: ~22s.\n' +
    'Lời đọc: "DSATUR, do Brélaz công bố năm 1979, mỗi vòng chọn vertex chưa tô có độ bão hòa lớn nhất ' +
    '— hòa thì chọn degree lớn hơn. Nó luôn tô đúng hai màu trên đồ thị hai phía, nên trên ví dụ chung ' +
    'nó thành công trong khi greedy thất bại. Trong app, vì mỗi vòng quét lại mọi cặp vertex, chi phí ' +
    'là O(n lập phương cộng n·k)."',
});

// ---- 12. Quay lui ------------------------------------------------------------
SLIDES.push({
  kicker: 'Chương 3 · Năm thuật toán',
  title: 'Thuật toán 4: Quay lui (Backtracking, Levitin §12.1)',
  durationSec: 32,
  blocks: [
    { type: 'bullets', items: [
      'Đúng đắn: chỉ mở rộng cách tô bộ phận hợp lệ → trả về false sau khi duyệt hết nghĩa là chắc chắn vô nghiệm.',
      'Dừng ở nghiệm đầu tiên (bài toán quyết định k màu).',
      'State-space tree có ≤ (n+1)·kⁿ nút. Cận lý thuyết O((n+1)·kⁿ·(Δ+1)); trong app O(n²·kⁿ) vì quét mọi vertex mỗi nút.',
      'Chế độ χ(G): lower bound = clique greedy, upper bound = DSATUR, tăng k dần tới nghiệm đầu tiên.',
    ], fontSize: 14 },
  ],
  side: { type: 'code', title: 'Mã giả', lines: [
    'Backtrack(i):',
    '  if i = n: return true',
    '  v ← order[i]',
    '  for c in 0..k-1:',
    '    if không vertex kề nào màu c:',
    '      color[v] ← c',
    '      if Backtrack(i+1): return true',
    '      color[v] ← chưa tô  // backtrack',
    '  return false',
  ], fontSize: 11.5 },
  notes:
    'Thời lượng: ~24s.\n' +
    'Lời đọc: "Backtracking thử từng màu cho mỗi vertex; trùng màu vertex kề thì loại, hết màu thì ' +
    'backtrack lên vertex trước. Vì mọi nhánh bị cắt đã vi phạm ràng buộc, trả về false sau khi duyệt ' +
    'hết nghĩa là chắc chắn không có cách tô — khác biệt quan trọng so với heuristic. Việc pruning giảm ' +
    'số nút phải thăm rất nhiều. Ở chromatic mode, nó còn tính lower bound bằng clique và upper bound ' +
    'bằng DSATUR."',
});

// ---- 13. Vét cạn --------------------------------------------------------------
SLIDES.push({
  kicker: 'Chương 3 · Năm thuật toán',
  title: 'Thuật toán 5: Vét cạn (Exhaustive search)',
  durationSec: 25,
  blocks: [
    { type: 'bullets', items: [
      'Sinh mọi kⁿ phép gán theo thứ tự từ điển; dừng ở nghiệm đầu tiên hợp lệ.',
      'Cận lý thuyết O(kⁿ·(n+m)); trong app O(kⁿ·n²) vì kiểm tra bằng quét mọi cặp vertex.',
      'Giới hạn an toàn trong app: kⁿ ≤ 200.000 (k-coloring) hoặc Σkⁿ ≤ 200.000, k=1..n (χ, tức n ≤ 6).',
      'Mốc để so sánh "chi phí pruning" của backtracking (20 bước so với 69 bước trên ví dụ chung).',
    ], fontSize: 15 },
  ],
  side: { type: 'code', title: 'Mã giả', lines: [
    'Exhaustive(G, k):',
    '  for mỗi c in {0..k-1}^n',
    '      (thứ tự từ điển):',
    '    if c hợp lệ: return c',
    '  return "vô nghiệm"',
  ], fontSize: 13 },
  notes:
    'Thời lượng: ~16s.\n' +
    'Lời đọc: "Exhaustive search sinh tất cả kⁿ cách gán màu, trả về nghiệm đầu tiên hợp lệ — mốc để ' +
    'so sánh hiệu quả pruning của backtracking. App chỉ cho chạy an toàn khi kⁿ không vượt hai trăm ' +
    'nghìn."',
});

// ---- 14. Bảng so sánh ----------------------------------------------------------
SLIDES.push({
  kicker: 'Chương 3 · Năm thuật toán',
  title: 'Bảng tổng hợp 5 thuật toán',
  durationSec: 26,
  blocks: [
    { type: 'table', headers: ['Thuật toán', 'Kết luận chắc chắn?', 'Độ phức tạp (lý thuyết / trong app)', 'Giới hạn n'], widths: [1.9, 1.7, 4.1, 1.9], fontSize: 11.5, rows: [
      ['Greedy', 'Không', 'O(n·k+m) / O(n·(n+k))', '320'],
      ['Welsh–Powell', 'Không', 'O(n log n+n·k+m) / O(n²+n·k)', '320'],
      ['DSATUR', 'Không (đúng trên đồ thị 2 phía)', 'O(n²+m) / O(n³+n·k)', '320'],
      ['Backtracking', 'Có', 'O((n+1)·kⁿ·(Δ+1)) / O(n²·kⁿ)', '9 (k màu) / 10 (χ)'],
      ['Exhaustive search', 'Có', 'O(kⁿ·(n+m)) / O(kⁿ·n²)', 'kⁿ ≤ 200.000 (~6, χ)'],
    ]},
  ],
  notes:
    'Thời lượng: ~16s.\n' +
    'Lời đọc: "Ba heuristic chạy nhanh nhưng không kết luận chắc chắn. Backtracking và exhaustive search ' +
    'chắc chắn, nhưng chỉ an toàn với đồ thị rất nhỏ — đánh đổi giữa nhanh mà không chắc chắn, và chắc ' +
    'chắn mà tốn chi phí."',
});

// ---- 15. Vì sao heuristic thất bại ---------------------------------------------
SLIDES.push({
  kicker: 'Chương 3 · Năm thuật toán',
  title: 'Vì sao heuristic có thể thất bại',
  durationSec: 26,
  blocks: [
    { type: 'bullets', items: [
      'Đồ thị vương miện 6 vertex: nhóm A = {A1,A2,A3}, nhóm B = {B1,B2,B3}; Ai kỵ mọi Bj trừ Bi → hai phía, χ = 2.',
      'Thứ tự nhập cố ý xen kẽ A1,B1,A2,B2,A3,B3 — đây là thứ tự "xấu" cho greedy/Welsh–Powell.',
      'DSATUR tránh được vì luôn ưu tiên vertex bị ràng buộc nhiều nhất, không phụ thuộc thứ tự nhập.',
      'Đây là ví dụ chung dùng xuyên suốt report, demo và video — số bước phải khớp nhau ở mọi nơi.',
    ], fontSize: 15 },
  ],
  side: { type: 'diagram', kind: 'crown', title: 'Đồ thị vương miện 6 vertex (χ=2)', order: true, coloring: {} },
  notes:
    'Thời lượng: ~18s.\n' +
    'Lời đọc: "Ví dụ chung là đồ thị vương miện sáu vertex: nhóm A và nhóm B, loài Ai kỵ mọi loài Bj ' +
    'trừ Bi. Đây là đồ thị hai phía nên χ bằng 2, nhưng em cố ý nhập thứ tự xen kẽ A, B, A, B để thử thách ' +
    'các thuật toán. DSATUR tránh được bẫy này vì luôn ưu tiên vertex bị ràng buộc nhiều nhất."',
});

// ---- 16. Ví dụ chung: thiết lập dữ liệu (DEMO) ---------------------------------
SLIDES.push({
  kicker: 'Chương 4 · Ví dụ minh họa từng bước',
  title: 'Ví dụ chung: thiết lập dữ liệu',
  demo: true,
  durationSec: 20,
  blocks: [
    { type: 'bullets', items: [
      '6 loài: A1, B1, A2, B2, A3, B3 (đúng thứ tự nhập).',
      'Edges: Ai–Bj với i ≠ j (6 edges).',
      'Chế độ "Tô bằng k màu cho sẵn", k = 2.',
      'JSON dán trực tiếp vào tab "Chỉnh JSON" — dữ liệu cập nhật ngay, không cần nút áp dụng.',
    ], fontSize: 15.5 },
  ],
  side: { type: 'code', title: 'JSON ví dụ chung', fontSize: 11, lines: [
    '{',
    '  "nodes": ["A1","B1","A2",',
    '            "B2","A3","B3"],',
    '  "edges": [',
    '    {"from":"A1","to":"B2"},',
    '    {"from":"A1","to":"B3"},',
    '    {"from":"A2","to":"B1"},',
    '    {"from":"A2","to":"B3"},',
    '    {"from":"A3","to":"B1"},',
    '    {"from":"A3","to":"B2"}],',
    '  "colors": 2',
    '}',
  ]},
  notes:
    'Thời lượng slide: ~12s + demo ~18s (tổng ~30s).\n' +
    'Lời đọc: "Bây giờ em nhập ví dụ chung: sáu loài A1, B1, A2, B2, A3, B3; loài Ai kỵ loài Bj khi i ' +
    'khác j; k bằng 2. Đây là đồ thị hai phía, nhưng em cố ý nhập thứ tự xen kẽ để thử thách các thuật toán."\n' +
    '[CHUYỂN SANG DEMO: https://algorithm-visualizer.hieutk.dev/play/graph-coloring/backtracking → tab "Chỉnh JSON" ' +
    '→ dán JSON ở cột phải → quan sát khung đồ thị cập nhật ngay]',
});

// ---- 17. Quay lui: bế tắc (DEMO) ------------------------------------------------
SLIDES.push({
  kicker: 'Chương 4 · Ví dụ minh họa từng bước',
  title: 'Quay lui — bước 1 đến 9: đi tới bế tắc',
  demo: true,
  durationSec: 25,
  blocks: [
    { type: 'table', headers: ['Bước', 'Vertex', 'Thao tác', 'Mảng màu (A1 B1 A2 B2 A3 B3)'], widths: [0.9, 0.8, 4.2, 3.6], fontSize: 12, rows: [
      ['1', '—', 'Khởi tạo, thứ tự A1 B1 A2 B2 A3 B3', '– – – – – –'],
      ['2', 'A1', 'Gán màu 0', '0 – – – – –'],
      ['3', 'B1', 'Gán màu 0 (không kề A1)', '0 0 – – – –'],
      ['4', 'A2', 'Loại màu 0 (kề B1) → thử tiếp', '0 0 – – – –'],
      ['5', 'A2', 'Gán màu 1', '0 0 1 – – –'],
      ['6', 'B2', 'Loại màu 0 (kề A1) → thử tiếp', '0 0 1 – – –'],
      ['7', 'B2', 'Gán màu 1', '0 0 1 1 – –'],
      ['8', 'A3', 'Loại màu 0 (kề B1)', '0 0 1 1 – –'],
      ['9', 'A3', 'Loại màu 1 (kề B2) → hết màu, bế tắc', '0 0 1 1 – –'],
    ]},
  ],
  notes:
    'Thời lượng slide: ~16s + demo ~20s (tổng ~36s).\n' +
    'Lời đọc: "Em bấm Tiến bước từng bước. Bước 2–3: A1 và B1 nhận màu 0. Bước 4–7: màu trùng vertex kề ' +
    'bị loại, A2 và B2 nhận màu 1. Bước 8–9: A3 kề cả B1 (0) lẫn B2 (1), cả hai màu bị loại — bế tắc. Em ' +
    'chuyển sang state-space tree view để xem hai nhánh này bị cắt."\n' +
    '[CHUYỂN SANG DEMO: Player quay lui, bấm "Chạy" rồi bấm "Tiến bước" 9 lần tới bước 9; dừng ~5 giây ở bước 9; ' +
    'bấm nút chuyển view sang "Cây trạng thái" và zoom vào hai nhánh bị loại dưới A3; chuyển lại view "Đồ thị"]',
});

// ---- 18. Quay lui: quay lui + hoàn tất (DEMO) ------------------------------------
SLIDES.push({
  kicker: 'Chương 4 · Ví dụ minh họa từng bước',
  title: 'Quay lui — bước 10 đến 20: quay lui và hoàn tất',
  demo: true,
  durationSec: 30,
  blocks: [
    { type: 'table', headers: ['Bước', 'Vertex', 'Thao tác', 'Mảng màu (A1 B1 A2 B2 A3 B3)'], widths: [0.9, 0.8, 4.2, 3.6], fontSize: 11.5, rows: [
      ['10', '—', 'Backtrack: bỏ B2=1 (hết màu khả thi)', '0 0 1 – – –'],
      ['11', '—', 'Backtrack: bỏ A2=1', '0 0 – – – –'],
      ['12', '—', 'Backtrack: bỏ B1=0 — gốc của bế tắc', '0 – – – – –'],
      ['13', 'B1', 'Gán màu 1 (đổi màu)', '0 1 – – – –'],
      ['14–19', '…', 'A2=0, B2=1, A3=0, B3=1 — không còn bế tắc', '→ 0 1 0 1 0 1'],
      ['20', '—', 'Hoàn tất: tô thành công, 20 bước, 6 lần pruning', '0 1 0 1 0 1'],
    ]},
  ],
  notes:
    'Thời lượng slide: ~20s + demo ~20s (tổng ~40s).\n' +
    'Lời đọc: "Bước 10–12: backtrack qua B2, qua A2, dừng ở B1 — gốc của bế tắc là B1 cùng màu với A1. ' +
    'Bước 13: B1 đổi sang màu 1, và đến bước 20 thì tô xong — hai mươi bước, sáu lần pruning. Em có ' +
    'thể lùi về bất kỳ bước nào. Checker xác nhận đây là cách tô hợp lệ."\n' +
    '[CHUYỂN SANG DEMO: tiếp tục bấm "Tiến bước" tới bước 20; bấm "Lùi bước" về bước 12 để minh họa có thể xem ' +
    'lại; chỉ vào vùng kết quả/checker ở dưới Player]',
});

// ---- 19. So sánh 5 thuật toán (DEMO) --------------------------------------------
SLIDES.push({
  kicker: 'Chương 4 · Ví dụ minh họa từng bước',
  title: 'So sánh 5 thuật toán trên ví dụ chung',
  demo: true,
  durationSec: 30,
  blocks: [
    { type: 'bullets', items: [
      'Mỗi thuật toán có checkbox riêng để bật/tắt khỏi so sánh; dropdown "Đồng bộ" đồng bộ các lane: Độc lập / % tiến độ / Giai đoạn / Số bước.',
      'Mỗi lane có thanh trượt "Bước {tên thuật toán}" riêng; bảng kết quả có cột "Trung vị ms", và nút "Đo hiệu năng theo n" mở biểu đồ benchmark.',
    ], fontSize: 12.5 },
    { type: 'table', headers: ['Thuật toán', 'Số bước', 'Phép toán', 'Kết quả'], widths: [2.0, 1.3, 1.3, 4.8], fontSize: 12.5, rows: [
      ['Greedy', '7', '5', '"Chưa tìm được" — hết màu ở A3'],
      ['Welsh–Powell', '7', '5', 'Giống Greedy — mọi vertex cùng degree 2'],
      ['DSATUR', '14', '6', 'Tô thành công: [0,1,0,1,0,1]'],
      ['Backtracking', '20', '21', 'Tô thành công: [0,1,0,1,0,1]'],
      ['Exhaustive search', '69', '67', 'Tô thành công: nghiệm đầu tiên ở lá thứ 22'],
    ]},
  ],
  notes:
    'Thời lượng slide: ~20s + demo ~24s (tổng ~44s).\n' +
    'Lời đọc: "Trên trang So sánh, năm thuật toán chạy cùng lúc — mỗi thuật toán có checkbox riêng, và ' +
    'dropdown Đồng bộ đồng bộ các lane theo phần trăm tiến độ, giai đoạn hoặc số bước. Greedy và ' +
    'Welsh–Powell báo chưa tìm được. DSATUR thành công trong mười bốn bước. Backtracking chỉ cần hai ' +
    'mươi bước so với sáu mươi chín của exhaustive search."\n' +
    '[CHUYỂN SANG DEMO: https://algorithm-visualizer.hieutk.dev/compare/graph-coloring → dán lại JSON ví dụ chung ' +
    'vào trình nhập → TRƯỚC KHI chạy: tắt/bật thử 1 checkbox thuật toán để minh họa, rồi đảm bảo lại đủ 5 ' +
    'checkbox được chọn → mở dropdown "Đồng bộ" và chọn "% tiến độ" → bấm "Chạy tất cả" (cả 5 kết quả cùng ' +
    'xuất hiện vì không còn checkbox nào bị tắt) → kéo thử thanh trượt "Bước" của một lane → zoom vào cột số ' +
    'bước/phép toán và cột "Trung vị ms" → bấm nút "Đo hiệu năng theo n" → zoom vào biểu đồ benchmark hiện ra]',
});

// ---- 20. Chế độ χ(G) (DEMO) ------------------------------------------------------
SLIDES.push({
  kicker: 'Chương 4 · Ví dụ minh họa từng bước',
  title: 'Chế độ "Tìm sắc số χ(G)" trên ví dụ chung',
  demo: true,
  durationSec: 22,
  blocks: [
    { type: 'table', headers: ['Thuật toán', 'Số màu dùng', 'Số bước', 'Kết quả'], widths: [2.1, 1.7, 1.4, 3.6], fontSize: 13, rows: [
      ['Greedy', '3', '8', 'Hợp lệ nhưng chưa tối ưu'],
      ['Welsh–Powell', '3', '8', 'Hợp lệ nhưng chưa tối ưu'],
      ['DSATUR', '2', '14', 'Tối ưu'],
      ['Backtracking', '2', '22', 'χ = 2, chính xác'],
      ['Exhaustive search', '2', '78', 'χ = 2, chính xác'],
    ]},
  ],
  notes:
    'Thời lượng slide: ~14s + demo ~14s (tổng ~28s).\n' +
    'Lời đọc: "Ở chromatic mode, greedy tô được nhưng dùng ba màu, trong khi χ thật chỉ bằng hai. ' +
    'DSATUR, backtracking và exhaustive search đều dùng đúng hai màu — một góc nhìn khác của cùng phản ví dụ."\n' +
    '[CHUYỂN SANG DEMO: vẫn ở trang So sánh, trong trình nhập đổi chế độ sang "Tìm sắc số χ(G)" → bấm "Chạy tất ' +
    'cả" lại → chỉ vào cột "Giá trị" (số màu)]',
});

// ---- 21. Giao diện Player 1/2 (DEMO) ----------------------------------------------
SLIDES.push({
  kicker: 'Dạo qua giao diện',
  title: 'Giao diện Player (1/2) — điều hướng và nhập liệu',
  demo: true,
  durationSec: 20,
  blocks: [
    { type: 'bullets', items: [
      'Thanh bên: tìm bài theo chương sách, theo kỹ thuật thiết kế, hoặc theo tên bài toán (Ctrl+K).',
      'Nút chuyển nhanh giữa 5 cách giải của cùng bài toán: Greedy, Welsh–Powell, DSATUR, Backtracking, Exhaustive search.',
      'Trình nhập dữ liệu: JSON, bộ sinh ngẫu nhiên theo seed, đồ thị mẫu kinh điển (Vương miện, Kₙ, Cₙ, K(p,q), Petersen, Grötzsch).',
      'Khung đồ thị: màu từng vertex ghi bằng số trên nhãn, vertex đang xét được làm nổi bật.',
    ], fontSize: 15 },
  ],
  notes:
    'Thời lượng slide: ~14s + demo ~16s (tổng ~30s).\n' +
    'Lời đọc: "Đây là trang Player. Bên trái là thanh điều hướng theo chương, kỹ thuật hoặc tên bài. ' +
    'Phía trên là nút chuyển nhanh giữa năm cách giải. Giữa là khung đồ thị, cho thấy màu từng vertex và ' +
    'vertex đang xét."\n' +
    '[CHUYỂN SANG DEMO: /play/graph-coloring/backtracking → lướt qua thanh bên, nút chuyển 5 thuật toán, trình ' +
    'nhập liệu (JSON / sinh ngẫu nhiên / mẫu), rồi khung đồ thị — không bấm chạy]',
});

// ---- 22. Giao diện Player 2/2 (DEMO) ----------------------------------------------
SLIDES.push({
  kicker: 'Dạo qua giao diện',
  title: 'Giao diện Player (2/2) — điều khiển và 2 cách xem',
  demo: true,
  durationSec: 26,
  blocks: [
    { type: 'bullets', items: [
      'Khung mã giả: dòng đang chạy được tô đậm.',
      'Thẻ "Giải thích bước": lời giải thích tiếng Việt cho từng bước.',
      'Thẻ "Trạng thái": hiển thị Giai đoạn hiện tại của thuật toán (place / reject / backtrack / done).',
      'Thanh điều khiển: tiến / lùi / tua / tốc độ, có phím tắt.',
      'Nút chuyển view giữa "Đồ thị" và "Cây trạng thái" — cây đánh dấu riêng các nhánh bị cắt (pruned).',
      'Toàn giao diện chỉ dùng trắng/đen/xám — trạng thái phân biệt bằng độ đậm và viền, không phụ thuộc màu sắc.',
    ], fontSize: 13 },
  ],
  notes:
    'Thời lượng slide: ~19s + demo ~16s (tổng ~35s).\n' +
    'Lời đọc: "Bên cạnh là mã giả với dòng đang chạy tô đậm, thẻ Giải thích bước bằng tiếng Việt, và thẻ ' +
    'Trạng thái hiển thị giai đoạn hiện tại — place, reject, backtrack hoặc done. Thanh điều khiển cho ' +
    'tiến, lùi, tua, tốc độ, có phím tắt. Giao diện chỉ dùng trắng đen — trạng thái phân biệt bằng độ ' +
    'đậm và viền, không dựa vào màu sắc."\n' +
    '[CHUYỂN SANG DEMO: tiếp tục ở Player — khoanh khung mã giả, thẻ "Giải thích bước", thẻ "Trạng thái" (chỉ ' +
    'vào dòng "Giai đoạn: …"), thanh điều khiển, rồi bấm nút chuyển view sang "Cây trạng thái" rồi chuyển lại]',
});

// ---- 23. Input không hợp lệ (DEMO) --------------------------------------------------
SLIDES.push({
  kicker: 'Dạo qua giao diện',
  title: 'Dữ liệu không hợp lệ bị từ chối ngay khi nhập',
  demo: true,
  durationSec: 15,
  blocks: [
    { type: 'bullets', items: [
      'Validation chạy ngay khi dán JSON, không cần bấm nút áp dụng.',
      'colors = 0 vi phạm ràng buộc 1 ≤ k ≤ 10 → app báo lỗi, không cho chạy.',
      'Mục đích: tránh crash hoặc kết quả vô nghĩa khi người dùng nhập sai.',
    ], fontSize: 16 },
  ],
  side: { type: 'code', title: 'JSON không hợp lệ', lines: [
    '{',
    '  "nodes": ["A"],',
    '  "edges": [],',
    '  "colors": 0',
    '}',
  ], fontSize: 13 },
  notes:
    'Thời lượng slide: ~9s + demo ~10s (tổng ~19s).\n' +
    'Lời đọc: "App kiểm tra dữ liệu ngay khi nhập. Nhập sai, ví dụ số màu bằng 0, app từ chối ngay."\n' +
    '[CHUYỂN SANG DEMO: ở tab "Chỉnh JSON", dán JSON có colors:0 → chỉ vào thông báo lỗi xuất hiện ngay → dán ' +
    'lại JSON ví dụ chung để chuẩn bị cho các cảnh sau]',
});

// ---- 24. Trang Testcase (DEMO) --------------------------------------------------------
SLIDES.push({
  kicker: 'Dạo qua giao diện',
  title: 'Trang Testcase — 22 ca, xuất CSV/JSON',
  demo: true,
  durationSec: 29,
  blocks: [
    { type: 'bullets', items: [
      '22 testcase, chia 6 nhóm: thông thường, biên, nhỏ, lớn, đặc biệt, không hợp lệ.',
      'Chạy toàn bộ bằng một nút, kết quả "Đạt 22/22".',
      'Hầu hết các nhánh thuật toán được phủ bằng 22 file testcase này (có nghiệm, vô nghiệm, χ đã biết, vượt giới hạn…).',
      'Riêng nhánh "heuristic bế tắc dù đồ thị có nghiệm" được phủ bằng 1 unit test của greedy — chưa có file testcase riêng.',
      'Thẻ "Hiệu năng theo n": nút "Đo thời gian" mở biểu đồ thời gian chạy theo n.',
      'Xuất kết quả CSV/JSON để đưa trực tiếp vào report.',
    ], fontSize: 12.5 },
  ],
  notes:
    'Thời lượng slide: ~20s + demo ~18s (tổng ~38s).\n' +
    'Lời đọc: "Trang Testcase chạy toàn bộ dữ liệu, chia sáu nhóm, đạt 22 trên 22 ca. Phần lớn nhánh ' +
    'thuật toán được phủ ngay trong 22 file này; riêng heuristic bế tắc dù đồ thị có nghiệm thì được ' +
    'phủ bằng một unit test của greedy, chưa có file riêng. Thẻ Hiệu năng theo n còn cho đo thời gian ' +
    'chạy theo kích thước n. Kết quả xuất CSV hoặc JSON để đưa vào report."\n' +
    '[CHUYỂN SANG DEMO: /testcases/graph-coloring → bấm chạy toàn bộ → dừng ở dòng "Đạt 22/22" → cuộn qua các ' +
    'nhóm → cuộn tới thẻ "Hiệu năng theo n", bấm nút "Đo thời gian" → zoom vào biểu đồ hiện ra → bấm xuất ' +
    'CSV/JSON]',
});

// ---- 25. Đồ thị lớn & giới hạn an toàn (DEMO) -------------------------------------------
SLIDES.push({
  kicker: 'Dạo qua giao diện',
  title: 'Đồ thị lớn và giới hạn an toàn của thuật toán chính xác',
  demo: true,
  durationSec: 22,
  blocks: [
    { type: 'bullets', items: [
      'Sinh ngẫu nhiên n = 300, p = 0,1, seed = 1, chế độ χ(G).',
      'Ba heuristic vẫn chạy ra kết quả (không ghi trace vì n > 10) — DSATUR dùng ít màu nhất.',
      'Backtracking/exhaustive search báo "Không áp dụng" thay vì treo trình duyệt.',
    ], fontSize: 16 },
  ],
  side: { type: 'code', title: 'Thông báo thật của app (precondition)', fontSize: 11, lines: [
    'Không áp dụng: Quay lui tìm χ(G)',
    'chỉ an toàn với đồ thị ≤ 10 đỉnh',
    'khi giữ thứ tự duyệt đã cho (đồ',
    'thị hiện có 300 đỉnh).',
  ]},
  notes:
    'Thời lượng slide: ~15s + demo ~16s (tổng ~31s).\n' +
    'Lời đọc: "Với đồ thị ba trăm vertex, các heuristic vẫn chạy được, DSATUR dùng ít màu nhất. Thuật ' +
    'toán chính xác báo rõ "không áp dụng" thay vì treo trình duyệt."\n' +
    '[CHUYỂN SANG DEMO: /compare/graph-coloring → trình nhập chọn "Tìm sắc số χ(G)", bộ sinh ngẫu nhiên n=300, ' +
    'p=0,1, seed=1 → "Chạy tất cả" (xem 3 heuristic ra kết quả); sau đó mở /play/graph-coloring/backtracking, ' +
    'sinh lại cùng đồ thị, bấm "Chạy" → chỉ vào thông báo "Không áp dụng: …"]',
});

// ---- 26. Tiến trình phát triển ----------------------------------------------------------
SLIDES.push({
  kicker: 'Chương 5 · Tường thuật quá trình thiết kế và xây dựng',
  title: 'Tiến trình phát triển',
  durationSec: 25,
  blocks: [
    { type: 'table', headers: ['#', 'Giai đoạn', 'Kết quả'], widths: [0.5, 4.3, 4.3], fontSize: 12, rows: [
      ['1–3', 'Phân tích đề → khảo sát sách → thiết kế kiến trúc', 'Note cấu trúc, danh mục ~60 thuật toán, kiến trúc đã chốt'],
      ['4–5', 'Bản đầu (cái túi 0/1) → deploy', 'PR #1 (11/10); chuyển sang Cloudflare Pages'],
      ['6–8', 'Nền tảng catalog → 5 nhóm song song → tích hợp', 'PR #2–#8, merge 12/10'],
      ['9–10', 'Domain riêng → chiến lược report', 'algorithm-visualizer.hieutk.dev (17/10)'],
      ['11', 'Nâng cấp tô màu: χ(G), đồ thị lớn, 22 testcase', '3 vòng CHANGES REQUESTED → PR #12, merge 18/10'],
    ]},
  ],
  notes:
    'Thời lượng: ~18s.\n' +
    'Lời đọc: "Mười một giai đoạn chính: phân tích đề, khảo sát sách Levitin, thiết kế kiến trúc, bản ' +
    'đầu cái túi, mở nền tảng dùng chung, làm song song năm nhóm, tích hợp, gắn domain riêng, và cuối ' +
    'cùng nâng cấp sâu bài tô màu — qua ba vòng bị yêu cầu sửa trước khi merge."',
});

// ---- 27. Dùng AI: công cụ & nguyên tắc review chéo -------------------------------------
SLIDES.push({
  kicker: 'Chương 5 · Tường thuật quá trình thiết kế và xây dựng',
  title: 'Dùng AI trong xây dựng — công cụ và nguyên tắc',
  durationSec: 28,
  blocks: [
    { type: 'bullets', items: [
      { text: 'Toàn bộ mã nguồn do AI sinh: Claude Code (Anthropic) và Codex (OpenAI).', bold: true },
      'Sinh viên KHÔNG tự viết code và KHÔNG tự review code.',
      'Nguyên tắc review chéo khác hãng: việc do Claude Code làm thì Codex review, và ngược lại.',
      'Reviewer chỉ nhận bản diff cố định theo commit, không được sửa code; lỗi chặn gửi lại kèm yêu cầu test hồi quy fail trên code cũ.',
    ], fontSize: 14.5 },
  ],
  side: { type: 'table', title: 'Việc sinh viên trực tiếp làm', headers: ['Việc'], widths: [4.9], fontSize: 11, rows: [
    ['Đặt yêu cầu, phạm vi (toàn bộ sách, không chỉ 1 bài)'],
    ['Chọn công nghệ, phong cách UI (shadcn, trắng đen)'],
    ['Chọn deploy Cloudflare Pages, domain riêng'],
    ['Yêu cầu các mô hình AI tranh luận chiến lược'],
    ['Merge PR sau khi review chéo đạt (mergedBy: tkhieu)'],
    ['Xử lý agent bị chặn (duyệt ngân sách, đăng nhập lại)'],
  ]},
  notes:
    'Thời lượng: ~20s.\n' +
    'Lời đọc: "Toàn bộ mã nguồn được sinh bằng AI: Claude Code và Codex. Em không tự viết code và không ' +
    'tự review code — nguyên tắc là việc do Claude Code làm thì Codex review, và ngược lại. Việc em trực ' +
    'tiếp làm là đặt yêu cầu, chọn công nghệ và giao diện, chọn nơi deploy, và quyết định merge."',
});

// ---- 28. Prompt mẫu ---------------------------------------------------------------------
SLIDES.push({
  kicker: 'Chương 5 · Tường thuật quá trình thiết kế và xây dựng',
  title: 'Prompt mẫu (trích nguyên văn)',
  durationSec: 25,
  blocks: [
    { type: 'quotes', items: [
      { label: 'Prompt thiết kế giao diện (nguyên văn, giữ nguyên chính tả gốc)', text: 'Hãy chọn 1 đề tài mà bạn nghĩ là hợp lý,. build theo kiến trúc khuyến nghhị, build cho tới khi xong có thể demo đựoc. UI chọn shadcn ui tông màu sáng. trắng đen.' },
      { label: 'Prompt giao việc nhóm B5 (trích đoạn đầu, log c6dcc10b)', text: '/goal IMPLEMENT group B5 (tsp, assignment, n-queens, hamiltonian-circuit, subset-sum, graph-coloring (bai So thu), matrix-chain, lcs…' },
      { label: 'Prompt review lượt 2 (nguyên văn, log 04cbfb0d)', text: 'REVIEW (cross-vendor; fixes by Codex, original by Claude Code) of catalog group B5… Previous review FAILED with 8 blocking issues…' },
    ] },
  ],
  notes:
    'Thời lượng: ~17s.\n' +
    'Lời đọc: "Ba prompt trích nguyên văn: yêu cầu thiết kế giao diện, giữ cả lỗi chính tả gốc; lệnh giao ' +
    'việc cho nhóm B5 có bài tô màu; và một lượt review chéo ghi rõ lượt trước FAIL với tám lỗi chặn. ' +
    'Đầy đủ các prompt khác ở report, Phụ lục D."',
});

// ---- 29. Sự cố tiêu biểu --------------------------------------------------------------------
SLIDES.push({
  kicker: 'Chương 5 · Tường thuật quá trình thiết kế và xây dựng',
  title: 'Các sự cố tiêu biểu khi dùng AI và cách xử lý',
  durationSec: 35,
  blocks: [
    { type: 'table', headers: ['#', 'Lỗi AI gây ra', 'Ai phát hiện', 'Cách sửa'], widths: [0.4, 3.9, 1.7, 3.4], fontSize: 11, rows: [
      ['1', 'Checker tự tham chiếu + heuristic khẳng định sai "vô nghiệm"', 'Review chéo (Codex)', 'Oracle existsColoring độc lập + cờ heuristic'],
      ['2', 'Nhánh cận đánh dấu sai nút tốt nhất là "bị cắt"', 'Review chéo (Claude Code)', '8 test hồi quy, fail trên code cũ'],
      ['3', 'Lời giải tham chiếu tự tham chiếu (B1, B4, B5)', 'Review chéo', 'Thay oracle độc lập (đếm, mô phỏng, Held-Karp…)'],
      ['4', '136/184 file viết dồn 1 dòng (>1.000 ký tự/dòng)', 'Review chéo', 'Format lại — chỉ sửa dòng cần thiết, tránh đụng file chung'],
    ]},
  ],
  notes:
    'Thời lượng: ~24s.\n' +
    'Lời đọc: "Bốn sự cố. Checker bài tô màu từng tự tham chiếu chính thuật toán đang kiểm — sửa bằng ' +
    'oracle độc lập. Ở bài cái túi, nút nghiệm tốt nhất bị đánh dấu sai là bị cắt — tám test hồi quy ' +
    'fail trên code cũ xác nhận. Nhiều lời giải tham chiếu khác cũng tự tham chiếu, và 136 file bị viết ' +
    'dồn một dòng. Cả bốn đều do reviewer hãng khác phát hiện."',
});

// ---- 30. Bài học rút ra ---------------------------------------------------------------------
SLIDES.push({
  kicker: 'Chương 5 · Tường thuật quá trình thiết kế và xây dựng',
  title: 'Bài học rút ra khi dùng AI',
  durationSec: 28,
  blocks: [
    { type: 'bullets', items: [
      { text: 'AI làm tốt:', bold: true },
      'dựng nhanh hệ thống lớn (47 bài toán, 126 cách giải trong ~22 giờ), giữ đúng kiến trúc chung, tự viết test.',
      { text: 'AI hay sai:', bold: true },
      'test tự tham chiếu; trace minh họa sai dù đáp án đúng; "làm cho có"; code khó đọc.',
      { text: 'Vẫn phải do người kiểm:', bold: true },
      'phạm vi và tính trung thực của report; chạy tay để hiểu thuật toán; quyết định merge.',
    ], fontSize: 15 },
  ],
  notes:
    'Thời lượng: ~18s.\n' +
    'Lời đọc: "AI dựng nhanh hệ thống lớn và tự viết test, nhưng hay sai ở chỗ cần chính xác tinh vi — ' +
    'đều do reviewer hãng khác phát hiện. Vẫn cần người quyết định phạm vi, tính trung thực của report, ' +
    'và việc merge."',
});

// ---- 31. Thiết kế thực nghiệm ------------------------------------------------------------
SLIDES.push({
  kicker: 'Chương 6 · Thiết kế thực nghiệm',
  title: 'Thiết kế thực nghiệm — bộ testcase',
  durationSec: 26,
  blocks: [
    { type: 'bullets', items: [
      'Viết tay (ca nhỏ, đáp án dễ thấy) + dựng có chủ đích (đồ thị kinh điển đã biết χ) + sinh ngẫu nhiên theo seed.',
      'App tự hạ xác suất edge p để kỳ vọng số edges ≤ 7.200, từ chối nếu số edges thực vượt 8.000.',
      '22 file testcase, xuất qua lệnh export của app ra testcases/graph-coloring/.',
    ], fontSize: 15.5 },
  ],
  side: { type: 'table', title: '6 nhóm testcase', headers: ['Nhóm', 'Số file', 'Mục đích'], widths: [1.3, 0.8, 2.7], fontSize: 10.5, rows: [
    ['Thông thường', '5', 'Ca điển hình'],
    ['Biên', '3', 'Min/rỗng'],
    ['Nhỏ', '2', 'Kiểm tay được'],
    ['Lớn', '5', 'n đến 310, kiểm hiệu năng'],
    ['Đặc biệt', '5', 'Kₙ, Petersen, Grötzsch…'],
    ['Không hợp lệ', '2', 'k=0, mode sai'],
  ]},
  notes:
    'Thời lượng: ~18s.\n' +
    'Lời đọc: "Bộ testcase xây bằng ba cách: viết tay, dựng có chủ đích từ đồ thị kinh điển đã biết χ, và ' +
    'sinh ngẫu nhiên theo seed. Hai mươi hai file, chia sáu nhóm, mỗi nhóm nhắm một nhánh cần phủ."',
});

// ---- 32. Hiệu năng đồ thị lớn --------------------------------------------------------------
SLIDES.push({
  kicker: 'Chương 7 · Đánh giá',
  title: 'Hiệu năng trên đồ thị ngẫu nhiên lớn (G(n, p=0,1), 5 seed, trung vị)',
  durationSec: 26,
  blocks: [
    { type: 'table', headers: ['n', 'Greedy (ms / màu)', 'Welsh–Powell (ms / màu)', 'DSATUR (ms / màu)'], widths: [0.8, 3.2, 3.2, 3.2], fontSize: 13, rows: [
      ['50', '0,098 / 5', '0,241 / 4', '1,173 / 4'],
      ['100', '0,279 / 7', '0,692 / 6', '7,958 / 6'],
      ['200', '1,359 / 12', '3,181 / 10', '64,816 / 8'],
      ['300', '3,579 / 14', '7,363 / 13', '203,489 / 11'],
    ]},
  ],
  notes:
    'Thời lượng: ~18s.\n' +
    'Lời đọc: "DSATUR dùng ít màu nhất ở mọi kích thước — mười một so với mười bốn của greedy ở n=300. ' +
    'Nhưng greedy nhanh nhất; DSATUR tăng theo n lập phương, khớp độ phức tạp đã phân tích."',
});

// ---- 33. Đánh giá ----------------------------------------------------------------------------
SLIDES.push({
  kicker: 'Chương 7 · Đánh giá',
  title: 'Đánh giá: tính đúng, trực quan, hạn chế',
  durationSec: 40,
  blocks: [
    { type: 'bullets', items: [
      { text: 'Tính đúng:', bold: true },
      '"Đạt 22/22"; 314/314 e2e pass trên chính domain https://algorithm-visualizer.hieutk.dev; 825 unit test.',
      'Backtracking: so với oracle độc lập existsColoring, trên nhiều seed/kích thước. Exhaustive search: so với backtracking trên nhiều input, cộng kiểm trực tiếp bằng oracle χ(G) trên vài đồ thị nhỏ (vương miện, chu trình).',
      { text: 'Trực quan:', bold: true },
      'mỗi bước có mã giả + giải thích + trạng thái đồ thị; lùi được bất kỳ bước; state-space tree thấy rõ lúc backtrack.',
      { text: 'Hạn chế:', bold: true },
      'thuật toán chính xác chỉ chạy đồ thị nhỏ; với n > 12 không biết χ thật; heuristic không bảo đảm; toàn bộ code do AI sinh, có thể còn lỗi chưa phát hiện.',
    ], fontSize: 12 },
  ],
  notes:
    'Thời lượng: ~34s.\n' +
    'Lời đọc: "Tính đúng: đạt 22/22 testcase, 314/314 e2e pass trên domain thật. Backtracking kiểm bằng ' +
    'oracle existsColoring; exhaustive search so với backtracking trên nhiều input, cộng oracle χ(G) ' +
    'trên vài đồ thị nhỏ như vương miện, chu trình. Trực quan: mỗi bước có mã giả, giải thích, trạng ' +
    'thái đồ thị, lùi được bất kỳ bước. Hạn chế: thuật toán chính xác chỉ chạy đồ thị nhỏ, trên 12 ' +
    'vertex không biết χ thật, code do AI sinh có thể còn lỗi."',
});

// ---- 34. Hướng phát triển & mở rộng ---------------------------------------------------------
SLIDES.push({
  kicker: 'Chương 7–8 · Hướng phát triển và mở rộng',
  title: 'Hướng phát triển & mở rộng: toàn bộ sách Levitin',
  durationSec: 32,
  blocks: [
    { type: 'bullets', items: [
      { text: 'Hướng phát triển:', bold: true },
      'thêm nhánh cận (clique + DSATUR) để tìm χ(G) trên đồ thị lớn hơn; thêm biến thể (edge coloring, list coloring); nhập đồ thị bằng vẽ tay.',
      { text: 'Mở rộng đã có (≈30s):', bold: true },
      'cùng nền tảng Player/So sánh/Testcase phục vụ 47 bài toán, 126 cách giải — phần lớn theo sách Levitin (Dijkstra, LCS, TSP, n-hậu…), một số ngoại lệ ngoài sách được ghi rõ trong app (DSATUR, Hungarian). Phần chấm điểm chính vẫn là bài Tô màu đồ thị.',
    ], fontSize: 13.5 },
  ],
  demo: true,
  notes:
    'Thời lượng slide: ~18s + demo ~10s (tổng ~28s).\n' +
    'Lời đọc: "Hướng tới: thêm nhánh cận để tìm χ(G) trên đồ thị lớn hơn, thêm biến thể như edge coloring. ' +
    'Nền tảng này còn dùng cho 47 bài toán, 126 cách giải — phần lớn theo Levitin, trừ vài ngoại lệ app ' +
    'ghi rõ như DSATUR, Hungarian. Phần nộp chấm chính vẫn là bài tô màu đồ thị."\n' +
    '[CHUYỂN SANG DEMO: /algorithms → Ctrl+K gõ "Dijkstra" → mở Player Dijkstra (hoặc LCS) → cho chạy 3–4 bước]',
});

// ---- 35. Kết thúc -----------------------------------------------------------------------------
SLIDES.push({
  kind: 'closing',
  title: 'Cảm ơn cô đã xem',
  durationSec: 18,
  demo: true,
  lines: [
    'Hạn chế: thuật toán chính xác chỉ chạy đồ thị nhỏ; heuristic không bảo đảm tìm nghiệm.',
    'Mã nguồn được sinh bằng AI (Claude Code, Codex), kiểm chứng bằng review chéo và test độc lập — chi tiết trong report.',
    'Demo trực tuyến: algorithm-visualizer.hieutk.dev',
  ],
  notes:
    'Thời lượng slide: ~12s + demo ~8s (tổng ~20s).\n' +
    'Lời đọc: "Hạn chế: thuật toán chính xác chỉ chạy đồ thị nhỏ, heuristic không bảo đảm nghiệm. Mã ' +
    'nguồn sinh bằng AI, kiểm chứng bằng review chéo và test độc lập — chi tiết trong report. Em cảm ơn ' +
    'cô đã xem video."\n' +
    '[CHUYỂN SANG DEMO: mở lại Player quay lui, dán JSON ví dụ chung, bấm "Chạy", tua tới bước 20, đứng yên hình]',
});

// ---------------------------------------------------------------------------
// Dựng pptx
// ---------------------------------------------------------------------------

function buildTitleSlide(pptx, spec, index, total) {
  const slide = pptx.addSlide();
  slide.background = { color: C.bg };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: SLIDE_W, h: 0.14, fill: { color: C.ink }, line: { type: 'none' } });
  slide.addText('CS112 — BÀI TẬP LỚN · PHÂN TÍCH VÀ THIẾT KẾ THUẬT TOÁN', {
    x: MARGIN_X, y: 1.5, w: FULL_W, h: 0.4, fontFace: FONT, fontSize: 14, color: C.mute, bold: true, charSpacing: 1,
  });
  slide.addText(spec.title, {
    x: MARGIN_X, y: 2.0, w: FULL_W, h: 1.6, fontFace: FONT, fontSize: 38, bold: true, color: C.ink, valign: 'top', lineSpacing: 44,
  });
  slide.addText(spec.subtitle, {
    x: MARGIN_X, y: 3.55, w: FULL_W, h: 0.7, fontFace: FONT, fontSize: 18, color: C.sub, italic: true,
  });
  slide.addShape(pptx.ShapeType.line, { x: MARGIN_X, y: 4.5, w: 2.2, h: 0, line: { color: C.ink, width: 2 } });
  slide.addText(bulletParas(spec.meta, { fontSize: 15, color: C.sub }), {
    x: MARGIN_X, y: 4.75, w: FULL_W, h: 1.8, fontFace: FONT, valign: 'top', lineSpacing: 24,
  });
  slide.addText(`${index} / ${total}`, { x: SLIDE_W - MARGIN_X - 0.9, y: SLIDE_H - 0.42, w: 0.9, h: 0.3, fontFace: FONT, fontSize: 10, color: C.mute, align: 'right' });
  slide.addNotes(spec.notes);
  return slide;
}

function buildClosingSlide(pptx, spec, index, total) {
  const slide = pptx.addSlide();
  slide.background = { color: C.ink };
  slide.addText(spec.title, {
    x: MARGIN_X, y: 2.3, w: FULL_W, h: 1.0, fontFace: FONT, fontSize: 40, bold: true, color: C.badgeFg, align: 'center',
  });
  renderBullets(slide, spec.lines, MARGIN_X + 1.2, 3.6, FULL_W - 2.4, { fontSize: 16, color: 'D4D4D8', h: 2.6 });
  slide.addText(`${index} / ${total}`, { x: SLIDE_W - MARGIN_X - 0.9, y: SLIDE_H - 0.42, w: 0.9, h: 0.3, fontFace: FONT, fontSize: 10, color: C.mute, align: 'right' });
  slide.addNotes(spec.notes);
  return slide;
}

function buildContentSlide(pptx, spec, index, total) {
  const slide = pptx.addSlide();
  addChrome(slide, pptx, { kicker: spec.kicker, title: spec.title, demo: spec.demo, index, total });

  const hasSide = !!spec.side;
  const mainW = hasSide ? MAIN_W : FULL_W;
  let cy = CONTENT_TOP;

  for (const block of spec.blocks || []) {
    if (block.type === 'bullets') {
      const h = heightForBullets(block.items.length, block.fontSize || 16);
      renderBullets(slide, block.items, MARGIN_X, cy, mainW, { fontSize: block.fontSize || 16, h });
      cy += h + 0.15;
    } else if (block.type === 'table') {
      const bottom = renderTable(slide, pptx, block, MARGIN_X, cy, mainW, { fontSize: block.fontSize || 13 });
      cy = bottom + 0.15;
    } else if (block.type === 'quotes') {
      cy = renderQuotes(slide, pptx, block.items, MARGIN_X, cy, mainW) + 0.1;
    }
  }

  if (hasSide) {
    const side = spec.side;
    if (side.title) {
      slide.addText(side.title, {
        x: SIDE_X, y: CONTENT_TOP, w: SIDE_W, h: 0.3,
        fontFace: FONT, fontSize: 12, bold: true, color: C.sub,
      });
    }
    const sideTop = CONTENT_TOP + (side.title ? 0.4 : 0);
    if (side.type === 'table') {
      renderTable(slide, pptx, side, SIDE_X, sideTop, SIDE_W, { fontSize: side.fontSize || 11 });
    } else if (side.type === 'code') {
      renderCode(slide, pptx, side.lines, SIDE_X, sideTop, SIDE_W, { fontSize: side.fontSize || 12 });
    } else if (side.type === 'diagram' && side.kind === 'crown') {
      drawCrownGraph(slide, pptx, SIDE_X, sideTop, SIDE_W, 3.0, { order: side.order, coloring: side.coloring });
      if (side.caption) {
        slide.addText(side.caption, {
          x: SIDE_X, y: sideTop + 3.1, w: SIDE_W, h: 1.1,
          fontFace: FONT, fontSize: 11, italic: true, color: C.sub, valign: 'top', lineSpacing: 15,
        });
      }
    } else if (side.type === 'code-stack') {
      let sy = sideTop;
      for (const sub of side.blocks) {
        slide.addText(sub.title, {
          x: SIDE_X, y: sy, w: SIDE_W, h: 0.26,
          fontFace: FONT, fontSize: 11, bold: true, color: C.sub,
        });
        sy = renderCode(slide, pptx, sub.lines, SIDE_X, sy + 0.3, SIDE_W, { fontSize: sub.fontSize || 10.5, lineH: 0.21 });
        sy += 0.18;
      }
    }
  }

  slide.addNotes(spec.notes);
  return slide;
}

if (process.env.NARR_DUMP) {
  SLIDES.forEach((spec, i) => {
    const line = (spec.notes || '').split('\n').find((l) => l.startsWith('Lời đọc:'));
    console.log(`#${i + 1} ${spec.title || ''}\n${line}\n`);
  });
  process.exit(0);
}

if (process.env.DUR_CHECK) {
  const WPM = 145;
  let sumSlide = 0, sumWords = 0, sumSpeechSec = 0, sumDemoExtra = 0;
  SLIDES.forEach((spec, i) => {
    const line = (spec.notes || '').split('\n').find((l) => l.startsWith('Lời đọc:'));
    const words = line ? line.replace(/^Lời đọc:\s*"?/, '').replace(/"?$/, '').split(/\s+/).filter(Boolean).length : 0;
    const speechSec = (words / WPM) * 60;
    const demoMatch = (spec.notes || '').match(/demo ~(\d+)s/);
    const demoExtra = demoMatch ? Number(demoMatch[1]) : 0;
    sumSlide += spec.durationSec || 0;
    sumWords += words;
    sumSpeechSec += speechSec;
    sumDemoExtra += demoExtra;
    console.log(
      `#${i + 1}`.padEnd(4), `dur=${String(spec.durationSec || 0).padStart(3)}s`,
      `words=${String(words).padStart(3)}`, `speech=${speechSec.toFixed(1).padStart(5)}s`,
      speechSec > (spec.durationSec || 0) + 3 ? '  <-- QUÁ DÀI' : ''
    );
  });
  console.log('---');
  console.log('Tổng durationSec (khai báo):', (sumSlide / 60).toFixed(1), 'phút');
  console.log('Tổng thời gian đọc thật (ước tính @', WPM, 'từ/phút):', (sumSpeechSec / 60).toFixed(1), 'phút');
  console.log('Tổng thời gian demo cộng thêm:', (sumDemoExtra / 60).toFixed(1), 'phút');
  console.log('TỔNG VIDEO (đọc thật + demo):', ((sumSpeechSec + sumDemoExtra) / 60).toFixed(1), 'phút');
  process.exit(0);
}

const pptx = new PptxGenJS();
pptx.defineLayout({ name: 'AV16x9', width: SLIDE_W, height: SLIDE_H });
pptx.layout = 'AV16x9';
pptx.author = 'CS112.F31 — Algorithm Visualizer';
pptx.title = 'Tô màu đồ thị (bài Sở thú) — Thuyết trình video demo';

const total = SLIDES.length;
SLIDES.forEach((spec, i) => {
  const index = i + 1;
  if (spec.kind === 'title') buildTitleSlide(pptx, spec, index, total);
  else if (spec.kind === 'closing') buildClosingSlide(pptx, spec, index, total);
  else buildContentSlide(pptx, spec, index, total);
});

const outPptx = join(__dirname, 'algorithm-visualizer-video.pptx');
await pptx.writeFile({ fileName: outPptx });
console.log('Đã sinh', outPptx);

// ---------------------------------------------------------------------------
// Sinh docs/kich-ban-thuyet-trinh.md từ CÙNG mảng SLIDES
// ---------------------------------------------------------------------------

function summarizeContent(spec) {
  if (spec.kind === 'title') return `Trang bìa: ${spec.subtitle}`;
  if (spec.kind === 'closing') return spec.lines.join(' ');
  const parts = [];
  for (const b of spec.blocks || []) {
    if (b.type === 'bullets') parts.push(b.items.map((it) => (typeof it === 'string' ? it : it.text)).join(' · '));
    else if (b.type === 'table') parts.push(`Bảng ${b.headers.join('/')} (${b.rows.length} dòng)`);
    else if (b.type === 'quotes') parts.push(b.items.map((q) => q.label || q.text).join(' · '));
  }
  if (spec.side) {
    if (spec.side.type === 'table') parts.push(`[Cột phải] Bảng: ${spec.side.title || ''}`);
    else if (spec.side.type === 'code') parts.push(`[Cột phải] Mã/JSON: ${spec.side.title || ''}`);
    else if (spec.side.type === 'diagram') parts.push(`[Cột phải] Sơ đồ: ${spec.side.title || ''}`);
    else if (spec.side.type === 'code-stack') parts.push(`[Cột phải] Mã giả nguyên văn: ${spec.side.blocks.map((b) => b.title).join(' + ')}`);
  }
  return parts.join(' — ');
}

function mdEscape(s) {
  return String(s).replace(/\|/g, '\\|').replace(/\n+/g, ' ');
}

let md = '';
md += '# Kịch bản thuyết trình — Tô màu đồ thị (bài Sở thú)\n\n';
md += '> Sinh tự động từ `presentation/generate.mjs` (mảng `SLIDES`) — KHÔNG sửa tay file này,\n';
md += '> sửa trong `generate.mjs` rồi chạy lại `node generate.mjs` để đồng bộ với file .pptx.\n';
md += '> Dùng để sinh viên theo dõi/ôn lời đọc mà không cần mở PowerPoint.\n\n';

const WPM_DOCS = 145;
const totalSec = SLIDES.reduce((s, sp) => s + (sp.durationSec || 0), 0);
const totalDemoExtraSec = SLIDES.reduce((s, sp) => {
  const m = (sp.notes || '').match(/demo ~(\d+)s/);
  return s + (m ? Number(m[1]) : 0);
}, 0);
const totalWords = SLIDES.reduce((s, sp) => {
  const line = (sp.notes || '').split('\n').find((l) => l.startsWith('Lời đọc:'));
  return s + (line ? line.replace(/^Lời đọc:\s*"?/, '').replace(/"?$/, '').split(/\s+/).filter(Boolean).length : 0);
}, 0);
const totalSpeechSec = (totalWords / WPM_DOCS) * 60;
const grandTotalMin = (totalSpeechSec + totalDemoExtraSec) / 60;
md += `**Tổng số slide:** ${total}. **Tổng thời lượng ước tính** (lời đọc @ ${WPM_DOCS} từ/phút, cộng các đoạn demo trực tiếp ghi trong cột cuối): khoảng ${(totalSpeechSec / 60).toFixed(1)} phút lời đọc + ${(totalDemoExtraSec / 60).toFixed(1)} phút demo trực tiếp ≈ **${grandTotalMin.toFixed(1)} phút** (mục tiêu đề ra: 12–15 phút; số liệu này do \`generate.mjs\` tự tính lại từ nội dung thật mỗi lần build, không phải ước lượng tay).\n\n`;
md += '| # | Tiêu đề | Nội dung trên slide (tóm tắt) | Lời đọc & cue demo | Thời lượng |\n';
md += '|---:|---|---|---|---|\n';

SLIDES.forEach((spec, i) => {
  const index = i + 1;
  const title = spec.title;
  const content = mdEscape(summarizeContent(spec));
  const notes = mdEscape(spec.notes);
  const totalMatch = (spec.notes || '').match(/tổng ~(\d+)s/);
  const dur = totalMatch ? `~${totalMatch[1]}s` : spec.durationSec ? `~${spec.durationSec}s` : '';
  md += `| ${index} | ${mdEscape(title)} | ${content} | ${notes} | ${dur} |\n`;
});

md += '\n---\n\n';
md += '## Ghi chú đối chiếu\n\n';
md += '- Số bước quay lui (slide 17–18: 1→9 bế tắc, 10→20 hoàn tất) khớp đúng bảng mục 4.2 báo cáo và trace thật của `run()`.\n';
md += '- Số bước so sánh 5 thuật toán (slide 19: 7/7/14/20/69) và chế độ χ (slide 20: 3/3/2/2/2 màu) khớp mục 4.3 báo cáo.\n';
md += '- Thông báo "Không áp dụng" ở slide 25 lấy nguyên văn từ `source-code/src/algorithms/graph-coloring/backtracking/index.ts` tại HEAD hiện tại (sau PR #14 — không còn lặp tiền tố).\n';
md += '- Mọi mốc [SV XÁC NHẬN] trong slide 1–2 phải được sinh viên điền/viết lại bằng lời của mình trước khi quay.\n';

const outMd = join(__dirname, '..', 'docs', 'kich-ban-thuyet-trinh.md');
writeFileSync(outMd, md, 'utf8');
console.log('Đã sinh', outMd, `(${md.split('\n').length} dòng)`);
console.log('Tổng', total, 'slide. Lời đọc ~', (totalSpeechSec / 60).toFixed(1), 'phút + demo ~', (totalDemoExtraSec / 60).toFixed(1), 'phút = TỔNG ~', grandTotalMin.toFixed(1), 'phút.');
