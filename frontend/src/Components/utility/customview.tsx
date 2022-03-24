import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Navigate, NavigateAction, TitleOptions } from "react-big-calendar";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import TimeGrid from "react-big-calendar/lib/TimeGrid";
import { useAvailableSlotsStore } from "../../stores/availabilityStore";
export const CustomWeekView = ({
  date,
  localizer,
  max = localizer.endOf(new Date(), "day"),
  min = localizer.startOf(new Date(), "day"),
  scrollToTime = localizer.startOf(new Date(), "day"),
  ...props
}: {
  date: Date;
  localizer: any;
  max: Date;
  min: Date;
  scrollToTime: Date;
}) => {
  const currRange = CustomWeekView.range(date, { localizer });

  return (
    <TimeGrid
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      date={date}
      eventOffset={15}
      localizer={localizer}
      max={max}
      min={min}
      range={currRange}
      scrollToTime={scrollToTime}
      {...props}
    />
  );
};

// handles what is shown for view, when the view only has one date, it breaks....
CustomWeekView.range = (date: Date, { localizer }: { localizer: any }) => {
  const { availableDateTimeIntervals, retrieveCurrentDateTimeIntervalIndex } =
    useAvailableSlotsStore();

  const currentDateTimeIntervalIndex =
    retrieveCurrentDateTimeIntervalIndex(date);

  if (currentDateTimeIntervalIndex == -1) {
    return [];
  }

  console.log(currentDateTimeIntervalIndex);

  return availableDateTimeIntervals.slice(
    currentDateTimeIntervalIndex,
    currentDateTimeIntervalIndex + 5
  );
};

CustomWeekView.navigate = (date: Date, action: NavigateAction, props: any) => {
  switch (action) {
    case Navigate.PREVIOUS:
      return props.customNavigation(date, action);

    case Navigate.NEXT:
      return props.customNavigation(date, action);

    default:
      return date;
  }
};

CustomWeekView.title = (date: Date, options: TitleOptions) => {
  return `Showing days on/after: ${options.localizer.format(
    date,
    "EEEE MM-dd-yy",
    "en-US"
  )}`;
};
