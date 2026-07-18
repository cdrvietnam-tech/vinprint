export type StudioForm = {
  prompt: string;
  productType: string;
  brand: string;
  productName: string;
  requiredText: string;
  size: string;
  quantity: string;
  material: string;
  deadline: string;
  shape: string;
  style: string;
  palette: string;
};

export type ParsedBrief = StudioForm & {
  detectedStyle: string;
  detectedShape: string;
  detectedPalette: string;
  keywords: string[];
};

export type DesignVariant = {
  id: number;
  name: string;
  labelSvg: string;
  mockupSvg: string;
};

const palettes: Record<string, [string, string, string, string]> = {
  natural: ["#173c2d", "#f3e8c9", "#d8ff52", "#e85b35"],
  premium: ["#17120f", "#f4e9d1", "#d9b862", "#7d4cf1"],
  fresh: ["#063c45", "#e9fbf7", "#36d8b7", "#ff6845"],
  sweet: ["#501f38", "#fff0f4", "#ff7aaa", "#ffd552"],
  bold: ["#19132b", "#f8f5e9", "#ff4c24", "#ceff42"],
  blue: ["#132c58", "#eef4ff", "#5b7cff", "#ffb83e"],
};

const styleNames: Record<string, string> = {
  editorial: "Editorial",
  minimal: "Tối giản",
  luxury: "Cao cấp",
  organic: "Tự nhiên",
  cute: "Dễ thương",
  retro: "Retro",
};

export const defaultStudioForm: StudioForm = {
  prompt:
    "Thiết kế tem tròn tối giản cho trà thảo mộc, màu xanh lá và kem, cảm giác tự nhiên, sạch và cao cấp.",
  productType: "thuc-pham",
  brand: "Mộc Nhiên",
  productName: "Trà Thảo Mộc",
  requiredText: "100% nguyên liệu tự nhiên · Khối lượng 120g",
  size: "60 x 60 mm",
  quantity: "500 tem",
  material: "Chưa xác định",
  deadline: "",
  shape: "auto",
  style: "auto",
  palette: "auto",
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function includesAny(value: string, words: string[]) {
  return words.some((word) => value.includes(word));
}

export function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function limit(value: string, max: number) {
  const cleaned = value.trim().replace(/\s+/g, " ");
  return cleaned.length > max ? `${cleaned.slice(0, max - 1)}…` : cleaned;
}

function splitTitle(value: string, max = 18) {
  const words = limit(value || "Sản phẩm mới", 42).split(" ");
  const lines: string[] = [];
  let current = "";

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (next.length > max && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  });
  if (current) lines.push(current);
  return lines.slice(0, 2);
}

export function interpretBrief(form: StudioForm): ParsedBrief {
  const prompt = normalize(form.prompt);

  const detectedShape =
    form.shape !== "auto"
      ? form.shape
      : includesAny(prompt, ["tron", "hinh tron", "circle"])
        ? "round"
        : includesAny(prompt, ["oval", "bau duc"])
          ? "oval"
          : includesAny(prompt, ["vom", "arch"])
            ? "arch"
            : "rounded";

  const detectedStyle =
    form.style !== "auto"
      ? form.style
      : includesAny(prompt, ["sang trong", "cao cap", "luxury", "premium"])
        ? "luxury"
        : includesAny(prompt, ["tu nhien", "moc", "organic", "thu cong"])
          ? "organic"
          : includesAny(prompt, ["de thuong", "cute", "kawaii", "vui nhon"])
            ? "cute"
            : includesAny(prompt, ["retro", "vintage", "co dien"])
              ? "retro"
              : includesAny(prompt, ["toi gian", "minimal", "sach"])
                ? "minimal"
                : "editorial";

  const detectedPalette =
    form.palette !== "auto"
      ? form.palette
      : includesAny(prompt, ["xanh la", "xanh reu", "moc", "tu nhien"])
        ? "natural"
        : includesAny(prompt, ["hong", "pastel", "ngot ngao"])
          ? "sweet"
          : includesAny(prompt, ["xanh duong", "blue", "bien"])
            ? "blue"
            : includesAny(prompt, ["den", "vang", "sang trong", "cao cap"])
              ? "premium"
              : includesAny(prompt, ["tuoi mat", "mint", "xanh ngoc"])
                ? "fresh"
                : "bold";

  const keywords = [
    styleNames[detectedStyle] || "Editorial",
    detectedShape === "round"
      ? "Tem tròn"
      : detectedShape === "oval"
        ? "Tem oval"
        : detectedShape === "arch"
          ? "Tem vòm"
          : "Bo góc",
    form.productType === "my-pham"
      ? "Mỹ phẩm"
      : form.productType === "do-uong"
        ? "Đồ uống"
        : form.productType === "nen-thom"
          ? "Nến & quà tặng"
          : form.productType === "thuc-pham"
            ? "Thực phẩm"
            : "Sản phẩm khác",
  ];

  return {
    ...form,
    detectedStyle,
    detectedShape,
    detectedPalette,
    keywords,
  };
}

