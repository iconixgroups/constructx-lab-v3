const nodemailer = require('nodemailer');

// Create a test account for development
let transporter;

// Initialize email transporter
const initTransporter = async () => {
  if (process.env.NODE_ENV === 'production') {
    // Production email configuration
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  } else {
    // Development email using Ethereal
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    console.log('Test email account created:', testAccount.user);
  }
};

// Send verification email
exports.sendVerificationEmail = async (email, token) => {
  if (!transporter) {
    await initTransporter();
  }

  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email/${token}`;
  
  const mailOptions = {
    from: `"ConstructX" <${process.env.EMAIL_FROM || 'noreply@constructx.com'}>`,
    to: email,
    subject: 'Verify Your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to ConstructX!</h2>
        <p>Thank you for registering. Please verify your email address to complete your registration.</p>
        <p>
          <a href="${verificationUrl}" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">
            Verify Email Address
          </a>
        </p>
        <p>If you didn't create an account, you can safely ignore this email.</p>
        <p>This link will expire in 24 hours.</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #666; font-size: 12px;">© 2025 ConstructX. All rights reserved.</p>
      </div>
    `
  };

  const info = await transporter.sendMail(mailOptions);
  
  if (process.env.NODE_ENV !== 'production') {
    console.log('Verification email sent:', nodemailer.getTestMessageUrl(info));
  }
  
  return info;
};

// Send password reset email
exports.sendPasswordResetEmail = async (email, token) => {
  if (!transporter) {
    await initTransporter();
  }

  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${token}`;
  
  const mailOptions = {
    from: `"ConstructX" <${process.env.EMAIL_FROM || 'noreply@constructx.com'}>`,
    to: email,
    subject: 'Reset Your Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Reset Your Password</h2>
        <p>You requested a password reset. Click the button below to create a new password.</p>
        <p>
          <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">
            Reset Password
          </a>
        </p>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #666; font-size: 12px;">© 2025 ConstructX. All rights reserved.</p>
      </div>
    `
  };

  const info = await transporter.sendMail(mailOptions);
  
  if (process.env.NODE_ENV !== 'production') {
    console.log('Password reset email sent:', nodemailer.getTestMessageUrl(info));
  }
  
  return info;
};

// Send company invitation email
exports.sendCompanyInvitationEmail = async (email, companyName, verificationToken, tempPassword) => {
  if (!transporter) {
    await initTransporter();
  }

  const invitationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/invitation/${verificationToken}`;
  
  const mailOptions = {
    from: `"ConstructX" <${process.env.EMAIL_FROM || 'noreply@constructx.com'}>`,
    to: email,
    subject: `You've Been Invited to Join ${companyName} on ConstructX`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">You've Been Invited!</h2>
        <p>You've been invited to join <strong>${companyName}</strong> on ConstructX.</p>
        <p>Click the button below to accept the invitation and set up your account.</p>
        <p>
          <a href="${invitationUrl}" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">
            Accept Invitation
          </a>
        </p>
        ${tempPassword ? `<p>Your temporary password is: <strong>${tempPassword}</strong></p>` : ''}
        <p>This invitation will expire in 7 days.</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #666; font-size: 12px;">© 2025 ConstructX. All rights reserved.</p>
      </div>
    `
  };

  const info = await transporter.sendMail(mailOptions);
  
  if (process.env.NODE_ENV !== 'production') {
    console.log('Invitation email sent:', nodemailer.getTestMessageUrl(info));
  }
  
  return info;
};

// Send subscription confirmation email
exports.sendSubscriptionConfirmationEmail = async (email, companyName, plan, billingCycle, endDate) => {
  if (!transporter) {
    await initTransporter();
  }
  
  const formattedEndDate = new Date(endDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const mailOptions = {
    from: `"ConstructX" <${process.env.EMAIL_FROM || 'noreply@constructx.com'}>`,
    to: email,
    subject: 'Subscription Confirmation',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Subscription Confirmed</h2>
        <p>Thank you for subscribing to ConstructX!</p>
        <p>Your subscription details:</p>
        <ul>
          <li><strong>Company:</strong> ${companyName}</li>
          <li><strong>Plan:</strong> ${plan.charAt(0).toUpperCase() + plan.slice(1)}</li>
          <li><strong>Billing Cycle:</strong> ${billingCycle.charAt(0).toUpperCase() + billingCycle.slice(1)}</li>
          <li><strong>Next Billing Date:</strong> ${formattedEndDate}</li>
        </ul>
        <p>You can manage your subscription from your account dashboard.</p>
        <p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/subscription" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">
            Manage Subscription
          </a>
        </p>
        <hr style="border: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #666; font-size: 12px;">© 2025 ConstructX. All rights reserved.</p>
      </div>
    `
  };

  const info = await transporter.sendMail(mailOptions);
  
  if (process.env.NODE_ENV !== 'production') {
    console.log('Subscription confirmation email sent:', nodemailer.getTestMessageUrl(info));
  }
  
  return info;
};

// Send payment receipt email
exports.sendPaymentReceiptEmail = async (email, companyName, payment) => {
  if (!transporter) {
    await initTransporter();
  }
  
  const formattedDate = new Date(payment.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const mailOptions = {
    from: `"ConstructX" <${process.env.EMAIL_FROM || 'noreply@constructx.com'}>`,
    to: email,
    subject: 'Payment Receipt',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Payment Receipt</h2>
        <p>Thank you for your payment to ConstructX!</p>
        <p>Payment details:</p>
        <ul>
          <li><strong>Company:</strong> ${companyName}</li>
          <li><strong>Amount:</strong> ${payment.currency} ${payment.amount.toFixed(2)}</li>
          <li><strong>Date:</strong> ${formattedDate}</li>
          <li><strong>Description:</strong> ${payment.description}</li>
          <li><strong>Payment ID:</strong> ${payment._id}</li>
        </ul>
        <p>You can view your payment history from your account dashboard.</p>
        <p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/payments" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">
            View Payment History
          </a>
        </p>
        <hr style="border: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #666; font-size: 12px;">© 2025 ConstructX. All rights reserved.</p>
      </div>
    `
  };

  const info = await transporter.sendMail(mailOptions);
  
  if (process.env.NODE_ENV !== 'production') {
    console.log('Payment receipt email sent:', nodemailer.getTestMessageUrl(info));
  }
  
  return info;
};
