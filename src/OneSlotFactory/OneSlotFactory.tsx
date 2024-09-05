import * as React from 'react';

import { OneSlotFactory as OneSlotFactoryInternal } from 'react-declarative';

import Combo from './components/Combo';
import Items from './components/Items';
import Text from './components/Text';
import YesNo from './components/YesNo';
import Choose from './components/Choose';
import Complete from './components/Complete';
import Date from './components/Date';
import Tree from './components/Tree';
import Time from './components/Time';
import ComboArray from './components/ComboArray';
import Switch from './components/Switch';
import Radio from './components/Radio';
import CheckBox from './components/CheckBox';

interface IOneSlotFactoryProps {
    children: React.ReactNode;
}

export const defaultSlots = {
    Choose,
    Combo,
    ComboArray,
    Complete,
    Date,
    Items,
    Text,
    Time,
    Tree,
    YesNo,
    Switch,
    Radio,
    CheckBox,
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
