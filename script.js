const addListForm = document.querySelector('body>form');
const list = document.querySelector('body>ul');

addListForm.onsubmit = handleNewSubmit;
list.onsubmit = handleListSubmit;
list.onclick = handleListClick;
list.addEventListener('toggle', handleListToggle, true);

function handleNewSubmit(e) {
  e.preventDefault();

  const name = addListForm.name.value.trim();

  if (!name) return;

  addList(name);
  addListForm.reset();
}

function handleListSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const action = form.getAttribute('action');

  if (action === 'name-list') handleRenameList(e);
  if (action === 'add-item') handleAddItem(e);
  if (action === 'name-item') handleRenameItem(e);
}

function handleListToggle(e) {
  if (!e.target.matches('li>details')) return

  if (e.newState === 'closed') maintainOrder(e.target);
  if (e.newState === 'open') closeOtherDetails.call(e.target);
}

function handleListClick(e) {
  const btn = e.target.closest('button');
  const action = btn?.innerHTML;

  if (action === 'Delete List') handleDeleteList(e);
  if (action === 'Delete') handleDelete(e);
  if (action === 'Edit') handleEdit(e);
  if (action === 'Cancel') handleCancel(e);
}

function handleDeleteList(e) {
  const btn = e.target;
  const item = btn.closest('li');
  const i = getIndexOf(item);

  removeList(i);
}

function handleDelete(e) {
  const item = e.target.closest('li');
  const parentItem = item.parentNode.closest('li');
  const i = getIndexOf(parentItem);
  const j = getIndexOf(item);

  removeItem(i, j);
}

function handleEdit(e) {
  const btn = e.target;
  const item = btn.closest('li');
  const parentItem = item.parentNode.closest('li');
  const i = getIndexOf(parentItem);
  const j = getIndexOf(item);

  enableItemEdit(i, j);
}

function handleCancel(e) {
  const btn = e.target;
  const item = btn.closest('li');
  const parentItem = item.parentNode.closest('li');
  const i = getIndexOf(parentItem);
  const j = getIndexOf(item);

  cancelEdit(i, j);
}

function handleRenameList(e) {
  const form = e.target;
  const newName = form.name.value.trim();
  const li = form.closest('li');
  const i = getIndexOf(li);

  renameList(i, newName);
}

function handleAddItem(e) {
  const form = e.target;
  const parentItem = form.closest('li');
  const i = getIndexOf(parentItem);
  const name = form.text.value.trim();

  if (!name) return;

  addItem(i, name);
  form.reset();
}

function handleRenameItem(e) {
  const form = e.target;
  const newName = form.name.value.trim();
  const item = form.closest('li');
  const parentItem = item.parentNode.closest('li');
  const i = getIndexOf(parentItem);
  const j = getIndexOf(item);

  renameItem(i, j, newName);
}


function addList(name) {
  const item = document.createElement('li');

  item.innerHTML = `
    <details>
      <summary>${name}</summary>

      <details>
        <summary>
          <span> list actions</span>
        </summary>

        <fieldset>
          <form action="name-list">
            <input type="text" name="name" value="${name}">
            <button type="submit">Update List Name</button>
            <button type="button">Delete List</button>
          </form>
        </fieldset>
      </details>

      <form action="add-item">
        <input type="text" name="text">
        <button type="submit">Add Item</button>
      </form>

      <ul></ul>
    </details>
  `;

  list.prepend(item);
}

function renameList(i, newName) {
  const item = list.children[i];
  const summary = item.querySelector('summary');
  const details = item.querySelector('details>details');
  const form = details.querySelector('form');

  details.removeAttribute('open');
  summary.innerText = newName;
  form.name.setAttribute('value', newName);
  form.reset();
}

function removeList(i) {
  const item = list.children[i];

  item.remove();
}

function addItem(i, name) {
  const parentItem = list.children[i];
  const subList = parentItem.querySelector('ul');
  const item = document.createElement('li');

  item.innerHTML = `
    <div>
      <span>${name}</span>
      <button>Edit</button>
      <button>Delete</button>
    </div>

    <fieldset hidden>
      <form action="name-item">
        <input type="text" name="name" value="${name}">
        <button type="submit">Save</button>
        <button type="button">Cancel</button>
      </form>
    </fieldset>
  `;

  subList.prepend(item);
}

function enableItemEdit(i, j) {
  const parentItem = list.children[i];
  const subList = parentItem.querySelector('ul');

  for (let k = 0; k < subList.children.length; k++) {
    const item = subList.children[k];
    const [div, fieldset] = item.children;

    div.hidden = k === j;
    fieldset.hidden = k !== j;
  }
}

function cancelEdit(i, j) {
  const parentItem = list.children[i];
  const subList = parentItem.querySelector('ul');
  const item = subList.children[j];
  const [div, fieldset] = item.children;

  div.hidden = false;
  fieldset.hidden = true;
}

function renameItem(i, j, newName) {
  const parentItem = list.children[i];
  const subList = parentItem.querySelector('ul');
  const item = subList.children[j];
  const div = item.querySelector('div');
  const span = div.querySelector('span');
  const form = item.querySelector('form');

  span.innerText = newName;
  form.name.setAttribute('value', newName);
  form.reset();

  cancelEdit(i, j);
}

function removeItem(i, j) {
  const parentItem = list.children[i];
  const subList = parentItem.querySelector('ul');
  const item = subList.children[j];

  item.remove();
}

function getIndexOf(item) {
  const list = item.parentElement;
  const items = Array.from(list.children);
  const i = items.indexOf(item);

  return i;
}

function maintainOrder(details) {
  const subDetails = details.querySelector('details');
  const inputs = details.querySelectorAll('input');
  const items = details.querySelectorAll('li');

  subDetails.removeAttribute('open');

  for (const input of inputs) {
    input.value = input.getAttribute('value');
  }
  
  for (const item of items) {
    const [div, fieldset] = item.children;

    div.hidden = false;
    fieldset.hidden = true;
  }
}

function closeOtherDetails() {
  const allDetails = list.querySelectorAll('li>details');

  for (const details of allDetails) {
    if (details !== this) details.removeAttribute('open');
  }
}
