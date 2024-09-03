import * as React from 'react';

import { OneSlotFactory as OneSlotFactoryInternal } from 'react-declarative';

import CheckBox from './components/CheckBox';
import Combo from './components/Combo';
import Items from './components/Items';
import Radio from './components/Radio';
import Text from './components/Text';
import Switch from './components/Switch';
import YesNo from './components/YesNo';
import Choose from './components/Choose';
import Complete from './components/Complete';
import Icon from './components/Icon';
import Date from './components/Date';
import Slider from './components/Slider';
import Tree from './components/Tree';
import Time from './components/Time';

interface IOneSlotFactoryProps {
    children: React.ReactNode;
}

export const defaultSlots = {
    CheckBox,
    Choose,
    Combo,
    Complete,
    Date,
    Icon,
    Items,
    Radio,
    Slider,
    Switch,
    Text,
    Time,
    Tree,
    YesNo,
};

export const OneSlotFactory = ({
    children
}: IOneSlotFactoryProps) => (
    <OneSlotFactoryInternal
        {...defaultSlots}
    >
        {children}
    </OneSlotFactoryInternal>
);

export default OneSlotFactory;
