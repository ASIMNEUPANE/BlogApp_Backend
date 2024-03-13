import bcrypt from 'bcrypt'

const hashPassword = (string:string) => {
  return bcrypt.hashSync(string, Number(process.env.SALT_ROUND));
};

const comparePassword = (password:string, hashPassword:string) => {
  return bcrypt.compareSync(password, hashPassword);
};

export  { hashPassword, comparePassword };
