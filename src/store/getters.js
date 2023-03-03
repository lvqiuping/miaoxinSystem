const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  isAdmin: state => state.user.isAdmin
}
export default getters
