import * as _ from 'lodash';

export default class TableViewBuilder {
  constructor(maxUsersForSelection) {
    this.maxUsersForSelection = maxUsersForSelection;
  }

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

  build(sessionId = 0) {
    if (!this.data) {
      throw new Error('Data was not passed to builder object');
    }

    this.clean();

    const fragment = document.createDocumentFragment();
    this._populateBaseTableInfo(fragment, sessionId);
    this._populateUserStatistics(fragment, sessionId);
    this._addEventListeners(fragment);
    document.body.append(fragment);
    return this.data;
  }

  _populateBaseTableInfo(fragment, sessionId) {
    const table = document.createElement('table');
    const head = document.createElement('thead');
    const headRow = document.createElement('tr');

    const gitHubColumn = document.createElement('th');
    gitHubColumn.innerText = 'Github';
    headRow.append(gitHubColumn);

    _.each(this.data.puzzles[sessionId].puzzles, (puzzler) => {
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

  _populateUserStatistics(fragment, sessionId) {
    const body = document.createElement('tbody');
    _.each(this.data.users, this._appendUserToTable.bind(this, body, sessionId));
    fragment.querySelector('table').append(body);
  }

  _appendUserToTable(body, sessionId, user) {
    const row = document.createElement('tr');
    row.id = user.id;
    row.append(this._createTableRow(user.name));
    _.each(user.session[sessionId].answers, (answer) => {
      row.append(this._createTableRow(answer.time.$numberLong, answer.code, 'tooltip'));
    });
    row.append(this._createTableRow(user.session[sessionId].overalTime));
    row.append(this._buildCheckBox());
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
    td.append(input);
    return td;
  }

  _addEventListeners(fragment) {
    fragment.querySelector('table').addEventListener('click', this._checkboxClickedEvent.bind(this));
  }

  _checkboxClickedEvent(event) {
    if (event && event.target.getAttribute('type') === 'checkbox') {
      const { id } = event.target.closest('tr');
      const user = _.find(this.data.users, ['id', id]);
      const eventName = event.target.checked ? 'addToChart' : 'removeFromChart';
      document.body.dispatchEvent(new CustomEvent(eventName, { detail: user }));
    }
    this._blockSelection(this._isMaxAllowedNumberOfUsersSelected());
  }

  _isMaxAllowedNumberOfUsersSelected() {
    return document.querySelectorAll('input[type=checkbox]:checked').length >= this.maxUsersForSelection;
  }

  _blockSelection(block) {
    _.each(
      _.filter(document.querySelectorAll('input[type=checkbox]'), checkbox => !checkbox.checked),
      (checkbox) => { checkbox.disabled = block; },
    );
  }
}
