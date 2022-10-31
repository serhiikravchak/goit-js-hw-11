import './css/styles.css';
import PixabayApiService from './js/fetchApi';
import markup from './templates/markup.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SmoothScroll from 'smoothscroll-for-websites';

const refs = {
  form: document.querySelector('.search-form'),
  div: document.querySelector('.gallery'),
  btn: document.querySelector('button'),
  input: document.querySelector('[name=searchQuery]'),
  loadMoreBtn: document.querySelector('.load-more-btn'),
  guard: document.querySelector('.guard'),
  scrollUp: document.querySelector('.scroll-up'),
};

const gallerySimpleLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  animationSpeed: 300,
  fadeSpeed: 600,
});

const notifyOptions = {
  showOnlyTheLastOne: true,
};

const apiPixabay = new PixabayApiService();

const forGuardOptions = {
  root: null,
  rootMargin: '50px',
  threshold: 1,
};
const observer = new IntersectionObserver(onLoad, forGuardOptions);

refs.scrollUp.hidden = true;

function onFormSubmit(e) {
  e.preventDefault();
  refs.scrollUp.hidden = false;
  scrollUp();

  apiPixabay.value = e.currentTarget[0].value.trim();

  if (apiPixabay.value === '') {
    return Notify.info('Enter something', notifyOptions);
  }

  apiPixabay.resetPage();
  apiPixabay.fetchArticles().then(data => {
    if (data.total === 0) {
      return Notify.failure('Sorry, there are no images matching your search query. Please try again.', notifyOptions);
    }
    newRenderOnSearch();
    render(data.hits);
    Notify.info(`Hooray! We found ${data.totalHits} images.`, notifyOptions);
  });

  return;
}

refs.form.addEventListener('submit', onFormSubmit);

function render(data) {
  refs.div.insertAdjacentHTML('beforeend', markup(data));

  observer.observe(refs.guard);
  gallerySimpleLightbox.refresh();

  return;
}



function newRenderOnSearch() {
  refs.div.innerHTML = '';
}
let pages = 1;
function onLoad(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      apiPixabay.fetchArticles().then(data => {
        render(data.hits);
        let totalPages = Math.ceil(data.totalHits / data.hits.length);
        pages += 1;
        if (totalPages === pages) {
          return Notify.info('We are sorry, but you have reached the end of search results.', notifyOptions);
        }
      });
    }
  });
}

SmoothScroll({
  stepSize: 175,
  animationTime: 800,
  accelerationDelta: 200,
  accelerationMax: 6,
  keyboardSupport: true,
  arrowScroll: 100,
});

refs.scrollUp.addEventListener('click', scrollUp);

function scrollUp() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}