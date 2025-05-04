const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Loan = require('../models/Loan');
const Customer = require('../models/Customer');
const User = require('../models/User');

exports.generateReceipt = async (repayment) => {
  try {
    // Fetch related data first
    const loan = await Loan.findById(repayment.loan);
    const customer = await Customer.findById(loan.customer);
    const user = await User.findById(loan.owner);

    return new Promise((resolve, reject) => {
      // Create PDF document
      const doc = new PDFDocument();
      const fileName = `receipt_${repayment._id}_${Date.now()}.pdf`;
      const receiptsDir = path.join(__dirname, '../receipts');
      
      // Create receipts directory if it doesn't exist
      if (!fs.existsSync(receiptsDir)) {
        fs.mkdirSync(receiptsDir, { recursive: true });
      }

      const filePath = path.join(receiptsDir, fileName);
      const writeStream = fs.createWriteStream(filePath);

      doc.pipe(writeStream);

      // Build PDF content
      doc.fontSize(20).text('Payment Receipt', { align: 'center' });
      doc.moveDown();

      // Business information
      doc.fontSize(14).text(`Business: ${user.businessName}`);
      doc.text(`Contact: ${user.phone}`);
      doc.moveDown();

      // Customer information
      doc.text(`Customer: ${customer.name}`);
      doc.text(`Phone: ${customer.phone}`);
      if (customer.address) doc.text(`Address: ${customer.address}`);
      doc.moveDown();

      // Payment details
      doc.font('Helvetica-Bold').text('Payment Details:', { underline: true });
      doc.font('Helvetica');
      doc.text(`Date: ${repayment.paymentDate.toDateString()}`);
      doc.text(`Amount: ₹${repayment.amount.toLocaleString('en-IN')}`);
      doc.text(`Payment Mode: ${repayment.paymentMode || 'Cash'}`);
      doc.moveDown();

      // Loan reference
      doc.font('Helvetica-Bold').text('Loan Reference:', { underline: true });
      doc.font('Helvetica');
      doc.text(`Description: ${loan.description}`);
      doc.text(`Original Amount: ₹${loan.amount.toLocaleString('en-IN')}`);
      doc.text(`Remaining Balance: ₹${loan.remainingAmount.toLocaleString('en-IN')}`);
      doc.moveDown();

      // Footer
      doc.fontSize(10).text('Generated on: ' + new Date().toLocaleString(), { align: 'right' });
      doc.text('Thank you for your payment!', { align: 'center' });

      doc.end();

      writeStream.on('finish', () => resolve({
        path: filePath,
        fileName: fileName,
        publicUrl: `/receipts/${fileName}` // URL to access the receipt
      }));
      
      writeStream.on('error', (error) => {
        console.error('PDF generation error:', error);
        reject(error);
      });
    });
  } catch (error) {
    console.error('Error in generateReceipt:', error);
    throw error;
  }
};