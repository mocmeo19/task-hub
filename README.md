[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url]

## What is
You know, task-hub help you run and manage your schedule running 
function. 
## Installation

```bash
npm install task-hub
```
## Quick start

```javascript
const TaskHub = require('task-hub')

const taskHub = TaskHub.init()
const task = taskHub.addTask(function () {
  const { config } = this
  console.log(config.value)
  // 1
}, { value: 1 })
taskHub.start(task.id)
```
## API
### addTask(function, options)
Add new task to hub
- function: the task function
- options: the config for task function
```javascript
const taskConfig = {
  value: 1
}
const syncTask = function () {
  // You can access taskConfig from "this"
  const { config } = this
  console.log(config.value)
}
const asyncTask = function () {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('Run')
      resolve()
    }, 3000)
  })
}
// add sync task
const task = taskHub.addTask(syncTask, taskConfig)
// add async task
const task = taskHub.addTask(asyncTask, taskConfig)
```
### updateConfig(newConfig)
Update config of exist task in hub
- newConfig: The config will be merged with exist config.
```javascript
taskHub.updateConfig(task.id, {value: 2})
```
### start(taskId)
Start the specific task in hub.
- taskId: Id of task will be started.
```javascript
taskHub.start(task.id)
```
### stop(taskId)
Stop the specific task in hub.
- taskId: Id of task will be stopped.
```javascript
taskHub.stop(task.id)
```
### stopAll()
Stop all task in hub.
```javascript
taskHub.stopAll()
```

**Note**: If task is running, it can be stopped until it completes it's function 
## Events
### start
Event when task start.
```javascript
task.on('start', function () {
  console.log('Now, task will be executed.')
})
```
### completed
Event when task run completed.
```javascript
task.on('completed', function(res) {
  console.log('Result:', res)
})
```
### error
Event when an error raised while execute task. 
```javascript
task.on('error', function(error) {
  console.log('An error has been occurred.', error)
})
```
## Debug
To enable log of process, set
```javascript
TaskHub.debug = true
```

## Develop Path

- [ ] Set limit for hub.
- [ ] Limit quantity of tasks can be run at same time.
- [ ] Stats for hub.