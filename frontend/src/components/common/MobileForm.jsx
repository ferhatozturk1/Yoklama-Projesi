import React from "react";
import { Formik, Form } from "formik";
import { useBreakpoint } from "../../utils/responsiveUtils";
import {
  FormField,
  TextAreaField,
  SelectField,
  CheckboxField,
  RadioGroupField,
} from "./FormField";

/**
 * Mobile-optimized form component
 *
 * @param {Object} props - Component props
 * @param {Object} props.initialValues - Initial form values
 * @param {Object} props.validationSchema - Yup validation schema
 * @param {Function} props.onSubmit - Form submission handler
 * @param {Array} props.fields - Form field definitions
 * @param {React.ReactNode} props.submitButton - Custom submit button
 * @param {React.ReactNode} props.cancelButton - Custom cancel button
 * @param {Function} props.onCancel - Cancel handler
 * @param {boolean} props.loading - Whether form is submitting
 * @param {string} props.className - Additional CSS classes
 */
const MobileForm = ({
  initialValues = {},
  validationSchema,
  onSubmit,
  fields = [],
  submitButton,
  cancelButton,
  onCancel,
  loading = false,
  className = "",
  ...props
}) => {
  const { isMobile } = useBreakpoint();

  // Render a field based on its type
  const renderField = (field, formikProps) => {
    const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
      formikProps;

    const commonProps = {
      name: field.name,
      label: field.label,
      placeholder: field.placeholder,
      required: field.required,
      disabled: loading || field.disabled,
      className: field.className,
      helpText: field.helpText,
    };

    switch (field.type) {
      case "textarea":
        return <TextAreaField {...commonProps} rows={field.rows || 3} />;

      case "select":
        return <SelectField {...commonProps} options={field.options || []} />;

      case "checkbox":
        return <CheckboxField {...commonProps} checked={values[field.name]} />;

      case "radio":
        return (
          <RadioGroupField {...commonProps} options={field.options || []} />
        );

      case "date":
        return (
          <FormField
            {...commonProps}
            type="date"
            min={field.min}
            max={field.max}
          />
        );

      case "time":
        return (
          <FormField
            {...commonProps}
            type="time"
            min={field.min}
            max={field.max}
          />
        );

      case "number":
        return (
          <FormField
            {...commonProps}
            type="number"
            min={field.min}
            max={field.max}
            step={field.step}
          />
        );

      case "tel":
        return (
          <FormField {...commonProps} type="tel" pattern={field.pattern} />
        );

      case "email":
        return <FormField {...commonProps} type="email" />;

      case "password":
        return (
          <FormField
            {...commonProps}
            type="password"
            autoComplete={field.autoComplete}
          />
        );

      case "hidden":
        return (
          <input
            type="hidden"
            name={field.name}
            value={values[field.name] || ""}
          />
        );

      default:
        return <FormField {...commonProps} type={field.type || "text"} />;
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      validateOnChange={false}
      validateOnBlur={true}
    >
      {(formikProps) => (
        <Form
          className={`${isMobile ? "mobile-form" : ""} ${className}`}
          {...props}
        >
          {/* Form Fields */}
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={index} className={field.containerClassName}>
                {renderField(field, formikProps)}
              </div>
            ))}
          </div>

          {/* Form Actions */}
          <div
            className={`${
              isMobile ? "mt-6 space-y-3" : "mt-6 flex justify-end space-x-3"
            }`}
          >
            {cancelButton ||
              (onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={loading}
                  className={`${isMobile ? "w-full" : ""} btn btn-secondary`}
                >
                  İptal
                </button>
              ))}

            {submitButton || (
              <button
                type="submit"
                disabled={loading}
                className={`${isMobile ? "w-full" : ""} btn btn-primary`}
              >
                {loading ? "İşleniyor..." : "Kaydet"}
              </button>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};

/**
 * Mobile form section component
 */
export const MobileFormSection = ({
  children,
  title,
  subtitle,
  className = "",
  ...props
}) => {
  return (
    <div className={`mobile-form-section mb-6 ${className}`} {...props}>
      {(title || subtitle) && (
        <div className="mb-3">
          {title && (
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          )}
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

/**
 * Mobile form group component for grouping related fields
 */
export const MobileFormGroup = ({
  children,
  label,
  className = "",
  ...props
}) => {
  return (
    <div className={`mobile-form-group mb-4 ${className}`} {...props}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="space-y-3">{children}</div>
    </div>
  );
};

/**
 * Mobile form actions component for form buttons
 */
export const MobileFormActions = ({
  children,
  submitText = "Kaydet",
  cancelText = "İptal",
  onSubmit,
  onCancel,
  loading = false,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`mobile-form-actions fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 ${className}`}
      {...props}
    >
      <div className="flex flex-col space-y-2">
        {children || (
          <>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary"
              onClick={onSubmit}
            >
              {loading ? "İşleniyor..." : submitText}
            </button>

            {onCancel && (
              <button
                type="button"
                disabled={loading}
                className="w-full btn btn-secondary"
                onClick={onCancel}
              >
                {cancelText}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MobileForm;
