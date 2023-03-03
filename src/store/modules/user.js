import { login, logout } from '@/api/user'
import { removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import Cookies from 'js-cookie'

const getDefaultState = () => {
  return {
    // 这些都是state的信息
    isAdmin: Cookies.get('isAdmin')
  }
}

const state = getDefaultState()
const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_IS_ADMIN: (state, isAdmin) => {
    state.isAdmin = isAdmin
  }
}
const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        if (response.result === '1') {
          Cookies.set('isAdmin', true)
          commit('SET_IS_ADMIN', true)
        }
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      const params = `userName=${Cookies.get('permission')}`
      logout(params).then(() => {
        // removeToken() // must remove  token  first
        // removeRefreshToken()
        // Cookies.remove('permission')
        // Cookies.remove('userId')
        Cookies.remove('isAdmin')
        window.location.reload() // f5
        resetRouter()
        // resolve() //
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    // return new Promise((resolve, reject) => {
    //   getInfo(state.token).then(response => {
    //     const { data } = response

    //     if (!data) {
    //       return reject('Verification failed, please Login again.')
    //     }

    //     const { userName } = data

    //     commit('SET_USER_NAME', userName)
    //     // commit('SET_AVATAR')
    //     resolve(data)
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve, reject) => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true, // 必须写
  state,
  mutations,
  actions
}

