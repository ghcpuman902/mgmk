interface MailboxAttributes {
  force_pw_update: string;
  tls_enforce_in: string;
  tls_enforce_out: string;
  sogo_access: string;
  imap_access: string;
  pop3_access: string;
  smtp_access: string;
  sieve_access: string;
  relayhost: string;
  passwd_update: string;
  mailbox_format: string;
  quarantine_notification: string;
  quarantine_category: string;
}

interface MailboxRL {
  value: string;
  frame: string;
}

export interface Alias {
  id: number;
  domain: string;
  public_comment: string | null;
  private_comment: string | null;
  goto: string;
  address: string;
  is_catch_all: number;
  active: number;
  active_int: number;
  sogo_visible: number;
  sogo_visible_int: number;
  created: string;
  modified: string | null;
}

export interface Mailbox {
  username: string;
  active: number;
  active_int: number;
  domain: string;
  name: string;
  local_part: string;
  quota: number;
  messages: number;
  attributes: MailboxAttributes;
  custom_attributes: Record<string, string>[];
  quota_used: number;
  percent_in_use: number;
  created: string;
  modified: string;
  percent_class: string;
  last_imap_login: number;
  last_smtp_login: number;
  last_pop3_login: number;
  max_new_quota: number;
  spam_aliases: number;
  pushover_active: number;
  rl: MailboxRL;
  rl_scope: string;
  is_relayed: number;
  aliases?: Alias[];
}

export async function getMailboxes(): Promise<Mailbox[]> {
  const [mailboxesResponse, aliasesResponse] = await Promise.all([
    fetch('https://mail.mg.mk/api/v1/get/mailbox/all/e.mg.mk', {
      headers: {
        'X-API-Key': 'esUq5a633qa1z2Lsjrr1rBClia91-Fwx',
        'Accept': 'application/json',
      },
    }),
    fetch('https://mail.mg.mk/api/v1/get/alias/all', {
      headers: {
        'X-API-Key': 'esUq5a633qa1z2Lsjrr1rBClia91-Fwx',
        'Accept': 'application/json',
      },
    }),
  ]);

  if (!mailboxesResponse.ok || !aliasesResponse.ok) {
    throw new Error('Failed to fetch mailboxes or aliases');
  }

  const [mailboxes, aliases] = await Promise.all([
    mailboxesResponse.json(),
    aliasesResponse.json(),
  ]);

  // Group aliases by their goto address
  const aliasesByGoto = aliases.reduce((acc: { [key: string]: Alias[] }, alias: Alias) => {
    if (!acc[alias.goto]) {
      acc[alias.goto] = [];
    }
    acc[alias.goto].push(alias);
    return acc;
  }, {});

  // Attach aliases to their respective mailboxes
  return mailboxes.map((mailbox: Mailbox) => ({
    ...mailbox,
    aliases: aliasesByGoto[mailbox.username] || [],
  }));
}