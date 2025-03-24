import { setIn } from 'final-form';
import * as Yup from 'yup';

export { Yup };

export const formValidation = (schema) => async (values) => {
  try {
    await schema.validate(values, { abortEarly: false });
    return null;
  } catch (err) {
    const errors = err.inner.reduce(
      (formError, innerError) =>
        setIn(formError, innerError.path, innerError.message),
      {}
    );
    return errors;
  }
};
