const Events = require('events')
const {v4} = require('uuid')

class TaskHub {
  static init (opts) {
    const config = Object.assign({
      maxSize: Number.MAX_SAFE_INTEGER
    }, opts)
    if (typeof TaskHub.hub !== 'undefined') return TaskHub.hub
    TaskHub.hub = new TaskHub(config)
    return TaskHub.hub
  }
  constructor(opts) {
    this.opts = opts
    this.storage = new Map()
  }
  get size () {
    return this.storage.size
  }

  addTask(handler, config) {
    if (typeof handler !== 'function') throw Error('Task must be a function')
    const taskId = v4()
    const task = new Task(handler, config, taskId)
    this.storage.set(taskId, task)
    return task
  }
  getTask(taskId) {
    const task = this.storage.get(taskId)
    return task || null
  }
  updateConfig(taskId, newConfig) {
    const task = this.getTask(taskId)
    if (task === null) throw Error(`Task "${taskId}" is not found.`)
    Object.assign(task.config, newConfig)
  }
  start (taskId) {
    const task = this.getTask(taskId)
    if (task === null) throw Error(`Task "${taskId}" is not found.`)
    task.start()
  }
  stop (taskId) {
    const task = this.getTask(taskId)
    if (task === null) throw Error(`Task "${taskId}" is not found.`)
    task.stop()
  }
  stopAll () {
    this.storage.forEach(function (task, taskId) {
      task.stop()
    })
  }
}

class Task extends Events {
  static get STATE() {
    return {
      RUNNING: 'running',
      QUEUED: 'queued',
      SLEEPING: 'sleeping'
    }
  }
  constructor(handler, config, taskId) {
    super()
    this.config = Object.assign({
      timeInterval: 5000
    }, this.config, config)
    this.id = taskId
    this.instance = null
    this.handler = handler
    this.state = Task.STATE.QUEUED
  }
  log () {
    if (TaskHub.debug) {
      const date = new Date().toLocaleString('en-GB', { hour12: false })
      console.log(date, ...arguments)
    }
  }
  start () {
    const timeInterval = this.instance ? this.config.timeInterval : 0
    this.log(`Schedule for task "${this.id}" in ${timeInterval}ms.`)
    this.instance = setTimeout(async () => {
      this.log(`Task "${this.id}" is running`)
      this.emit('start')
      this.state = Task.STATE.RUNNING
      try {
        const result = await this.handler.call(this)
        this.log(`Task "${this.id}" run completed`)
        this.emit('completed', result)
      } catch (e) {
        this.emit('error', e)
      }
      this.state = Task.STATE.SLEEPING
      setTimeout(this.start.bind(this))
    }, timeInterval)
  }
  stop () {
    this.log(`Stop task "${this.id}"`)
    clearTimeout(this.instance)
  }
}

module.exports = TaskHub
