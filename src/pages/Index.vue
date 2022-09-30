<template>
  <q-page padding class="hide-scrollbar">
    <!-- <pre>{{projectData}} -->
      <!-- {{tasks.map(t => t.project_id)}} -->
    <q-list padding separator bordered v-if="getTasks">
      <q-item-label v-if="getTasks && getTasks.length === 0" header class="text-center">No data available</q-item-label>
      <q-expansion-item @mouseover="task.isSelected = true; $forceUpdate()" @mouseout="task.isSelected = false; $forceUpdate()" ref="myRef" :content-inset-level="0.8" v-for="(task, index) in getTasks" :key="index" :expand-icon-class="task.children.length < 1 ? 'hidden' : ''">
        <template v-slot:header>
          <q-item-section v-if="task.children.length !== 0" side>
            <q-btn v-if="$refs.myRef && $refs.myRef[index]" :outline="$refs.myRef[index].showing" :unelevated="!$refs.myRef[index].showing" :color="$refs.myRef[index].showing ? '' : 'green'" :label="task.children.length" padding="1px 10px" :ripple="false" />
          </q-item-section>

          <q-item-section @click="addSubTask(task, $refs.myRef[index], 'parent')" @dblclick.native="openUpdateTask(task)">
            <!-- <pre>{{task}}</pre> -->
            <q-item-label class="ellipsis" caption v-if="task.description === null">
              <q-icon size="16px" name="add" color="grey" /> Add description
            </q-item-label>
            <q-item-label class="ellipsis" v-else>
              {{task.description}}
            </q-item-label>
            <q-item-label class="ellipsis" caption v-if="task.title === ''"><q-icon size="16px" name="add" color="grey" /> Add project</q-item-label>
            <q-item-label class="ellipsis" v-else>{{task.title}}</q-item-label>
          </q-item-section>

          <q-item-section side style="min-height: 40px">
            <q-item-label>
              <!-- PID{{task.pid}} <br>
              ID{{task.id}}
              <pre>{{task.total_period_arr}}</pre> -->
              <!-- {{task.total_period_arr.year}}:{{task.total_period_arr.month}}:{{task.total_period_arr.day}}: -->
              {{task.total_period_arr.hour}}:{{task.total_period_arr.minute}}:{{task.total_period_arr.seconds}}
              <q-btn v-if="getOnGoingTask.id === task.id && getOnGoingTask !== ''" :loading="task.id === addTaskLoading.id" @click="updateTask(task)" class="q-ml-xs" unelevated icon="stop" color="negative" dense flat round />
              <q-btn v-else :loading="task.id === addTaskLoading.id" @click="updateTask(task)" v-show="task.children.length < 1 && task.isSelected || task.id === addTaskLoading.id" class="q-ml-xs" unelevated :icon="task.status === 0 ? 'play_arrow' : 'stop'" :color="task.status === 0 ? 'positive' : 'negative'" dense flat round />
            </q-item-label>
          </q-item-section>
        </template>

        <q-list separator>
          <q-item @mouseover="child.isSelected = true; $forceUpdate()" @mouseout="child.isSelected = false; $forceUpdate()" v-for="(child, index) in task.children" :key="index" :ripple="false">
            <q-item-section @dblclick.native="openUpdateTask(child)">
              <q-item-label class="ellipsis" caption v-if="child.description === null">
                <q-icon size="16px" name="add" color="grey" /> Add description
              </q-item-label>
              <q-item-label class="ellipsis" v-else>
                {{child.description}}
              </q-item-label>
              <q-item-label class="ellipsis" caption v-if="child.title === ''"><q-icon size="16px" name="add" color="grey" /> Add Title</q-item-label>
              <q-item-label class="ellipsis" v-else>{{child.title}}</q-item-label>
            </q-item-section>

            <q-item-section side style="min-height: 40px">
               <!-- addTaskLoading <pre>{{addTaskLoading}}</pre> -->
               <!-- <pre>{{child}}</pre>
               <pre>{{addTaskLoading}}</pre> -->
               <!-- task <pre>{{task.id === addTaskLoading.pid}}</pre> -->
              <q-item-label>
                <!-- <pre>{{child.total_period_arr}}</pre> -->
                <!-- {{child.total_period_arr.year}}:{{child.total_period_arr.month}}:{{child.total_period_arr.day}}: -->
                {{child.total_period_arr.hour}}:{{child.total_period_arr.minute}}:{{child.total_period_arr.seconds}}
                <!-- <span style="position:absolute; right: 60px; top: 20px;">
                  {{$date.getDateDiff(child.end_at, child.start_at, 'seconds')}}
                </span> -->
                <q-btn v-if="getOnGoingTask.id === child.id && getOnGoingTask !== ''" :loading="child.id === addTaskLoading.id" @click="updateTask(child)" class="q-ml-xs" unelevated icon="stop" color="negative" dense flat round />
                <q-btn v-else :loading="child.id === addTaskLoading.id" @click="updateTask(child)" v-show="child.isSelected || child.id === addTaskLoading.id" class="q-ml-xs" unelevated :icon="task.status === 0 ? 'play_arrow' : 'stop'" :color="task.status === 0 ? 'positive' : 'negative'" dense flat round />
                <!-- <q-btn :loading="child.id === addTaskLoading.id" v-show="child.isSelected" unelevated icon="play_arrow" color="positive" dense flat round /> -->
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-expansion-item>
    </q-list>
  </q-page>
