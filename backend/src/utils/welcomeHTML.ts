function returnHTMLEmail(firstName : string , otp : string) : string{
const htmlEmail = `
<div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; padding: 20px;">
      
      <h2 style="color: #333;">Welcome ${firstName} to Libsense 📚</h2>
      
      <p style="color: #555; line-height: 1.6;">
        Thanks for signing up! We're excited to have you.
      </p>

	<h2>Your otp</h2>

      <span 
        style="
          display: inline-block;
          margin-top: 20px;
          padding: 12px 20px;
          background-color: #4f46e5;
          color: #ffffff;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
        "
      >
	<strong>${otp}</strong>
      </span>

      <hr style="margin: 30px 0;" />

      <p style="font-size: 12px; color: #888;">
        If you didn’t request this, you can safely ignore this email.
      </p>
    </div>
  </div>
`

return htmlEmail
    }

export {returnHTMLEmail}
