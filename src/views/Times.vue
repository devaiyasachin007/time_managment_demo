<template>
  <div class="home">
    <h3 class="heading">Time Management</h3>
      <div style="float:right;margin:10px;">
      <b-button size="sm" @click="addTime">Add New Time</b-button>
    </div>
    <b-table striped hover :items="bindListEmployees" responsive="sm" :fields="fields" show-empty
      :current-page="currentPage"

      :per-page="perPage"
      @filtered="onFiltered">
      <template v-slot:cell(action)="data">
        <b-button size="sm" class="mr-1" @click="editEmployee(data)">
          Edit
        </b-button>
        <b-button size="sm" @click="deleteEmployee(data)">
          Delete
        </b-button>
      </template>
      <template v-slot:cell(name)="data">
        <!-- `data.value` is the value after formatted by the Formatter -->
        <a :href="`#${data.value.replace(/[^a-z]+/i,'-').toLowerCase()}`">{{ data.value }}</a>
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
          key: 'id', label: 'Start Time', sortable: true, sortDirection: 'desc'
        },
        {
          key: 'name', label: 'End Time', sortable: true, class: 'text-center'
        },
        {
          key: 'email', label: 'Minutes', sortable: true
        },
        {
          key: 'contact', label: 'Task Description', sortable: true
        },
        {
          key: 'action', label: 'Actions'
        }
      ],
      currentPage: 1,
      totalRows: 0,
      perPage: 2,
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
    bindListEmployees () {
      console.log(this.$store.state.listTimes)
      return this.$store.state.listTimes
    }
  },
  watch: {
    bindListEmployees: {
      deep: true,
      handler: function (list) {
        this.totalRows = list.length
      }
    }
  },
  created () {
    this.loadlistEmployees()
  },
  methods: {
    // New
    addTime () {
      this.$root.$emit('add-time', {})
      this.$bvModal.show('addNewTime')
    },
    // Old
    loadlistEmployees () {
      this.totalRows = this.$store.state.listTimes.length
    },
    addEmployee () {
      this.$root.$emit('add-employee', {})
      this.$bvModal.show('addNewEmployee')
    },
    editEmployee (employee) {
      this.$root.$emit('edit-employee', Object.assign({}, employee.item))
      this.$bvModal.show('addNewEmployee')
    },
    deleteEmployee (employee) {
      this.$bvModal.msgBoxConfirm('Please confirm that you want to delete employee.', {
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
            this.$store.dispatch('deleteStoreEmployee', { employee: employee }) // dispatch store action
          }
        })
    },
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    }
  }
}
</script>
