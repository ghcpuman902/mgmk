import { getMailboxes, Mailbox } from '../lib/api';
import MailboxCard from './MailboxCard';

export default async function MailboxList() {
  const mailboxes: Mailbox[] = await getMailboxes();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mailboxes.map((mailbox: Mailbox) => (
        <MailboxCard key={mailbox.username} mailbox={mailbox} />
      ))}
    </div>
  )
}