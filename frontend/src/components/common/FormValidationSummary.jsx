import React from "react";
import { useFormikContext } from "formik";
import ValidationMessage from "./ValidationMessage";

/**
 * Component that displays a summary of all form validation errors
 */
const FormValidationSummary = ({
  title = "Lütfen aşağıdaki hataları düzeltin:",
  showOnlyIfSubmitted = true,
  className = "",
}) => {
  const { errors, touched, submitCount } = useFormikContext();

  // Only show if form has been submitted (or showOnlyIfSubmitted is false)
  if (showOnlyIfSubmitted && submitCount === 0) {
    return null;
  }

  // Collect all errors from touched fields
  const collectErrors = (errorsObj, touchedObj, prefix = "") => {
    const errorList = [];

    Object.keys(errorsObj).forEach((key) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      const error = errorsObj[key];
      const isTouched = touchedObj?.[key];

      if (typeof error === "string" && isTouched) {
        errorList.push(error);
      } else if (typeof error === "object" && error !== null) {
        // Handle nested errors (like arrays or objects)
        if (Array.isArray(error)) {
          error.forEach((item, index) => {
            if (typeof item === "string" && touchedObj?.[key]?.[index]) {
              errorList.push(item);
            } else if (typeof item === "object" && item !== null) {
              errorList.push(
                ...collectErrors(
                  item,
                  touchedObj?.[key]?.[index],
                  `${fullKey}[${index}]`
                )
              );
            }
          });
        } else {
          errorList.push(...collectErrors(error, touchedObj?.[key], fullKey));
        }
      }
    });

    return errorList;
  };

  const allErrors = collectErrors(errors, touched);

  if (allErrors.length === 0) {
    return null;
  }

  return (
    <div className={`form-validation-summary ${className}`}>
      <ValidationMessage
        type="error"
        messages={[title, ...allErrors]}
        showIcon={true}
      />
    </div>
  );
};

export default FormValidationSummary;
