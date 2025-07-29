import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import InsertViewWrapper from 'src/sections/insert/view/insert-view.tsx';


// ----------------------------------------------------------------------

const metadata = { title: `ניהול |  ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <InsertViewWrapper />
        </>
    );
}