</template>

<script>
let time = null

import { scroll } from 'quasar'
const { getScrollHeight } = scroll

export default {
  name: 'PageIndex',
  props: ['tasks', 'addTaskLoading', 'getOnGoingTask'],
  data () {
    return {
      getScrollHeight,
      contentStyle: {
        backgroundColor: 'rgba(0,0,0,0.02)',
        color: '#555'
      },

      contentActiveStyle: {
        backgroundColor: '#eee',
        color: 'black'
      },

      thumbStyle: {
        right: '2px',
        borderRadius: '5px',
        backgroundColor: '#027be3',
        width: '5px',
        opacity: 0.75
      },
      timer: null
    }
  },
  computed: {
    getTasks () {
      // console.log('this.projectData', this.projectData)
      // if (this.projectData === null) {
      //   return this.tasks
      // } else {
      // alert(this.projectData.project_id)
      return this.tasks
      // }
      // console.log('adadadad', this.tasks.filter(task => task.project_id === this.projectData.project_id))
      // return this.tasks
    }
  },
  methods: {
    // addTask (task, child) {
    //   this.addTaskLoading = child === undefined ? task : child
    //   this.$axios({
    //     method: 'post',
    //     url: 'api/v1/task',
    //     headers: {
    //       Accept: 'application/json',
    //       Authorization: `Bearer ${this.$q.localStorage.getItem('WorkOnlyUser').api_token}`
    //     },
    //     data: {
    //       pid: task.id,
    //       description: task.description,
    //       project_id: task.project_id,
    //       title: task.title,
    //       tags: task.tags
    //     }
    //   }).then((response) => {
    //     const index = this.getTasks.findIndex(task => task.id === parseInt(response.data.pid))
    //     this.getTasks[index].children.unshift(response.data)
    //     this.addTaskLoading = {
    //       id: '',
    //       pid: ''
    //     }
    //     this.$root.$emit('setOnGoingTask', response.data)
    //     this.$q.notify({
    //       icon: 'done',
    //       message: 'You have sucessfully added',
    //       color: 'positive'
    //     })
    //   }).catch(error => {
    //     console.log('error', error)
    //   })
    // },
    updateTask (task) {
      this.$root.$emit('setOnGoingTask', task)
      // this.addTaskLoading = task
      // this.$axios({
      //   method: 'post',
      //   url: `api/v1/task/${task.id}`,
      //   headers: {
      //     Accept: 'application/json',
      //     Authorization: `Bearer ${this.$q.localStorage.getItem('WorkOnlyUser').api_token}`
      //   },
      //   data: {
      //     act: task.status === 0 ? 'start' : 'stop'
      //   }
      // }).then((response) => {
      //   console.log('Update', response)
      //   this.addTaskLoading = {
      //     id: '',
      //     pid: ''
      //   }
      // }).catch(error => {
      //   this.addTaskLoading = {
      //     id: '',
      //     pid: ''
      //   }
      //   console.log('error', error)
      // })
    },
    openUpdateTask (taskChild) {
      clearTimeout(time)
      this.$root.$emit('openUpdateTask', taskChild)
    },
    addSubTask (taskChild, expansion, type) {
      if (type === 'parent') {
        expansion.showing ? expansion.hide() : expansion.show()
      }

      clearTimeout(time)
      time = setTimeout(() => {
        this.$root.$emit('openAddSubTask', taskChild)
      }, 300)
    }
  }
}
</script>

<style scoped>
.hide-scrollbar {
  width: 100%;
  height: 100px;
  overflow-y: scroll;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
