const API_URL = 'https://crudcrud.com/api/21021eac47db4ef096bb4d6ce8c1ec47/tasks';

const fetchTasks = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);

    const tasks = await response.json();
    console.log(tasks);
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
      body: JSON.stringify({ task: taskField.value })
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