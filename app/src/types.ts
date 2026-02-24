export type ContainerType = 'screen' | 'modal';

export type BlockType =
  | 'gds-header'
  | 'phase-banner'
  | 'back-link'
  | 'breadcrumbs'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body-text'
  | 'inset-text'
  | 'warning-text'
  | 'button'
  | 'button-secondary'
  | 'button-warning'
  | 'text-input'
  | 'textarea'
  | 'radios'
  | 'checkboxes'
  | 'date-input'
  | 'error-summary'
  | 'summary-list'
  | 'notification-banner'
  | 'panel'
  | 'select'
  | 'table'
  | 'tag'
  | 'pagination'
  | 'file-upload'
  | 'accordion'
  | 'tabs'
  | 'task-list'
  | 'service-nav'
  | 'gds-footer'
  | 'form'
  | 'question'
  | 'custom';

export interface BlockTypeInfo {
  type: BlockType;
  icon: string;
  defaultLabel: string;
  description: string;
  isMacro: boolean;
}

export interface CustomPrimitive {
  type: string;
  label?: string;
  value?: string;
  height?: number;
  width?: number;
  color?: 'grey' | 'blue' | 'green' | 'red';
  columns?: string[];
  rows?: number;
  items?: CustomPrimitive[];
  text?: string;
}

export type CustomLayout = CustomPrimitive[];

export interface CustomTemplate {
  id: string;
  label: string;
  layout: CustomLayout;
  prompt: string;
}

export interface Block {
  id: string;
  type: BlockType;
  label: string;
  options?: string[];
  customLayout?: CustomLayout;
  customPrompt?: string;
}

export interface Container {
  id: string;
  type: ContainerType;
  name: string;
  blocks: Block[];
}

export const BLOCK_TYPES: BlockTypeInfo[] = [
  { type: 'task-list',        icon: '☑', defaultLabel: 'Your application',       description: 'Task list with section heading and status tags',             isMacro: false },
  { type: 'tabs',             icon: '⊟', defaultLabel: 'Tabs',                  description: 'Tabbed content panel',                                       isMacro: false },
  { type: 'accordion',        icon: '▼', defaultLabel: 'Accordion',             description: 'Expandable accordion sections',                              isMacro: false },
  { type: 'file-upload',      icon: '↑', defaultLabel: 'Upload a file',          description: 'File upload input with label and hint',                      isMacro: false },
  { type: 'pagination',       icon: '←→', defaultLabel: 'Pagination',           description: 'Previous / page numbers / Next navigation',                 isMacro: false },
  { type: 'tag',              icon: '◈', defaultLabel: 'Active',                description: 'Coloured status tag pill',                                   isMacro: false },
  { type: 'table',            icon: '▦', defaultLabel: 'Table caption',          description: 'Table with header row and data rows',                        isMacro: false },
  { type: 'select',           icon: '▽', defaultLabel: 'Country of birth',      description: 'Select dropdown with label and hint',                        isMacro: false },
  { type: 'gds-header',          icon: '▬', defaultLabel: 'My Service',           description: 'GOV.UK header with crown logo and service name',     isMacro: false },
  { type: 'phase-banner',        icon: '◈', defaultLabel: 'BETA',                  description: 'Alpha/beta phase banner with feedback link',          isMacro: false },
  { type: 'back-link',           icon: '←', defaultLabel: 'Back',                  description: 'Back link for previous page navigation',             isMacro: false },
  { type: 'breadcrumbs',         icon: '/', defaultLabel: 'Home',                  description: 'Breadcrumb navigation trail',                        isMacro: false },
  { type: 'h1',                  icon: 'H', defaultLabel: 'Page heading',           description: 'govuk-heading-xl — large page title (48px)',         isMacro: false },
  { type: 'h2',                  icon: 'H', defaultLabel: 'Section heading',        description: 'govuk-heading-l — section heading (36px)',           isMacro: false },
  { type: 'h3',                  icon: 'H', defaultLabel: 'Subsection heading',     description: 'govuk-heading-m — subsection heading (24px)',        isMacro: false },
  { type: 'body-text',           icon: '¶', defaultLabel: 'Body text',              description: 'govuk-body — body paragraph text (19px)',            isMacro: false },
  { type: 'inset-text',          icon: '|', defaultLabel: 'Important information',  description: 'Inset text with blue left border',                   isMacro: false },
  { type: 'warning-text',        icon: '!', defaultLabel: 'Warning message here',   description: 'Warning text with exclamation icon',                 isMacro: false },
  { type: 'button',              icon: '◻', defaultLabel: 'Continue',              description: 'Primary green action button',                        isMacro: false },
  { type: 'button-secondary',    icon: '◻', defaultLabel: 'Cancel',               description: 'Secondary button with grey border',                  isMacro: false },
  { type: 'button-warning',      icon: '◻', defaultLabel: 'Delete account',        description: 'Warning button for destructive actions (red)',        isMacro: false },
  { type: 'text-input',          icon: '▭', defaultLabel: 'Full name',             description: 'Text input with label and hint text',                isMacro: false },
  { type: 'textarea',            icon: '▭', defaultLabel: 'Description',           description: 'Multi-line textarea with label',                     isMacro: false },
  { type: 'radios',              icon: '○', defaultLabel: 'Where do you live?',    description: 'Radio buttons — single selection question',          isMacro: false },
  { type: 'checkboxes',          icon: '□', defaultLabel: 'Which applies to you?', description: 'Checkboxes — multiple selection question',           isMacro: false },
  { type: 'date-input',          icon: '□', defaultLabel: 'Date of birth',         description: 'Date input — day, month, year fields',               isMacro: false },
  { type: 'error-summary',       icon: '✕', defaultLabel: 'There is a problem',    description: 'Error summary box shown at top of page',             isMacro: false },
  { type: 'summary-list',        icon: '≡', defaultLabel: 'Summary',               description: 'Key–value summary list with change links',           isMacro: false },
  { type: 'notification-banner', icon: '■', defaultLabel: 'Important',             description: 'Notification banner with blue top border',           isMacro: false },
  { type: 'panel',               icon: '◼', defaultLabel: 'Application complete',  description: 'Green confirmation panel for success pages',         isMacro: false },
  { type: 'service-nav',         icon: '≡', defaultLabel: 'My Service',          description: 'Service name and navigation links bar',                      isMacro: false },
  { type: 'gds-footer',          icon: '▁', defaultLabel: 'Footer',               description: 'GOV.UK footer with crown copyright',                 isMacro: false },
  { type: 'form',                icon: '⚿', defaultLabel: 'Enter your name',       description: 'Macro — question page: heading + input + button',    isMacro: true  },
  { type: 'question',            icon: '⚿', defaultLabel: 'Are you sure?',         description: 'Macro — question page: heading + radios + button',   isMacro: true  },
];

export const PLACEHOLDER_SUGGESTIONS = [
  'try "gds-header"',
  'try "service-nav"',
  'try "h1"',
  'try "text-input"',
  'try "button"',
  'try "radios"',
  'try "summary-list"',
  'try "panel"',
  'try "form"',
  'try "question"',
];
