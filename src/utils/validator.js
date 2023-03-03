const validatepwd = (rule, value, callback) => {
  if (value.length < 6) {
    callback(new Error('请输入6位数的密码'))
  } else {
    callback()
  }
}

export {
  validatepwd
}
