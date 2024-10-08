import * as React from 'react';

import { Checkbox as UiCheckBox } from '@mantine/core';

import { ICheckBoxSlot } from 'react-declarative';

export const CheckBox = ({
    disabled,
    onChange,
    title,
    value,
}: ICheckBoxSlot) => (
    <UiCheckBox
        size="md"
        mt="xs"
        mb="xs"
        disabled={disabled}
        style={{
            opacity: disabled ? 0.5 : undefined,
        }}
        checked={Boolean(value)}
        onChange={() => onChange(!value)}
        label={title}
    />
);

export default CheckBox;
