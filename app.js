const taskList = document.getElementById('task-list');
const API_URL = 'https://crudcrud.com/api/b378a3a498824c26926d139573b4d2ca/tasks';

const fetchTasks = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);

    const tasks = await response.json();
    taskList.innerHTML = '';

    if (tasks.length === 0) {
      taskList.innerHTML = '<p class="empty-message">No task yet.</p>'
    } else {
      const template = tasks.map(task => `
        <li class="task-item" title="Double click to edit">
          <span class="task-name" data-id="${task._id}">${task.name}</span>
          <button class="btn-delete" data-id="${task._id}">&#x2715;</button>
        </li>
      `).join('');
      taskList.innerHTML = template;
    }
  } catch (error) {
    console.error(error.message);
  }
};

const form = document.getElementById('task-form');
const taskField = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');

form.addEventListener('submit', async e => {
  e.preventDefault();

  addBtn.disabled = true;
  addBtn.textContent = 'Adding...';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: taskField.value })
    });
    if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
  } catch (error) {
    console.error(error.message);
  } finally {
    addBtn.disabled = false;
    addBtn.textContent = 'Add Task';
    form.reset();
    fetchTasks();
  }
});

const modal = {
  delete: {
    container: document.getElementById('delete-modal'),
    cancel: document.getElementById('cancel-delete'),
    confirm: document.getElementById('confirm-delete')
  },
  edit: {
    container: document.getElementById('edit-modal'),
    form: document.getElementById('edit-form'),
    input: document.getElementById('edit-input'),
    cancel: document.getElementById('cancel-edit'),
    confirm: document.getElementById('confirm-edit')
  }
};
let taskId = null;

taskList.addEventListener('click', e => {
  e.preventDefault();
  if (e.target.classList.contains('btn-delete')) {
    taskId = e.target.dataset.id;
    modal.delete.container.classList.remove('hidden'); 
  }
});
modal.delete.cancel.addEventListener('click', () => {
  modal.delete.container.classList.add('hidden');
  taskId = null;
});
modal.delete.confirm.addEventListener('click', async () => {
  if (!taskId) return;

  modal.delete.confirm.textContent = 'Deleting...';
  modal.delete.confirm.disabled = true;

  try {
    const response = await fetch(`${API_URL}/${taskId}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
  } catch (error) {
    console.error(error.message);
  } finally {
    modal.delete.container.classList.add('hidden');
    modal.delete.confirm.textContent = 'Delete';
    modal.delete.confirm.disabled = false;
    taskId = null;
    fetchTasks();
  }
});

taskList.addEventListener('dblclick', e => {
  e.preventDefault();
  const taskItem = e.target.closest('.task-item');
  if (taskItem) {
    const taskName = taskItem.querySelector('.task-name');
    taskId = taskName.dataset.id;
    modal.edit.input.value = taskName.textContent;
    modal.edit.container.classList.remove('hidden');
  }
});
modal.edit.form.addEventListener('submit', async e => {
  e.preventDefault();

  modal.edit.confirm.disabled = true;
  modal.edit.confirm.textContent = 'Saving...';

  try {
    const response = await fetch(`${API_URL}/${taskId}`, {
      'method': 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: modal.edit.input.value })
    });
    if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
  } catch (error) {
    console.error(error.message);
  } finally {
    modal.edit.container.classList.add('hidden');
    modal.edit.confirm.textContent = 'Save Changes';
    modal.edit.confirm.disabled = false;
    taskId = null;
    fetchTasks();
  }
});
modal.edit.cancel.addEventListener('click', () => {
  modal.edit.container.classList.add('hidden');
  taskId = null;
});

fetchTasks();