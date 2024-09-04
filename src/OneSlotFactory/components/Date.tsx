import * as React from "react";
import { useMemo } from "react";
import dayjs from "dayjs";

import { DateInput } from "@mantine/dates";

import { datetime, IDateSlot } from "react-declarative";
import { MANTINE_CONFIG, MANTINE_POPOVER_ZINDEX } from "../../config";

export const Date = ({
  invalid,
  incorrect,
  value,
  disabled,
  readonly,
  description = "",
  title = "Text",
  dirty,
  inputRef,
  onChange,
}: IDateSlot) => {
  const dateValue = useMemo(() => {
    if (value) {
      const date = datetime.parseDate(value);
      if (!date) {
        return undefined;
      }
      let now = dayjs();
      now = now.set("date", date.day);
      now = now.set("month", date.month - 1);
      now = now.set("year", date.year);
      return now.toDate();
    }
    return undefined;
  }, [value]);

  return (
    <DateInput
      {...MANTINE_CONFIG}
      label={title}
      ref={inputRef}
      readOnly={readonly}
      disabled={disabled}
      valueFormat="DD/MM/YYYY"
      error={(dirty && (invalid || incorrect))}
      description={description}
      value={dateValue}
      popoverProps={{
        zIndex: MANTINE_POPOVER_ZINDEX,
      }}
      onChange={(value: Date | null) => {
        if (value) {
          const date = dayjs(value);
          const day = date.get("date");
          const month = date.get("month") + 1;
          const year = date.get("year");
          onChange(new datetime.Date(day, month, year).toString());
          return;
        }
        onChange(null);
      }}
    />
  );
};

export default Date;
