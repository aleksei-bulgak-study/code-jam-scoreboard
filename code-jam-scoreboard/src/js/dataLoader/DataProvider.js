export default class DataProvider {
  constructor(dataFormatter, userDataUrl, sessionDataUrl, previousYearDataUrl) {
    this.dataFormatter = dataFormatter;

    this.userDataUrl = userDataUrl;
    this.sessionDataUrl = sessionDataUrl;
    this.previousYearDataUrl = previousYearDataUrl;
  }

  loadData() {
    return Promise.all([
      this._load(this.userDataUrl),
      this._load(this.sessionDataUrl),
      this._load(this.previousYearDataUrl),
    ]);
  }

  async _load(url) {
    const result = await fetch(url);
    return result.json();
  }
}
