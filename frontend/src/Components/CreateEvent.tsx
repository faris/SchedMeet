import React from "react";
import {
  Field,
  useFormikContext,
  useField,
  ErrorMessage,
  Formik,
  Form,
} from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/calendar-overrides.css";

const Fieldset = ({
  name,
  label,
  ...rest
}: {
  [x: string]: any;
  name: string;
  label: string;
}) => (
  <React.Fragment>
    <label htmlFor={name}>{label}</label>
    <Field id={name} name={name} {...rest} />
    <ErrorMessage name={name} />
  </React.Fragment>
);

const DatePickerField = ({ ...props }: { [x: string]: any; name: string }) => {
  const { setFieldValue } = useFormikContext();

  const [field] = useField({ ...props });

  const [selectedDates, setSelectedDates] = React.useState<Date[]>([]);

  return (
    <DatePicker
      {...field}
      {...props}
      minDate={new Date()}
      highlightDates={selectedDates}
      onChange={(val) => {
        if (val) {
          console.log(val);
          if (selectedDates.some((item) => item.getTime() === val.getTime())) {
            const filtered = selectedDates.filter(
              (item) => item.getTime() != val.getTime()
            );
            setSelectedDates(filtered);
            console.log(`Deleting ${val} `);
          } else {
            setSelectedDates([...selectedDates, val]);
            console.log(`selectedDates ${selectedDates} `);
          }
        }
      }}
    />
  );
};

export const SignupForm = () => {
  return (
    <Formik
      initialValues={{
        title: "",
        lastName: "",
        email: "",
      }}
      validationSchema={Yup.object({
        title: Yup.string()
          .max(15, "Must be 15 characters or less")
          .required("Required"),
        lastName: Yup.string()
          .max(20, "Must be 20 characters or less")
          .required("Required"),
        date: Yup.string().email("Invalid email address").required("Required"),
      })}
      onSubmit={(values) => {
        alert(JSON.stringify(values, null, 2));
      }}
    >
      <Form>
        <Fieldset
          name="title"
          type="text"
          label="Event Title"
          placeholder="..."
        />
        <DatePickerField name="date" label="Start Date" />
      </Form>
    </Formik>
  );
};
