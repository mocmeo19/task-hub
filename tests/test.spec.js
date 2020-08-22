const TaskHub = require('../')

const myTask = async function () {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(this.config)
      console.log('My Task has been run.')
      resolve()
    }, 3000)
  })
}
TaskHub.debug = true
const taskHub = TaskHub.init()

const task = taskHub.addTask(myTask, { value: 1 })
task.on('completed', () => {
  console.log(taskHub.size)
})
taskHub.start(task.id)
setTimeout(() => {
  taskHub.updateConfig(task.id, { value: 2 })
}, 10000)
setTimeout(() => {
  taskHub.stop(task.id)
}, 20000)
