/**
 * Placeholder data layer for the Application Shell (Auth, Navigation, Notifications, Account Settings).
 * Follows api-network-rules.md:
 * - Scoped to shell features
 * - No endpoint names, base URLs, or environment variables
 * - Supports loading, populated result, empty result, and failure states
 */

export interface UserProfile {
  id: string;
  fullName: string;
  initials: string;
  email: string;
  phoneNumber: string;
  ward: string;
  role: string;
  idCardFileName: string;
  assignedBlocksCount: number;
  appearanceMode: 'light' | 'dark';
}

export interface LoginSessionLog {
  id: string;
  portalName: string;
  timestamp: string;
  supportPhone: string;
  supportEmail: string;
}

import { ReviewRecordType } from '../types/states';

export interface NotificationItem {
  id: string;
  type:
    | 'report_submission'
    | 'report_review'
    | 'report_approval'
    | 'user_added'
    | 'block_added'
    | 'assignment_deployed'
    | 'campaign_added'
    | 'tree_added'
    | 'system_error'
    | 'security_alert';
  recordType?: ReviewRecordType;
  title: string;
  message: string;
  timestamp: string;
  actionLabel?: string;
  highlighted?: boolean;
  read: boolean;
}

export interface OnlineUser {
  id: string;
  name: string;
  status: 'Online' | 'Offline';
}

export interface SupportFaqCategory {
  id: string;
  name: string;
  faqs: {
    id: string;
    question: string;
    answer: string;
  }[];
}

export interface ContactAdminPayload {
  email: string;
  phone: string;
  complaint: string;
}

export interface SupportInquiryPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  message: string;
}

// In-memory placeholder state
let currentUserProfile: UserProfile = {
  id: 'usr-001',
  fullName: 'Ibrahim Haruna',
  initials: 'IH',
  email: 'contactwaleedbello@gmail.com',
  phoneNumber: '+2348139414056',
  ward: 'Wunlan Ward',
  role: 'EXTENSION OFFICER',
  idCardFileName: 'Image_capture2.PNG',
  assignedBlocksCount: 4,
  appearanceMode: 'light',
};

const mockSessionLog: LoginSessionLog = {
  id: 'sess-001',
  portalName: 'Admin portal',
  timestamp: 'Sep 4, 2026 at 8:37 PM',
  supportPhone: '09039414056',
  supportEmail: 'customerservice@greemlegacy.com',
};

let mockNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'report_submission',
    recordType: 'growth_check',
    title: 'Report Submision',
    message: 'New report has been submitted',
    timestamp: '2:30 pm',
    actionLabel: 'Review',
    read: false,
  },
  {
    id: 'notif-2',
    type: 'report_review',
    recordType: 'incident',
    title: 'Report Review',
    message: 'Report is under review by the team.',
    timestamp: '3:00 pm',
    actionLabel: 'Review',
    read: false,
  },
  {
    id: 'notif-3',
    type: 'report_approval',
    recordType: 'validation',
    title: 'Report Approval',
    message: 'Report has been approved and finalized.',
    timestamp: '4:15 pm',
    actionLabel: 'View',
    read: false,
  },
  {
    id: 'notif-4',
    type: 'user_added',
    title: 'New User Added',
    message: 'New user has been Added',
    timestamp: '2:30 pm',
    read: false,
  },
  {
    id: 'notif-5',
    type: 'block_added',
    title: 'New Block Added',
    message: 'New block has been Added',
    timestamp: '2:30 pm',
    read: false,
  },
  {
    id: 'notif-6',
    type: 'assignment_deployed',
    title: 'Assignment deployed successfully',
    message: 'Auditing task routed to Officer Amina Bello. Target: 100 Neem trees in Bwari Zone.',
    timestamp: 'Operations · Just now',
    actionLabel: 'Track live progress',
    read: false,
  },
  {
    id: 'notif-7',
    type: 'campaign_added',
    title: 'New Campaign Added',
    message: 'New campaign has been Added',
    timestamp: '2:30 pm',
    read: false,
  },
  {
    id: 'notif-8',
    type: 'tree_added',
    title: 'New Tree Added',
    message: 'New tree has been Added',
    timestamp: '2:30 pm',
    read: false,
  },
  {
    id: 'notif-9',
    type: 'system_error',
    title: 'System Error',
    message: 'we are experiencing system error and our experts are on it',
    timestamp: '2:30 pm',
    read: false,
  },
  {
    id: 'notif-10',
    type: 'security_alert',
    title: 'New device login detected',
    message: "Your account was accessed from Chrome on Android (Abuja, NG). If this wasn't you, secure your account immediately.",
    timestamp: '2:30 pm',
    highlighted: true,
    read: false,
  },
];

