import Razorpay from "razorpay";
import crypto from "crypto";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_dummykey12345",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "dummysecret12345",
});

export const verifyRazorpaySignature = (
  orderId: string,
  paymentId: string,
  signature: string
) => {
  const secret = process.env.RAZORPAY_KEY_SECRET || "";
  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(orderId + "|" + paymentId)
    .digest("hex");
    
  return generatedSignature === signature;
};
