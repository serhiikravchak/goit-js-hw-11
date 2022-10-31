import axios from "axios";

const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '30947996-96e9277b400b51ec4b69b5054';

export default class PixabayApiService {
  constructor() {
    this.searchValue = '';
    this.page = 1;
  }

  async fetchArticles() {
    const url = `${BASE_URL}?key=${API_KEY}&q=${this.searchValue}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`;
    this.page += 1;
    try {
      const response = await axios.get(url);

      return response.data;
    } catch (e) {
      console.log(e);
    }
  }

  resetPage() {
    this.page = 1;
  }

  get value() {
    return this.searchValue;
  }
  set value(newValue) {
    this.searchValue = newValue;
  }
}