const mockOnlineUsers: OnlineUser[] = [
  { id: 'usr-1', name: 'Marcus A. Lee', status: 'Online' },
  { id: 'usr-2', name: 'Marcus A. Lee', status: 'Online' },
  { id: 'usr-3', name: 'Marcus A. Lee', status: 'Online' },
  { id: 'usr-4', name: 'Marcus A. Lee', status: 'Online' },
  { id: 'usr-5', name: 'Marcus A. Lee', status: 'Online' },
  { id: 'usr-6', name: 'Marcus A. Lee', status: 'Online' },
  { id: 'usr-7', name: 'Marcus A. Lee', status: 'Online' },
  { id: 'usr-8', name: 'Marcus A. Lee', status: 'Online' },
  { id: 'usr-9', name: 'Marcus A. Lee', status: 'Online' },
  { id: 'usr-10', name: 'Marcus A. Lee', status: 'Online' },
  { id: 'usr-11', name: 'Marcus A. Lee', status: 'Online' },
  { id: 'usr-12', name: 'Marcus A. Lee', status: 'Online' },
  { id: 'usr-13', name: 'Marcus A. Lee', status: 'Online' },
  { id: 'usr-14', name: 'Marcus A. Lee', status: 'Offline' },
];

const mockFaqs: SupportFaqCategory[] = [
  {
    id: 'green-legacy',
    name: 'Green Legacy',
    faqs: [
      {
        id: 'faq-1',
        question: 'What is Green Legacy?',
        answer:
          'Green Legacy is a Nigerian environmental sustainability and agroforestry enterprise that operates at the intersection of ecological restoration, agricultural technology, and rural economic development.',
      },
      {
        id: 'faq-2',
        question: 'Where does Green Legacy operate?',
        answer:
          'Green Legacy operates across verified ecological restoration blocks and conservation corridors throughout Nigeria.',
      },
      {
        id: 'faq-3',
        question: 'How long has Green Legacy been operating?',
        answer:
          'Green Legacy has been active in landscape restoration and tree tracking operations since its foundational initiative.',
      },
      {
        id: 'faq-4',
        question: 'Is Green Legacy a charity or a business?',
        answer:
          'Green Legacy is an agroforestry and environmental sustainability enterprise dedicated to verifiable ecological impact and community economic resilience.',
      },
    ],
  },
  {
    id: 'tree-sponsorship',
    name: 'Tree Sponsorship',
    faqs: [
      {
        id: 'faq-5',
        question: 'How does tree sponsorship work?',
        answer:
          'Sponsors can allocate resources to mapped blocks. Every planted tree is tagged, registered, and tracked through regular field validation and growth checks.',
      },
    ],
  },
  {
    id: 'investment-partnership',
    name: 'Investment & Partnership',
    faqs: [
      {
        id: 'faq-6',
        question: 'How can partners collaborate with Green Legacy?',
        answer:
          'Institutional and commercial partners can collaborate on large-scale reforestation drives, carbon offset programmes, and sustainable community forestry.',
      },
    ],
  },
];

// Helper to simulate network latency
const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch current user profile
 */
export async function getProfilePlaceholder(): Promise<UserProfile> {
  await delay();
  return { ...currentUserProfile };
}

/**
 * Update appearance mode preference
 */
export async function updateAppearancePlaceholder(mode: 'light' | 'dark'): Promise<UserProfile> {
  await delay();
  currentUserProfile = { ...currentUserProfile, appearanceMode: mode };
  return { ...currentUserProfile };
}

/**
 * Fetch login session logs
 */
export async function getSessionLogPlaceholder(): Promise<LoginSessionLog> {
  await delay();
  return { ...mockSessionLog };
}

/**
 * Fetch notifications feed
 */
export async function getNotificationsPlaceholder(): Promise<NotificationItem[]> {
  await delay();
  return [...mockNotifications];
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsReadPlaceholder(id: string): Promise<void> {
  await delay(150);
  mockNotifications = mockNotifications.map((n) =>
    n.id === id ? { ...n, read: true } : n
  );
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsReadPlaceholder(): Promise<void> {
  await delay(200);
  mockNotifications = mockNotifications.map((n) => ({ ...n, read: true }));
}

/**
 * Fetch list of online/offline users
 */
export async function getOnlineUsersPlaceholder(): Promise<OnlineUser[]> {
  await delay();
  return [...mockOnlineUsers];
}

/**
 * Fetch Support FAQs
 */
export async function getSupportFaqsPlaceholder(): Promise<SupportFaqCategory[]> {
  await delay();
  return [...mockFaqs];
}

/**
 * Submit Contact Admin assistance request
 */
export async function submitContactAdminPlaceholder(
  payload: ContactAdminPayload
): Promise<{ success: boolean; message: string }> {
  await delay(500);
  if (!payload.email || !payload.complaint) {
    throw new Error('Please fill in your email and complaint description.');
  }
  return {
    success: true,
    message: "Request submitted successfully. We'll respond in no time.",
  };
}

/**
 * Submit Support inquiry
 */
export async function submitSupportInquiryPlaceholder(
  payload: SupportInquiryPayload
): Promise<{ success: boolean; message: string }> {
  await delay(500);
  if (!payload.fullName || !payload.email || !payload.message) {
    throw new Error('Please fill in all required fields.');
  }
  return {
    success: true,
    message: 'Your inquiry has been received. Our team will contact you within 24 hours.',
  };
}

/**
 * Logout placeholder
 */
export async function logoutPlaceholder(): Promise<{ success: boolean }> {
  await delay(300);
  return { success: true };
}
