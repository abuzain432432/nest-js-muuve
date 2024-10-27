import { JSDOM } from 'jsdom';

function extractOtpFromEmail(email: any, userEmail: string) {
  // NOTE check if email belongs to the user
  if (!email.subject.includes(userEmail)) {
    return null;
  }
  const dom = new JSDOM(email.html.body);
  const otp = dom.window.document.querySelector('.otpCode').textContent;
  console.log('OTP: ', otp);
  return otp ? otp : null;
}
export default extractOtpFromEmail;