function variantPalette(name: string, variant: number) {
  const base = palettes[name] || palettes.bold;
  if (variant === 1) return base;
  if (variant === 2) return [base[0], base[2], base[1], base[3]] as const;
  return [base[2], base[0], base[1], base[3]] as const;
}

function frameShape(shape: string) {
  if (shape === "round") return `<circle cx="380" cy="380" r="332" />`;
  if (shape === "oval") return `<rect x="65" y="150" width="630" height="460" rx="230" />`;
  if (shape === "arch") {
    return `<path d="M92 682V328C92 143 221 55 380 55s288 88 288 273v354Z" />`;
  }
  return `<rect x="58" y="58" width="644" height="644" rx="94" />`;
}

function productIcon(type: string, color: string) {
  if (type === "my-pham") {
    return `<g fill="none" stroke="${color}" stroke-width="12" stroke-linecap="round"><path d="M380 204c-42 55-70 90-70 130a70 70 0 0 0 140 0c0-40-28-75-70-130Z"/><path d="M346 337c8 25 26 37 52 39"/></g>`;
  }
  if (type === "do-uong") {
    return `<g fill="none" stroke="${color}" stroke-width="12" stroke-linecap="round"><path d="M322 245h116l-12 142c-3 37-24 56-66 56s-63-19-66-56Z"/><path d="M300 270h160M350 210h60"/></g>`;
  }
  if (type === "nen-thom") {
    return `<g fill="none" stroke="${color}" stroke-width="12" stroke-linecap="round"><path d="M298 316h164l-12 135H310Z"/><path d="M380 284c-34-36-10-72 13-92 17 37 12 68-13 92Z"/></g>`;
  }
  return `<g fill="none" stroke="${color}" stroke-width="12" stroke-linecap="round"><path d="M380 205c-9 84-52 139-119 167 51 23 90 65 119 126 27-62 69-103 119-126-68-28-110-83-119-167Z"/><path d="M268 245c-4 38-24 64-55 77 25 10 43 30 55 58 13-29 31-48 55-58-31-13-51-39-55-77Z"/></g>`;
}

function safeLogo(logoDataUrl?: string) {
  if (!logoDataUrl) return "";
  return /^data:image\/(png|jpe?g|webp);base64,/i.test(logoDataUrl)
    ? logoDataUrl
    : "";
}

