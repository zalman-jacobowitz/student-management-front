// Button.stories.js
import { ButtonStory } from './Button';
import { initialize, mswDecorator } from 'msw-storybook-addon';
import { handlers } from 'src/actions/moks/handlers';
import { info_columns, info_students } from 'src/actions/moks/mokes';
import { StudentsSimpleTable } from 'src/sections/students/students-simple-table';
import { StudentsSimpleTableRow } from 'src/sections/students/students-simple-table-row';

export default {
  title: 'מערכת/רשימת תלמידים',
  component: ButtonStory,
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers,
    },
  },
  decorators: [mswDecorator],
};

export const Primary = {
  name: 'טבלה רגילה',
  args: {},
};
