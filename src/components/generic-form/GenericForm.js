'use client';

import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Form, Field } from 'react-final-form';

function DefaultSubmitButton({ submitting, pristine }) {
  return (
    <Box>
      <Button
        type="submit"
        variant="contained"
        disabled={submitting || pristine}
        sx={{ mt: 2 }}
      >
        Submit
      </Button>
    </Box>
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {React.Children.toArray(
              fields.map((field) => {
                if (field.group === 'row') {
                  return (
                    <Box key={field.id} sx={{ display: 'flex', gap: 2 }}>
                      {React.Children.toArray(
                        field.fields.map((subField) => (
                          <Box
                            key={subField.name}
                            sx={{
                              flex: subField.xs ? subField.xs : 1,
                            }}
                          >
                            <Field name={subField.name}>
                              {({ input, meta }) => (
                                <subField.component
                                  {...input}
                                  {...subField.props}
                                  error={meta.touched && meta.error}
                                />
                              )}
                            </Field>
                          </Box>
                        ))
                      )}
                    </Box>
                  );
                }

                return (
                  <Field key={field.name} name={field.name}>
                    {({ input, meta }) => (
                      <field.component
                        {...input}
                        {...field.props}
                        error={meta.touched && meta.error}
                      />
                    )}
                  </Field>
                );
              })
            )}

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
