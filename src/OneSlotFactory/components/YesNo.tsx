import * as React from "react";
import { useMemo, useState, useEffect, useRef } from "react";

import { IYesNoSlot, useOnePayload, useOneState, useOneProps, useAsyncAction } from "react-declarative";
import { Select } from "@mantine/core";
import { MANTINE_CONFIG, MANTINE_POPOVER_ZINDEX } from "../../config";

const LOADING_LABEL = "Loading";

const OPTIONS = [
  "Yes",
  "No",
];

/**
 * Represents a YesNoField component.
 * @typedef  YesNoField
 * @property value - The value of the YesNoField.
 * @property disabled - Indicates whether the YesNoField is disabled.
 * @property readonly - Indicates whether the YesNoField is readonly.
 * @property description - The description of the YesNoField.
 * @property placeholder - The placeholder text of the YesNoField.
 * @property outlined - Indicates whether the YesNoField is outlined.
 * @property virtualListBox - Indicates whether to use the virtual list box for the YesNoField.
 * @property labelShrink - Indicates whether the label should shrink for the YesNoField.
 * @property noDeselect - Indicates whether deselection is allowed for the YesNoField.
 * @property title - The title of the YesNoField.
 * @property tr - The translation function for the YesNoField.
 * @property dirty - Indicates whether the YesNoField is dirty.
 * @property invalid - Indicates whether the YesNoField is invalid.
 * @property incorrect - Indicates whether the YesNoField is incorrect.
 * @property onChange - The change event handler for the YesNoField.
 */
export const YesNoField = ({
  value: upperValue,
  disabled,
  readonly,
  description = "",
  placeholder = "",
  noDeselect,
  title = "",
  tr = (v) => v,
  outlined,
  dirty,
  invalid,
  incorrect,
  onChange,
}: IYesNoSlot) => {
  const [labels, setLabels] = useState<Record<string, string>>({});

  const initComplete = useRef(false);

  const payload = useOnePayload();
  const { object } = useOneState();

  /**
   * A memoized value based on the value of `upperValue`.
   * If `upperValue` is `true`, the memoized value is "Yes".
   * If `upperValue` is `false`, the memoized value is "No".
   * If `upperValue` is neither `true` nor `false`, the memoized value is `null`.
   * The memoized value is recalculated whenever `upperValue` changes.
   *
   * @type {string|null}
   */
  const value = useMemo(() => {
    if (upperValue === true) {
      return "Yes";
    }
    if (upperValue === false) {
      return "No";
    }
    return null;
  }, [upperValue]);

  const { fallback } = useOneProps();

  const { loading, execute } = useAsyncAction(
    async () => {
      const labels: Record<string, string> = {};
      await Promise.all(
        OPTIONS.map(
          async (item) =>
            (labels[item] = await Promise.resolve(tr(item, object, payload)))
        )
      );
      setLabels(labels);
      initComplete.current = true;
    },
    {
      fallback,
    }
  );

  useEffect(() => {
    execute();
  }, []);

  /**
   * Handles the change in value.
   *
   * @param value - The new value.
   */
  const handleChange = (value: any) => {
    onChange(value === "Yes" ? true : value === "No" ? false : null);
  };

  const data = useMemo(() => OPTIONS.map((value) => ({
    value,
    label: labels[value],
  })), [labels]);

  if (loading || !initComplete.current) {
    return (
      <Select
        {...MANTINE_CONFIG}
        variant={outlined ? "unstyled" : "filled"}
        disabled
        label={title}
        error={(dirty && (invalid || incorrect))}
        description={description}
        placeholder={LOADING_LABEL}
        comboboxProps={{
          withinPortal: true,
          shadow: 'xl',
          zIndex: MANTINE_POPOVER_ZINDEX,
        }}
      />
    );
  }

  return (
    <Select
      {...MANTINE_CONFIG}
      value={value}
      allowDeselect={!noDeselect}
      variant={outlined ? "unstyled" : "filled"}
      onChange={handleChange}
      label={title}
      disabled={disabled}
      readOnly={readonly}
      error={(dirty && (invalid || incorrect))}
      description={description}
      placeholder={placeholder}
      data={data}
      comboboxProps={{
        withinPortal: true,
        shadow: 'xl',
        zIndex: MANTINE_POPOVER_ZINDEX,
      }}
    />
  );
};

export default YesNoField;
