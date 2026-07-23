import { emailSchema, type Email } from "./email-schema";

const email = emailSchema.parse("  Person@Example.COM  ");

const sendReceipt = (recipient: Email) => {
  console.log(`Sending receipt to ${recipient}`);
};

sendReceipt(email);
// Output: Sending receipt to Person@Example.COM
