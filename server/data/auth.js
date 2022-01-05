let users = [
  {
    id: '1',
    username: 'bob',
    password: '',
    name: 'Bob',
    email: 'anshqhsh.dev@gmail.com',
    url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
  },
];

export async function createUser(user) {
  const created = {
    ...user,
    id: Date.now().toString(),
  };
  users.push(created);
  return created.id;
}
