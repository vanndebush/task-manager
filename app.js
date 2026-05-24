const taskList = document.getElementById('task-list');
const API_URL = 'https://crudcrud.com/api/c30167173cd64953a1c57c686f9eebe3/tasks';

const fetchTasks = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);

    const tasks = await response.json();
    taskList.innerHTML = '';
    const template = tasks.map(task => `
      <li class="task-item">
        <span class="task-name">${task.name}!</span>
        <button class="btn-delete" data-id="${task._id}">&#x2715;</button>
      </li>
    `).join('');
    taskList.innerHTML = template;
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
taskList.addEventListener('click', async e => {
  e.preventDefault();

  if (e.target.classList.contains('btn-delete')) {
    const taskId = e.target.dataset.id;
    if (!confirm('Delete this task?')) return;

    try {
      const response = await fetch(`${API_URL}/${taskId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
      fetchTasks();
    } catch (error) {
      console.error(error.message);
    }
  }
});