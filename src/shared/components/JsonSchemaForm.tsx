import { FC } from "react";
import Form from "@rjsf/material-ui";
import pointer from "json-pointer";
import { FormValidation } from "@rjsf/core";
import { SelectWidget } from "./SelectWidget";
import { DateWidget } from "./DateWidget";
import { TimeWidget } from "./TimeWidget";
import { FieldTemplate } from "./FieldTemplate";
import { DescriptionField } from "./DescriptionField";
import { useSchemaValidator } from "../hooks";

const widgets = {
  DateWidget,
  TimeWidget,
  SelectWidget,
  ErrorList: () => null,
};

const fields = {
  DescriptionField,
};

export type Props = {
  id?: string;
  children?: JSX.Element;
  jsonSchema: any;
  uiSchema: any;
  onSubmit?: any;
  onChange?: any;
  formData: any;
};

export const JsonSchemaForm: FC<Props> = ({
  children,
  jsonSchema,
  uiSchema,
  onSubmit = () => {},
  onChange,
  id,
  formData,
}: Props) => {
  const validator = useSchemaValidator(jsonSchema);

  return (
    <Form
      id={id}
      formData={formData}
      FieldTemplate={FieldTemplate}
      ErrorList={() => null}
      schema={jsonSchema}
      uiSchema={uiSchema}
      onSubmit={onSubmit}
      widgets={widgets}
      fields={fields}
      children={children}
      onChange={onChange}
      transformErrors={() => {
        // This function is used to transform errors generated from the Form components internal
        // validation, which occurs regardless of passing a custom validation function and merges
        // those errors with any errors generated from the custom validation. Overriding this
        // to return an empty array such that the merge results in only custom errors.
        // Since we use the same validation as the component, we still generate the same errors,
        // except when we override them with custom errors.
        // https://github.com/rjsf-team/react-jsonschema-form/blob/64b167051d724df381b81dc2319e925266f99709/packages/core/src/validate.js#L231-L233
        return [];
      }}
      validate={(newFormData: any, errorHandlers: FormValidation) => {
        // Validate the form data, if there are any errors, an `errors` object is set on
        // on the validator object.
        validator(newFormData);

        // For errors, each field can have multiple errors. It is not helpful to spam the user with them all, so
        // only accept a single error. The loop ensures a preference for the error with the keyword
        // "errorMessage", which can be set on the JSON Schema as a custom user-defined
        // error message. Otherwise, the last error in the list of errors for a field is selected.
        const errorLookup: Record<string, string | undefined> = {};

        validator.errors?.forEach(({ message, dataPath, keyword }) => {
          // Each of these errors have the shape defined here:
          // https://ajv.js.org/docs/api.html#validation-errors
          // the data path is a JSON pointer to where the validation error occurred in the
          // formData, since errorHandlers has the same shape as formData, use the
          // same pointer.
          // If the datapath exists already in the error lookup, replace it if the keyword is errorMessage.
          if (errorLookup[dataPath]) {
            if (keyword === "errorMessage") {
              errorLookup[dataPath] = message;
            }
          } else {
            errorLookup[dataPath] = message;
          }
        });

        Object.entries(errorLookup).forEach(([dataPath, message]) => {
          if (pointer.has(errorHandlers, dataPath)) {
            const errorHandler = pointer.get(errorHandlers, dataPath);
            if (errorHandler?.addError) errorHandler.addError(message);
          }
        });

        // The same ErrorHandlers object must be returned from this function, which should be
        // mutated by the error handler `addError` functions. The result of this validation
        // is then merged with the result of the internal validation of the component, rather
        // than overriding it.
        // https://github.com/rjsf-team/react-jsonschema-form/blob/64b167051d724df381b81dc2319e925266f99709/packages/core/src/validate.js#L254
        return errorHandlers;
      }}
    />
  );
};
