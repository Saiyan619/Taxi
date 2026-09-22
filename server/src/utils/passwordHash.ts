import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;

  const hash = await bcrypt.hash(password, saltRounds);

  return hash;
};

export const comparePassword = async(enteredPassword: string, storedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(enteredPassword, storedPassword)
}

export const hashToken = async (token: string): Promise<string> => {
  const saltRounds = 12;

  const hash =  bcrypt.hash(token, saltRounds);

  return hash;
};

export const compareToken = async(enteredToken: string, storedToken: string): Promise<boolean> => {
    return await bcrypt.compare(enteredToken, storedToken)
}


// const bcrypt = require('bcrypt');
// const saltRounds = 10;  // Number of hashing rounds (can increase for more security)

// const password = 'mySecretPassword';

// // Hash the password
// bcrypt.hash(password, saltRounds, (err, hash) => {
//   if (err) throw err;
//   console.log('Hashed Password:', hash);
// });

// const bcrypt = require('bcrypt');

// const storedHash = 'hashedPasswordFromDB';

// const enteredPassword = 'mySecretPassword';

// // Compare password with the hash stored in the database
// bcrypt.compare(enteredPassword, storedHash, (err, result) => {
//   if (err) throw err;
//   if (result) {
//     console.log('Password is correct!');
//   } else {
//     console.log('Password is incorrect.');
//   }
// });