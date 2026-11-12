export interface UserData {
  gender: 'Male' | 'Female';
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export function createUniqueUser(): UserData {
  const uniqueEmail = `bella.aye_${Date.now()}@yopmail.com`;

  return {
    gender: 'Female',
    firstName: 'Bella',
    lastName: 'Aye',
    email: uniqueEmail,
    password: 'test@12345',
  };
}

export default UserData;