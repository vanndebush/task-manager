const taskList = document.getElementById('task-list');
const API_URL = 'https://crudcrud.com/api/5120718cd9614fcc83459cfb7d6f851d/tasks';

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
        <li class="task-item">
          <span class="task-name">${task.name}</span>
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
    fetchTasks();
  } catch (error) {
    console.error(error.message);
  } finally {
    addBtn.disabled = false;
    addBtn.textContent = 'Add Task';
    form.reset();
  }
});

const deleteModal = document.getElementById('delete-modal');
const btnCancel = document.getElementById('cancel-delete');
const btnConfirm = document.getElementById('confirm-delete');

let taskId = null;

taskList.addEventListener('click', e => {
  e.preventDefault();

  if (e.target.classList.contains('btn-delete')) {
    taskId = e.target.dataset.id;
    deleteModal.classList.remove('hidden'); 
  }
});
btnCancel.addEventListener('click', () => {
  deleteModal.classList.add('hidden');
  taskId = null;
});
btnConfirm.addEventListener('click', async () => {
  if (!taskId) return;

  btnConfirm.textContent = 'Deleting...';
  btnConfirm.disabled = true;

  try {
    const response = await fetch(`${API_URL}/${taskId}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
    fetchTasks();
  } catch (error) {
    console.error(error.message);
  } finally {
    deleteModal.classList.add('hidden');
    btnConfirm.textContent = 'Delete';
    btnConfirm.disabled = false;
    taskId = null;
  }
});

fetchTasks();