import * as React from "react";

import { ActionButton, IChooseSlot, IField, useAsyncValue, useOnePayload, useOneState, useSinglerunAction } from "react-declarative";
import { MANTINE_CONFIG } from "../../config";
import { TextInput } from "@mantine/core";

const LOADING_LABEL = "Loading";

/**
 * Retrieves the processed input value based on the provided parameters.
 *
 * @param value - The input value to process.
 * @param tr - The transformation function.
 * @param data - Additional data used in the transformation process.
 * @param payload - Additional payload used in the transformation process.
 * @returns - The processed input value or null.
 */
const getInputValue = async (
  value: any,
  tr: Exclude<IField["tr"], undefined>,
  data: any,
  payload: any
) => {
  if (Array.isArray(value)) {
    return await Promise.all(value.map((v) => tr(v, data, payload)));
  } else if (value) {
    return await tr(value, data, payload);
  } else {
    return null;
  }
};

/**
 * Represents a Choose variable.
 * @typedef IChooseSlot
 * @property invalid - The invalid value.
 * @property incorrect - The incorrect value.
 * @property value - The value.
 * @property disabled - The disabled value.
 * @property readonly - The readonly value.
 * @property description - The description value.
 * @property outlined - The outlined value.
 * @property title - The title value.
 * @property placeholder - The placeholder value.
 * @property labelShrink - The labelShrink value.
 * @property dirty - The dirty value.
 * @property upperLoading - The upperLoading value.
 * @property inputRef - The inputRef value.
 * @property onChange - The onChange value.
 * @property choose - The choose value.
 * @property tr - The tr value.
 */
export const Choose = ({
  invalid,
  incorrect,
  value,
  disabled,
  readonly,
  description = "",
  title = "",
  placeholder = "Not chosen",
  dirty,
  outlined,
  loading: upperLoading,
  inputRef,
  onChange,
  choose = () => "unknown",
  tr = (value) => value,
}: IChooseSlot) => {
  const payload = useOnePayload();
  const { object } = useOneState();

  /**
   * Represents the value of an input.
   *
   * @typedef inputValue
   */
  const [inputValue, { loading: currentLoading }] = useAsyncValue(
    async () => {
      return await getInputValue(value, tr, object, payload);
    },
    {
      deps: [value],
    }
  );

  /**
   * Handles the click event.
   *
   * @param event - The click event object.
   * @returns
   */
  const { execute: handleClick, loading: chooseLoading } = useSinglerunAction(
    async () => {
      if (value) {
        onChange(null);
        return;
      }
      const pendingValue = await choose(object, payload);
      onChange(
        Array.isArray(pendingValue)
          ? pendingValue.length
            ? pendingValue
            : null
          : pendingValue || null
      );
    }
  );

  const loading = upperLoading || currentLoading || chooseLoading;

  return (
    <TextInput
      {...MANTINE_CONFIG}
      variant={outlined ? "default" : "filled"}
      readOnly
      ref={inputRef}
      label={title}
      error={(dirty && (invalid || incorrect))}
      description={description}
      rightSection={(
        <ActionButton
          sx={{
            pointerEvents: readonly ? "none" : "all",
            mr: 1,
          }}
          disabled={loading || disabled}
          variant="outlined"
          size="small"
          color={value ? "secondary" : "primary"}
          onClick={async () => {
            await handleClick();
          }}
        >
          {value && "Deselect"}
          {!value && "Choose"}
        </ActionButton>
      )}
      rightSectionProps={{
        style: {
          width: 'auto',
        }
      }}
      value={loading ? LOADING_LABEL : String(inputValue || "")}
      placeholder={placeholder}
      onClick={(e) => {
        e.currentTarget?.blur();
        if (!value) {
          handleClick();
        }
      }}
      disabled={disabled}
    />
  );
};

export default Choose;
