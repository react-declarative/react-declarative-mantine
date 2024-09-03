import { FieldType, One, TypedField } from "react-declarative";

const fields: TypedField[] = [
  {
    type: FieldType.Component,
    style: {
      justifyContent: 'center',
      width: '100%',
      height: 125,
    },
    element: () => (
      <h2>
        Adaptive columns
      </h2>
    ),
  },
  {
    type: FieldType.Group,
    style: {
      width: '100%',
    },
    fields: [
      {
        type: FieldType.Group,
        style: {
          width: '100%',
        },
        fields: [
          {
            type: FieldType.Group,
            fields: [
              {
                type: FieldType.Component,
                style: {
                  width: '100%',
                },
                element: () => (
                  <h2>
                    FieldType.Text
                  </h2>
                ),
              },
              {
                type: FieldType.Text,
                name: 'text',
                title: 'Text',
                description: 'Single line',
              },
              {
                type: FieldType.Text,
                validation: {
                  required: true,
                },
                dirty: true,
                name: 'text_invalid',
                title: 'Text',
                description: 'Invalid',
              },
              {
                type: FieldType.Text,
                inputRows: 3,
                name: 'text',
                title: 'Text',
                description: 'Multi line',
              },
            ],
          },
          {
            type: FieldType.Group,
            fields: [
              {
                type: FieldType.Component,
                style: {
                  width: '100%',
                },
                element: () => (
                  <h2>
                    FieldType.Combo
                  </h2>
                ),
              },
              {
                type: FieldType.Combo,
                itemList: [
                  'Test 1',
                  'Test 2',
                  'Test 3',
                ],
                name: 'combo',
                title: 'Combo',
                placeholder: 'combo',
                description: 'Default',
              },
              {
                type: FieldType.Combo,
                noDeselect: true,
                itemList: [
                  'Test 1',
                  'Test 2',
                  'Test 3',
                ],
                validation: {
                  required: true,
                },
                dirty: true,
                name: 'combo_invalid',
                title: 'Combo',
                placeholder: 'combo',
                description: 'Invalid',
              },
              {
                type: FieldType.Combo,
                noDeselect: true,
                itemList: [
                  'Test 1',
                  'Test 2',
                  'Test 3',
                ],
                name: 'combo',
                title: 'Combo',
                placeholder: 'combo',
                description: 'No deselect',
              },
            ],
          },
          {
            type: FieldType.Group,
            fields: [
              {
                type: FieldType.Component,
                element: () => (
                  <h2>
                    FieldType.Items
                  </h2>
                ),
              },
              {
                type: FieldType.Items,
                itemList: [
                  'Test 1',
                  'Test 2',
                  'Test 3',
                ],
                name: 'items',
                title: 'Items',
                placeholder: 'items',
                description: 'Default',
              },
              {
                type: FieldType.Items,
                noDeselect: true,
                itemList: [
                  'Test 1',
                  'Test 2',
                  'Test 3',
                ],
                validation: {
                  required: true,
                },
                dirty: true,
                name: 'items_invalid',
                title: 'Items',
                placeholder: 'items',
                description: 'Invalid',
              },
              {
                type: FieldType.Items,
                noDeselect: true,
                itemList: [
                  'Test 1',
                  'Test 2',
                  'Test 3',
                ],
                name: 'items',
                title: 'Items',
                placeholder: 'items',
                description: 'No deselect',
              },
            ],
          },
          {
            type: FieldType.Group,
            fields: [
              {
                type: FieldType.Component,
                style: {
                  width: '100%',
                },
                element: () => (
                  <h2>
                    FieldType.YesNo
                  </h2>
                ),
              },
              {
                type: FieldType.YesNo,
                name: 'yesno',
                title: 'YesNo',
                placeholder: 'yesno',
                description: 'Default',
              },
              {
                type: FieldType.YesNo,
                noDeselect: true,
                validation: {
                  required: true,
                },
                dirty: true,
                name: 'yesno_invalid',
                title: 'YesNo',
                placeholder: 'yesno',
                description: 'Invalid',
              },
              {
                type: FieldType.YesNo,
                noDeselect: true,
                name: 'yesno',
                title: 'YesNo',
                placeholder: 'yesno',
                description: 'No deselect',
              },
            ]
          },
        ]
      },
      {
        type: FieldType.Group,
        style: {
          width: '100%',
        },
        fields: [
          {
            type: FieldType.Group,
            fields: [
              {
                type: FieldType.Component,
                style: {
                  width: '100%',
                },
                element: () => (
                  <h2>
                    FieldType.Radio
                  </h2>
                ),
              },
              {
                type: FieldType.Radio,
                name: 'radio',
                radioValue: '1',
                title: 'Radio 1',
              },
              {
                type: FieldType.Radio,
                name: 'radio',
                radioValue: '2',
                title: 'Radio 2',
              },
              {
                type: FieldType.Radio,
                name: 'radio',
                radioValue: '3',
                title: 'Radio 3',
              },
            ],
          },
          {
            type: FieldType.Group,
            fields: [
              {
                type: FieldType.Component,
                style: {
                  width: '100%',
                },
                element: () => (
                  <h2>
                    FieldType.Switch
                  </h2>
                ),
              },
              {
                type: FieldType.Switch,
                name: 'switch',
              },
              {
                type: FieldType.Switch,
                name: 'switch',
              },
              {
                type: FieldType.Switch,
                name: 'switch',
              },
            ],
          },
          {
            type: FieldType.Group,
            fields: [
              {
                type: FieldType.Component,
                style: {
                  width: '100%',
                },
                element: () => (
                  <h2>
                    FieldType.Checkbox
                  </h2>
                ),
              },
              {
                type: FieldType.Checkbox,
                name: 'checkbox1',
              },
              {
                type: FieldType.Checkbox,
                name: 'checkbox2',
              },
              {
                type: FieldType.Checkbox,
                name: 'checkbox2',
              },
            ],
          },
        ]
      },
    ],
  },
  {
    type: FieldType.Component,
    style: {
      justifyContent: 'center',
      width: '100%',
      height: 125,
    },
    element: () => (
      <h2>
        Adaptive form
      </h2>
    ),
  },
  {
    type: FieldType.Group,
    style: {
      width: '100%',
    },
    fields: [
      {
        type: FieldType.Text,
        inputRows: 3,
        name: 'text',
        title: 'Text',
        description: 'Multi line',
      },
      {
        type: FieldType.Text,
        name: 'text',
        title: 'Text',
        description: 'Single line',
      },
      {
        type: FieldType.Text,
        name: 'text',
        title: 'Text',
        description: 'Single line',
      },
      {
        type: FieldType.Text,
        name: 'text',
        title: 'Text',
        description: 'Single line',
      },
      {
        type: FieldType.Text,
        name: 'text',
        title: 'Text',
        description: 'Single line',
      },
      {
        type: FieldType.Text,
        name: 'text',
        title: 'Text',
        description: 'Single line',
      },
    ],
  },
];

export const App = () => (
  <One fields={fields} />
);

export default App;
