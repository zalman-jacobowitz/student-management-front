import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { ProfileView } from 'src/sections/profile/view/profile-view';

// ----------------------------------------------------------------------

const metadata = { title: `פרופיל אישי | ${CONFIG.appName}` };

export default function Page() {
    const { id = '' } = useParams();

    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <ProfileView student_id={id} />
        </>
    );
}
