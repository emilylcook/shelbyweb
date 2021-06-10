import { useScrollRestoration } from './scrollRestoration';
import navItems from './navItems';

const isFormSubmitDisabled = (inputs: any, formState: any) => {
  const requiredFields = Object.entries(inputs).reduce((acc: any[], val: any) => {
    if (val[1].validator.required) {
      const name = val[1].name;
      acc.push(name);
    }

    return acc;
  }, []);

  const touchedRequiredFields = requiredFields.every(item => {
    return formState.touched[item] && formState.values[item];
  });

  const errors = Object.keys(formState.errors).some(e => {
    return formState.errors[e]; // note: both true and undefined represent a valid input
  });

  const disableSubmit = !touchedRequiredFields || errors;

  return disableSubmit;
};

export { useScrollRestoration, isFormSubmitDisabled, navItems };
