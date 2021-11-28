const validate = values => {
  const errors = {}
  if (!values.firstName) {
    errors.firstName = 'Required'
  }
  if (!values.lastName) {
    errors.lastName = 'Required'
  }
  if (!values.role) {
    errors.role = 'Required'
  }
  // if (!values.address || values.address.length < 42) {
  //   errors.address = 'Required and must be of length 42 with prefix'
  // }
  return errors
}
export default validate