// Common components index file

// Error handling components
export { default as ErrorBoundary, withErrorBoundary, useErrorHandler } from './ErrorBoundary'
export { default as ErrorDisplay, NetworkError, NotFoundError, PermissionError, ValidationError, EmptyState } from './ErrorDisplay'
export { default as FormValidationSummary } from './FormValidationSummary'

// Feedback components
export { default as LoadingSpinner, PageLoader, ButtonLoader, SectionLoader, TableLoader } from './LoadingSpinner'
export { default as ProgressIndicator, CircularProgress, StepProgress, UploadProgress } from './ProgressIndicator'
export { default as ConfirmDialog, useConfirmDialog } from './ConfirmDialog'

// Notification utilities
export { showSuccess, showError, showWarning, showInfo, showCustomToast, ToastNotification } from './ToastNotification'

// Form components
export { default as FormField, TextAreaField, SelectField, CheckboxField, RadioGroupField, DatePickerField, TimePickerField } from './FormField'
export { default as FileUploadField } from './FileUploadField'
export { default as ValidationMessage } from './ValidationMessage'

// Responsive components
export { default as ResponsiveTable, ScrollableTable, FixedColumnTable } from './ResponsiveTable'
export { default as ResponsiveModal, BottomSheetModal, FullScreenModal } from './ResponsiveModal'

// Mobile-optimized components
export { default as MobileForm, MobileFormSection, MobileFormGroup, MobileFormActions } from './MobileForm'
export { default as HorizontalScrollTable, CardTable } from './HorizontalScrollTable'
export { default as MobileModal, BottomSheetModal as MobileBottomSheet, FullScreenModal as MobileFullScreen } from './MobileModal'

// Performance-optimized components
export { default as LazyImage } from './LazyImage'

// Accessibility components
export { default as withAccessibility } from './withAccessibility'

// Other common components
export { default as RouteGuard } from './RouteGuard'
export { default as ClassStartButton } from './ClassStartButton'