import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { formatBytes, formatDate } from '../lib/utils'
import { Mailbox, Alias } from '../lib/api';

interface MailboxCardProps {
  mailbox: Mailbox;
}

export default function MailboxCard({ mailbox }: MailboxCardProps) {
  const {
    username,
    name,
    active,
    quota,
    quota_used,
    percent_in_use,
    messages,
    created,
    modified,
    last_imap_login,
    last_smtp_login,
    last_pop3_login,
    attributes,
    rl,
    rl_scope,
    is_relayed,
    aliases,
  } = mailbox

  const activeClass = active === 1 ? 'border-green-500' : 'border-red-500'

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-lg bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 border-2 ${activeClass}`}>
      <CardHeader className="bg-gradient-to-r from-purple-900 to-blue-900 p-4">
        <CardTitle className="flex flex-col">
          <span className="text-xl font-bold truncate">{name || username.split('@')[0]}</span>
          <span className="text-sm font-normal opacity-80">{username}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Storage Usage</span>
          <span className="text-sm font-semibold text-purple-300">{formatBytes(quota_used)} / {formatBytes(quota)}, {Math.round(quota_used/quota*10000)/100}%</span>
        </div>
        <Progress value={ quota_used === 0 ? 0 : Math.max(percent_in_use * 100, 0.5) } className="w-full bg-gray-700 [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-blue-500" />
        <div className="grid grid-cols-2 gap-4 text-sm">
          <InfoItem icon="📧" label="Messages" value={messages} />
          <InfoItem icon="📅" label="Created" value={formatDate(created)} />
          <InfoItem icon="🔄" label="Modified" value={formatDate(modified)} />
          <InfoItem icon="🚀" label="Rate Limit" value={`${rl.value}/${rl.frame} (${rl_scope})`} />
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-300">Access Methods</h4>
          <div className="flex flex-wrap gap-2 text-xs">
            <AccessBadge type="IMAP" access={attributes.imap_access} lastLogin={last_imap_login} />
            <AccessBadge type="SMTP" access={attributes.smtp_access} lastLogin={last_smtp_login} />
            <AccessBadge type="POP3" access={attributes.pop3_access} lastLogin={last_pop3_login} />
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-300">Features</h4>
          <div className="flex flex-wrap gap-2">
            <FeatureBadge feature="SOGo UI" enabled={attributes.sogo_access === "1"} />
            <FeatureBadge feature="Sieve" enabled={attributes.sieve_access === "1"} />
            <FeatureBadge feature="TLS In" enabled={attributes.tls_enforce_in === "1"} />
            <FeatureBadge feature="TLS Out" enabled={attributes.tls_enforce_out === "1"} />
            <FeatureBadge feature="Relayed" enabled={is_relayed === 1} />
          </div>
        </div>
        
        {aliases && aliases.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-300">Aliases</h4>
            <div className="flex flex-wrap gap-2">
              {aliases.map((alias: Alias) => (
                <AliasBadge key={alias.id} alias={alias} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface InfoItemProps {
  icon: string
  label: string
  value: string | number
}

function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-center space-x-2">
      <span>{icon}</span>
      <span className="text-gray-400">{label}:</span>
      <span className="font-semibold text-purple-300">{value}</span>
    </div>
  )
}

interface AccessBadgeProps {
  type: string
  access: string
  lastLogin: number
}

function AccessBadge({ type, access, lastLogin }: AccessBadgeProps) {
  const isEnabled = access === "1"
  const lastLoginText = isEnabled ? formatDate(lastLogin) : 'Inactive'
  const bgColor = isEnabled ? "bg-green-900 text-green-200" : "bg-red-900 text-red-200"

  return (
    <Badge variant="outline" className={`${bgColor}`}>
      {type}: {lastLoginText}
    </Badge>
  )
}

interface FeatureBadgeProps {
  feature: string
  enabled: boolean
}

function FeatureBadge({ feature, enabled }: FeatureBadgeProps) {
  const bgColor = enabled ? "bg-blue-900 text-blue-200" : "bg-gray-700 text-gray-400"

  return (
    <Badge variant="outline" className={bgColor}>
      {feature}
    </Badge>
  )
}

interface AliasBadgeProps {
  alias: Alias;
}

function AliasBadge({ alias }: AliasBadgeProps) {
  const bgColor = alias.active === 1 ? "bg-indigo-900 text-indigo-200" : "bg-gray-700 text-gray-400";
  const isCatchAll = alias.is_catch_all === 1;

  return (
    <Badge variant="outline" className={`${bgColor} ${isCatchAll ? 'font-bold' : ''}`}>
      {isCatchAll ? '@' : ''}{alias.address}
    </Badge>
  )
}