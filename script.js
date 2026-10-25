/* Mahbub's Math Room: all site behaviour. Edit CONFIG and the DATA arrays below. */

/* ===== CONFIG: add real details here ===== */
const CONFIG = {
  whatsapp: "+8801670734940",      // digits only with country code, e.g. "8801XXXXXXXXX" (leave "" to hide WhatsApp links)
  email: "mahbub3245@gmail.com",         // e.g. "name@example.com" (leave "" to hide email links)
  formEndpoint: ""   // e.g. a Formspree URL "https://formspree.io/f/xxxx" (leave "" until connected)
};

/* ===== DATA: placeholders, replace with real offerings ===== */
const COURSES = [
  { title: "SSC Mathematics", level: "Class 9 to 10", subjects: "Algebra, Geometry, Trigonometry", format: "Online / Offline", duration: "", fee: "",
    desc: "Placeholder: chapter-wise coverage of the SSC syllabus with regular practice." },
  { title: "HSC Mathematics", level: "Class 11 to 12", subjects: "Calculus, Algebra, Vectors", format: "Online / Offline", duration: "", fee: "",
    desc: "Placeholder: concept-first teaching for higher mathematics with exam practice." },
  { title: "Foundation Mathematics", level: "Class 6 to 8", subjects: "Arithmetic, Basic Algebra, Geometry", format: "Online / Offline", duration: "", fee: "",
    desc: "Placeholder: build strong basics before the exam years begin." }
];
const MATERIALS = [  // url: put a real file path (e.g. "files/ssc-formulas.pdf") to enable a download button
  { title: "Algebra chapter notes", cat: "Notes", access: "free", url: "" },
  { title: "Geometry formula sheet", cat: "Formula sheets", access: "free", url: "" },
  { title: "Trigonometry practice questions", cat: "Practice", access: "free", url: "" },
  { title: "Weekly worksheet with sample solutions", cat: "Worksheets", access: "restricted", url: "" },
  { title: "SSC model test 1", cat: "Model tests", access: "restricted", url: "" }
];
const TESTIMONIALS = [  // Replace with real reviews and written permission only
  { text: "Placeholder: A great Techer who loves to learn and teach", who: "Ishrak Hasan", note: "GPA-5.00" },
  { text: "Placeholder: friendly teacher", who: "jamir uddin", note: "Gpa-5.00" }
];
const FAQS = [
  ["Which classes do you teach?", "From Class 6-12. Me And My fellow Teachers take every students responsibility in our hands"],
  ["Are online classes available?", "Yes ! Online Classes are available in my facebook page."],
  ["How can I enroll?", "Send a demo class request using the form below. You will be contacted to confirm details."],
  ["What are the class timings?", "Time can be different in many Curcumustances .Contact me on Whatsapp to learn more."],
  ["Are study materials provided?", "Some materials are listed in the Study Materials section. Edit this answer to say exactly what students receive."],
  ["Is a demo class available?", "Why Not !!!"],
];

/* ===== helpers ===== */
const $ = (s, r = document) => r.querySelector(s);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const icons = () => window.lucide && lucide.createIcons();

