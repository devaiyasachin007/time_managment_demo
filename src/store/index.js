import Vue from 'vue'
import Vuex from 'vuex'
import { setLocalStorage, getLocalStorage } from '@/core/utils'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    listTimes: getLocalStorage('timeList') ? getLocalStorage('timeList') : [] // Check from localStorage else default empty array
  },
  mutations: {
    updateTime (state, time) {
      if (!time.isEdit) {
        state.listTimes.push(time)
      } else {
        const editTime = state.listTimes.find((item) => { return item.id === time.id })
        editTime.dateSelect = time.dateSelect
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
    updatelistTime ({ commit }, data) {
      commit('updateTime', data.times)
    },
    deleteStoreTime ({ commit }, data) {
      commit('deleteTime', data.times)
    }

  },
  modules: {
  }
})
