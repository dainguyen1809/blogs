export interface IEmailLocals {
  username?: string;
  subject?: string;
  header?: string;
  message?: string;
  type?: string;

  // Verification
  verifyLink?: string;
  resetLink?: string;
  otp?: string;

  // Optional content sections
  appIcon?: string;
  title?: string;
  description?: string;
  requirements?: string;

  // Scheduling or contact updates
  originalDate?: string;
  newDate?: string;
  reason?: string;

  // Links
  appLink?: string;
  offerLink?: string;

  // Branding
  sender?: string;
}
