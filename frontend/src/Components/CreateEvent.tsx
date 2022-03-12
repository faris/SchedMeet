import React, { useEffect } from "react";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import produce from "immer";
import { useFormikContext, Formik, FormikContextType, Form } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/calendar-overrides.css";
import { addDays, differenceInDays, addMinutes } from "date-fns";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { EventTimeRestrictions, SchedMeetNewEvent } from "../constants";
import { createNewEventMutation } from "../service/mutation";
import { useMutation } from "react-query";
import { useAuthStore } from "../stores/authStore";
import { useEventStore } from "../stores/newTimeStore";
import compareAsc from "date-fns/compareAsc";

const DatePickerField = (...props: any[]) => {
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);

  const { selectedDates, deleteEventDate, addEventDate } = useEventStore();

  const {
    values,
    handleChange,
    setFieldValue,
    touched,
    errors,
  }: FormikContextType<SchedMeetNewEvent> = useFormikContext();

  return (
    <DatePicker
      customInput={
        <TextField
          fullWidth
          id={"availableDateTimeIntervals"}
          name={"availableDateTimeIntervals"}
          label={"Date Range(s)"}
          margin="normal"
          value={values.availableDateTimeIntervals}
          onChange={handleChange}
          error={
            touched.availableDateTimeIntervals &&
            Boolean(errors.availableDateTimeIntervals)
          }
          helperText={
            touched.availableDateTimeIntervals &&
            errors.availableDateTimeIntervals
          }
        />
      }
      {...props}
      minDate={new Date()}
      selectsRange
      withPortal
      shouldCloseOnSelect={false}
      disabledKeyboardNavigation
      selected={startDate}
      startDate={startDate}
      endDate={endDate}
      highlightDates={[...selectedDates.values()]}
      onChange={(dates: [Date | null, Date | null]) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);

        if (start && !end && selectedDates.has(start.toISOString())) {
          deleteEventDate(start);
          setStartDate(null);
        } else if (start && end) {
          const newEventDates = addEventDate(start, end);
          setStartDate(null);
          setEndDate(null);
          setFieldValue("availableDateTimeIntervals", newEventDates);
        }
      }}
    />
  );
};

const TimePickerField = (...props: any[]) => {
  const { restrictedTimeInterval, updateRestrictedInterval } = useEventStore();
  const [startTime, endTime] = restrictedTimeInterval;

  const {
    values,
    handleChange,
    setFieldValue,
    touched,
    errors,
  }: FormikContextType<EventTimeRestrictions> = useFormikContext();

  const filterTimeForNoEarlier = (time: Date) => {
    return (
      compareAsc(endTime, startTime) == 1 && compareAsc(endTime, time) == 1
    );
  };

  const filterTimeForNoLater = (time: Date) => {
    return (
      compareAsc(endTime, startTime) == 1 && compareAsc(time, startTime) == 1
    );
  };

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      spacing={4}
      alignItems="center"
    >
      <DatePicker
        customInput={
          <TextField
            fullWidth
            id={"noEarlierThenTime"}
            name={"noEarlierThenTime"}
            label={"Book No Earlier Then"}
            margin="normal"
            value={values.noEarlierThenTime}
            onChange={handleChange}
            error={
              touched.noEarlierThenTime && Boolean(errors.noEarlierThenTime)
            }
            helperText={touched.noEarlierThenTime && errors.noEarlierThenTime}
          />
        }
        {...props}
        selected={startTime}
        onChange={(time) => {
          if (time) {
            updateRestrictedInterval(time, restrictedTimeInterval[1]);
            setFieldValue("noEarlierThenTime", time);
          }
        }}
        filterTime={filterTimeForNoEarlier}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        timeCaption="Time"
        dateFormat="h:mm aa"
      />
      <DatePicker
        customInput={
          <TextField
            fullWidth
            id={"noLaterThenTime"}
            name={"noLaterThenTime"}
            label={"End No Later Then"}
            margin="normal"
            value={values.noLaterThenTime}
            onChange={handleChange}
            error={touched?.noLaterThenTime && Boolean(errors.noLaterThenTime)}
            helperText={touched.noLaterThenTime && errors.noLaterThenTime}
          />
        }
        {...props}
        selected={endTime}
        filterTime={filterTimeForNoLater}
        onChange={(time) => {
          if (time) {
            console.log(time);
            setFieldValue("noLaterThenTime", time);
            updateRestrictedInterval(restrictedTimeInterval[0], time);
          }
        }}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        timeCaption="Time"
        dateFormat="h:mm aa"
      />
    </Stack>
  );
};

export const SignupForm = () => {
  const { authToken, retrieveAuthToken } = useAuthStore();

  useEffect(() => {
    retrieveAuthToken();
  }, []);

  const createNewEvent = useMutation(createNewEventMutation, {
    mutationKey: "createNewEvent",
  });

  return (
    <>
      <Formik
        onSubmit={(values, { setSubmitting }) => {
          const newEvent = {
            title: values.title,
            description: values.description,
            availableDateTimeIntervals: values.availableDateTimeIntervals,
            timeRestrictions:
              values.noEarlierThenTime && values.noLaterThenTime
                ? {
                    noEarlierThenTime: values.noEarlierThenTime,
                    noLaterThenTime: values.noLaterThenTime,
                  }
                : null,
          };

          createNewEvent.mutate({ newEvent, authToken });

          setSubmitting(false);
        }}
        // TODO: See if nested form thing is possible with setFieldValue.
        initialValues={{
          title: "",
          description: "",
          availableDateTimeIntervals: [] as Date[],
          timeSlotGranularity: 15,
          noEarlierThenTime: null,
          noLaterThenTime: null,
        }}
        validationSchema={Yup.object({
          title: Yup.string()
            .max(15, "Must be 15 characters or less")
            .required("Required"),
          description: Yup.string().required("Required"),
          timeSlotGranularity: Yup.number().min(15),
          availableDateTimeIntervals: Yup.array().min(1),
          noEarlierThenTime: Yup.string().nullable(true),
          noLaterThenTime: Yup.string().nullable(true),
        })}
      >
        {(formik) => (
          <Form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              id={"title"}
              name={"title"}
              label={"Event Title"}
              margin="normal"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            ></TextField>
            <TextField
              fullWidth
              id={"description"}
              name={"description"}
              label={"Event Description"}
              margin="normal"
              multiline
              minRows={3}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
            ></TextField>

            <TextField
              margin="normal"
              fullWidth
              select
              name="timeSlotGranularity"
              id="timeSlotGranularity"
              label="Time Slot Granularity"
              onChange={formik.handleChange}
              value={formik.values.timeSlotGranularity}
              error={
                formik.touched.timeSlotGranularity &&
                Boolean(formik.errors.timeSlotGranularity)
              }
              helperText={
                formik.touched.timeSlotGranularity &&
                formik.errors.timeSlotGranularity
              }
            >
              <MenuItem key={1} value={15}>
                15 minutes
              </MenuItem>
              <MenuItem key={2} value={30}>
                30 minutes
              </MenuItem>
              <MenuItem key={3} value={60}>
                1 hour
              </MenuItem>
            </TextField>

            <DatePickerField></DatePickerField>
            <TimePickerField></TimePickerField>

            <Button color="primary" variant="contained" fullWidth type="submit">
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};
