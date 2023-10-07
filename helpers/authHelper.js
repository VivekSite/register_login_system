import bcrypt from 'bcrypt';

export const hashPassword = async (password) => {
  try{
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;

  } catch(error) {
    console.log(`Error while hashing password ${error}`);
  }
}

export const comparePassword = (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
}