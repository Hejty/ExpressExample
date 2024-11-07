import express = require('express')
import { Application, Request, Response } from 'express'
import 'dotenv/config'
import { writeFile } from 'fs'

const app: Application = express()
const port = process.env.PORT
const fs = require('fs/promises')
const path = './tasks.json'

async function readFile(id?: string) {
  try {
    const data = await fs.readFile(path, 'utf-8')
    const jsonData = JSON.parse(data)
    const tasks = jsonData.data

    if (id) {
      const taskId = parseInt(id)
      const task = tasks.find((t: any) => t.id === taskId)
      return task || null
    }

    return tasks
  } catch (err) {
    console.error('Error reading file', err)
    throw err
  }
}

async function editFile(name: string, description: string, id?: string) {
  try {
    const data = await readFile()
    const tasks = data
    if (id) {
      //Edit task
      const taskId = parseInt(id)
      const task = tasks.find((t: any) => t.id === taskId)
      if (!task) return null
      if (name) task.name = name
      if (description) task.description = description

      await fs.writeFile(path, JSON.stringify({ data: tasks }, null, 2))
      return
    }

    const newTask = {
      id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
      name: name,
      description: description,
      done: false,
    }
    tasks.push(newTask)

    await fs.writeFile(path, JSON.stringify({ data: tasks }, null, 2))
    return
  } catch (err) {
    console.error('Error editing file', err)
    throw err
  }
}

app.use(express.json())

// Static directory for frontend
// ./static
app.use('/static', express.static('static'))

// Displays all tasks
app.get('/task', async (req: Request, res: Response) => {
  try {
    const data = await readFile()
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ message: 'Error reading tasks.' })
  }
})

// Displays specific task
app.get('/task/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const data = await readFile(id)

    if (!data) {
      res.status(404).json({ error: 'Task not found.' })
    } else {
      res.status(200).json(data)
    }
  } catch (err) {
    res.status(500).json({ message: 'Error reading task.' })
  }
})

// Adds a task
app.post('/task', async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body
    if (!name || !description) {
      res.status(400).json({ error: 'Name and description are required.' })
    } else {
      await editFile(name, description)
      res.status(201).json({ message: 'Succesfully posted task.' })
    }
  } catch (err) {
    res.status(500).json({ message: 'Error posting task.' })
  }
})

// Edits a task
app.put('/task/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const { name, description } = req.body

    if (!name && !description) {
      res
        .status(400)
        .json({ error: 'At least name or description must be provided.' })
    } else {
      await editFile(name, description, id)
      res.status(200).json({ message: 'Succesfully edited task.' })
    }
  } catch (err) {
    res.status(500).json({ message: 'Error editing task.' })
  }
})

app.listen(port, () => {
  console.log(`Server started on port ${port}!`)
})
