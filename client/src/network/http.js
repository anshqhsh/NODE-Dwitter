export default class HttpClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async fetch(url, option) {
    const res = await fetch(`${this.baseURL}${url}`, {
      ...option,
      headers: {
        'Content-Type': 'application/json',
        ...option.headers,
      },
    });
    let data;
    try {
      data = await res.json();
    } catch (error) {
      console.error(error);
    }

    if (res.status > 299 || res.status < 200) {
      const message =
        data && data.message ? data.message : 'Something went wrong';
      throw new Error(message);
    }
    return data;
  }
}
