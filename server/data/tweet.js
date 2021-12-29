let tweets = [
  {
    id: '1',
    text: '화이팅',
    createdAt: Date.now.toString(),
    name: 'JoonHyuk',
    username: 'JoonHyuk',
    url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
  },
  {
    id: '2',
    text: 'HI',
    createdAt: Date.now().toString(),
    name: 'Joon',
    username: 'joon',
    url: 'https://anshqhsh.github.io/portfolio/images/profile%20r.JPG',
  },
  {
    id: '3',
    text: '안녕?',
    createdAt: Date.now().toString(),
    name: 'sori',
    username: 'sori',
    url: 'https://anshqhsh.github.io/portfolio/images/profile%20r.JPG',
  },
];

export async function getAll() {
  return tweets;
}

export async function getAllByUsername(username) {
  return tweets.filter(tweet => tweet.username === username);
}

export async function getById(id) {
  return tweets.find(tweet => tweet.id === id);
}

export async function create(text, name, username) {
  const tweet = {
    id: Date.now().toString(),
    text,
    createdAt: new Date(),
    name,
    username,
  };
  tweets = [tweet, ...tweets];
  return tweet;
}

export async function update(id, text) {
  const tweet = tweets.find(tweet => tweet.id === id);
  if (tweet) {
    tweet.text = text;
  }
  return tweet;
}

export async function remove(id) {
  tweets = tweets.filter(tweet => tweet.id !== id);
}
