import { useScrollRestoration } from './scrollRestoration'
import navItems from './navItems'

const isFormSubmitDisabled = (inputs, formState) => {
  const requiredFields = Object.entries(inputs).flatMap(([name, args]) =>
    args.validator.required ? [name] : []
  )

  const touchedRequiredFields = requiredFields.every(item => {
    return formState.touched[item] && formState.values[item]
  })

  const errors = Object.keys(formState.errors).some(e => {
    return formState.errors[e] // note: both true and undefined represent a valid input
  })

  const disableSubmit = !touchedRequiredFields || errors > 0

  return disableSubmit
}

export { useScrollRestoration, isFormSubmitDisabled, navItems }
