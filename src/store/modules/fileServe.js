const state = {
  fileServe: null,
  ossFileServe: '',
}

const getters = {
  fileServe: state => state.fileServe,
  ossFileServe: state => state.ossFileServe,
}

const mutations = {
  SET_FILE_SERVE: (state, fileServe) => {
    state.fileServe = fileServe
  },
  SET_OSS_FILE_SERVE: (state, ossFileServe) => {
    state.ossFileServe = ossFileServe
  },
}

const actions = {
  setFileServe({ commit }) {
    if (!state.fileServe) {
      import('@/api/fileServe/fileServe').then(async module => {
        let data = await module.fileServer()
        commit('SET_FILE_SERVE', data)
      })
    }
  },
  setOSSFileServe({ commit }) {
    if (!state.ossFileServe) {
      import('@/api/fileServe/fileServe').then(async module => {
        let data = await module.ossFileServer()
        commit('SET_OSS_FILE_SERVE', data)
      })
    }
  },
}

export default {
  state,
  getters,
  mutations,
  actions
}