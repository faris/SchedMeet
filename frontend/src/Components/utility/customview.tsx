import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Navigate, NavigateAction, TitleOptions } from "react-big-calendar";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import TimeGrid from "react-big-calendar/lib/TimeGrid";

export default function CustomWeekView({
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
}) {
  const currRange = useMemo(
    () => CustomWeekView.range(date, { localizer }),
    [date, localizer]
  );

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
}

// handles what is shown for view....
CustomWeekView.range = (date: Date, { localizer }: { localizer: any }) => {
  const start = date;
  const end = localizer.add(start, 25, "day");

  let current = start;
  const range = [];

  while (localizer.lte(current, end, "day")) {
    range.push(current);
    current = localizer.add(current, 5, "day");
  }

  return range;
};

// handles how the component moves, both will need changes.
CustomWeekView.navigate = (
  date: Date,
  action: NavigateAction,
  { localizer }: { localizer: any }
) => {
  switch (action) {
    case Navigate.PREVIOUS:
      return localizer.add(date, -3, "day");

    case Navigate.NEXT:
      return localizer.add(date, 3, "day");

    default:
      return date;
  }
};

CustomWeekView.title = (date: Date, options: TitleOptions) => {
  console.log(options);
  return "Hello World";
};
