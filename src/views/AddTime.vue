<template>
  <div>
    <b-modal id="addNewTime" title="Add Time">
      <b-form>
         <b-form-group
          id="input-group-0"
          label="Date:"
          label-for="input-0">
          <b-form-datepicker
            id="input-0"
            v-model="time.dateSelect"
            required
            :disabled="time.isEdit"
            placeholder="Select Date">
          </b-form-datepicker>
          <span v-if="submitted && $v.time.dateSelect.$error" class="errorMsg">Please Select Date</span>
        </b-form-group>
        <b-form-group
          id="input-group-1"
          label="Start Time:"
          label-for="input-1">
          <b-form-timepicker
            id="input-1"
            v-model="time.startTime"
            required
            now-button
            placeholder="Select Start Time">
          </b-form-timepicker>
          <span v-if="submitted && $v.time.startTime.$error" class="errorMsg">Please Select Start Time</span>
        </b-form-group>
        <b-form-group
          id="input-group-2"
          label="End Time:"
          label-for="input-2">
          <b-form-timepicker
            id="input-2"
            v-model="time.endTime"
            required
            now-button
            placeholder="Select End Time">
          </b-form-timepicker>
          <span v-if="submitted && $v.time.endTime.$error" class="errorMsg">Please Select End Time</span>
          <span class="errorMsg">{{invalidTimeError}}</span>
        </b-form-group>
        <b-form-group
          id="input-group-3"
          label="Task Description:"
          label-for="input-3">
          <b-form-textarea
            id="input-3"
            v-model="time.taskDesc"
            required
            rows="3"
            max-rows="6"
            placeholder="Enter Task Description">
          </b-form-textarea>
          <div v-if="submitted && $v.time.taskDesc.$error" class="errorMsg">
            Please Enter Task Description
          </div>
        </b-form-group>
      </b-form>
      <template v-slot:modal-footer>
        <div class="w-100">
          <b-button
            variant="danger"
            size="sm"
            class="float-right m-l-10"
            @click="submitForm">
            Save
          </b-button>
          <b-button
            variant="primary"
            size="sm"
            class="float-right"
            @click="resetForm">
            Cancel
          </b-button>

        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { BModal, BForm } from 'bootstrap-vue'
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'add_new_time',
  data () {
    return {
      time: {
        dateSelect: '',
        startTime: '',
        endTime: '',
        taskDesc: ''
      },
      submitted: false,
      invalidTimeError: ''
    }
  },
  validations: {
    time: {
      dateSelect: { required },
      startTime: { required },
      endTime: { required },
      taskDesc: { required }
    }
  },
  mounted () {
    this.$root.$on('edit-time', (data) => {
      this.time = data
      this.time.isEdit = true
      this.submitted = false
    })
    this.$root.$on('add-time', (data) => {
      this.time = {}
      this.time.id = Date.now()
      this.time.isEdit = false
      this.submitted = false
    })
  },
  components: {
    'b-modal': BModal,
    'b-form': BForm
  },
  methods: {
    submitForm () {
      this.invalidTimeError = ''
      this.submitted = true
      const timeDiff = this.timediff(this.time.startTime, this.time.endTime)
      this.$v.$touch()
      if (timeDiff > 0) {
        if (this.$v.$invalid) {
          return
        }
        this.$bvModal.hide('addNewTime')
        this.$store.dispatch('updatelistTime', { times: this.time }) // dispatch store action
        this.invalidTimeError = ''
      } else {
        this.submitted = false
        this.invalidTimeError = 'End Time Not Valid'
      }
    },
    resetForm () {
      this.time = {}
      this.time.isEdit = false
      this.submitted = false
      this.invalidTimeError = ''
    },
    timediff (valuestart, valuestop) {
      const today = new Date()
      const td = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + (today.getDate() + 1)).slice(-2)
      const date1 = new Date(td + ' ' + valuestart).getTime()
      const date2 = new Date(td + ' ' + valuestop).getTime()

      const msec = date2 - date1
      const mins = Math.floor(msec / 60000)
      return mins
    }
  }
}
</script>

<style>

</style>
