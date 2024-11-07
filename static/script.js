const API_LINK = 'http://localhost:3000/task'

const displayCards = (data) => {
  const container = document.getElementById('tasks')
  data.forEach((item) => {
    const card = document.createElement('div')
    card.className = 'card'
    card.id = item.id

    const name = document.createElement('h3')
    name.textContent = item.name
    card.appendChild(name)

    const description = document.createElement('p')
    description.textContent = item.description
    card.appendChild(description)

    if (item.done) {
      card.classList.add('done')
    }
    container.appendChild(card)
  })
}

const fetchTasks = async () => {
  try {
    const response = await fetch(API_LINK)
    const data = await response.json()

    console.log(data)
    displayCards(data)
  } catch (err) {
    console.error('Error fetching tasks:', err)
  }
}

document.addEventListener('DOMContentLoaded', fetchTasks)
