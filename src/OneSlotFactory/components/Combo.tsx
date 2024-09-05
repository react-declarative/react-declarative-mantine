import * as React from "react";
import { useMemo, useState, useRef, useEffect } from "react";

import { IComboSlot, useAsyncAction, useOnePayload, useOneProps, useOneState, useRenderWaiter } from "react-declarative";
import { MANTINE_CONFIG, MANTINE_POPOVER_ZINDEX } from "../../config";
import { Select } from "@mantine/core";

const LOADING_LABEL = "Loading";

/**
 * Returns a hash string generated from the values in an array.
 *
 * @param value - The array object to generate the hash from.
 * @returns - The hash string generated from the array values.
 */
const getArrayHash = (value: any) =>
  Object.values<string>(value || {})
    .sort((a, b) => b.localeCompare(a))
    .join("-");

/**
 * Represents the contract for the State class, which holds options and labels.
 *
 * @interface
 */
interface IState {
  options: string[];
  labels: Record<string, string>;
}

/**
 * Represents a Combo component.
 * @param value - The selected value(s) of the Combo.
 * @param disabled - Whether the Combo is disabled or not.
 * @param readonly - Whether the Combo is readonly or not.
 * @param description - The description of the Combo.
 * @param placeholder - The placeholder text of the Combo input.
 * @param outlined - Whether the Combo is outlined or not.
 * @param itemList - The list of items/options for the Combo.
 * @param virtualListBox - Whether to use a virtual list box for the Combo or not.
 * @param watchItemList - Whether to watch the itemList for changes or not.
 * @param labelShrink - Whether to shrink the label of the Combo or not.
 * @param noDeselect - Whether to allow deselecting an item or not.
 * @param freeSolo - Whether to allow free text input or not.
 * @param title - The title/label of the Combo.
 * @param dirty - Whether the Combo value is dirty/changed or not.
 * @param invalid - Whether the Combo value is invalid or not.
 * @param incorrect - Whether the Combo value is incorrect or not.
 * @param withContextMenu - Whether to show a context menu for the Combo or not.
 * @param tr - The translation function for the Combo.
 * @param onChange - The change event handler for the Combo.
 * @returns The Combo component.
 */
export const Combo = ({
  value: upperValue,
  disabled,
  readonly,
  description = "",
  placeholder = "",
  outlined = false,
  itemList = [],
  watchItemList,
  noDeselect,
  freeSolo,
  title = "",
  dirty,
  invalid,
  incorrect,
  tr = (s) => s.toString(),
  onChange,
}: IComboSlot) => {
  const { object } = useOneState();
  const payload = useOnePayload();

  const [state, setState] = useState<IState>(() => ({
    options: [],
    labels: {},
  }));

  const initComplete = useRef(false);

  const waitForRender = useRenderWaiter([state], 10);

  /**
   * Returns a memoized value based on the given `upperValue`.
   *
   * @param upperValue - The value to compute the memoized value from.
   * @returns - The computed memoized value.
   */
  const value = useMemo(() => {
    if (Array.isArray(upperValue)) {
      const [first] = upperValue;
      return first;
    }
    return upperValue;
  }, [upperValue]);

  const { fallback } = useOneProps();

  /**
   * Loads the given variable from a source.
   */
  const { loading, execute } = useAsyncAction(
    async (object) => {
      const labels: Record<string, string> = {};
      itemList = itemList || [];
      const options: string[] = [
        ...new Set(
          Object.values(
            typeof itemList === "function"
              ? await Promise.resolve(itemList(object, payload))
              : itemList
          )
        ),
      ];
      await Promise.all(
        options.map(
          async (item) =>
            (labels[item] = await Promise.resolve(tr(item, object, payload)))
        )
      );

      if (freeSolo && value) {
        !options.includes(value) && options.push(value);
      }

      setState({ labels, options });
      initComplete.current = true;
      await waitForRender();
    },
    {
      fallback,
    }
  );

  const valueHash = getArrayHash(value);
  const prevObject = useRef<any>(null);
  const initial = useRef(true);

  useEffect(() => {
    if (!initial.current) {
      if (prevObject.current === object) {
        return;
      }
      if (!watchItemList) {
        return;
      }
    }
    prevObject.current = object;
    initial.current = false;
    execute(object);
  }, [valueHash, disabled, dirty, invalid, incorrect, object, readonly]);

  /**
   * Handles the change of a value and triggers the corresponding
   * callback and event.
   *
   * @param value - The new value for the change event.
   * @returns
   */
  const handleChange = (value: any) => {
    onChange(value || null);
  };

  const data = useMemo(() => state.options.map((value) => ({
    value,
    label: state.labels[value] || value,
  })), [state]);


  if (loading || !initComplete.current) {
    return (
      <Select
        {...MANTINE_CONFIG}
        variant={outlined ? "default" : "filled"}
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
      variant={outlined ? "default" : "filled"}
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

export default Combo;
