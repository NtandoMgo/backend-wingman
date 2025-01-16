const bcrypt = require('bcryptjs');

// Password to be hashed
const password = '123123';

// // Hash the password
// bcrypt.hash(password, 10, (err, hashedPassword) => {
//   if (err) {
//     console.error('Error while hashing:', err);
//   } else {
//     console.log('Hashed password:', hashedPassword);
//   }
// });
// // $2a$10$aQIzWPz.PdYhUpSx7Kef7.FaAm0xGPU3Kcz4LUAkJimw3qFzFcfUi
// // $2a$10$3H7itQ91zodqG6k4PUkSMewzzHY4SQSfvq4D5LZyqEnXhX5zf7ZUu

const isMatch = bcrypt.compare(password, "$2a$10$CfTie1IqxumioskE5gn1yetFkQ8grkdwR.Lsioa/aHqZybFjQK/vm");

console.log(isMatch)