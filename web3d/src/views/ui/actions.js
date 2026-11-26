/**
 * Small row of buttons/links under the scene for the current stop:
 * open a job or project without a mouse, or contact links.
 * Gives keyboard and screen-reader users the same actions as clicking in 3D.
 */
export function buildActions(tour, detail, content) {
  const bar = document.getElementById('actions');
  const p = content.profile;

  const btn = (text, short, aria, onClick) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'chip';
    b.innerHTML = `<span class="long">${text}</span><span class="short">${short}</span>`;
    b.setAttribute('aria-label', aria);
    b.addEventListener('click', onClick);
    return b;
  };
  const link = (text, href, aria, extra = {}) => {
    const a = document.createElement('a');
    a.className = 'chip'; a.href = href; a.textContent = text;
    a.setAttribute('aria-label', aria);
    if (extra.blank) { a.target = '_blank'; a.rel = 'noopener'; }
    if (extra.download) a.setAttribute('download', '');
    return a;
  };

  const build = {
    experience: () => content.jobs.map((j) => btn(j.shortName, j.shortName, `Open details: ${j.role} at ${j.company}`, () => detail.openJob(j.id))),
    projects: () => content.projects.map((x) => btn(x.title, x.id === 'kdch' ? 'KDCH' : x.id === 'portfolio' ? 'Portfolio' : x.title, `Open project: ${x.title}`, () => detail.openProject(x.id))),
    contact: () => [
      link('Email', `mailto:${p.email}`, `Email ${p.email}`),
      link('Call', p.phoneHref, `Call ${p.phone}`),
      link('GitHub', p.github, 'GitHub profile (opens in a new tab)', { blank: true }),
      link('LinkedIn', p.linkedin, 'LinkedIn profile (opens in a new tab)', { blank: true }),
      link('Resume', p.resume, 'Download resume (PDF)', { download: true }),
    ],
  };
  const lead = { experience: 'Details:', projects: 'Open:', contact: '' };

  tour.on('change', ({ stop }) => {
    bar.replaceChildren();
    const make = build[stop.id];
    if (!make) { bar.hidden = true; return; }
    if (lead[stop.id]) {
      const s = document.createElement('span'); s.className = 'lead'; s.textContent = lead[stop.id];
      bar.appendChild(s);
    }
    bar.append(...make());
    bar.setAttribute('aria-label', stop.id === 'contact' ? 'Contact links' : `${stop.label} details`);
    bar.hidden = false;
  });
}
