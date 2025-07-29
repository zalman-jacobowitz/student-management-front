/*-
import { toast } from 'sonner';
import { orderBy, set } from 'lodash';
import { useState, useCallback, useEffect } from 'react';

import Fab from '@mui/material/Fab';
import SvgIcon from '@mui/material/SvgIcon';
import ListItemText from '@mui/material/ListItemText';
import { Box, Typography, Button, Icon } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { EmptyContent } from 'src/components/empty-content';

import useCopyPaste from '../base/base-store';

import { BaseScreenToolbar } from '../base/manager-simple-table-toolbar';


function changeBool(newData){
  // for base screen
  return newData.map((item) => ({...item, data: item.data? "100": "0"}))
}



export function ButtonGreen({ value = 90, sx, onClick, ...other }) {
  const [show, setShow] = useState(true);

  return (
    <Fab
      aria-label="Back to top"
      onClick={onClick}
      sx={{
        width: 48,
        height: 48,
        position: 'fixed',
        transform: 'scale(0)',
        right: { xs: 24, md: 32 },
        bottom: { xs: 24, md: 32 },
        zIndex: (theme) => theme.zIndex.speedDial,
        transition: (theme) => theme.transitions.create(['transform']),
        ...(show && { transform: 'scale(1)' }),
        ...sx,
      }}
      {...other}
    >
      <SvgIcon>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path fill="currentColor" fillOpacity={0} strokeDasharray={20} strokeDashoffset={20} d="M12 15h2v-6h2.5l-4.5 -4.5M12 15h-2v-6h-2.5l4.5 -4.5"><animate attributeName="d" begin="0.5s" dur="1.5s" repeatCount="indefinite" values="M12 15h2v-6h2.5l-4.5 -4.5M12 15h-2v-6h-2.5l4.5 -4.5;M12 15h2v-3h2.5l-4.5 -4.5M12 15h-2v-3h-2.5l4.5 -4.5;M12 15h2v-6h2.5l-4.5 -4.5M12 15h-2v-6h-2.5l4.5 -4.5"/><animate fill="freeze" attributeName="fill-opacity" begin="0.7s" dur="0.15s" values="0;0.3"/><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="20;0"/></path><path strokeDasharray={14} strokeDashoffset={14} d="M6 19h12"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" values="14;0" /></path></g>
      </SvgIcon>
    </Fab>
  );
}


export function BaseListView({table, mutateAsync
}) {
    return <BaseViewScreen oldData={table.map(e=> ({...e, id: `${e.day}-${e.event}`}))} mutateAsync={mutateAsync}/>

    }

function useBaseViewScreen(oldData, mutateAsync) {
    
    const [filters, setFilters] = useState({'שם_מלא': '', 'data': {value: 'all', label: 'הצג הכל'}});
    
    const update = useBoolean(!oldData.length);

    const [newData, setNewData] = useState(oldData);

    const handleFilters = useCallback(
        (name, value) => {

          setFilters((prevState) => ({
            ...prevState,
            [name]: value,
          }));
        },
        [setFilters]
      );
    
    const [sortBy, setSortBy] = useState({'value': 'עולה', 'label': 'סדר עולה'});
    
    const dataFiltered = applyFilters({
        inputData: newData || [],
        comparator: (a, b) => a - b,
        filters,
        sortBy
    })
      
    // const infoColumn = useGetInfoColumns();
    
    const canReset = false;
    
    const isSubmitting = useBoolean();
    
    const notFound = !oldData.length && canReset;

    const onClickStudent = (id) => {
        setNewData(prevItems =>
          prevItems.map(item => {
            if (item.id === id) {
              return { ...item, data: !item.data };
            }
            return item;
          })
        );
      };

    const updateToServer = useCallback(async (mode="update") => {
        const promise = mutateAsync(changeBool(newData), mode);
        try {
            toast.promise(promise, {
                loading: 'מעדכן...',
                success: 'העדכון הצליח!',
                error: 'העידכון נכשל!',
            });
            await promise;
        } catch (error) {
            console.error(error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newData]);

    const { makeCopy, makePaste} = useCopyPaste()

    const handleCopy = useCallback(
        () => {
          makeCopy(newData)
        },
        [makeCopy, newData]
      );
    const handlePaste = useCallback(
        () => {
          const newDataPaste = newData.map((item) => {
            const existingItem = makePaste.find((i) => i.id === item.id);
            if (item) {
              return { ...item, data: existingItem.data };
            }
            return item;
          });
          makeCopy([])
          setNewData(newDataPaste);
          
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [newData, makeCopy ]
      );

    return {
        newData,
        notFound,
        updateToServer,
        onClickStudent,
        isSubmitting,
        update,
        handleFilters,
        filters,
        dataFiltered,
        setSortBy,
        sortBy,
        setNewData,
        //
        handleCopy,
        handlePaste,
        makePaste
    };
}


export function BaseItem({ student, onClickStudent}) {
    return (

      <Button
      
        color={student.data? 'primary' : 'paper'}
        disabled={!typeof student.data === 'boolean'} variant='soft'
        onClick={() => {
          onClickStudent(student.id)
        }}>

        <ListItemText
          key={student.id}
          primary={student.event}
          secondary={student.יום_מלא}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
  
      </Button>

    );
  }

function BaseViewScreen({oldData, mutateAsync
 }) {
    const {
        newData,
        notFound,
        updateToServer,
        onClickStudent,
        isSubmitting,
        update,
        handleFilters,
        filters,
        dataFiltered,
        setSortBy,
        sortBy,
        setNewData,
        //
        handleCopy,
        handlePaste,
        makePaste

    } = useBaseViewScreen(oldData, mutateAsync);
    
    
    return (
        <DashboardContent>
          <>
            <Box sx={{ mb: 2, textAlign: 'center' }}>
              <Label color="success" sx={{ textTransform: 'capitalize' }}>
              {newData.filter((item) => item.data).length} נוכחים
              </Label>
              <Label icon="solar:cross-bold" color="error" sx={{ textTransform: 'capitalize', ml: 1 }}>
                {newData.filter((item) => !item.data).length} חסרים
              </Label>
              <Label sx={{ textTransform: 'capitalize',  ml: 1  }}>
                מתוך {newData.length} 
              </Label>
            </Box>
            <ButtonGreen onClick={()=>updateToServer("update")}/>
          </>

            <BaseScreenToolbar
                onDelete={()=>updateToServer('delete')}
                newData={newData}
                setNewData={setNewData}
                handleCopy={handleCopy}
                handlePaste={handlePaste}
                previousData={makePaste}
                handleReset={()=>{}}
                handleFilters={handleFilters}
                filters={filters}
                onResetPage={null}
                sortBy={sortBy}
                setSortBy={setSortBy}
                options={{ roles: [] }}
            />
            {notFound && <EmptyContent title="לא נמצאו תלמידים" filled sx={{ py: 10 }} />}
            <Box
            gap={1}
            display="grid"
            gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
            }}
            >
            {dataFiltered.map((student) => (
              <BaseItem
                key={student.id}
                student={student}
                onClickStudent={onClickStudent}
                />
            ))}
          </Box>
        </DashboardContent>
    );
}

function applyFilters({ inputData, comparator, filters, sortBy }) {

  const {שם_מלא, data } = filters
  if (שם_מלא) {
    inputData = inputData.filter(
      (user) => user.שם.toLowerCase().indexOf(שם_מלא.toLowerCase()) !== -1 ||
        user.משפחה.toLowerCase().indexOf(שם_מלא.toLowerCase()) !== -1
    );
  }
  if (data.value) {
      if (data.value !== 'all') {
          inputData = inputData.filter((student) => String(student.data) === data.value)
      } 
  }
  if (sortBy.value === 'יורד') {
      inputData = orderBy(inputData, ['משפחה'], ['desc']);
  }

  else if (sortBy.value === 'עולה') {
      inputData = orderBy(inputData, ['משפחה'], ['asc']);
  }

  else if (sortBy.value === 'שם') {
      inputData = orderBy(inputData, ['שם'], ['asc']);
  }
  
  const stabilizedThis = inputData.map((el, index) => [el, index])
  
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  
  inputData = stabilizedThis.map((el) => el[0]); 

  return inputData;
}

-*/