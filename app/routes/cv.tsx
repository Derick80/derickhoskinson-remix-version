import { type LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getMDXPage } from '~/.server/mdx.server';
import { useMdxComponent } from '~/lib/mdx-functions';

export async function loader({ request, params }: LoaderFunctionArgs) {
    const cv = await getMDXPage('resume');
    return json({ cv });

}

export default function CvRoute () {
    const data = useLoaderData<typeof loader>();
    const Component = useMdxComponent(data.cv.code);
    return (
        <div>
            <h1>
                Hello world!
            </h1>
            <Component />
        </div>
    );
}