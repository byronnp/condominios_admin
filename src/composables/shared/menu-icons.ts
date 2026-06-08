const menuIconMap: Record<string, string> = {
  'account-balance-wallet': 'account_balance_wallet',
  'account-tree': 'account_tree',
  'add-business': 'add_business',
  'badge-dollar-sign': 'paid',
  'building-2': 'apartment',
  'calendar-month': 'calendar_month',
  'calendar-plus': 'event_available',
  'credit-card': 'credit_card',
  'file-text': 'description',
  'layout-dashboard': 'dashboard',
  'list-tree': 'account_tree',
  'panel-left': 'view_sidebar',
  'receipt-text': 'receipt_long',
  'shield-check': 'verified_user',
  'shield-user': 'admin_panel_settings',
  'user-plus': 'person_add',
  'users-round': 'groups',
  'wallet-cards': 'account_balance_wallet',
  build: 'build',
  campaign: 'campaign',
  dashboard: 'dashboard',
  edit: 'edit',
  groups: 'groups',
  home: 'home',
  home_work: 'home_work',
  menu: 'menu',
  notifications: 'notifications',
  paid: 'paid',
  person: 'person',
  person_add: 'person_add',
  payments: 'payments',
  receipt: 'receipt',
  receipt_long: 'receipt_long',
  settings: 'settings',
  shield: 'shield',
  verified: 'verified',
  verified_user: 'verified_user',
  view_sidebar: 'view_sidebar',
  wallet: 'account_balance_wallet',
};

export function normalizeMenuIcon(icon?: string | null) {
  if (!icon) {
    return 'radio_button_unchecked';
  }

  const normalized = icon.replace(/-/g, '_');
  return menuIconMap[icon] || menuIconMap[normalized] || normalized;
}
