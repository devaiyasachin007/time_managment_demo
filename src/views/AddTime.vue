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
            v-model="user.dateSelect"
            required
            now-button
            :disabled="user.isEdit"
            placeholder="Select Date">
          </b-form-datepicker>
          <span v-if="submitted && $v.user.dateSelect.$error" class="errorMsg">Please Select Date</span>
        </b-form-group>
        <b-form-group
          id="input-group-1"
          label="Start Time:"
          label-for="input-1">
          <b-form-timepicker
            id="input-1"
            v-model="user.startTime"
            required
            now-button
            :disabled="user.isEdit"
            placeholder="Select Start Time">
          </b-form-timepicker>
          <span v-if="submitted && $v.user.startTime.$error" class="errorMsg">Please Select Start Time</span>
        </b-form-group>
        <b-form-group
          id="input-group-2"
          label="End Time:"
          label-for="input-2">
          <b-form-timepicker
            id="input-2"
            v-model="user.endTime"
            required
              now-button
            :disabled="user.isEdit"
            placeholder="Select End Time">
          </b-form-timepicker>
          <span v-if="submitted && $v.user.endTime.$error" class="errorMsg">Please Enter Employee Name</span>
        </b-form-group>
        <b-form-group
          id="input-group-3"
          label="Task Description:"
          label-for="input-3">
          <b-form-textarea
            id="input-3"
            v-model="user.taskDesc"
            required
            rows="3"
            max-rows="6"
            placeholder="Enter Task Description">
          </b-form-textarea>
          <div v-if="submitted && $v.user.taskDesc.$error" class="errorMsg">
            Please Enter Email address
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
import { required, minLength, maxLength, email } from 'vuelidate/lib/validators'

export default {
  name: 'add_new_employee',
  data () {
    return {
      user: {
        id: '',
        name: '',
        email: '',
        contact: ''
      },
      submitted: false
    }
  },
  validations: {
    user: {
      id: { required },
      name: { required },
      email: { required, email },
      contact: { required, minLength: minLength(10), maxLength: maxLength(12) }
    }
  },
  mounted () {
    this.$root.$on('edit-employee', (data) => {
      this.user = data
      this.user.isEdit = true
      this.submitted = false
    })
    this.$root.$on('add-employee', (data) => {
      this.user = {}
      this.user.isEdit = false
      this.submitted = false
    })
  },
  components: {
    'b-modal': BModal,
    'b-form': BForm
  },
  methods: {
    submitForm () {
      this.submitted = true
      this.$v.$touch()
      if (this.$v.$invalid) {
        return
      }
      this.$bvModal.hide('addNewEmployee')
      this.$store.dispatch('updatelistEmployee', { employee: this.user }) // dispatch store action
    },
    resetForm () {
      this.user = {}
      this.user.isEdit = false
      this.submitted = false
    }
  }
}
</script>

<style>

</style>
