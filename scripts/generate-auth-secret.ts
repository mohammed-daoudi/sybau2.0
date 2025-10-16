import * as crypto from 'crypto';

function generateSecret(): void {
  // Generate a 64-character hex string (32 bytes)
  const secret: string = crypto.randomBytes(32).toString('hex');
  console.log('\nGenerated NEXTAUTH_SECRET:');
  console.log(secret);
  console.log('\nAdd this to your .env file:');
  console.log(`NEXTAUTH_SECRET=${secret}\n`);
}

if (require.main === module) {
  generateSecret();
}