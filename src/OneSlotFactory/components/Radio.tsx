import * as React from 'react';
import { useCallback, useEffect, useMemo } from 'react';

import { Radio as UiRadio } from '@mantine/core';

import { useOneRadio, useActualValue, IRadioSlot } from 'react-declarative';

export const Radio = ({
    disabled,
    onChange,
    title,
    radioValue,
    value,
    name = '',
}: IRadioSlot) => {
    const [radioMap, setRadioMap] = useOneRadio();
    const radioMap$ = useActualValue(radioMap);

    const checked = useMemo(() => {
        return radioMap[name] === radioValue;
    }, [radioMap]);

    const setValue = useCallback((value: string | null) => setRadioMap((prevRadioMap) => ({
        ...prevRadioMap,
        [name]: value,
    })), []);

    const handleChange = useCallback((value: string | null) => {
        setValue(value);
        onChange(value);
    }, []);

    useEffect(() => {
        const { current: radioMap } = radioMap$;
        if (value !== radioMap[name]) {
            setValue(value);
        }
    }, [value]);

    return (
        <UiRadio
            size="md"
            mt="xs"
            mb="xs"
            checked={checked}
            disabled={disabled}
            onChange={() => handleChange(radioValue || null)}
            label={title}
        />
    );
};

export default Radio;
