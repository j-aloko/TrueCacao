'use client';

import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Form, Field } from 'react-final-form';

function DefaultSubmitButton({ submitting, pristine }) {
  return (
    <Button
      type="submit"
      variant="contained"
      disabled={submitting || pristine}
      sx={{ mt: 2 }}
    >
      Submit
    </Button>
  );
}

function GenericForm({
  fields,
  onSubmit,
  initialValues,
  validate,
  renderButtons = null,
}) {
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      validate={validate}
      render={({ handleSubmit, submitting, pristine }) => (
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {fields.map(({ name, component: Component, props }) => (
              <Field key={name} name={name}>
                {({ input, meta }) => (
                  <Component
                    {...input}
                    {...props}
                    error={meta.touched && meta.error}
                  />
                )}
              </Field>
            ))}
            {renderButtons ? (
              renderButtons({ submitting })
            ) : (
              <DefaultSubmitButton
                submitting={submitting}
                pristine={pristine}
              />
            )}
          </Box>
        </form>
      )}
    />
  );
}

export default GenericForm;
