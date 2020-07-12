import React from "react";
import * as validators from "calidators";
import useDeepCompareEffect from "use-deep-compare-effect";

function validateField(fieldValue = "", fieldConfig) {
  for (let validatorName in fieldConfig) {
    const validatorConfig = fieldConfig[validatorName];
    const validator = validators[validatorName];
    const configuredValidator = validator(validatorConfig);
    const errorMessage = configuredValidator(fieldValue);

    if (errorMessage) {
      return errorMessage;
    }
  }
  return null;
}

function validateFields(fieldValues, fieldConfigs) {
  const errors = {};
  for (let fieldName in fieldConfigs) {
    const fieldConfig = fieldConfigs[fieldName];
    const fieldValue = fieldValues[fieldName];

    errors[fieldName] = validateField(fieldValue, fieldConfig);
  }
  return errors;
}

const initialState = {
  values: {},
  errors: {},
  submitted: false,
};

const validationReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "change":
      const values = { ...state.values, ...payload };
      return {
        ...state,
        values,
        submitted: false,
      };
    case "validate":
      return {
        ...state,
        errors: payload,
      };
    case "submit":
      return {
        ...state,
        submitted: true,
      };
    case "reset":
      return { ...state, values: {}, submitted: false };
    default:
      return state;
  }
};

export default (config) => {
  const [state, dispatch] = React.useReducer(validationReducer, initialState);

  useDeepCompareEffect(() => {
    const errors = validateFields(state.values, config.fields);
    dispatch({ type: "validate", payload: errors });
  }, [state.values, config.fields]);

  return {
    errors: state.errors,
    values: state.values,
    submitted: state.submitted,
    getFieldProps: (fieldName) => ({
      onChange: (e) => {
        if (!config.fields[fieldName]) {
          return;
        }
        dispatch({
          type: "change",
          payload: { [fieldName]: e.target.value },
        });
      },
      name: fieldName,
      value: state.values[fieldName] || "",
    }),
    getFormProps: () => ({
      onSubmit: (e) => {
        e.preventDefault();
        dispatch({ type: "submit" });
        if (config.onSubmit) {
          config.onSubmit(state);
        }
      },
    }),
    errorsExist: () => {
      dispatch({ type: "submit" });
      for (let error in state.errors) {
        if (state.errors[error]) return true;
      }
      return false;
    },
    resetValues: () => {
      dispatch({ type: "reset" });
    },
  };
};
