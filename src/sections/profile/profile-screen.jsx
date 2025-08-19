/*-
import { useState, useCallback, useEffect } from 'react';

import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Tabs, { tabsClasses } from '@mui/material/Tabs';



import { Iconify } from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';

import { useGetTable } from 'src/actions/table';

import { ProfileHomeStudent } from './profile-main';

import { BaseListView } from './base-screen';
import { ProfileCover } from './profile-cover';

// ----------------------------------------------------------------------

const TABS = [
    {
        value: 'נוכחות',
        label: 'נוכחות',
        icon: <Iconify icon="solar:user-id-bold" width={24} />,
    },
    {
        value: 'ציונים',
        label: 'ציונים',
        icon: <Iconify icon="solar:heart-bold" width={24} />,
    }
];



// ----------------------------------------------------------------------


function useTamplateEvents(studentData, studentsInfo, student_id){
    const list_of_events = useGetTable('list_of_events', [...studentsInfo].map(e=>e.student_id))
    
    if (list_of_events.data) {
        // eslint-disable-next-line array-callback-return, consistent-return
        return list_of_events.data.map(event => {
            const oldData = studentData.find(e => e.event === event.event && e.day === event.day)
            if (oldData) {
                event.data = oldData.data;
            return {...event, student_id, data: event.data || false}
            }})


       
    }


    return null;
}


export function ProfileViewScreen({ studentData , studentInfo={}, studentsInfo, mutateAsync }) {
    
    const tamplateEvents = useTamplateEvents(studentData, studentsInfo, studentInfo.student_id);

    const settings = useSettingsContext();

    const [currentTab, setCurrentTab] = useState('נוכחות');

    const handleChangeTab = useCallback((event, newValue) => {
        setCurrentTab(newValue);
    }, []);

    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <Card
                sx={{
                    mb: 3,
                    height: 290,
                }}
            >

                <ProfileCover
                    sec={studentInfo.כתובת_מגורים}
                    name={`${studentInfo.שם} ${studentInfo.משפחה}`}
                    avatarUrl=''
                    coverUrl=''
                />
                <Tabs
                    value={currentTab}
                    onChange={handleChangeTab}
                    sx={{
                        width: 1,
                        bottom: 0,
                        zIndex: 9,
                        position: 'absolute',
                        bgcolor: 'background.paper',
                        [`& .${tabsClasses.flexContainer}`]: {
                            pr: { md: 3 },
                            justifyContent: {
                                sm: 'center',
                                md: 'flex-end',
                            },
                        },
                    }}
                >
                    {TABS.map((tab) => (
                        <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
                    ))}
                </Tabs>
            </Card>

            {currentTab === 'נוכחות' && tamplateEvents &&
            <ProfileHomeStudent
                studentData={tamplateEvents}
                studentInfo={studentInfo}
            />
            }
            {currentTab === 'ציונים' && tamplateEvents && 
                <BaseListView table={tamplateEvents} mutateAsync={mutateAsync}/>}
        </Container>
    );
}
-*/

import { useState, useCallback, Suspense } from "react";

import { Tab, Card, Tabs, Container, tabsClasses } from "@mui/material";

import { Iconify } from "src/components/iconify";
import { useSettingsContext } from "src/components/settings";

import { ProfileCover } from "./profile-cover";
import { ProfileDataMain } from "./profile-main";
import useInsertStore from "../insert/insert-state.ts";
import { LoadingScreen } from "src/components/loading-screen/loading-screen.tsx";
import { useSuspenseQuery } from "@tanstack/react-query";
import { apiInfoStudents } from "src/actions/info_students.ts";
import { apiProfile } from "src/actions/profile.ts";
import { ProfileListView } from "./profile-list.tsx";

const TABS = [
    {
        value: 'נוכחות',
        label: 'נוכחות',
        icon: <Iconify icon="solar:user-id-bold" width={24} />,
    },
    {
        value: 'ציונים',
        label: 'ציונים',
        icon: <Iconify icon="solar:heart-bold" width={24} />,
    }
];
// ----------------------------------------------------------------------

function ProfileTabs({ currentTab, handleChangeTab }) {
    return (
        <Tabs
            value={currentTab}
            onChange={(evnt, tab) => handleChangeTab(tab)}
            sx={{
                width: 1,
                bottom: 0,
                zIndex: 9,
                position: 'absolute',
                bgcolor: 'background.paper',
                [`& .${tabsClasses.flexContainer}`]: {
                    pr: { md: 3 },
                    justifyContent: {
                        sm: 'center',
                        md: 'flex-end',
                    },
                },
            }}
        >
            {TABS.map((tab) => (
                <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
            ))}
        </Tabs>
    );
}

export function ProfileTabsContant({tab, studentInfo, dataStudents}) {
    switch (tab) {
        case 'נוכחות':
            return <ProfileDataMain studentInfo={studentInfo} dataStudents={dataStudents} />;
        case 'ציונים':
            return <ProfileListView currentData={dataStudents} />;
        default:
            return null;
    }
}

export function ProfileViewScreen({studentId}) {

    const infoStudents = useSuspenseQuery(apiInfoStudents());
    const dataStudents = useSuspenseQuery(apiProfile(studentId));

    const studentInfo = infoStudents.data.find(e => e.student_id === studentId) || {};
    console.log({studentInfo});
    const studentData = dataStudents.data || [];

    const settings = useSettingsContext();

    const [currentTab, setCurrentTab] = useState('נוכחות');
    
    const handleChangeTab = useCallback((event, newValue) => {
        setCurrentTab(newValue);
    }, []);
    
    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <Card sx={{ mb: 3, height: 290 }}>
                <ProfileCover studentInfo={studentInfo} />
                <ProfileTabs
                    currentTab={currentTab}
                    handleChangeTab={setCurrentTab}
                />
            </Card>
            <ProfileTabsContant tab={currentTab} studentInfo={studentInfo} dataStudents={studentData}/>
        </Container>
    );
}


