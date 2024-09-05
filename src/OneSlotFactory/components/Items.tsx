import * as React from 'react';
import { useMemo, useState, useRef, useEffect } from 'react';

import { IItemsSlot, useOneState, useOnePayload, useRenderWaiter, isObject, compareArray, useOneProps, useAsyncAction } from 'react-declarative';
import { MultiSelect } from '@mantine/core';
import { MANTINE_CONFIG, MANTINE_POPOVER_ZINDEX } from '../../config';

const LOADING_LABEL = "Loading";

const getArrayHash = (value: any) =>
    Object.values<string>(value || {})
        .sort((a, b) => b.localeCompare(a))
        .join('-');

interface IState {
    options: string[];
    labels: Record<string, string>;
}

/**
 * @param Items - The main function that renders the Autocomplete component.
 * @param Items.value - The value of the autocomplete field. It can be a string or an object.
 * @param Items.disabled - Determines whether the autocomplete field is disabled or not.
 * @param Items.readonly - Determines whether the autocomplete field is readonly or not.
 * @param Items.description - The description of the autocomplete field.
 * @param Items.placeholder - The placeholder text of the autocomplete field.
 * @param Items.outlined - Determines whether the autocomplete field has an outlined style or not.
 * @param Items.itemList - The list of items to be populated in the autocomplete dropdown.
 * @param Items.freeSolo - Determines whether the user can input values that are not in the itemList.
 * @param Items.noDeselect - Determines whether the user can deselect values in the autocomplete field.
 * @param Items.virtualListBox - Determines whether to use a virtual listbox for rendering the autocomplete dropdown.
 * @param Items.watchItemList - Determines whether to watch for changes in the itemList.
 * @param Items.labelShrink - Determines whether to shrink the label when the autocomplete field has a value.
 * @param Items.dirty - Determines whether the autocomplete field has been modified.
 * @param Items.invalid - Determines whether the autocomplete field has an invalid value.
 * @param Items.incorrect - Determines whether the autocomplete field has an incorrect value.
 * @param Items.title - The title text of the autocomplete field.
 * @param Items.tr - A translation function that takes a string and returns a translated string.
 * @param Items.onChange - A callback function that is called when the value of the autocomplete field changes.
 * @param Items.withContextMenu - Determines whether to show a context menu for the autocomplete field.
 * @returns The Autocomplete component.
 */
export const Items = ({
    value: upperValue,
    disabled,
    readonly,
    description,
    placeholder,
    outlined = false,
    itemList = [],
    freeSolo,
    watchItemList,
    dirty,
    invalid,
    incorrect,
    title,
    tr = (s) => s.toString(),
    onChange,
}: IItemsSlot) => {

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
        itemList = itemList || [];
        const options: string[] = [...new Set(Object.values(typeof itemList === 'function' ? await Promise.resolve(itemList(object, payload)) : itemList))];
        await Promise.all(options.map(async (item) => labels[item] = await Promise.resolve(tr(item, object, payload))));
        if (freeSolo) {
            value.forEach((item) => {
                if (!options.includes(item)) {
                    options.push(item);
                }
            });
        }
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
            if (!watchItemList) {
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

    if (loading || !initComplete.current) {
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

export default Items;
