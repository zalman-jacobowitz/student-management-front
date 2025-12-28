// core (MUI)
import {
  frFR as frFRCore,
  heIL as heILCore,
  viVN as viVNCore,
  zhCN as zhCNCore,
  arSA as arSACore,
  enUS as enUSCore,
} from '@mui/material/locale';
// date pickers (MUI)
import {
  enUS as enUSDate,
  frFR as frFRDate,
  viVN as viVNDate,
  heIL as heILDate,
  zhCN as zhCNDate,
} from '@mui/x-date-pickers/locales';
// data grid (MUI)
import {
  enUS as enUSDataGrid,
  frFR as frFRDataGrid,
  viVN as viVNDataGrid,
  zhCN as zhCNDataGrid,
  heIL as heILDataGrid,
  arSD as arSDDataGrid,
} from '@mui/x-data-grid/locales';

// ----------------------------------------------------------------------

export const allLangs = [
  {
    value: 'en',
    label: 'English',
    countryCode: 'GB',
    adapterLocale: 'en',
    numberFormat: { code: 'en-US', currency: 'USD' },
    systemValue: {
      components: { ...enUSDate.components, ...enUSDataGrid.components },
    },
  },
  {
    value: 'fr',
    label: 'French',
    countryCode: 'FR',
    adapterLocale: 'fr',
    numberFormat: { code: 'fr-Fr', currency: 'EUR' },
    systemValue: {
      components: { ...frFRCore.components, ...frFRDate.components, ...frFRDataGrid.components },
    },
  },
  {
    value: 'he',
    label: 'Hebrew',
    countryCode: 'IL',
    adapterLocale: 'he',
    numberFormat: { code: 'he-IL', currency: 'ILS' },
    systemValue: {
      components: { ...heILCore.components, ...heILDate.components, ...heILDataGrid.components },
    },
  },
  {
    value: 'yi',
    label: 'Yiddish',
    countryCode: 'IL',
    adapterLocale: 'he',
    numberFormat: { code: 'he-IL', currency: 'ILS' },
    systemValue: {
      components: { ...heILCore.components, ...heILDate.components, ...heILDataGrid.components },
    },
  },
];

/*

 * Country code:
 * https://flagcdn.com/en/codes.json
 *
 * Number format code:
 * https://gist.github.com/raushankrjha/d1c7e35cf87e69aa8b4208a8171a8416

*/

// PLEASE REMOVE `LOCAL STORAGE` WHEN YOU CHANGE SETTINGS.
// ----------------------------------------------------------------------

