const API_LINK = 'http://localhost:3000/task'

const displayCards = (data) => {
  const container = document.getElementById('tasks')
  data.forEach((item) => {
    const card = displayTaskDetails(item)
    container.appendChild(card)
  })
}

const displayTaskDetails = (data) => {
  const card = document.createElement('div')
  card.className = 'card'
  card.id = data.id

  const name = document.createElement('h3')
  name.textContent = data.name
  card.appendChild(name)

  const description = document.createElement('p')
  description.textContent = data.description
  card.appendChild(description)

  if (data.done) {
    card.classList.add('done')
  }

  return card
}

const fetchTasks = async () => {
  try {
    const response = await fetch(API_LINK)
    const data = await response.json()

    if (data) displayCards(data)
  } catch (err) {
    console.error('Error fetching tasks:', err)
  }
}

const fetchSpecificTask = async (id) => {
  try {
    const response = await fetch(`${API_LINK}/${id}`)
    const data = await response.json()
    console.log(data)
    if (data) {
      const container = document.getElementById('specificTask')
      const task = displayTaskDetails(data)
      container.appendChild(task)
    }
  } catch (err) {
    console.error('Error fetching task:', err)
  }
}

const fetchPostTask = async (name, description) => {
  try {
    const response = await fetch(API_LINK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description }),
    })
    const result = await response.json()

    if (response.ok) alert('Task added successfully!')
  } catch (err) {
    console.error('Error posting task:', err)
  }
}

const fetchPutTask = async (id, name, description) => {
  try {
    const response = await fetch(`${API_LINK}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, name, description }),
    })
    const result = await response.json()

    if (response.ok) alert('Task edited successfully!')
  } catch (err) {
    console.error('Error editing task:', err)
  }
}

const fetchDeleteTask = async (id) => {
  try {
    const response = await fetch(`${API_LINK}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })
    const result = await response.json()

    if (response.ok) alert('Task deleted successfully!')
  } catch (err) {
    console.error('Error deleting task:', err)
  }
}

document.addEventListener('DOMContentLoaded', fetchTasks)
document
  .getElementById('specificTaskForm')
  .addEventListener('submit', (event) => {
    event.preventDefault()

    const taskId = document.getElementById('taskId').value
    if (taskId) {
      fetchSpecificTask(taskId)
    } else {
      document.getElementById('taskDetails').textContent =
        'Please enter a valid task ID.'
    }
  })
document.getElementById('taskAddForm').addEventListener('submit', (event) => {
  event.preventDefault()

  const name = document.getElementById('name').value
  const description = document.getElementById('description').value
  if (name && description) {
    fetchPostTask(name, description)
  } else {
    alert('Input name and description!')
  }
})
document.getElementById('taskEditForm').addEventListener('submit', (event) => {
  event.preventDefault()

  const id = document.getElementById('editId').value
  const name = document.getElementById('editName').value
  const description = document.getElementById('editDescription').value
  if (id && name && description) {
    fetchPutTask(id, name, description)
  } else {
    alert('Input id, name and description!')
  }
})
document
  .getElementById('removeTaskForm')
  .addEventListener('submit', (event) => {
    event.preventDefault()

    const id = document.getElementById('removeId').value
    if (id) {
      fetchDeleteTask(id)
    } else {
      alert('Input id!')
    }
  })
