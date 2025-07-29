/*-
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import { Iconify } from 'src/components/iconify';
import Box from '@mui/material/Box';

import { Button, Card, CardActions, CardContent, CardHeader } from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';


const getIcon = {
  'location': "mingcute:location-fill",
  'info': "ic:outline-info",
  'group': "ic:round-groups-2",
  'man': "ic:round-person",
  'phone': "ic:baseline-add-ic-call",
  'home': "ic:round-apartment",
  'mail': "ic:round-mail-outline"
}

export function AboutSection({ info, value, ...onther }) {
  return (
    <Stack direction="row" spacing={2} >
      <Iconify icon={getIcon[info.icon ? info.icon : 'info']} width={24} />
      <Box sx={{ typography: 'body2' }}>
        {`${info}: `}
        <Link variant="subtitle2" color="inherit">
          {info.type === 'relationship'? info.options.find(e=> e.value === value)?.label: value}
        </Link>
      </Box>
    </Stack>
  )
}
export function ProfileAbout({ studentInfo={}, clickEdit }) {

  return (
      <Card>
          <CardHeader title="אודות" />
          <CardContent>
              <Scrollbar sx={{ height: 320 }}>
                  <Stack spacing={2} sx={{ p: 3 }}>
                      {Object.keys(studentInfo).map(s => <AboutSection info={s} value={studentInfo[s]} />)}
                  </Stack>
              </Scrollbar>
          </CardContent>
          <CardActions>
              <Button
                  fullWidth
                  variant="soft"
                  color="error"
                  size="large"
                  onClick={clickEdit}
                  startIcon={<Iconify icon="solar:user-bold" />}
              >
                  שנה נתונים
              </Button>
          </CardActions>
      </Card>
  );

}
-*/

import { Link } from "react-router-dom";

import { Box, Card, Stack, Button, CardHeader, CardActions, CardContent } from "@mui/material";

import { Iconify } from "src/components/iconify";
import { Scrollbar } from "src/components/scrollbar";

import useInsertStore from "../insert/insert-state.ts";

export function AboutSection({ info, value }) {
  return (
    <Stack direction="row" spacing={2} >
      <Iconify icon='info' width={24} />
      <Box sx={{ typography: 'body2' }}>
        {`${info}: `}
        <Link variant="subtitle2" color="inherit">
          {value}
        </Link>
      </Box>
    </Stack>
  )
}


export function ProfileAbout() {

  const studentInfo = useInsertStore(state => state.studentInfo);
  
  return (
      <Card>
          <CardHeader title="אודות" />
          <CardContent>
              <Scrollbar sx={{ height: 320 }}>
                  <Stack spacing={2} sx={{ p: 3 }}>
                      {Object.keys(studentInfo).map(s => <AboutSection info={s} value={studentInfo[s]} />)}
                  </Stack>
              </Scrollbar>
          </CardContent>
          <CardActions>
              <Button
                  fullWidth
                  variant="soft"
                  color="error"
                  size="large"
                  onClick={()=>{}}
                  startIcon={<Iconify icon="solar:user-bold" />}
              >
                  שנה נתונים
              </Button>
          </CardActions>
      </Card>
  );

}