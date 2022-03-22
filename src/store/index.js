import Vue from 'vue'
import Vuex from 'vuex'
import { setLocalStorage, getLocalStorage } from '@/core/utils'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    listEmployee: getLocalStorage('employeeList') ? getLocalStorage('employeeList') : [], // Check from localStorage else default empty array
    listTimes: getLocalStorage('timeList') ? getLocalStorage('timeList') : [] // Check from localStorage else default empty array
  },
  mutations: {
    updateEmployee (state, employee) {
      if (!employee.isEdit) {
        state.listEmployee.push(employee)
      } else {
        const editEmp = state.listEmployee.find((item) => { return item.id === employee.id })
        editEmp.name = employee.name
        editEmp.email = employee.email
        editEmp.contact = employee.contact
      }
      setLocalStorage('employeeList', state.listEmployee) // Updated to localStorage
    },
    deleteEmployee (state, employee) {
      state.listEmployee.splice(employee.index, 1)
      setLocalStorage('employeeList', state.listEmployee) // Updated to localStorage
    },
    updateTime (state, time) {
      if (!time.isEdit) {
        state.listTimes.push(time)
      } else {
        const editTime = state.listTimes.find((item) => { return item.dateSelect === time.dateSelect })
        editTime.startTime = time.startTime
        editTime.endTime = time.endTime
        editTime.taskDesc = time.taskDesc
      }
      setLocalStorage('timeList', state.listTimes) // Updated to localStorage
    },
    deleteTime (state, time) {
      state.listTimes.splice(time.index, 1)
      setLocalStorage('timeList', state.listTimes) // Updated to localStorage
    }
  },
  actions: {
    updatelistEmployee ({ commit }, data) {
      commit('updateEmployee', data.employee)
    },
    deleteStoreEmployee ({ commit }, data) {
      commit('deleteEmployee', data.employee)
    },
    updatelistTime ({ commit }, data) {
      commit('updateTime', data.time)
    },
    deleteStoreTime ({ commit }, data) {
      commit('deleteTime', data.time)
    }

  },
  modules: {
  }
})
