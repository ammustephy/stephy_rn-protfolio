/**
 * Plain HTML version of all content (for screen readers, search engines,
 * and as the whole page when WebGL is not available).
 * index.html ships a static copy of this markup; at runtime it is rebuilt from
 * content.js so the two can never drift apart for visitors.
 */
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function renderFullText(c) {
  const p = c.profile;
  const li = (items) => items.map((x) => `<li>${esc(x)}</li>`).join('');
  return `
<header>
  <h1>${esc(p.name)} — ${esc(p.role)}</h1>
  <p>${esc(p.tagline)}</p>
</header>
<section id="ft-about" aria-labelledby="ft-about-h">
  <h2 id="ft-about-h">About</h2>
  <p>${esc(p.summary)}</p>
</section>
<section id="ft-skills" aria-labelledby="ft-skills-h">
  <h2 id="ft-skills-h">Skills</h2>
  ${c.skillGroups.map((g) => `<h3>${esc(g.title)}</h3><ul class="ft-chips">${li(g.skills)}</ul>`).join('\n  ')}
</section>
<section id="ft-experience" aria-labelledby="ft-exp-h">
  <h2 id="ft-exp-h">Experience</h2>
  ${c.jobs.map((j) => `<article><h3>${esc(j.role)}</h3><p>${esc(j.company)}, ${esc(j.location)} · ${esc(j.dates)}</p><ul>${li(j.points)}</ul></article>`).join('\n  ')}
</section>
<section id="ft-projects" aria-labelledby="ft-proj-h">
  <h2 id="ft-proj-h">Projects</h2>
  ${c.projects.map((x) => `<article><h3>${esc(x.title)}</h3><p>${esc(x.description)}</p><h4>Key features</h4><ul>${li(x.features)}</ul><p><strong>Tech stack:</strong> ${esc(x.techStack.join(', '))}</p></article>`).join('\n  ')}
</section>
<section id="ft-education" aria-labelledby="ft-edu-h">
  <h2 id="ft-edu-h">Education</h2>
  <ul>${c.education.map((e) => `<li><strong>${esc(e.title)}</strong> — ${esc(e.institution)}, ${esc(e.year)}${e.detail && e.detail.startsWith('CGPA') ? ' — ' + esc(e.detail) : ''}</li>`).join('')}</ul>
</section>
<section id="ft-contact" aria-labelledby="ft-contact-h">
  <h2 id="ft-contact-h">Contact</h2>
  <p>${esc(p.contactNote)}</p>
  <ul>
    <li>Email: <a href="mailto:${esc(p.email)}">${esc(p.email)}</a></li>
    <li>Mobile: <a href="${esc(p.phoneHref)}">${esc(p.phone)}</a></li>
    <li>Location: ${esc(p.location)}</li>
    <li><a href="${esc(p.github)}" rel="noopener" target="_blank">GitHub</a></li>
    <li><a href="${esc(p.linkedin)}" rel="noopener" target="_blank">LinkedIn</a></li>
    <li><a href="${esc(p.resume)}" download>Download resume (PDF)</a></li>
  </ul>
</section>`;
}
