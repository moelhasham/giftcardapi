const nodemailer = require('nodemailer');




const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com', // Change to Hostinger's SMTP server
    port: 587, // Use 587 for TLS
    secure: false, // Set to true if using port 465
    auth: {
      user: 'info@royalcell.online', // Your Hostinger email
      pass: 'Hammady@2411' // Your email password
    }
  });


  const sendemail = async (finalcode,email,valueCatecory) => {
    const mailOptions = {
      from: 'info@royalcell.online', // Sender address
      to: email , // List of recipients
      subject: 'no-replay', // Subject line
      html: `<h7> Your $${valueCatecory} Gift Card Code is: <b>${finalcode} </b> </h7>  `, // Plain text body
    };
  
    try {
      const info = await transporter.sendMail(mailOptions);
    
      return true;
  
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
      
    }
  }


  module.exports = {
    sendemail
  }