/** A degree or course shown as a framed certificate. */
export class Education {
  /**
   * @param {{id: string, title: string, shortTitle: string, institution: string, year: string, detail: string}} data
   */
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.shortTitle = data.shortTitle;
    this.institution = data.institution;
    this.year = data.year;
    this.detail = data.detail;
  }
}
