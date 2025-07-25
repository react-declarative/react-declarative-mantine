import * as React from "react";

import { Slider as UiSlider } from '@mantine/core';

import { ISliderSlot } from 'react-declarative';

export const Slider = ({
  disabled,
  value,
  onChange,
  minSlider,
  maxSlider,
  sliderSteps,
  labelFormatSlider,
}: ISliderSlot) => {
  return (
    <UiSlider
      size="md"
      mt="xs"
      mb="xs"
      style={{
        opacity: disabled ? 0.5 : undefined,
      }}
      label={labelFormatSlider}
      value={value}
      min={minSlider}
      max={maxSlider}
      disabled={disabled}
      marks={sliderSteps}
      onChange={(value) => onChange(value)}
    />
  );
};

export default Slider;
