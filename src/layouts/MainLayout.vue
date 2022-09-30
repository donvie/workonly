<template>
  <q-layout view="hHh LpR fFf">
    <q-header :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'" bordered>
      <q-bar v-touch-pan.prevent.mouse="moveFab" class="q-electron-drag" :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-black'">
        <div @click="draggingFab ? '' : projectForm = true" class="col text-center" style="font-size: 13px; margin-top: -6px;">
          {{projectData === null ? 'OnlyWork' : projectData.project_name}}
        </div>
      </q-bar>

      <q-toolbar v-if="getOnGoingTask === ''" class="q-my-md text-black">
        <q-input class="full-width" ref="whatAreYouDoing" rounded dense standout="bg-primary no-shadow text-white" v-model="whatAreYouDoing" placeholder="What are you doing?" />

        <q-space />

        <q-btn
          v-hotkey="keymap"
          @click="createTask()"
          :loading="createTaskLoading"
          class="q-ml-sm"
          color="positive"
          unelevated
          dense
          round
          icon="play_arrow"
        />
      </q-toolbar>

      <q-item v-else class="q-my-md">
        <q-item-section v-if="getOnGoingTask" @click.native="openUpdateTaskCallback(getOnGoingTask)">
          <q-item-label class="ellipsis" caption v-if="getOnGoingTask.description === null">
            <q-icon size="16px" name="add" color="grey" /> Add description
          </q-item-label>
          <q-item-label :class="$q.dark.isActive ? 'text-white' : 'text-black'" class="ellipsis" v-else>
            {{getOnGoingTask.description}}
          </q-item-label>
          <q-item-label class="ellipsis" caption v-if="getOnGoingTask.title === ''"><q-icon size="16px" name="add" color="grey" /> Add project</q-item-label>
          <q-item-label :class="$q.dark.isActive ? 'text-white' : 'text-black'" class="ellipsis" v-else>{{getOnGoingTask.title}}</q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-item-label>
            <span style="position:absolute; right: 60px; top: 20px;">
              <!-- {{getOnGoingTask.total_period_arr.year}}:{{getOnGoingTask.total_period_arr.month}}:{{getOnGoingTask.total_period_arr.day}}: -->
              {{getOnGoingTask.total_period_arr.hour}}:{{getOnGoingTask.total_period_arr.minute}}:{{getOnGoingTask.total_period_arr.seconds}}
              <!-- 0:05:47 -->
            </span>
            <q-btn :loading="updateTaskLoading" @click="updateTask(getOnGoingTask)" icon="stop" color="negative" dense unelevated round />
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-header>

    <q-dialog v-model="projectForm">
      <q-card style="max-width: 350px; min-width: 300px;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Projects</div>
          <q-space />
          <q-btn icon="close" style="margin-top: -22px; margin-right: -12px" flat round dense v-close-popup>
            <q-tooltip>
              Close
            </q-tooltip>
          </q-btn>
        </q-card-section>

        <div class="row q-pa-md">
          <div class="col-12 q-mb-md">
            <q-list v-if="projectsData">
              <q-item v-close-popup @click.native="getProject(project)" v-for="(project, index) in projectsData" :key="index" v-ripple>
                <q-item-section>{{project.project_name}}</q-item-section>
                <q-item-section side v-if="projectData && projectData.id === project.id" avatar>
                  <q-icon color="primary" name="check" />
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </q-card>
    </q-dialog>

    <q-dialog v-model="taskUpdateForm">
      <q-card style="max-width: 350px; min-width: 300px;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Details</div>
          <q-space />
          <q-btn icon="close" style="margin-top: -22px; margin-right: -12px" flat round dense v-close-popup>
            <q-tooltip>
              Close
            </q-tooltip>
          </q-btn>
        </q-card-section>

        <div class="row q-pa-md" v-if="taskChild">
          <div class="col-12 q-mb-md">
            <q-input outlined dense rounded @input="updateTaskDetails()" debounce="1000" v-model="taskChild.title" label="Title" autofocus />
          </div>
          <div class="col-12 q-mb-md">
            <q-input outlined dense rounded @input="updateTaskDetails()" debounce="1000" v-model="taskChild.description" label="Description" autofocus />
          </div>
          <div class="col-12 q-mb-md">
            <q-select @new-value="createValueTag" @input="updateTaskDetails()" debounce="1000" :option-label="(item) => item.name" outlined dense rounded use-input input-debounce="0" @filter="filterFnTags" behavior="dialog" multiple use-chips v-model="tags1" :options="tagsOptions" label="Tags" />
          </div>
          <div class="col-12 text-right">
            <q-btn :loading="removeTaskLoading" @click="removeTask()" label="Delete" no-caps unelevated color="negative" />
          </div>
        </div>
      </q-card>
    </q-dialog>

    <q-dialog v-model="taskAddSubForm">
      <q-card style="max-width: 350px; min-width: 300px;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Add Sub Task</div>
          <q-space />
          <q-btn icon="close" style="margin-top: -22px; margin-right: -12px" flat round dense v-close-popup>
            <q-tooltip>
              Close
            </q-tooltip>
          </q-btn>
        </q-card-section>

        <div class="row q-pa-md">
          <div class="col-12 q-mb-md">
            <q-input class="full-width" rounded dense outlined v-model="whatAreYouDoing1" placeholder="What are you doing?" />
          </div>
          <!-- <div class="col-12 q-mb-md">
            <q-select :option-label="(item) => item.project_name" outlined dense rounded use-input input-debounce="0" @filter="filterFnProject" behavior="dialog" v-model="project" :options="projectsOptions" label="Project" />
          </div> -->
          <div class="col-12 q-mb-md">
            <q-input outlined dense rounded  v-model="description" label="Description" autofocus @keyup.enter="taskUpdateForm = false" />
          </div>
          <div class="col-12 q-mb-md">
            <q-select @new-value="createValueTag" :option-label="(item) => item.name" outlined dense rounded use-input input-debounce="0" @filter="filterFnTags" behavior="dialog" multiple use-chips v-model="tags" :options="tagsOptions" label="Tags" />
          </div>
          <div class="col-12 text-right">
            <q-btn :loading="addSubTaskLoading" @click="addSubTask()" label="Save" no-caps unelevated color="primary" />
          </div>
        </div>
      </q-card>
    </q-dialog>

    <q-page-container>
      <!-- <pre>{{projectData}}</pre> -->
      <router-view :tasks="tasks" :addTaskLoading="addTaskLoading" :getOnGoingTask="getOnGoingTask" :projectData="projectData" />
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'MainLayout',
  mounted () {
    if (this.$q.platform.is.electron === true) {
      this.$q.electron.ipcRenderer.on('logOut', e => {
        this.logOut()
      })
      this.$q.electron.ipcRenderer.on('darkMode', e => {
        this.darkMode()
      })
    }

    this.projectData = this.$q.localStorage.getItem('project')

    this.$axios({
      method: 'get',
      url: 'api/v1/task',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${this.$q.localStorage.getItem('WorkOnlyUser').api_token}`
      },
      params: {
        project_id: this.projectData !== null ? this.projectData.project_id : ''
      }
    }).then((response) => {
      this.tasks = response.data
      this.$axios({
        method: 'post',
        url: 'api/v1/getOnGoingTask',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${this.$q.localStorage.getItem('WorkOnlyUser').api_token}`
        }
      }).then((response) => {
        this.getOnGoingTask = response.data
        console.log('getOnGoingTask', response)
      }).catch(error => {
        console.log('error', error)
      })
      console.log('tasks', response.data)
    }).catch(error => {
      console.log('error', error)
    })

    this.$axios({
      method: 'get',
      url: 'api/v1/projects',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${this.$q.localStorage.getItem('WorkOnlyUser').api_token}`
      }
    }).then((response) => {
      this.projectsData = response.data
    }).catch(error => {
      console.log('error', error)
    })

    this.$axios({
      method: 'post',
      url: 'api/v1/getTagList',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${this.$q.localStorage.getItem('WorkOnlyUser').api_token}`
      }
    }).then((response) => {
      this.tagsData = response.data
    }).catch(error => {
      console.log('error', error)
    })
  },
  created () {
    this.$root.$on('openUpdateTask', this.openUpdateTaskCallback)
    this.$root.$on('openAddSubTask', this.openAddSubTaskCallback)
    this.$root.$on('setOnGoingTask', this.updateTask)
  },
  beforeDestroy () {
    // this.$root.$off('openUpdateTask')
    // this.$root.$off('openAddSubTask')
    // this.$root.$off('openAddSubTask')
  },
  computed: {
    keymap () {
      return {
        enter: {
          keydown: this.createTask
        }
      }
    }
  },
  watch: {
    getOnGoingTask (currentTask) {
      if (currentTask !== '') {
        this.timerStart(currentTask)
        this.timerStartParent(currentTask)
      } else {
        this.timerStop()
        this.timerStopParent()
      }
    }
  },
  methods: {
    timerStartParent (currentTask) {
      console.log('timerStartParent', currentTask)
      // const parent = this.tasks.find(task => task.id === parseInt(currentTask.pid))

      let parent = null

      if (parseInt(currentTask.pid) === 0) {
        parent = this.tasks.find(task => task.id === parseInt(currentTask.id))
      } else {
        parent = this.tasks.find(task => task.id === parseInt(currentTask.pid))
      }

      const input = {
        year: parent.total_period_arr.year,
        month: parent.total_period_arr.month,
        day: parent.total_period_arr.day,
        hour: parent.total_period_arr.hour,
        minute: parent.total_period_arr.minute,
        seconds: parent.total_period_arr.seconds
      }

      let timestamp = new Date(input.year, input.month, input.day, input.hour, input.minute, input.seconds)

      const interval = 1

      // const parent = this.tasks.find(task => task.id === currentTask.id)

      this.timerParent = setInterval(() => {
        timestamp = new Date(timestamp.getTime() + interval * 1000)
        parent.total_period_arr.year = timestamp.getFullYear()
        parent.total_period_arr.month = timestamp.getMonth()
        parent.total_period_arr.day = timestamp.getDay()
        parent.total_period_arr.hour = timestamp.getHours()
        parent.total_period_arr.minute = timestamp.getMinutes()
        parent.total_period_arr.seconds = timestamp.getSeconds()
      }, Math.abs(interval) * 1000)
    },
    timerStopParent () {
      clearInterval(this.timerParent)
    },
    timerStart (currentTask) {
      console.log('timerStart', currentTask)
      const input = {
        year: currentTask.total_period_arr.year,
        month: currentTask.total_period_arr.month,
        day: currentTask.total_period_arr.day,
        hour: currentTask.total_period_arr.hour,
        minute: currentTask.total_period_arr.minute,
        seconds: currentTask.total_period_arr.seconds
      }

      let timestamp = new Date(input.year, input.month, input.day, input.hour, input.minute, input.seconds)
      console.log(input)

      const interval = 1

      this.timer = setInterval(() => {
        timestamp = new Date(timestamp.getTime() + interval * 1000)
        if (this.getOnGoingTask !== '') {
          if (parseInt(currentTask.pid) === 0) {
            const index = this.tasks.findIndex(task => task.id === this.getOnGoingTask.id)
            // this.tasks[index].total_period = `${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}`
            this.tasks[index].total_period_arr.year = timestamp.getFullYear()
            this.tasks[index].total_period_arr.month = timestamp.getMonth()
            this.tasks[index].total_period_arr.day = timestamp.getDay()
            this.tasks[index].total_period_arr.hour = timestamp.getHours()
            this.tasks[index].total_period_arr.minute = timestamp.getMinutes()
            this.tasks[index].total_period_arr.seconds = timestamp.getSeconds()
          } else {
            const index = this.tasks.findIndex(task => task.id === parseInt(currentTask.pid))
            const indexChild = this.tasks[index].children.findIndex(task => task.id === currentTask.id)
            // this.tasks[index].children[indexChild].total_period = `${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}`

            this.tasks[index].children[indexChild].total_period_arr.year = timestamp.getFullYear()
            this.tasks[index].children[indexChild].total_period_arr.month = timestamp.getMonth()
            this.tasks[index].children[indexChild].total_period_arr.day = timestamp.getDay()
            this.tasks[index].children[indexChild].total_period_arr.hour = timestamp.getHours()
            this.tasks[index].children[indexChild].total_period_arr.minute = timestamp.getMinutes()
            this.tasks[index].children[indexChild].total_period_arr.seconds = timestamp.getSeconds()
          }
          // this.getOnGoingTask.total_period = `${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}`
          currentTask.total_period_arr.year = timestamp.getFullYear()
          currentTask.total_period_arr.month = timestamp.getMonth()
          currentTask.total_period_arr.day = timestamp.getDay()
          currentTask.total_period_arr.hour = timestamp.getHours()
          currentTask.total_period_arr.minute = timestamp.getMinutes()
          currentTask.total_period_arr.seconds = timestamp.getSeconds()
        }
      }, Math.abs(interval) * 1000)
    },
    timerStop () {
      clearInterval(this.timer)
    },
    moveFab (ev) {
      this.draggingFab = ev.isFirst !== true && ev.isFinal !== true
    },
    getProject (project) {
      this.$axios({
        method: 'get',
        url: 'api/v1/task',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${this.$q.localStorage.getItem('WorkOnlyUser').api_token}`
        },
        params: {
          project_id: project.project_id
        }
      }).then((response) => {
        console.log('getProjec', response)
        this.tasks = response.data
      }).catch(error => {
        console.log('error', error)
      })
      this.projectData = project
      this.$q.localStorage.set('project', project)
    },
    logOut () {
      this.$axios({
        method: 'post',
        url: 'api/v1/logout',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${this.$q.localStorage.getItem('WorkOnlyUser').api_token}`
        }
      }).then((response) => {
        this.$q.loading.hide()
        this.$q.localStorage.remove('WorkOnlyUser')
        this.$router.push('/auth/login')
      }).catch(error => {
        this.$q.loading.hide()
        this.$q.localStorage.remove('WorkOnlyUser')
        this.$router.push('/auth/login')
        console.log('error', error)
      })
    },
    createTask () {
      if (this.projectData === null || this.whatAreYouDoing === '') {
        this.$q.notify({
          icon: 'warning',
          timeout: 1000,
          message: 'Title or Project cant be empty.',
          color: 'negative'
        })
      } else {
        this.createTaskLoading = true
        this.$axios({
          method: 'post',
          url: 'api/v1/task',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${this.$q.localStorage.getItem('WorkOnlyUser').api_token}`
          },
          data: {
            pid: 0,
            project_id: this.projectData.project_id,
            // description: this.description,
            title: this.whatAreYouDoing
            // tags: this.tags.map(tag => tag.id).toString()
          }
        }).then((response) => {
          console.log('createTask', response)
          response.data.children = []
          response.data.project_id = parseInt(response.data.project_id)
          this.tasks.unshift(response.data)
          this.createTaskLoading = false
          this.whatAreYouDoing = ''
          this.$q.notify({
            icon: 'done',
            message: 'You have successfully created.',
            timeout: 1000,
            color: 'positive'
          })
          this.getOnGoingTask = response.data
        }).catch(error => {
          this.createTaskLoading = false
          console.log('error', error)
        })
      }
    },
    minimize () {
      if (process.env.MODE === 'electron') {
        this.$q.electron.remote.BrowserWindow.getFocusedWindow().minimize()
      }
    },
    maximize () {
      if (process.env.MODE === 'electron') {
        const win = this.$q.electron.remote.BrowserWindow.getFocusedWindow()

        if (win.isMaximized()) {
          win.unmaximize()
        } else {
          win.maximize()
        }
      }
    },
    darkMode () {
      this.$q.dark.toggle()
    },
    closeApp () {
      if (process.env.MODE === 'electron') {
        this.$q.electron.remote.BrowserWindow.getFocusedWindow().close()
      }
    },
    openUpdateTaskCallback (taskChild) {
      this.tags1 = this.tagsData.filter(tag => JSON.parse('[' + taskChild.tags + ']').includes(tag.id))

      this.taskChild = taskChild
      this.taskUpdateForm = true
    },
    openAddSubTaskCallback (taskChild) {
      console.log('addSubTaskDataddd', taskChild)
      this.addSubTaskData = taskChild
      this.taskAddSubForm = true
    },
    addSubTask () {
      this.addSubTaskLoading = true
      this.$axios({
        method: 'post',
        url: 'api/v1/task',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${this.$q.localStorage.getItem('WorkOnlyUser').api_token}`
        },
        data: {
          title: this.whatAreYouDoing1,
          pid: this.addSubTaskData.id,
          project_id: this.addSubTaskData.project_id,
          description: this.description,
          tags: this.tags.map(tag => tag.id).toString()
        }
      }).then((response) => {
        const index = this.tasks.findIndex(task => task.id === parseInt(response.data.pid))
        this.tasks[index].children.unshift(response.data)
        this.getOnGoingTask = response.data
        this.taskAddSubForm = false
        this.addSubTaskLoading = false
        this.whatAreYouDoing1 = ''
        this.description = ''
        this.tags = []
        this.$q.notify({
          icon: 'done',
          message: 'You have sucessfully added',
          timeout: 1000,
          color: 'positive'
        })
      }).catch(error => {
        this.addSubTaskLoading = false
        console.log('error', error)
      })
    },
    removeTask () {
      this.removeTaskLoading = true
      this.$axios({
        method: 'put',
        url: `api/v1/task/${this.taskChild.id}`,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${this.$q.localStorage.getItem('WorkOnlyUser').api_token}`
        }
      }).then((response) => {
        console.log('dadadad', response)
        if (parseInt(this.taskChild.pid) === 0) {
          const index = this.tasks.findIndex(task => task.id === this.taskChild.id)
          this.tasks.splice(index, 1)
        } else {
          const index = this.tasks.findIndex(task => task.id === parseInt(this.taskChild.pid))
          const indexChild = this.tasks[index].children.findIndex(task => task.id === this.taskChild.id)
          this.tasks[index].children.splice(indexChild, 1)
        }
        this.taskUpdateForm = false
        this.$q.notify({
          icon: 'check',
          message: 'You have successfully deleted.',
          color: 'positive',
          timeout: 1000
        })
        this.removeTaskLoading = false
      }).catch(error => {
        this.removeTaskLoading = false
        console.log('error', error)
      })
    },
    updateTaskDetails () {
      console.log('Tagsss1', this.tags1.map(tag => tag.id).toString())
      this.$axios({
        method: 'post',
        url: `api/v1/task/${this.taskChild.id}`,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${this.$q.localStorage.getItem('WorkOnlyUser').api_token}`
        },
        data: {
          title: this.taskChild.title,
          description: this.taskChild.description,
          tags: this.tags1.map(tag => tag.id).toString()
          // act: task.status === 0 ? 'start' : 'stop'
        }
      }).then((response) => {
        console.log('Update', response)
        if (parseInt(response.data.pid) === 0) {
          const index = this.tasks.findIndex(task => task.id === response.data.id)
          this.tasks[index].tags = response.data.tags
        } else {
          const index = this.tasks.findIndex(task => task.id === parseInt(response.data.pid))
          const indexChild = this.tasks[index].children.findIndex(task => task.id === response.data.id)
          this.tasks[index].children[indexChild].tags = response.data.tags
        }
      }).catch(error => {
        console.log('error', error)
      })
    },
    updateTask (task) {
      console.log('updateTask', task)
      this.addTaskLoading = task
      this.updateTaskLoading = true
      this.$axios({
        method: 'post',
        url: `api/v1/task/${task.id}`,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${this.$q.localStorage.getItem('WorkOnlyUser').api_token}`
        },
        data: {
          act: task.status === 0 ? 'start' : 'stop'
        }
      }).then((response) => {
        console.log('updateTask', response)
        if (parseInt(response.data.pid) === 0) {
          const index = this.tasks.findIndex(task => task.id === response.data.id)
          this.tasks[index].status = 0
        } else {
          const index = this.tasks.findIndex(task => task.id === parseInt(response.data.pid))
          const indexChild = this.tasks[index].children.findIndex(task => task.id === response.data.id)
          this.tasks[index].children[indexChild].status = 0
        }

        if (response.data.status === 0) {
          this.getOnGoingTask = ''
        } else {
          this.getOnGoingTask = response.data
        }

        this.addTaskLoading = {
          id: '',
          pid: ''
        }

        this.updateTaskLoading = false
        this.$q.notify({
          icon: 'check',
          timeout: 1000,
          message: 'It has been stopped successfully',
          color: 'positive'
        })
      }).catch(error => {
        this.addTaskLoading = {
          id: '',
          pid: ''
        }
        this.updateTaskLoading = false
        console.log('error', error)
      })
    },
    createValueProject (val, done) {
      if (val.length > 0) {
        if (!this.projectsData.includes(val)) {
          this.projectsData.push(val)
        }
        done(val, 'toggle')
      }
    },
    createValueTag (val, done) {
      if (val.length > 0) {
        if (!this.tagsData.includes(val)) {
          this.tagsData.push({
            name: val
          })
        }

        this.$axios({
          method: 'post',
          url: 'api/v1/addTag',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${this.$q.localStorage.getItem('WorkOnlyUser').api_token}`
          },
          data: {
            name: val
          }
        }).then((response) => {
          done({ name: val }, 'toggle')
          console.log('addTag', response)
        }).catch(error => {
          console.log('error', error)
        })
      }
    },
    filterFnProject (val, update) {
      if (val === '') {
        update(() => {
          this.projectsOptions = this.projectsData
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.projectsOptions = this.projectsData.filter(v => v.project.title.toLowerCase().indexOf(needle) > -1)
      })
    },
    filterFnTags (val, update) {
      if (val === '') {
        update(() => {
          this.tagsOptions = this.tagsData
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.tagsOptions = this.tagsData.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
      })
    }
  },
  data () {
    return {
      draggingFab: false,
      addTaskLoading: {
        id: ''
      },
      projectData: null,
      addSubTaskData: null,
      projectForm: false,
      getOnGoingTask: '',
      addSubTaskLoading: false,
      removeTaskLoading: false,
      updateTaskLoading: false,
      createTaskLoading: false,
      taskChild: null,
      whatAreYouDoing: '',
      whatAreYouDoing1: '',
      tags1: [],
      taskUpdateForm: false,
      taskAddSubForm: false,
      description: '',
      project: '',
      projectsData: [],
      projectsOptions: [],
      tags: [],
      tagsData: [],
      tagsOptions: [],
      tasks: [],
      timer: null,
      timerParent: null
    }
  }
}
</script>

<style scoped>
</style>
