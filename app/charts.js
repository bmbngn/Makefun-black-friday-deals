// Discount-distribution chart: a small hand-drawn SVG histogram.
// Buckets: under 15%, 15–25, 25–35, 35–45, 45–55, over 55%.

export function discountOf(deal) {
  return Math.round((1 - deal.price / deal.usual) * 100);
}

const BUCKETS = [
  { label: "<15%", min: 0, max: 15 },
  { label: "15–25%", min: 15, max: 25 },
  { label: "25–35%", min: 25, max: 35 },
  { label: "35–45%", min: 35, max: 45 },
  { label: "45–55%", min: 45, max: 55 },
  { label: "55%+", min: 55, max: 101 },
];

export function renderDiscountChart(deals, mount) {
  const counts = BUCKETS.map((b) => deals.filter((d) => {
    const p = discountOf(d);
    return p >= b.min && p < b.max;
  }).length);
  const peak = Math.max(1, ...counts);
  const W = 640, H = 150, base = 118, gap = 8;
  const bw = (W - gap * (BUCKETS.length - 1)) / BUCKETS.length;
  let bars = "";
  BUCKETS.forEach((b, i) => {
    const h = Math.round((counts[i] / peak) * 84);
    const x = Math.round(i * (bw + gap));
    const y = base - h;
    bars += `<rect x="${x}" y="${y}" width="${Math.round(bw)}" height="${h}" rx="4" fill="#b8860b"/>` +
      `<text x="${x + bw / 2}" y="${y - 6}" text-anchor="middle" font-size="13" font-weight="700" fill="#17140f">${counts[i]}</text>` +
      `<text x="${x + bw / 2}" y="136" text-anchor="middle" font-size="12" fill="#6b6257">${b.label}</text>`;
  });
  mount.innerHTML =
    `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Histogram of discounts among the deals shown">` +
    `<line x1="0" y1="${base}" x2="${W}" y2="${base}" stroke="#e8ddcb" stroke-width="1"/>` +
    bars + `</svg>`;
}
