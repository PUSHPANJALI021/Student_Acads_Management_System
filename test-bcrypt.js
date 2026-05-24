const bcrypt = require('bcryptjs');

const plaintext = 'Admin@123';
const hash = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGNiGb6hgNbU5hZp3dqVkiKH2Oi';

async function test() {
  const result = await bcrypt.compare(plaintext, hash);
  console.log('Match:', result);
}

test();
