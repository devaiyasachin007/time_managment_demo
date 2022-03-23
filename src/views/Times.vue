<template>
  <div class="home">
    <h3 class="heading">Time Management</h3>
      <div style="float:right;margin:10px;">
      <b-button size="sm" @click="addTime">Add New Time</b-button>
    </div>
    <b-table striped hover :items="bindListTimes" responsive="sm" :fields="fields" show-empty
      :current-page="currentPage"

      :per-page="perPage"
      @filtered="onFiltered">
      <template v-slot:cell(action)="data">
        <b-button size="sm" class="mr-1" @click="editTime(data)">
          Edit
        </b-button>
        <b-button size="sm" @click="deleteTime(data)">
          Delete
        </b-button>
      </template>
      <template v-slot:cell(startTime)="data">
        {{ convertTimeIntoAmPmFormat(data.value) }}
      </template>
       <template v-slot:cell(endTime)="data">
        {{ convertTimeIntoAmPmFormat(data.value) }}
      </template>
        <template v-slot:cell(difference)="data">
        {{ timediff(data.item.startTime, data.item.endTime) }}
      </template>
    </b-table>
    <b-col sm="3" md="3" class="my-1 float-right">
      <b-pagination
        v-model="currentPage"
        :total-rows="totalRows"
        :per-page="perPage"
        align="fill"
        size="sm"
        class="my-0">
      </b-pagination>
    </b-col>
    <AddTime />
  </div>
</template>

<script>
import { BTable } from 'bootstrap-vue'
import AddTime from './AddTime.vue'

export default {
  name: 'Times',
  components: {
    'b-table': BTable,
    AddTime
  },
  data () {
    return {
      fields: [
        {
          key: 'startTime', label: 'Start Time', sortable: false, sortDirection: 'desc'
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
      currentPage: 1,
      totalRows: 0,
      perPage: 100,
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      filterOn: [],
      pageOptions: [2, 5, 10, 15]
    }
  },
  computed: {
    sortOptions () {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key }
        })
    },
    bindListTimes () {
      return this.$store.state.listTimes
    }
  },
  watch: {
    bindListTimes: {
      deep: true,
      handler: function (list) {
        this.totalRows = list.length
      }
    }
  },
  created () {
    this.loadlistTimes()
  },
  methods: {
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
    loadlistTimes () {
      this.totalRows = this.$store.state.listTimes.length
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
      return mins + ' Minutes'
    },
    editTime (time) {
      this.$root.$emit('edit-time', Object.assign({}, time.item))
      this.$bvModal.show('addNewTime')
    },
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    }
  }
}
</script>
