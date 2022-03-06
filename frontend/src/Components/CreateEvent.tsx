import React from "react";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { SelectChangeEvent } from "@mui/material/Select";
import { Select } from "formik-mui";
import produce from "immer";
import { Field, useFormikContext, useField, useFormik } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/calendar-overrides.css";
import { addDays, differenceInDays, addMinutes } from "date-fns";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const DatePickerField = (...props: any[]) => {
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);

  const [selectedDates, setSelectedDates] = React.useState<Map<string, Date>>(
    new Map()
  );

  return (
    <DatePicker
      customInput={
        <TextField
          fullWidth
          id={"Date Range(s)"}
          name={"Date Range(s)"}
          label={"Date Range(s)"}
          margin="normal"
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
          setSelectedDates(
            produce(selectedDates, (selectedDates) => {
              selectedDates.delete(start.toISOString());
            })
          );
          setStartDate(null);
        } else if (start && end) {
          const daysDifference = differenceInDays(end, start);
          let tempDates = selectedDates;

          for (let dayNumber = 0; dayNumber <= daysDifference; dayNumber++) {
            const currentDate = addDays(start, dayNumber);
            tempDates = produce(tempDates, (selectedDates) => {
              selectedDates.set(currentDate.toISOString(), currentDate);
            });
          }

          setSelectedDates(tempDates);
          setStartDate(null);
          setEndDate(null);
        }
      }}
    />
  );
};

const TimePickerField = (...props: any[]) => {
  const [startTime, setStartTime] = React.useState<Date | undefined>();
  const [endTime, setEndTime] = React.useState<Date | undefined>();

  console.log(startTime, endTime);

  const filterTimeForNoEarlier = (time: Date) => {
    if (!endTime) {
      return true;
    } else {
      // Weird Time bug so I add a bit of extra minutes that are less then the granularity to ensure results are not off.
      return addMinutes(time, 10) < endTime;
    }
  };

  const filterTimeForNoLater = (time: Date) => {
    if (!startTime) {
      return false;
    } else {
      return time > startTime;
    }
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
            id={"StartMeetingTime"}
            name={"StartMeetingTime"}
            label={"Book No Earlier Then"}
            margin="normal"
          />
        }
        {...props}
        selected={startTime}
        onChange={(time) => {
          time && setStartTime(time);
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
            id={"EndMeetingTime"}
            name={"EndMeetingTime"}
            label={"Book No Later Then"}
            margin="normal"
          />
        }
        {...props}
        selected={endTime}
        filterTime={filterTimeForNoLater}
        onChange={(time) => {
          time && setEndTime(time);
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
  const [age, setAge] = React.useState("");
  const [value, setValue] = React.useState("");
  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      timeSlotGranularity: 15,
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .max(15, "Must be 15 characters or less")
        .required("Required"),
      description: Yup.string().required("Required"),
      timeSlotGranularity: Yup.number().min(15),
    }),
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
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
        error={formik.touched.description && Boolean(formik.errors.description)}
        helperText={formik.touched.description && formik.errors.description}
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
    </form>
  );
};
