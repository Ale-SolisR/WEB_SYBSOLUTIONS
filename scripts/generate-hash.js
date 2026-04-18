/**
 * Run with: node scripts/generate-hash.js <password>
 * Generates a bcrypt hash to use in ADMIN_PASSWORD_HASH env var
 */
const bcrypt = require("bcryptjs");

const password = process.argv[2] || "Admin123!";
bcrypt.hash(password, 12).then((hash) => {
  console.log("Password:", password);
  console.log("Hash:", hash);
  console.log("\nAdd to .env.local:");
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
});
