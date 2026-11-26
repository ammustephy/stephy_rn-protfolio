/**
 * One stop of the guided tour. The camera framing for a stop lives in the
 * scene view (views/scene/layout.js); the model only knows what the stop is.
 */
export class Stop {
  /** @param {{id: string, label: string, title: string}} data */
  constructor(data) {
    this.id = data.id;
    this.label = data.label;
    this.title = data.title;
  }
}
