const API_KEY = '33614277-14313d1389d57b7e80a4c1e60';

export default class ApiService {
  constructor() {
    this.querry = '';
    this.page = 1;
    this.totalHits = 0;
  }

  async fetchPhotos() {
    const url = `https://pixabay.com/api/?key=${API_KEY}&q=${this.querry}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`;
    const res = await fetch(url);
    const resJson = await res.json();
    this.totalHits = resJson.totalHits;
    this.page += 1;
    return resJson.hits;
  }

  resetPage() {
    this.page = 1;
  }
}
