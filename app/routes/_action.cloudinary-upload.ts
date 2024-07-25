import { type ActionFunctionArgs, json } from '@remix-run/node'

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData()
  console.log(Object.fromEntries(formData))

  return json({
    message: 'File uploaded successfully'
  })
}
