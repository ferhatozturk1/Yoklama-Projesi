import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Modal from "../common/Modal";
import LoadingSpinner from "../common/LoadingSpinner";
import { showSuccess, showError } from "../common/ToastNotification";

const CourseCreateModal = ({ isOpen, onClose, onCreateCourse }) => {
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object({
    code: Yup.string()
      .matches(/^[A-Z]{2,4}\d{3}$/, "Ders kodu formatı: ABC123")
      .required("Ders kodu zorunludur"),
    name: Yup.string()
      .min(2, "Ders adı en az 2 karakter olmalıdır")
      .max(100, "Ders adı en fazla 100 karakter olabilir")
      .required("Ders adı zorunludur"),
    section: Yup.string()
      .matches(/^\d{1,2}$/, "Şube numarası 1-2 haneli olmalıdır")
      .required("Şube numarası zorunludur"),
    classroom: Yup.string()
      .min(1, "Derslik bilgisi zorunludur")
      .max(50, "Derslik adı en fazla 50 karakter olabilir")
      .required("Derslik zorunludur"),
    day: Yup.string()
      .oneOf(
        ["monday", "tuesday", "wednesday", "thursday", "friday"],
        "Geçerli bir gün seçiniz"
      )
      .required("Gün seçimi zorunludur"),
    startTime: Yup.string()
      .matches(
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Geçerli bir saat formatı giriniz (HH:MM)"
      )
      .required("Başlangıç saati zorunludur"),
    endTime: Yup.string()
      .matches(
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Geçerli bir saat formatı giriniz (HH:MM)"
      )
      .required("Bitiş saati zorunludur")
      .test(
        "timeRange",
        "Bitiş saati başlangıç saatinden sonra olmalıdır",
        function (value) {
          const { startTime } = this.parent;
          if (!startTime || !value) return true;
          return startTime < value;
        }
      ),
    semester: Yup.string().required("Dönem seçimi zorunludur"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setIsLoading(true);

      // Prepare course data
      const courseData = {
        ...values,
        schedule: {
          day: values.day,
          startTime: values.startTime,
          endTime: values.endTime,
        },
        status: "active",
        studentCount: 0,
        sessionsHeld: 0,
        attendanceRate: 0,
        id: Date.now().toString(), // Generate a temporary ID for demo
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Call the parent component's handler
      if (onCreateCourse) {
        onCreateCourse(courseData);
      }

      showSuccess("Ders başarıyla oluşturuldu!");
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error creating course:", error);
      showError("Ders oluşturulurken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  const weekDays = [
    { value: "monday", label: "Pazartesi" },
    { value: "tuesday", label: "Salı" },
    { value: "wednesday", label: "Çarşamba" },
    { value: "thursday", label: "Perşembe" },
    { value: "friday", label: "Cuma" },
  ];

  const semesters = [
    { value: "2024-fall", label: "2024 Güz" },
    { value: "2024-spring", label: "2024 Bahar" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Yeni Ders Ekle"
      size="large"
    >
      <Formik
        initialValues={{
          code: "",
          name: "",
          section: "",
          classroom: "",
          day: "",
          startTime: "",
          endTime: "",
          semester: "2024-fall",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Course Code and Name */}
              <div className="form-group">
                <label htmlFor="code" className="form-label">
                  Ders Kodu *
                </label>
                <Field
                  id="code"
                  name="code"
                  type="text"
                  className={`form-input ${
                    errors.code && touched.code ? "border-red-500" : ""
                  }`}
                  placeholder="Örn: BIL101"
                />
                <ErrorMessage
                  name="code"
                  component="div"
                  className="form-error"
                />
              </div>

              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Ders Adı *
                </label>
                <Field
                  id="name"
                  name="name"
                  type="text"
                  className={`form-input ${
                    errors.name && touched.name ? "border-red-500" : ""
                  }`}
                  placeholder="Örn: Bilgisayar Programlama I"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="form-error"
                />
              </div>

              {/* Section and Classroom */}
              <div className="form-group">
                <label htmlFor="section" className="form-label">
                  Şube *
                </label>
                <Field
                  id="section"
                  name="section"
                  type="text"
                  className={`form-input ${
                    errors.section && touched.section ? "border-red-500" : ""
                  }`}
                  placeholder="Örn: 1"
                />
                <ErrorMessage
                  name="section"
                  component="div"
                  className="form-error"
                />
              </div>

              <div className="form-group">
                <label htmlFor="classroom" className="form-label">
                  Derslik *
                </label>
                <Field
                  id="classroom"
                  name="classroom"
                  type="text"
                  className={`form-input ${
                    errors.classroom && touched.classroom
                      ? "border-red-500"
                      : ""
                  }`}
                  placeholder="Örn: A-201"
                />
                <ErrorMessage
                  name="classroom"
                  component="div"
                  className="form-error"
                />
              </div>

              {/* Day and Time */}
              <div className="form-group">
                <label htmlFor="day" className="form-label">
                  Gün *
                </label>
                <Field
                  as="select"
                  id="day"
                  name="day"
                  className={`form-input ${
                    errors.day && touched.day ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Gün seçiniz</option>
                  {weekDays.map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="day"
                  component="div"
                  className="form-error"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Saat Aralığı *</label>
                <div className="flex items-center space-x-2">
                  <Field
                    id="startTime"
                    name="startTime"
                    type="time"
                    className={`form-input ${
                      errors.startTime && touched.startTime
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  <span>-</span>
                  <Field
                    id="endTime"
                    name="endTime"
                    type="time"
                    className={`form-input ${
                      errors.endTime && touched.endTime ? "border-red-500" : ""
                    }`}
                  />
                </div>
                <ErrorMessage
                  name="startTime"
                  component="div"
                  className="form-error"
                />
                <ErrorMessage
                  name="endTime"
                  component="div"
                  className="form-error"
                />
              </div>

              {/* Semester */}
              <div className="form-group">
                <label htmlFor="semester" className="form-label">
                  Dönem *
                </label>
                <Field
                  as="select"
                  id="semester"
                  name="semester"
                  className={`form-input ${
                    errors.semester && touched.semester ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Dönem seçiniz</option>
                  {semesters.map((semester) => (
                    <option key={semester.value} value={semester.value}>
                      {semester.label}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="semester"
                  component="div"
                  className="form-error"
                />
              </div>
            </div>

            {/* Info Box */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Bilgi:</strong> Ders oluşturulduktan sonra öğrenci
                listesini yükleyebilir ve yoklama almaya başlayabilirsiniz.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                disabled={isLoading || isSubmitting}
              >
                İptal
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading || isSubmitting}
              >
                {isLoading || isSubmitting ? (
                  <div className="flex items-center">
                    <LoadingSpinner size="small" className="mr-2" />
                    Oluşturuluyor...
                  </div>
                ) : (
                  "Ders Oluştur"
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default CourseCreateModal;
