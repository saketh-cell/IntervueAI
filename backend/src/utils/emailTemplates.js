// utils/emailTemplates.js

// 1️⃣ Welcome Email
const welcomeEmail = (name) => `
<div style="font-family: Arial, sans-serif; background:#f5f7fb; padding:40px;">
  <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:10px;padding:30px;">
    
    <h2 style="color:#4f46e5;">Welcome to IntervueAI 🚀</h2>

    <p>Hi <b>${name}</b>,</p>

    <p>
      Thank you for registering with <b>IntervueAI</b>.  
      You can now start practicing mock interviews and receive AI-powered feedback.
    </p>

    <div style="text-align:center;margin:30px 0;">
      <a href="https://intervue-ai.vercel.app/dashboard"
        style="background:#4f46e5;color:#fff;padding:12px 25px;border-radius:6px;text-decoration:none;">
        Start Interview
      </a>
    </div>

    <p style="font-size:13px;color:#999;text-align:center;">
      © 2026 IntervueAI
    </p>

  </div>
</div>
`;


// 2️⃣ OTP Verification Email
const otpEmail = (name, otp) => `
<div style="font-family: Arial, sans-serif; background:#f6f8fc; padding:40px;">
  <div style="max-width:600px;margin:auto;background:#fff;border-radius:12px;padding:30px;">

    <h2 style="color:#4f46e5;">Password Reset OTP</h2>

    <p>Hello <b>${name}</b>,</p>

    <p>Use the following OTP to reset your IntervueAI password:</p>

    <div style="text-align:center;margin:30px 0;">
      <div style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#4f46e5;">
        ${otp}
      </div>
    </div>

    <p>This code will expire in 10 minutes.</p>

    <p style="font-size:13px;color:#999;text-align:center;">
      IntervueAI Security Team
    </p>

  </div>
</div>
`;


// 3️⃣ Password Reset Email
const resetPasswordEmail = (name, resetLink) => `
<div style="font-family: Arial, sans-serif; background:#f4f6fb; padding:40px;">
  <div style="max-width:600px;margin:auto;background:#fff;border-radius:12px;padding:30px;">

    <h2>Reset Your Password</h2>

    <p>Hello <b>${name}</b>,</p>

    <p>Click the button below to reset your password.</p>

    <div style="text-align:center;margin:30px 0;">
      <a href="${resetLink}"
        style="background:#4f46e5;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;">
        Reset Password
      </a>
    </div>

    <p>If you didn’t request this, ignore this email.</p>

  </div>
</div>
`;


// 4️⃣ Interview Result Email
const interviewResultEmail = (name, role, score) => `
<div style="font-family: Arial, sans-serif; background:#f4f6fb; padding:40px;">
  <div style="max-width:600px;margin:auto;background:#fff;border-radius:12px;padding:30px;">

    <h2>Your Interview Results 🎯</h2>

    <p>Hi <b>${name}</b>,</p>

    <p>Your mock interview for <b>${role}</b> has been completed.</p>

    <div style="background:#eef2ff;padding:20px;border-radius:10px;text-align:center;margin:20px 0;">
      <h1 style="color:#4f46e5">${score}/100</h1>
      <p>Overall Score</p>
    </div>

    <div style="text-align:center;">
      <a href="https://intervue-ai.vercel.app/dashboard"
      style="background:#4f46e5;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;">
      View Full Report
      </a>
    </div>

  </div>
</div>
`;


// 5️⃣ AI Interview Analysis Email
const analysisEmail = (name, role, scores) => `
<div style="font-family: Arial, sans-serif; background:#f4f6fb; padding:40px;">
  <div style="max-width:600px;margin:auto;background:#fff;border-radius:12px;padding:30px;">

    <h2>AI Interview Analysis 📊</h2>

    <p>Hello <b>${name}</b>,</p>

    <p>Your performance for the role <b>${role}</b>:</p>

    <table style="width:100%;border-collapse:collapse;margin-top:20px;">

      <tr style="background:#eef2ff">
        <th style="padding:10px;text-align:left">Skill</th>
        <th style="padding:10px">Score</th>
      </tr>

      <tr>
        <td style="padding:10px">Technical</td>
        <td style="text-align:center">${scores.technical}/10</td>
      </tr>

      <tr>
        <td style="padding:10px">Communication</td>
        <td style="text-align:center">${scores.communication}/10</td>
      </tr>

      <tr>
        <td style="padding:10px">Problem Solving</td>
        <td style="text-align:center">${scores.problem}/10</td>
      </tr>

      <tr>
        <td style="padding:10px">Confidence</td>
        <td style="text-align:center">${scores.confidence}/10</td>
      </tr>

    </table>

  </div>
</div>
`;


// 6️⃣ Weekly Performance Email
const weeklyPerformanceEmail = (name, stats) => `
<div style="font-family: Arial, sans-serif; background:#f4f6fb; padding:40px;">
  <div style="max-width:600px;margin:auto;background:#fff;border-radius:12px;padding:30px;">

    <h2>Your Weekly Progress</h2>

    <p>Hello <b>${name}</b>,</p>

    <table style="width:100%;margin-top:20px">

      <tr>
        <td>Interviews Completed</td>
        <td style="text-align:right">${stats.completed}</td>
      </tr>

      <tr>
        <td>Average Score</td>
        <td style="text-align:right">${stats.averageScore}/100</td>
      </tr>

      <tr>
        <td>Best Skill</td>
        <td style="text-align:right">${stats.bestCategory}</td>
      </tr>

      <tr>
        <td>Needs Improvement</td>
        <td style="text-align:right">${stats.improvementArea}</td>
      </tr>

    </table>

  </div>
</div>
`;


// 7️⃣ Resume Analysis Email
const resumeAnalysisEmail = (name, data) => `
<div style="font-family: Arial, sans-serif; background:#f4f6fb; padding:40px;">
  <div style="max-width:600px;margin:auto;background:#fff;border-radius:12px;padding:30px;">

    <h2>Your Resume Analysis</h2>

    <p>Hello <b>${name}</b>,</p>

    <h1 style="color:#4f46e5">${data.atsScore}%</h1>
    <p>ATS Match Score</p>

    <p><b>Suggestion:</b> ${data.topSuggestion}</p>

  </div>
</div>
`;


module.exports = {
  welcomeEmail,
  otpEmail,
  resetPasswordEmail,
  interviewResultEmail,
  analysisEmail,
  weeklyPerformanceEmail,
  resumeAnalysisEmail,
};