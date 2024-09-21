import { Suspense } from 'react'
import MailboxList from '../components/MailboxList'
import Loading from '../components/Loading'

export const revalidate = 60

export default async function Home() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-purple-400">
        📬 Mailbox Dashboard
      </h1>
      <Suspense fallback={<Loading />}>
        <MailboxList />
      </Suspense>
    </div>
  )
}