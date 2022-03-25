<template>
  <div class="home">
    <h3 class="heading">Time Management</h3>
    <b-row>
      <b-col lg="3" class="my-1">
      <b-form-datepicker
        id="input-5"
        required
        v-model="selectDate"
        placeholder="Select Date">
      </b-form-datepicker>
      </b-col>
    </b-row>
    <div style="float:right;margin:10px;">
      <b-button size="sm" @click="addTime">Add New Time</b-button>
    </div>
     <div style="float:right;margin:10px;">
      <b-button size="sm" @click="printThis">Export as PNG</b-button>
    </div>
    <div style="float:right;margin:10px;">
     <b-button size="sm" >
       <export-excel
        :footer = "footerData"
        :data = "filterData"
        :fields = "json_fields"
        name = "filename.xls"
      >
        Download Excel
      </export-excel>
      </b-button>
    </div>
    <div ref="exportPng">
      <b-table hover bordered :items="filterData" responsive="sm" :fields="fields" show-empty>
        <template v-slot:cell(startTime)="data">
          {{ convertTimeIntoAmPmFormat(data.value) }}
        </template>
          <template v-slot:cell(endTime)="data">
          {{ convertTimeIntoAmPmFormat(data.value) }}
        </template>
          <template v-slot:cell(difference)="data">
          {{ timediff(data.item.startTime, data.item.endTime) }} Minutes
        </template>
        <template v-slot:cell(action)="data">
          <b-button size="sm" class="mr-1" @click="editTime(data)">
            Edit
          </b-button>
          <b-button size="sm" @click="deleteTime(data)">
            Delete
          </b-button>
        </template>
      </b-table>
        <div style="float:left;margin:10px;">
          <b-button size="sm">Day: {{ selectDate }}</b-button>
        </div>
        <div style="float:left;margin:10px;">
          <b-button size="sm">Day Total Min: {{ totalTimeInMin }} </b-button>
        </div>
        <div style="float:left;margin:10px;">
          <b-button size="sm">Day Total HR: {{ totalTimeInHr }}</b-button>
        </div>
      </div>
      <AddTime />
    </div>
</template>

<script>
import { BTable } from 'bootstrap-vue'
import AddTime from './AddTime.vue'
import html2canvas from 'html2canvas'
import canvs2Image from '@/util/canvas2image'
import { saveAs } from 'file-saver'
export default {
  name: 'Times',
  components: {
    'b-table': BTable,
    AddTime
  },
  data () {
    return {
      json_fields: {
        'Start Time': {
          field: 'startTime',
          callback: (value) => {
            return this.convertTimeIntoAmPmFormat(value)
          }
        },
        'End Time': {
          field: 'endTime',
          callback: (value) => {
            return this.convertTimeIntoAmPmFormat(value)
          }
        },
        'Minutes difference': {
          callback: (value) => {
            return this.timediff(value.startTime, value.endTime) + ' Minutes'
          }
        },
        'Task Description': 'taskDesc'
      },
      fields: [
        {
          key: 'dateSelect', label: 'Date', sortable: false
        },
        {
          key: 'startTime', label: 'Start Time', sortable: false
        },
        {
          key: 'endTime', label: 'End Time', sortable: false, class: 'text-center'
        },
        {
          key: 'difference', label: 'Minutes', sortable: false
        },
        {
          key: 'taskDesc', label: 'Task Description', sortable: false
        },
        {
          key: 'action', label: 'Actions'
        }
      ],
      displayData: this.$store.state.listTimes,
      currentPage: 1,
      selectDate: new Date().toISOString().slice(0, 10)
    }
  },
  computed: {
    filterData () {
      return this.displayData
        .filter((data) => {
          return data.dateSelect === this.selectDate
        })
    },
    totalTimeInMin () {
      const total = this.filterData.reduce((previousValue, currentValue) => {
        return previousValue + this.timediff(currentValue.startTime, currentValue.endTime)
      }, 0)
      return total
    },
    totalTimeInHr () {
      return Math.floor(this.totalTimeInMin / 60) + ':' + this.totalTimeInMin % 60
    },
    footerData () {
      return [
        'Date: ' + this.selectDate,
        'Day Total Min: ' + this.totalTimeInMin,
        'Day Total HR: ' + this.totalTimeInHr
      ]
    }
  },
  methods: {
    printThis () {
      const el = this.$refs.exportPng

      html2canvas(el)
        .then(canvas => {
          const img = canvs2Image.getImage(canvas)
          console.log(img)
          saveAs(img, 's.png')
        })
        .catch(err => {
          console.log('error', err)
        })
    },
    // New
    addTime () {
      this.$root.$emit('add-time', {})
      this.$bvModal.show('addNewTime')
    },
    deleteTime (time) {
      this.$bvModal.msgBoxConfirm('Please confirm that you want to delete Time Slot.', {
        title: 'Please Confirm',
        size: 'mm',
        buttonSize: 'sm',
        okVariant: 'danger',
        okTitle: 'YES',
        cancelTitle: 'NO',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true
      })
        .then((value) => {
          if (value) {
            this.$store.dispatch('deleteStoreTime', { times: time }) // dispatch store action
          }
        })
    },
    convertTimeIntoAmPmFormat (time) {
      time = time.split(':')
      time[3] = time[0] < 12 ? 'AM' : 'PM'

      time[0] = time[0] % 12 || 12
      time = time[0] + ':' + time[1] + ' ' + time[3]
      return time // return adjusted time or original string
    },
    timediff (valuestart, valuestop) {
      const today = new Date()
      const td = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + (today.getDate() + 1)).slice(-2)
      const date1 = new Date(td + ' ' + valuestart).getTime()
      const date2 = new Date(td + ' ' + valuestop).getTime()

      const msec = date2 - date1
      const mins = Math.floor(msec / 60000)
      return mins
    },
    editTime (time) {
      this.$root.$emit('edit-time', Object.assign({}, time.item))
      this.$bvModal.show('addNewTime')
    }
  }
}
</script>
