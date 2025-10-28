import { InfoColumn } from "src/serverTypes";
import { columnsTypes } from "src/utils/uinqe_usege/columnsTypes";

const chips = {
  type: {
    ...columnsTypes
  },
  hidden: {
    1: {
      label: 'מוסתר',
      color: 'error',
      icon: 'solar:eye-closed-bold'
    },
    0: {
      label: 'גלוי',
      color: 'success',
      icon: 'solar:eye-bold'
    }
  },
  required: {
    1: {
      label: 'חובה',
      color: 'warning',
      icon: 'solar:danger-bold'
    },
    0: {
      label: 'אופציונלי',
      color: 'default',
      icon: 'solar:check-circle-bold'
    }
  },
  filters: {
    'extra': {
      label: 'פילטר נגיש',
      color: 'info',
      icon: 'solar:verified-check-bold'
    },
    'regular': {
      label: 'פילטר רגיל',
      color: 'default',
      icon: 'solar:filter-bold'
    }
  },
  group_name: {
    'primary': {
      label: 'ראשי',
      color: 'primary',
      icon: 'solar:star-bold'
    },
    'secondary': {
      label: 'משני',
      color: 'secondary',
      icon: 'solar:bookmark-bold'
    }
  }
};

export function formatColumn(column: InfoColumn) {
  
  const formatted = {
    ...column,
    hidden: Number(column.hidden) ? 1 : 0,
    required: Number(column.required) ? 1 : 0
  };
  // Format the column as needed
  return formatted;
}

export function getChips(column: InfoColumn){
  const tags = {}
  const formatedColumn = formatColumn(column);
  // eslint-disable-next-line array-callback-return
  Object.keys(formatedColumn).map((key) => {
    const chip = chips[key];
    if (chip){
      const value = chip[formatedColumn[key]];
      if (value) {
        tags[key] = value;
      }
    }
  });
  return tags
}
