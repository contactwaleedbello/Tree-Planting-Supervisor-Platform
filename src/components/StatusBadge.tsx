/**
 * StatusBadge: Unified status indicator component.
 *
 * CONSTRUCTED FROM DESIGN SYSTEM:
 * 'Escalated' badge rendering was constructed from the design system,
 * not built from a reference image, per state-mapping-rules.md.
 */
import React from 'react';
import {
  PositionLabel,
  RecordState,
  IncidentState,
  TreeState,
  BlockSafetyFlag,
  BlockAssignmentState,
  UserState,
  getPositionDisplayLabel,
} from '../types/states';
import { tokens } from '../utils/tokens';

export type BadgeStatus =
  | PositionLabel
  | RecordState
  | IncidentState
  | TreeState
  | BlockSafetyFlag
  | BlockAssignmentState
  | UserState
  | 'Online'
  | 'Offline'
  | 'Pending'
  | 'Suspended'
  | 'In Progress'
  | 'Completed'
  | 'Accessible'
  | 'Damaged/Destroyed'
  | 'Individual'
  | 'Block'
  | 'Individual custodian'
  | 'Custodian'
  | 'Field Officer'
  | 'EXTENSION OFFICER';

interface StatusBadgeProps {
  status: BadgeStatus | string;
  variant?: 'dot' | 'pill' | 'outline';
  customLabel?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant = 'pill',
  customLabel,
  className = '',
}) => {
  // Determine display text (applying the rule that Simulated displays as "Approximate")
  const displayText =
    customLabel ||
    (status === 'Simulated'
      ? getPositionDisplayLabel('Simulated')
      : status);

  // Directly reference design tokens from /context/design-tokens.json via tokens object
  let bg = tokens.color.neutral[50];
  let text = tokens.color.neutral[600];
  let border = tokens.color.neutral[100];
  let dot = tokens.color.neutral[500];

  switch (status) {
    // Success states
    case 'Verified':
    case 'ReplacementApproved':
    case 'Safe':
    case 'Online':
    case 'Completed':
    case 'Accessible':
      bg = tokens.color.success[50];
      text = tokens.color.success[600];
      border = tokens.color.success[100];
      dot = tokens.color.success[600];
      break;

    // Error / Critical states
    case 'Rejected':
    case 'ReplacementRejected':
    case 'Dead':
    case 'Unsafe':
    case 'Suspended':
    case 'Damaged/Destroyed':
      bg = tokens.color.error[50];
      text = tokens.color.error[600];
      border = tokens.color.error[200];
      dot = tokens.color.error[500];
      break;

    // Warning states
    case 'Needs Review':
    case 'NeedsReview':
    case 'Low Accuracy':
    case 'IncidentFlagged':
    case 'Reported':
    case 'Pending':
    // CONSTRUCTED FROM DESIGN SYSTEM:
    // 'Escalated' renders the literal word per state-mapping-rules.md until a real design confirms otherwise.
    case 'Escalated':
      bg = tokens.color.warning[50];
      text = tokens.color.warning[600];
      border = tokens.color.warning[100];
      dot = tokens.color.warning[500];
      break;

    // Info / Blue states
    case 'In Progress':
    case 'Individual':
    case 'Individual custodian':
    case 'Submitted':
    case 'Active':
      bg = tokens.color.info[50];
      text = tokens.color.info[600];
      border = tokens.color.info[100];
      dot = tokens.color.info[500];
      break;

    // Brand green states
    case 'Block':
    case 'Captured':
      bg = tokens.color.brand[50];
      text = tokens.color.brand[500];
      border = tokens.color.brand[100];
      dot = tokens.color.brand[500];
      break;

    // Neutral / Gray states
    case 'Simulated': // Approximate
    case 'Unknown':
    case 'Deactivated':
    case 'Offline':
    case 'Closed':
    case 'Replaced':
    case 'Ended':
    case 'Draft':
    case 'Mapped':
    case 'Retired':
    case 'Custodian':
    case 'Field Officer':
    case 'EXTENSION OFFICER':
    default:
      bg = tokens.color.neutral[50];
      text = tokens.color.neutral[600];
      border = tokens.color.neutral[100];
      dot = tokens.color.neutral[500];
      break;
  }

  if (variant === 'dot') {
    return (
      <span
        style={{ backgroundColor: bg, color: text }}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${className}`}
      >
        <span
          style={{ backgroundColor: dot }}
          className="w-1.5 h-1.5 rounded-full"
        />
        <span>{displayText}</span>
      </span>
    );
  }

  if (variant === 'outline') {
    return (
      <span
        style={{ backgroundColor: bg, color: text, borderColor: border }}
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}
      >
        {displayText}
      </span>
    );
  }

  return (
    <span
      style={{ backgroundColor: bg, color: text }}
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${className}`}
    >
      {displayText}
    </span>
  );
};
