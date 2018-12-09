import _ from 'lodash';

export default class ComparisonTableView {
  withData(data) {
    this.data = data;
    return this;
  }

  clean() {
    const table = document.querySelector('table');
    if (table) {
      table.removeEventListener('click', this._checkboxClickedEvent);
      table.remove();
    }
  }

  build() {
    if (!this.data) {
      throw new Error('Data was not passed to builder object');
    }

    this.clean();

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

    _.each(this.data.puzzles[0].puzzles, (puzzler) => {
      const th = document.createElement('th');
      th.innerText = puzzler.name;
      headRow.append(th);
    });

    const overalColumn = document.createElement('th');
    overalColumn.innerText = 'Overal time';
    headRow.append(overalColumn);

    const checkboxColumn = document.createElement('th');
    checkboxColumn.innerText = 'Comparison';
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

    const github = this._createTableRow(user.name);
    github.setAttribute('rowspan', 2);
    row.append(github);

    _.each(user.session[0].answers, (answer) => {
      row.append(this._createTableRow(answer.time.$numberLong, answer.code));
    });
    row.append(this._createTableRow(user.session[0].overalTime));

    row.append(this._buildCheckBox());
    body.append(row);

    this._appendPreviousResults(body, user);
  }

  _appendPreviousResults(body, user) {
    const row = document.createElement('tr');
    row.name = user.id;
    _.each(user.session[1].answers, (answer) => {
      row.append(this._createTableRow(answer.time.$numberLong, answer.code, 'center'));
    });
    row.append(this._createTableRow(user.session[1].overalTime));
    body.append(row);
  }

  _createTableRow(value, title = '', className) {
    const td = document.createElement('td');
    td.setAttribute('title', title);
    td.innerText = value;
    if (className) {
      td.classList.add(className);
    }
    return td;
  }

  _buildCheckBox() {
    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    const td = this._createTableRow(null);
    td.setAttribute('rowspan', 2);
    td.append(input);
    return td;
  }

  _addEventListeners(fragment) {
    fragment.querySelector('table').addEventListener('click', this._checkboxClickedEvent.bind(this));
  }

  _checkboxClickedEvent(event) {
    if (event && event.target.getAttribute('type') === 'checkbox') {
      document.body.dispatchEvent(new CustomEvent('clear'));
      const { id } = event.target.closest('tr');
      const user = _.find(this.data.users, ['id', id]);
      document.body.dispatchEvent(new CustomEvent('addToChart', {
        detail: {
          name: 'q1',
          session: [{ answers: user.session[0].answers }],
        },
      }));
      document.body.dispatchEvent(new CustomEvent('addToChart', {
        detail: {
          name: 'q3',
          session: [{ answers: user.session[1].answers }],
        },
      }));
    }
  }
}
