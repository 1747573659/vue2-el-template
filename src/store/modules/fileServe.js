const state = {
  fileServe: null,
}

const getters = {
  fileServe: state => state.fileServe,
}

const mutations = {
  SET_FILE_SERVE: (state, fileServe) => {
    state.fileServe = fileServe
  }
}

const actions = {
  setFileServe({ commit }) {
    if (!state.fileServe) {
      import('@/api/fileServe/fileServe').then(async module => {
        let data = await module.fileServer()
        commit('SET_FILE_SERVE', data)
      })
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
