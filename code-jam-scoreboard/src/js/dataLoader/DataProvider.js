export default class DataProvider {
  constructor(userDataUrl, sessionDataUrl, previousYearSessionDataUrl,
    previousYearUserDataUrl) {
    this.userDataUrl = userDataUrl;
    this.sessionDataUrl = sessionDataUrl;
    this.previousYearSessionDataUrl = previousYearSessionDataUrl;
    this.previousYearUserDataUrl = previousYearUserDataUrl;
  }

  loadData() {
    return Promise.all([
      this._load(this.userDataUrl),
      this._load(this.sessionDataUrl),
    ]);
  }

  loadPreviousGroup() {
    return Promise.all([
      this._load(this.previousYearUserDataUrl),
      this._load(this.previousYearSessionDataUrl),
    ]);
  }

  async _load(url) {
    const result = await fetch(url);
    return result.json();
  }
}
