
import { type LoaderFunctionArgs, json } from '@remix-run/node';

export async function loader({ request, params }: LoaderFunctionArgs) {

  return json({
    message: 'Hello World',
  });
}