/** A job on the experience board. */
export class Job {
  /**
   * @param {{id: string, role: string, company: string, shortName: string, location: string,
   *   dates: string, color: string, points: string[]}} data
   */
  constructor(data) {
    this.id = data.id;
    this.role = data.role;
    this.company = data.company;
    this.shortName = data.shortName;
    this.location = data.location;
    this.dates = data.dates;
    this.color = data.color;
    this.points = data.points;
  }
}