export function buildLabelSvg(
  brief: ParsedBrief,
  variant: number,
  logoDataUrl?: string,
) {
  const id = `vp-${variant}-${Math.abs(
    Array.from(brief.brand + brief.productName).reduce(
      (sum, char) => sum + (char.codePointAt(0) || 0),
      0,
    ),
  )}`;
  const [ink, paper, accent, pop] = variantPalette(
    brief.detectedPalette,
    variant,
  );
  const lines = splitTitle(brief.productName || "Sản phẩm mới");
  const isOval = brief.detectedShape === "oval";
  const brand = escapeXml(limit(brief.brand || "THƯƠNG HIỆU", 26).toUpperCase());
  const detail = escapeXml(limit(brief.requiredText || "SẢN PHẨM THEO YÊU CẦU", 72));
  const logo = safeLogo(logoDataUrl);
  const brandY = isOval ? 193 : 125;
  const titleY = isOval
    ? lines.length === 1
      ? 390
      : 348
    : lines.length === 1
      ? 392
      : 362;
  const ruleY = isOval ? 500 : 535;
  const detailY = isOval ? 540 : 579;
  const footerY = isOval ? 579 : 625;
  const titleSize = Math.max(45, 69 - Math.max(...lines.map((line) => line.length)) * 1.1);
  const shape = frameShape(brief.detectedShape);

  const decorative =
    variant === 1
      ? `<path d="M122 542C218 490 270 511 353 558s171 55 285-8" fill="none" stroke="${accent}" stroke-width="18" stroke-linecap="round"/><circle cx="118" cy="212" r="24" fill="${pop}"/><circle cx="638" cy="520" r="19" fill="${pop}"/>`
      : variant === 2
        ? `<g fill="none" stroke="${pop}" stroke-width="8"><circle cx="380" cy="380" r="266" stroke-dasharray="7 17"/><path d="M150 520c60-75 115-80 172-17M610 236c-63 75-118 80-174 17"/></g>`
        : `<g transform="rotate(-8 380 380)"><rect x="92" y="305" width="576" height="214" rx="34" fill="${accent}"/><path d="M92 326h576M92 497h576" stroke="${paper}" stroke-width="5" opacity=".5"/></g>`;

  const titleColor = variant === 3 ? paper : ink;
  const logoMarkup = logo
    ? `<image href="${escapeXml(logo)}" x="${isOval ? 330 : 310}" y="${isOval ? 211 : 162}" width="${isOval ? 100 : 140}" height="${isOval ? 66 : 90}" preserveAspectRatio="xMidYMid meet" />`
    : `<g transform="${isOval ? "translate(247 135) scale(.35)" : "translate(171 58) scale(.55)"}">${productIcon(brief.productType, variant === 3 ? paper : pop)}</g>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="760" height="760" viewBox="0 0 760 760" role="img" aria-label="Mẫu tem ${brand}">
  <defs>
    <clipPath id="${id}-clip">${shape}</clipPath>
    <filter id="${id}-shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#111" flood-opacity=".22"/></filter>
    <pattern id="${id}-dots" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="2.5" fill="${ink}" opacity=".11"/></pattern>
  </defs>
  <rect width="760" height="760" fill="transparent"/>
  <g filter="url(#${id}-shadow)">
    <g clip-path="url(#${id}-clip)">
      <rect width="760" height="760" fill="${paper}"/>
      <rect width="760" height="760" fill="url(#${id}-dots)"/>
      <circle cx="90" cy="690" r="180" fill="${accent}" opacity=".28"/>
      <circle cx="700" cy="42" r="190" fill="${pop}" opacity=".16"/>
      ${decorative}
      ${logoMarkup}
      <text x="380" y="${brandY}" text-anchor="middle" fill="${ink}" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="800" letter-spacing="5">${brand}</text>
      ${lines
        .map(
          (line, index) =>
            `<text x="380" y="${titleY + index * 74}" text-anchor="middle" fill="${titleColor}" font-family="Arial, Helvetica, sans-serif" font-size="${titleSize}" font-weight="900" letter-spacing="-2">${escapeXml(line.toUpperCase())}</text>`,
        )
        .join("")}
      <line x1="250" x2="510" y1="${ruleY}" y2="${ruleY}" stroke="${variant === 3 ? paper : ink}" stroke-width="3" opacity=".32"/>
      <text x="380" y="${detailY}" text-anchor="middle" fill="${variant === 3 ? paper : ink}" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700">${detail}</text>
      <text x="380" y="${footerY}" text-anchor="middle" fill="${variant === 3 ? paper : ink}" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" letter-spacing="3">VINPRINT AI CONCEPT · ${escapeXml(brief.size || "KÍCH THƯỚC TÙY CHỌN")}</text>
    </g>
    <g fill="none" stroke="${ink}" stroke-width="7" opacity=".96">${shape}</g>
  </g>
</svg>`;
}

