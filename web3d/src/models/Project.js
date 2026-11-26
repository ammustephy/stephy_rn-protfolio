/**
 * A portfolio project.
 * @typedef {{src: string, thumb: string, alt: string}} Screenshot
 */
export class Project {
  /**
   * @param {{id: string, title: string, tagline: string, color: string, cover: string,
   *   coverKind: 'phone'|'wide', description: string, features: string[], techStack: string[],
   *   conclusion?: string, screenshots: Screenshot[]}} data
   */
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.tagline = data.tagline;
    this.color = data.color;
    this.cover = data.cover;
    this.coverKind = data.coverKind;
    this.description = data.description;
    this.features = data.features;
    this.techStack = data.techStack;
    this.conclusion = data.conclusion || '';
    /** @type {Screenshot[]} */
    this.screenshots = data.screenshots;
  }
}
