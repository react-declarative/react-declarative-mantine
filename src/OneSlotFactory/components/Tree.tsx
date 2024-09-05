import * as React from 'react';
import { useMemo, useState, useRef, useEffect } from 'react';

import { ITreeSlot, useOneState, useOnePayload, useRenderWaiter, isObject, compareArray, useOneProps, useAsyncAction } from 'react-declarative';
import { MultiSelect } from '@mantine/core';
import { MANTINE_CONFIG, MANTINE_POPOVER_ZINDEX } from '../../config';
import ITreeNode from 'react-declarative/model/ITreeNode';

const LOADING_LABEL = "Loading";
const EMPTY_ARRAY: any[] = [];

const getArrayHash = (value: any) =>
  Object.values<string>(value || {})
    .sort((a, b) => b.localeCompare(a))
    .join('-');

const deepFlat = (arr: ITreeNode[] = []) => {
  const result: ITreeNode[] = [];
  const process = (entries: any[] = []) => entries.forEach((entry) => {
    const options = entry['child'] || [];
    process([...options]);
    result.push(entry);
  });
  process(arr);
  return result;
};

interface IState {
  options: string[];
  labels: Record<string, string>;
}

/**
 * Creates a Tree component with customizable options.
 *
 * @param Tree - The Tree component.
 * @param Tree.invalid - Indicates if the Tree is invalid.
 * @param Tree.incorrect - Indicates if the Tree is incorrect.
 * @param Tree.value - The current value of the Tree.
 * @param Tree.disabled - Indicates if the Tree is disabled.
 * @param Tree.readonly - Indicates if the Tree is read only.
 * @param Tree.description - The description of the Tree.
 * @param Tree.outlined - Indicates if the Tree is outlined.
 * @param Tree.title - The title of the Tree.
 * @param Tree.placeholder - The placeholder text of the Tree.
 * @param Tree.dirty - Indicates if the Tree is dirty.
 * @param Tree.loading - The loading state of the Tree.
 * @param Tree.onChange - The event handler for onChange event.
 * @param Tree.itemTree - The item tree of the Tree.
 *
 * @returns The Tree component.
 */
export const Tree = ({
  invalid,
  incorrect,
  value: upperValue,
  disabled,
  readonly,
  description = "",
  outlined = false,
  title = "",
  placeholder = "",
  dirty,
  loading: upperLoading,
  onChange,
  itemTree = EMPTY_ARRAY,
  watchItemTree,
}: ITreeSlot) => {

  const { object } = useOneState();
  const payload = useOnePayload();

  const [state, setState] = useState<IState>(() => ({
    options: [],
    labels: {},
  }));

  const initComplete = useRef(false);

  const waitForRender = useRenderWaiter([state], 10);

  /**
   * Memoized value casted to array.
   *
   * @type {Array}
   * @param upperValue - The value used to compute the memoized array.
   * @returns - The memoized array value.
   */
  const arrayValue = useMemo(() => {
    if (typeof upperValue === 'string') {
      return [upperValue];
    }
    if (upperValue) {
      const result = Object.values<string>(upperValue);
      return isObject(result) ? [] : result;
    }
    return [];
  }, [upperValue]);

  const prevValue = useRef(arrayValue);

  /**
   * Memoizes the value based on the input array value.
   *
   * @param arrayValue - The array value.
   * @returns - The memoized value.
   */
  const value = useMemo(() => {
    if (compareArray(prevValue.current, arrayValue)) {
      return prevValue.current;
    }
    prevValue.current = arrayValue;
    return arrayValue;
  }, [arrayValue]);

  const {
    fallback,
  } = useOneProps();

  const {
    loading,
    execute,
  } = useAsyncAction(async (object) => {
    const labels: Record<string, string> = {};
    const options: string[] = [];
    let nodes: ITreeNode[] = typeof itemTree === "function" ? await itemTree(object, payload) : itemTree;
    nodes = deepFlat(nodes);
    nodes.forEach(({ label, value, child }) => {
      if (child) {
        return;
      }
      options.push(value);
      labels[value] = label;
    });
    setState({ options, labels });
    initComplete.current = true;
    await waitForRender();
  }, {
    fallback,
  });

  const valueHash = getArrayHash(value);
  const prevObject = useRef<any>(null);
  const initial = useRef(true);

  useEffect(() => {
    if (!initial.current) {
      if (prevObject.current === object) {
        return;
      }
      if (!watchItemTree) {
        return;
      }
    }
    prevObject.current = object;
    initial.current = false;
    execute(object);
  }, [
    valueHash,
    disabled,
    dirty,
    invalid,
    incorrect,
    object,
    readonly,
  ]);

  /**
   * Handles a change event by calling the provided onChange function with the value.
   * If the value is an empty string or undefined, null is passed to the onChange function.
   * After calling onChange, the changeSubject is notified.
   *
   * @param value - The value to be passed to the onChange function.
   * @returns
   */
  const handleChange = (value: any) => {
    onChange(value?.length ? value : null);
  };

  const data = useMemo(() => state.options.map((value) => ({
    value,
    label: state.labels[value],
  })), [state]);

  if (loading || upperLoading || !initComplete.current) {
    return (
      <MultiSelect
        {...MANTINE_CONFIG}
        variant={outlined ? "unstyled" : "filled"}
        disabled
        label={title}
        error={(dirty && (invalid || incorrect))}
        description={description}
        placeholder={LOADING_LABEL}
        comboboxProps={{
          withinPortal: false,
          zIndex: MANTINE_POPOVER_ZINDEX,
        }}
      />
    );
  }

  return (
    <MultiSelect
      {...MANTINE_CONFIG}
      value={value}
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
        zIndex: MANTINE_POPOVER_ZINDEX,
      }}
    />
  );
};

export default Tree;
