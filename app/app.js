// Bargain Friday — hash routing, search, filters, sorting, rendering.
import { DEALS, CHECKED_AT, CATEGORIES, STORES, SIGNAL_LABELS } from "./data.js";
import { discountOf, renderDiscountChart } from "./charts.js";

const $ = (id) => document.getElementById(id);
const money = (n) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const state = { category: "all", q: "", store: "", minDiscount: 0, maxPrice: 0, sort: "discount" };

function readHash() {
  const m = location.hash.match(/^#\/([a-z]+)/);
  const cat = m ? m[1] : "all";
  state.category = CATEGORIES.some((c) => c.id === cat) ? cat : "all";
}

function sameProduct(deal) {
  // Another store carrying the same product, for the cross-store note.
  return DEALS.find((d) => d.id !== deal.id && d.name === deal.name);
}

function visibleDeals() {
  const q = state.q.trim().toLowerCase();
  let list = DEALS.filter((d) => {
    if (state.category !== "all" && d.category !== state.category) return false;
    if (state.store && d.store !== state.store) return false;
    if (discountOf(d) < state.minDiscount) return false;
    if (state.maxPrice && d.price > state.maxPrice) return false;
    if (q && !(d.name + " " + d.store).toLowerCase().includes(q)) return false;
    return true;
  });
  const by = {
    discount: (a, b) => discountOf(b) - discountOf(a),
    saving: (a, b) => (b.usual - b.price) - (a.usual - a.price),
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    name: (a, b) => a.name.localeCompare(b.name),
  };
  return list.sort(by[state.sort] || by.discount);
}

function dealCard(d, i) {
  const off = discountOf(d);
  const save = d.usual - d.price;
  const other = sameProduct(d);
  const catLabel = CATEGORIES.find((c) => c.id === d.category).label;
  return `<article class="deal">
    ${i === 0 ? `<div class="ribbon">Best in this view · ${off}% off</div>` : ""}
    <h3>${d.name}</h3>
    <div class="meta">
      <span class="store">${d.store}</span>
      <span class="cat">${catLabel}</span>
      <span class="signal ${d.signal}">${SIGNAL_LABELS[d.signal]}</span>
    </div>
    <div class="prices">
      <span class="now">${money(d.price)}</span>
      <span class="was">${money(d.usual)}</span>
      <span class="off">${off}% off</span>
      <span class="save">you save ${money(save)}</span>
    </div>
    <p class="evidence">${d.evidence}</p>
    <p class="source">Source: ${d.source} · Checked ${CHECKED_AT}</p>
    ${other ? `<p class="dup">Also at ${other.store} for ${money(other.price)} — <a href="${other.url}" target="_blank" rel="noopener">compare</a></p>` : ""}
    <a class="store-link" href="${d.url}" target="_blank" rel="noopener">View at ${d.store} →</a>
  </article>`;
}

function render() {
  // Category nav with counts.
  $("cats").innerHTML = CATEGORIES.map((c) => {
    const n = c.id === "all" ? DEALS.length : DEALS.filter((d) => d.category === c.id).length;
    const active = c.id === state.category ? " class=\"active\"" : "";
    return `<a href="#/${c.id}"${active}>${c.label}<span class="n">${n}</span></a>`;
  }).join("");

  const list = visibleDeals();
  const totalSave = list.reduce((s, d) => s + (d.usual - d.price), 0);
  const best = list.length ? Math.max(...list.map(discountOf)) : 0;
  $("stats").innerHTML =
    `<div class="stat"><b>${list.length}</b><span>deals shown</span></div>` +
    `<div class="stat"><b>${best}%</b><span>biggest discount</span></div>` +
    `<div class="stat"><b>${money(totalSave)}</b><span>total savings</span></div>` +
    `<div class="stat"><b>${list.filter((d) => d.signal === "new-low").length}</b><span>new lows</span></div>`;

  renderDiscountChart(list, $("chart"));
  $("deals").innerHTML = list.map((d, i) => dealCard(d, i)).join("");
  $("empty").hidden = list.length > 0;
  $("checked-at").textContent = CHECKED_AT;
}

function bind() {
  const storeSel = $("store");
  STORES.forEach((s) => {
    const o = document.createElement("option");
    o.value = s; o.textContent = s;
    storeSel.appendChild(o);
  });
  $("q").addEventListener("input", (e) => { state.q = e.target.value; render(); });
  storeSel.addEventListener("change", (e) => { state.store = e.target.value; render(); });
  $("discount").addEventListener("change", (e) => { state.minDiscount = Number(e.target.value); render(); });
  $("maxprice").addEventListener("change", (e) => { state.maxPrice = Number(e.target.value); render(); });
  $("sort").addEventListener("change", (e) => { state.sort = e.target.value; render(); });
  window.addEventListener("hashchange", () => { readHash(); render(); });
}

readHash();
bind();
render();
