'use client';

import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Form, Field } from 'react-final-form';

function DefaultSubmitButton({
  submitting,
  pristine,
  buttonText,
  buttonSize,
  buttonFullWidth,
}) {
  return (
    <Box>
      <Button
        type="submit"
        variant="contained"
        size={buttonSize}
        disabled={submitting || pristine}
        fullWidth={buttonFullWidth}
      >
        {buttonText}
      </Button>
    </Box>
  );
}

function GenericForm({
  fields,
  onSubmit,
  initialValues = null,
  validate = null,
  buttonOrientation = 'column',
  buttonText = 'Submit',
  buttonSize = 'large',
  buttonFullWidth = false,
  renderButtons = null,
}) {
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      validate={validate}
      render={({ handleSubmit, submitting, pristine }) => (
        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              alignItems: buttonOrientation === 'row' ? 'center' : 'stretch',
              display: 'flex',
              flexDirection: buttonOrientation === 'row' ? 'row' : 'column',
              flexWrap: 'wrap',
              gap: 3,
            }}
          >
            {React.Children.toArray(
              fields.map((field) => {
                if (field.group === 'row') {
                  return (
                    <Box
                      key={field.id}
                      sx={{ display: 'flex', flex: 1, gap: 2 }}
                    >
                      {React.Children.toArray(
                        field.fields.map((subField) => (
                          <Box
                            key={subField.name}
                            sx={{
                              flex: subField.xs ? subField.xs : 1,
                              minWidth: 0,
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
                  <Box key={field.name} sx={{ flex: 1, minWidth: 0 }}>
                    <Field name={field.name}>
                      {({ input, meta }) => (
                        <field.component
                          {...input}
                          {...field.props}
                          error={meta.touched && meta.error}
                        />
                      )}
                    </Field>
                  </Box>
                );
              })
            )}

            {renderButtons ? (
              renderButtons({ submitting })
            ) : (
              <DefaultSubmitButton
                submitting={submitting}
                pristine={pristine}
                buttonText={buttonText}
                buttonSize={buttonSize}
                buttonFullWidth={buttonFullWidth}
              />
            )}
          </Box>
        </form>
      )}
    />
  );
}

export default GenericForm;
