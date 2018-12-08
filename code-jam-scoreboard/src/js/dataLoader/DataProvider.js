export default class DataProvider {
  constructor(dataFormatter, userDataUrl, sessionDataUrl) {
    this.dataFormatter = dataFormatter;

    this.userDataUrl = userDataUrl;
    this.sessionDataUrl = sessionDataUrl;
  }

  loadData() {
    return Promise.all([
      this._load(this.userDataUrl),
      this._load(this.sessionDataUrl),
    ]);
  }

  async _load(url) {
    const result = await fetch(url);
    return result.json();
  }
}
