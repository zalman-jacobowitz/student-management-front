import { paths } from "src/routes/paths";

export const manager = {
  type: 'manager',
  'sort': {
    'name_table': 'table_times',
    'columns': ['day', 'start'],
    'func': (a, b) => {
      // sort by day
      if (a.day < b.day) return -1;
      if (a.day > b.day) return 1;
      // sort by time
      if (a.start < b.start) return -1;
      if (a.start > b.start) return 1;
      return 0;
    }
  },
  names: {
    'topic': 'event',
    'day': 'day',
    'id': 'student_id',
    'data': 'data'
  },
  columns:
    [
      { id: 'משפחה', label: 'שם', width: 80 },
      { id: 'data', label: 'נוכחות', width: 40 },
      { id: 'summeryQday', label: 'היום', width: 60 },
      { id: 'summeryQall', label: 'ממוצע', width: 60 },

    ],
  links: [
    {
      name: 'ניהול',
      href: paths.dashboard.root,
    },
    {
      name: 'נוכחות',
      href: paths.dashboard.root,
    },
    {
      name: 'תצוגה',
    },
  ],
  info_columns: 'info',
  'local_key': 'seder',
  'table_name': 'table_summery',
  'topic_chart': 'by_seder',
  'day_chart': 'by_day',


}
export const profile_config = {
  type: 'data',
  pivot: 'profile_pivot',
  group_by: 'profile_group_by',
  group_sum: 'profile_group_sum',
  names: {
    'topic': 'event',
    'day': 'day',
    'id': 'student_id',
    'data': 'data'
  },
}

export const profile_test_config = {
  type: 'test',
  pivot: 'test_profile_pivot',
  group_by: 'test_profile_group_by',
  group_sum: 'test_profile_group_sum',
  names: {
    'topic': 'testQנושא',
    'day': 'testQיום',
    'id': 'testQid',
    'data': 'testQציון'
  },
}






export const test = {
  type: 'test',
  'sort': {
    'name_table': 'test_times',
    'columns': ['testQיום'],
    'func': (a, b) => {
      // sort by day
      if (a.testQיום < b.testQיום) return -1;
      if (a.testQיום > b.testQיום) return 1;
      return 0;
    }
  },
  info_columns: 'test',
  links: [
    {
      name: 'ניהול',
      href: paths.dashboard.root,
    },
    {
      name: 'נוכחות',
      href: paths.dashboard.invoice.root,
    },
    {
      name: 'תצוגה',
    },
  ],
  names: {
    'topic': 'testQנושא',
    'day': 'testQיום',
    'id': 'testQid',
    'data': 'testQציון'
  },
  columns:
    [
      { id: 'testQמשפחה', label: 'שם', width: 80 },
      { id: 'testQציון', label: 'ציון', width: 40 },
      { id: 'summeryQseder', label: 'סדר', width: 40 },
      { id: 'summeryQall', label: 'ממוצע', width: 40 },
    ],

  'local_key': 'test_info',
  'table_name': 'test_summery',
  'topic_chart': 'test_seder',
  'day_chart': 'test_by_day',

}

export const test_form = {
  table: 'test_group',
  names: {
    'topic': 'testQנושא',
    'day': 'testQיום',
    'id': 'testQid',
    'data': 'testQציון'
  },
  local: 'test'
}


export const config_form = {
  'type': 'test',
  'table': 'test',
  names: {
    'topic': 'testQנושא',
    'day': 'testQיום',
    'id': 'testQid',
    'data': 'testQציון'
  },
  text_form: {
    type: 'סוג מבחן',
    group: "קבוצת תלמידים",
    which: ''
  },
  form_options: ['גירסא', 'עיונא', 'מבחן כללי', 'הלכה'],
  default_value: '',
  local: 'test',
  local_table: 'test',
  text: {
    title: 'הוסף מבחן חדש',
    'links': [
      {
        name: 'ראשי',
        href: paths.dashboard.root,
      },
      {
        name: 'מבחנים',
        href: paths.dashboard.invoice.root,
      },
      {
        name: 'הוספה',
      },
    ],
    alerts: {
      'exists': 'ישנם נתונים על מבחן זה, השתמש ב- ',
      'filter_table': 'הטבלה מוכנה להכנסת ציונים!'
    },
    empty: "מלא טופס להוספת מבחן"

  }
}
export const config_form_manager = {
  'type': 'manager',
  'table': 'data_students',
  local_table: 'data',
  names: {
    'topic': 'event',
    'day': 'day',
    'id': 'student_id',
    'data': 'data'
  },
  text_form: {
    type: 'סדר',
    group: "קבוצת תלמידים",
    which: ''
  },
  form_options: ['גירסא', 'עיונא', 'חסידות בוקר', 'שיעור עיונא', 'תפילה'],
  default_value: '0',
  local: 'manager_l',
  text: {
    title: 'הוסף סדר חדש',
    'links': [
      {
        name: 'ראשי',
        href: paths.dashboard.root,
      },
      {
        name: 'סדרים',
        href: paths.dashboard.invoice.root,
      },
      {
        name: 'הוספה',
      },
    ],
    alerts: {
      'exists': 'ישנם נתונים על סדר זה, השתמש ב- ',
      'filter_table': 'הטבלה מוכנה להכנסת נתונים!'
    },
    empty: "מלא טופס להוספת סדר"

  }
}

