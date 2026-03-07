exports.welcomeEmail = (name, loginUrl, forgotUrl) => `
<h2>Hello ${name}</h2>

<p>Welcome to <b>InterviewIQ</b></p>

<p>You can login using the link below:</p>

<a href="${loginUrl}">Login</a>

<br/><br/>

<p>If you forgot your password:</p>

<a href="${forgotUrl}">Reset Password</a>

<br/><br/>

<p>Start preparing for your interviews 🚀</p>

<p>— Team InterviewIQ</p>
`;

exports.otpEmail = (otp) => `
<h2>Password Reset OTP</h2>

<p>Your OTP code:</p>

<h1>${otp}</h1>

<p>This OTP expires in 10 minutes.</p>

<p>If you didn't request this, ignore this email.</p>
`;