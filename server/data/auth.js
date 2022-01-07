// abcd1234: $2b$12$G9xf8SFq3oTEgdj7ozHQ/uhDOyeQcUEDU8tnOcvpvApuadr3nE5Vm
let users = [
  {
    id: '1',
    username: 'bob',
    password: '$2b$12$G9xf8SFq3oTEgdj7ozHQ/uhDOyeQcUEDU8tnOcvpvApuadr3nE5Vm',
    name: 'Bob',
    email: 'anshqhsh.dev@gmail.com',
    url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
  },
];

export async function findByUsername(username) {
  return users.find(user => user.username === username);
}

export async function findById(id) {
  return users.find(user => user.id === id);
}

export async function createUser(user) {
  const created = {
    ...user,
    id: Date.now().toString(),
  };
  users.push(created);
  return created.id;
}
