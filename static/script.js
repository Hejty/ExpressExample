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
