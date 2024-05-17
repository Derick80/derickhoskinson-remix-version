import { type LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

export async function loader({ request, params }: LoaderFunctionArgs) {

  return json({});
}



export default function nameofroute() {
    const data = useLoaderData<typeof loader>();

    return (
        <div
            className= ''
        >

        </div>
    )
}