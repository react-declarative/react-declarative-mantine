import * as React from "react";
import { useState, useEffect, useRef, useMemo, useLayoutEffect } from "react";
import dayjs from "dayjs";

import Popover from "@mui/material/Popover";
import IconButton from "@mui/material/IconButton";

import AlarmIcon from "@mui/icons-material/AlarmOutlined";
import { TextInput } from "@mantine/core";
import { MANTINE_CONFIG } from "../../config";
import { datetime, ITimeSlot, useOneMenu, useActualValue, formatText, TimePicker } from "react-declarative";

const TIME_TEMPLATE = "##:##";
const NEVER_POS = Symbol("never-pos");

const getCaretPos = (element: HTMLInputElement | HTMLTextAreaElement) => {
  return element.selectionStart || element.value.length;
};

/**
 * Represents a Time variable.
 *
 * @typedef  Time
 * @property invalid - Indicates if the value is invalid.
 * @property incorrect - Indicates if the value is incorrect.
 * @property value - The upper value.
 * @property disabled - Indicates if the time is disabled.
 * @property readonly - Indicates if the time is readonly.
 * @property description - The description of the time.
 * @property outlined - Indicates if the time is outlined.
 * @property title - The title of the time.
 * @property labelShrink - Indicates if the label is shrunk.
 * @property placeholder - The placeholder for the time.
 * @property dirty - Indicates if the time has been modified.
 * @property autoFocus - Indicates if the time is auto focused.
 * @property inputRef - The ref for the input element.
 * @property onChange - The callback function triggered when the value changes.
 * @property withContextMenu - Indicates if the time has a context menu.
 */
export const Time = ({
  invalid,
  incorrect,
  value: upperValue,
  disabled,
  readonly,
  description = "",
  title = "Text",
  placeholder = datetime.TIME_PLACEHOLDER,
  dirty,
  outlined,
  inputRef,
  onChange,
  withContextMenu,
}: ITimeSlot) => {
  const { requestSubject } = useOneMenu();

  const inputElementRef = useRef<HTMLInputElement | null>();

  const incomingUpdate = useRef(false);
  const outgoingUpdate = useRef(false);

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  /**
   * Handle click event on button element.
   * @param event - The click event object.
   */
  const handleClick = ({
    clientX,
    clientY,
    target,
  }: React.MouseEvent<HTMLButtonElement>) => {
    const pointTarget = document.elementFromPoint(clientX, clientY);
    if (pointTarget) {
      setAnchorEl(pointTarget as HTMLButtonElement);
      return;
    }
    setAnchorEl(target as unknown as HTMLButtonElement);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [value, setValue] = useState(
    datetime.parseTime(upperValue || "") ? upperValue : ""
  );

  const value$ = useActualValue(value);

  useEffect(() => {
    if (outgoingUpdate.current) {
      outgoingUpdate.current = false;
    } else if (datetime.parseTime(upperValue || "")) {
      incomingUpdate.current = true;
      setValue(upperValue);
    } else if (value$.current) {
      incomingUpdate.current = true;
      setValue("");
    }
  }, [upperValue]);

  const upperValue$ = useActualValue(upperValue);

  useEffect(() => {
    if (incomingUpdate.current) {
      incomingUpdate.current = false;
    } else {
      const pendingDate = datetime.parseTime(value || "");
      if (pendingDate) {
        outgoingUpdate.current = true;
        onChange(datetime.serializeTime(pendingDate));
      } else if (upperValue$.current) {
        outgoingUpdate.current = true;
        onChange("");
      }
    }
  }, [value]);

  /**
   * Handles the change of input value.
   *
   * @param value - The new value of the input.
   * @returns
   */
  const handleChange = (value: string) => {
    let result = "";
    for (let i = 0; i < value.length; i++) {
      result += value[i];
      result = formatText(result, TIME_TEMPLATE, {
        allowed: /\d/,
        symbol: "#",
      });
    }
    caretManager.pos();
    setValue(result);
  };

  /**
   * A memoized value computed from the given `value` using `useMemo`.
   *
   * @param value - The input value used to compute the `dayjsValue`.
   *
   * @returns - The computed `dayjsValue` which is a `Dayjs` object representing the parsed `value` as a time.
   *
   */
  const dayjsValue = useMemo(() => {
    if (value) {
      const date = datetime.parseTime(value);
      if (!date) {
        return undefined;
      }
      let now = dayjs();
      now = now.set("hour", date.hour);
      now = now.set("minute", date.minute);
      return now;
    }
    return undefined;
  }, [value]);

  /**
   * Manages the caret position in an input element.
   */
  const caretManager = useMemo(() => {
    let lastPos: symbol | number = NEVER_POS;

    const getAdjust = (pos: number) => {
      let adjust = 0;
      for (let i = Math.max(pos - 1, 0); i < TIME_TEMPLATE.length; i++) {
        const char = TIME_TEMPLATE[i];
        if (char === "#") {
          break;
        }
        adjust += 1;
      }
      return adjust;
    };

    return {
      render: () => {
        const { current: input } = inputElementRef;
        if (typeof lastPos === "number") {
          input?.setSelectionRange(lastPos, lastPos);
          lastPos = NEVER_POS;
        }
      },
      pos: () => {
        const { current: input } = inputElementRef;
        if (input) {
          lastPos = getCaretPos(input);
          lastPos += getAdjust(lastPos);
        }
        return lastPos;
      },
    };
  }, []);

  useLayoutEffect(() => {
    const { current: input } = inputElementRef;
    const handler = () => caretManager.pos();
    input && input.addEventListener("keyup", handler);
    input && input.addEventListener("click", handler);
    return () => {
      input && input.removeEventListener("keyup", handler);
      input && input.removeEventListener("click", handler);
    };
  }, [inputElementRef.current]);

  useLayoutEffect(() => {
    caretManager.render();
  }, [value]);

  useEffect(() => withContextMenu && requestSubject.subscribe(handleClose), []);

  return (
    <>
      <TextInput
        {...MANTINE_CONFIG}
        variant={outlined ? "default" : "filled"}
        ref={(input: HTMLInputElement | null) => {
          inputElementRef.current = input;
          inputRef && inputRef(input);
        }}
        type="text"
        readOnly={readonly}
        rightSection={(
          <IconButton onClick={handleClick} disabled={disabled}>
            <AlarmIcon />
          </IconButton>
        )}
        rightSectionProps={{
          style: {
            width: 'auto',
          }
        }}
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        label={title}
        error={(dirty && (invalid || incorrect))}
        description={description}
        onChange={({ target }) => handleChange(target.value)}
      />
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <TimePicker
          date={dayjsValue}
          onChange={(value: dayjs.Dayjs | null) => {
            if (value) {
              const hour = value.get("hour");
              const minute = value.get("minute");
              setValue(new datetime.Time(hour, minute).toString());
              return;
            }
            setValue(null);
          }}
        />
      </Popover>
    </>
  );
};

export default Time;
