import * as React from "react";

import { Switch as UiSwitch } from '@mantine/core';

import { ISwitchSlot } from 'react-declarative';

export const Switch = ({
  disabled,
  value,
  onChange,
  title,
}: ISwitchSlot) => {
  return (
    <UiSwitch
      size="md"
      mt="xs"
      mb="xs"
      style={{
        opacity: disabled ? 0.5 : undefined,
      }}
      checked={Boolean(value)}
      disabled={disabled}
      onChange={() => onChange(!value)}
      label={title}
    />
  );
};

export default Switch;