function encodeSvg(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function buildMockupSvg(
  brief: ParsedBrief,
  variant: number,
  labelSvg: string,
) {
  const [ink, paper, accent, pop] = variantPalette(
    brief.detectedPalette,
    variant,
  );
  const labelUri = escapeXml(encodeSvg(labelSvg));
  const id = `mock-${variant}-${brief.productType}`;

  const product =
    brief.productType === "my-pham"
      ? `<g filter="url(#${id}-shadow)"><rect x="350" y="120" width="200" height="82" rx="26" fill="#d9d9d4"/><rect x="410" y="75" width="80" height="70" rx="18" fill="#242421"/><path d="M450 75V43h105" fill="none" stroke="#242421" stroke-width="24" stroke-linecap="round"/><rect x="270" y="174" width="360" height="500" rx="115" fill="url(#${id}-glass)"/><image href="${labelUri}" x="335" y="305" width="230" height="230"/></g>`
      : brief.productType === "do-uong"
        ? `<g filter="url(#${id}-shadow)"><rect x="393" y="75" width="114" height="94" rx="20" fill="#20201e"/><path d="M355 155h190l35 92v385c0 49-35 77-85 77h-90c-50 0-85-28-85-77V247Z" fill="url(#${id}-glass)"/><image href="${labelUri}" x="333" y="300" width="234" height="234"/></g>`
        : brief.productType === "nen-thom"
          ? `<g filter="url(#${id}-shadow)"><ellipse cx="450" cy="214" rx="174" ry="54" fill="#e5ded1"/><path d="M276 214h348l-33 390c-5 63-50 91-141 91s-136-28-141-91Z" fill="url(#${id}-glass)"/><path d="M450 213c-40-50-7-96 18-121 17 51 8 91-18 121Z" fill="${pop}"/><image href="${labelUri}" x="337" y="326" width="226" height="226"/></g>`
          : brief.productType === "thuc-pham"
            ? `<g filter="url(#${id}-shadow)"><path d="M292 116h316l45 566H247Z" fill="url(#${id}-paper)"/><path d="M292 168h316" stroke="${ink}" stroke-width="8" opacity=".28"/><path d="M330 116l18-55h204l18 55" fill="none" stroke="${ink}" stroke-width="13" opacity=".48"/><image href="${labelUri}" x="326" y="278" width="248" height="248"/></g>`
            : `<g filter="url(#${id}-shadow)"><path d="M245 190 505 91l160 123-260 100Z" fill="#efe6d7"/><path d="m245 190 160 124v385L245 575Z" fill="url(#${id}-paper)"/><path d="m405 314 260-100v385L405 699Z" fill="#e4dac9"/><image href="${labelUri}" x="250" y="322" width="210" height="210" transform="skewY(4)"/></g>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="760" viewBox="0 0 900 760" role="img" aria-label="Mockup ${escapeXml(brief.productName)}">
  <defs>
    <linearGradient id="${id}-bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${paper}"/><stop offset="1" stop-color="${accent}" stop-opacity=".55"/></linearGradient>
    <linearGradient id="${id}-glass" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#faf9f4"/><stop offset=".5" stop-color="#d8d7ce"/><stop offset="1" stop-color="#aaa99f"/></linearGradient>
    <linearGradient id="${id}-paper" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f3eadb"/><stop offset="1" stop-color="#c9bba7"/></linearGradient>
    <filter id="${id}-shadow" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="28" stdDeviation="25" flood-color="#15120f" flood-opacity=".3"/></filter>
  </defs>
  <rect width="900" height="760" rx="44" fill="url(#${id}-bg)"/>
  <circle cx="84" cy="86" r="118" fill="${pop}" opacity=".22"/>
  <circle cx="835" cy="680" r="180" fill="${ink}" opacity=".08"/>
  <path d="M53 640C190 560 271 601 374 655s244 41 445-92" fill="none" stroke="${pop}" stroke-width="15" stroke-linecap="round" opacity=".65"/>
  ${product}
  <g transform="translate(58 72)"><rect width="182" height="72" rx="22" fill="${ink}"/><text x="91" y="29" text-anchor="middle" fill="${paper}" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="800" letter-spacing="2">MOCKUP 0${variant}</text><text x="91" y="52" text-anchor="middle" fill="${accent}" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="800">${escapeXml(limit(brief.productName, 18))}</text></g>
  <text x="842" y="93" text-anchor="end" fill="${ink}" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="800" letter-spacing="2">VINPRINT AI LAB ✦</text>
</svg>`;
}

export function createDesignVariants(
  brief: ParsedBrief,
  logoDataUrl?: string,
): DesignVariant[] {
  return [1, 2, 3].map((variant) => {
    const labelSvg = buildLabelSvg(brief, variant, logoDataUrl);
    return {
      id: variant,
      name:
        variant === 1
          ? "Editorial rõ nét"
          : variant === 2
            ? "Con dấu thủ công"
            : "Tương phản cao cấp",
      labelSvg,
      mockupSvg: buildMockupSvg(brief, variant, labelSvg),
    };
  });
}

export function buildOrderBrief(brief: ParsedBrief, projectCode: string) {
  const deadline = brief.deadline || "Trao đổi với nhân viên";
  return [
    `HỒ SƠ ĐẶT IN VINPRINT — ${projectCode}`,
    "",
    `Thương hiệu: ${brief.brand || "Chưa nhập"}`,
    `Tên sản phẩm: ${brief.productName || "Chưa nhập"}`,
    `Sản phẩm sử dụng: ${brief.productType}`,
    `Kích thước tem: ${brief.size || "Chưa xác định"}`,
    `Số lượng: ${brief.quantity || "Chưa xác định"}`,
    `Chất liệu dự kiến: ${brief.material || "Chưa xác định"}`,
    `Thời gian cần hàng: ${deadline}`,
    `Kiểu dáng: ${brief.detectedShape}`,
    `Phong cách: ${styleNames[brief.detectedStyle] || brief.detectedStyle}`,
    "",
    "Nội dung bắt buộc:",
    brief.requiredText || "Chưa nhập",
    "",
    "Ý tưởng ban đầu:",
    brief.prompt || "Chưa nhập",
    "",
    "QUY TRÌNH: Gửi file + số lượng + chất liệu → Nhận báo giá → Đặt cọc + gửi thông tin nhận hàng → Chờ nhận tem.",
    "Liên hệ Zalo VinPrint: 0844998499",
  ].join("\n");
}

export function projectCodeFrom(brief: ParsedBrief) {
  const source = `${brief.brand}-${brief.productName}-${brief.prompt}`;
  const hash = Array.from(source).reduce(
    (value, char) => (value * 31 + (char.codePointAt(0) || 0)) >>> 0,
    2166136261,
  );
  return `VP-${hash.toString(36).toUpperCase().slice(0, 6).padEnd(6, "0")}`;
}
