import { ActionFunction, Form, LoaderFunction, useLoaderData } from 'remix'
import { db } from '~/services/db.server'

const getAllUser = async () => {
  await db.$connect()
  const users = db.user.findMany()
  await db.$disconnect()
  return users
}

type GetAllUserFunctionReturn = Awaited<ReturnType<typeof getAllUser>>

export const loader: LoaderFunction = async () => {
  const users = await getAllUser()
  return users
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const user = await db.user.create({
    data: {
      name: (formData.get('name') as string) ?? '',
    },
  })

  return user
}

const Index: React.FC = () => {
  const data = useLoaderData<GetAllUserFunctionReturn>()
  return (
    <div className="my-2">
      <h1 className="text-4xl">Welcome to Remix</h1>
      <Form method="post">
        <input name="name" className="border" required />
        <button>Add</button>
      </Form>
      {data.map((u) => {
        return <p key={u.id}>{u.name}</p>
      })}
    </div>
  )
}

export default Index
