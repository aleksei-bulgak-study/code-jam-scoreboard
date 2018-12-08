import * as _ from 'lodash';

export default class TableViewBuilder {
  withData(data) {
    this.data = data;
    return this;
  }

  build() {
    if (!this.data) {
      throw new Error('Data was not passed to builder object');
    }

    const fragment = document.createDocumentFragment();
    this._populateBaseTableInfo(fragment);
    this._populateUserStatistics(fragment);
    this._addEventListeners(fragment);
    document.body.append(fragment);
  }

  _populateBaseTableInfo(fragment) {
    const table = document.createElement('table');
    const head = document.createElement('thead');
    const headRow = document.createElement('tr');

    const gitHubColumn = document.createElement('th');
    gitHubColumn.innerText = 'Github';
    headRow.append(gitHubColumn);

    _.each(this.data.puzzles, (puzzler) => {
      const th = document.createElement('th');
      th.innerText = puzzler.name;
      headRow.append(th);
    });

    const checkboxColumn = document.createElement('th');
    checkboxColumn.innerText = 'Append to chart';
    headRow.append(checkboxColumn);

    head.append(headRow);
    table.append(head);
    fragment.append(table);
  }

  _populateUserStatistics(fragment) {
    const body = document.createElement('tbody');
    _.each(this.data.users, this._appendUserToTable.bind(this, body));
    fragment.querySelector('table').append(body);
  }

  _appendUserToTable(body, user) {
    const row = document.createElement('tr');
    row.id = user.id;
    row.append(this._createTableRow(user.name));
    _.each(user.session[0].answers, (answer) => {
      row.append(this._createTableRow(answer.time.$numberLong, answer.code));
    });
    row.append(this._buildCheckBox());
    body.append(row);
  }

  _createTableRow(value, title = '') {
    const td = document.createElement('td');
    td.setAttribute('title', title);
    td.innerText = value;
    return td;
  }

  _buildCheckBox() {
    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    const td = this._createTableRow(null);
    td.append(input);
    return td;
  }

  _addEventListeners(fragment) {
    fragment.querySelector('table').addEventListener('click', (event) => {
      if (event && event.target.getAttribute('type') === 'checkbox') {
        const { id } = event.target.closest('tr');
        const user = _.find(this.data.users, ['id', id]);
        const eventName = event.target.checked ? 'addToChart' : 'removeFromChart';
        document.dispatchEvent(new CustomEvent(eventName, { detail: user }));
      }
    });
  }
}