/* Theme toggle */
const root = document.documentElement, themeBtn = $("#themeBtn");
function setTheme(t) {
  root.dataset.theme = t;
  try { localStorage.setItem("theme", t); } catch (e) {}
  themeBtn.innerHTML = `<i data-lucide="${t === "dark" ? "sun" : "moon"}"></i>`;
  themeBtn.setAttribute("aria-label", t === "dark" ? "Switch to light mode" : "Switch to dark mode");
  icons();
}
setTheme(root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
themeBtn.addEventListener("click", () => setTheme(root.dataset.theme === "dark" ? "light" : "dark"));

/* Mobile menu */
const nav = $("#nav"), menuBtn = $("#menuBtn");
function toggleMenu(open) {
  nav.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", open);
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}
menuBtn.addEventListener("click", () => toggleMenu(!nav.classList.contains("open")));
nav.addEventListener("click", e => { if (e.target.closest("a")) toggleMenu(false); });
document.addEventListener("keydown", e => { if (e.key === "Escape") toggleMenu(false); });

/* Portrait fallback when images/tutor.jpg is missing */
const pImg = $("#portrait img");
const noImg = () => $("#portrait").classList.add("no-img");
pImg.addEventListener("error", noImg);
if (pImg.complete && !pImg.naturalWidth) noImg();

/* Courses + details dialog */
const grid = $("#courseGrid"), dlg = $("#courseDialog"), courseSel = $("#f-course");
courseSel.innerHTML = '<option value="">Select course</option>';
COURSES.forEach((c, i) => {
  const card = el("article", "card",
    `<h3>${esc(c.title)}</h3><div class="meta"><span class="tag">${esc(c.level)}</span><span class="tag">${esc(c.format)}</span><span class="tag ph-tag">Editable example</span></div>
     <p><b>Covers:</b> ${esc(c.subjects)}</p><p>${esc(c.desc)}</p>
     <p>${c.duration ? "Duration: " + esc(c.duration) : "Duration: shared on enquiry"} · ${c.fee ? "Fee: " + esc(c.fee) : "Fee: shared on enquiry"}</p>`);
  const b = el("button", "btn btn-outline", "View Details"); b.type = "button";
  b.addEventListener("click", () => {
    $("#dTitle").textContent = c.title;
    $("#dMeta").textContent = `${c.level} · ${c.format}`;
    $("#dBody").textContent = `${c.desc} Covers: ${c.subjects}.`;
    $("#dEnquire").dataset.course = c.title; dlg.showModal();
  });
  card.append(b); grid.append(card);
  courseSel.append(new Option(c.title, c.title));
});
courseSel.append(new Option("Not sure yet", "Not sure yet"));
$("#dClose").addEventListener("click", () => dlg.close());
dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
$("#dEnquire").addEventListener("click", e => { courseSel.value = e.currentTarget.dataset.course; dlg.close(); });

/* Study materials: search + category filter */
const matGrid = $("#matGrid"), filtersBox = $("#matFilters"), search = $("#matSearch");
let activeCat = "All";
["All", ...new Set(MATERIALS.map(m => m.cat))].forEach(cat => {
  const b = el("button", "", esc(cat)); b.type = "button"; b.setAttribute("aria-pressed", cat === "All");
  b.addEventListener("click", () => { activeCat = cat; [...filtersBox.children].forEach(x => x.setAttribute("aria-pressed", x === b)); renderMaterials(); });
  filtersBox.append(b);
});
function renderMaterials() {
  const q = search.value.trim().toLowerCase();
  const list = MATERIALS.filter(m => (activeCat === "All" || m.cat === activeCat) && (m.title + " " + m.cat).toLowerCase().includes(q));
  matGrid.innerHTML = "";
  list.forEach(m => {
    const free = m.access === "free";
    const card = el("article", "card", `<h3>${esc(m.title)}</h3><div class="meta"><span class="tag">${esc(m.cat)}</span><span class="tag ${free ? "free" : "locked"}">${free ? "Free" : "Restricted"}</span></div>`);
    if (m.url && free) { const a = el("a", "btn btn-outline", "Download"); a.href = m.url; a.setAttribute("download", ""); card.append(a); }
    else if (m.url) { const a = el("a", "btn btn-outline", "Ask for access"); a.href = "#contact"; card.append(a); }
    else card.append(el("span", "btn btn-outline disabled", "File not added yet"));
    matGrid.append(card);
  });
  $("#matEmpty").hidden = list.length > 0;
  icons();
}
search.addEventListener("input", renderMaterials); renderMaterials();

/* Testimonials (clearly marked placeholders) */
TESTIMONIALS.forEach(t => $("#testiGrid").append(el("figure", "card",
  `<span class="tag ph-tag">Placeholder, not a real review</span><blockquote class="quote" style="margin:0"><p>${esc(t.text)}</p></blockquote><figcaption class="who">${esc(t.who)}<br><small class="note">${esc(t.note)}</small></figcaption>`)));

/* FAQ accordion */
FAQS.forEach(([q, a], i) => {
  const item = el("div", "faq-item");
  item.innerHTML = `<h3 style="margin:0"><button class="faq-q" aria-expanded="false" aria-controls="fa${i}" id="fq${i}">${esc(q)}<i data-lucide="chevron-down"></i></button></h3>
    <div class="faq-a" id="fa${i}" role="region" aria-labelledby="fq${i}"><div><p>${esc(a)}</p></div></div>`;
  const btn = $(".faq-q", item), panel = $(".faq-a", item);
  btn.addEventListener("click", () => { const o = btn.getAttribute("aria-expanded") !== "true"; btn.setAttribute("aria-expanded", o); panel.classList.toggle("open", o); });
  $("#faqList").append(item);
});

/* Contact links (WhatsApp / email) only appear when configured */
const wa = CONFIG.whatsapp.replace(/\D/g, ""), mail = CONFIG.email.trim();
const waBase = wa.length >= 8 ? `https://wa.me/${wa}` : "";
if (waBase) { ["#waLink", "#fWaLink"].forEach(s => $(s).href = `${waBase}?text=${encodeURIComponent("Hello, I'd like to book a demo class.")}`); $("#waItem").hidden = $("#fWa").hidden = false; }
if (mail) { ["#mailLink", "#fMailLink"].forEach(s => $(s).href = "mailto:" + mail); $("#mailItem").hidden = $("#fMail").hidden = false; }
if (waBase || mail) $("#noContact").hidden = true;

/* Form validation + submission */
const form = $("#demoForm"), status = $("#formStatus");
const rules = {
  name: v => v.trim().length >= 2 || "Enter the student's name.",
  phone: v => /^\+?[\d\s-]{7,16}$/.test(v.trim()) || "Enter a valid phone number, for example +8801XXXXXXXXX.",
  email: v => !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || "Enter a valid email address or leave it empty.",
  grade: v => !!v || "Select the student's grade.",
  course: v => !!v || "Select a course."
};
function check(name) {
  const f = form.elements[name], r = rules[name](f.value), box = $("#e-" + name);
  f.setAttribute("aria-invalid", r !== true); f.setAttribute("aria-describedby", "e-" + name);
  box.textContent = r === true ? "" : r; return r === true;
}
Object.keys(rules).forEach(n => form.elements[n].addEventListener("blur", () => check(n)));
function show(type, html) { status.className = "status show " + type; status.innerHTML = html; status.focus(); }

form.addEventListener("submit", async e => {
  e.preventDefault(); status.className = "status";
  const ok = Object.keys(rules).map(check).every(Boolean);
  if (!ok) { show("bad", "Please fix the highlighted fields and try again."); form.querySelector("[aria-invalid=true]")?.focus(); return; }
  const data = Object.fromEntries(new FormData(form));
  const summary = `Demo class request\nName: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email || "-"}\nGrade: ${data.grade}\nCourse: ${data.course}\nPreferred time: ${data.time || "-"}\nMessage: ${data.message || "-"}`;
  if (CONFIG.formEndpoint) {
    try {
      const res = await fetch(CONFIG.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error(res.status);
      show("ok", "Request sent. You will be contacted to arrange the demo class."); form.reset();
    } catch (err) { show("bad", "The request could not be sent. Please check your connection and try again" + (waBase ? ", or use WhatsApp." : ".")); }
    return;
  }
  /* No backend configured: be honest, offer manual sending if contact details exist */
  let html = "<b>Nothing has been sent.</b> This form is not connected to a submission service yet.";
  if (waBase) html += ` <a href="${waBase}?text=${encodeURIComponent(summary)}" target="_blank" rel="noopener noreferrer">Send these details on WhatsApp</a>.`;
  if (mail) html += ` <a href="mailto:${esc(mail)}?subject=${encodeURIComponent("Demo class request")}&body=${encodeURIComponent(summary)}">Send them by email</a>.`;
  show("info", html);
});

/* Back to top, active nav link, year */
const toTop = $("#toTop");
addEventListener("scroll", () => { toTop.hidden = scrollY < 600; }, { passive: true });
toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }));
const links = [...document.querySelectorAll("nav a")];
const io = new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting) links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
}), { rootMargin: "-40% 0px -55% 0px" });
links.forEach(a => { const s = $(a.getAttribute("href")); if (s) io.observe(s); });
$("#year").textContent = new Date().getFullYear();
icons();
