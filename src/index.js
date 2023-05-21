import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ApiService from './ApiService';

import 'simplelightbox/dist/simple-lightbox.min.css';
import './css/style.css';

const refs = {
  form: document.querySelector('#search-form'),
  galleryEl: document.querySelector('.gallery'),
  loadMoreEl: document.querySelector('.load-more'),
};
const apiService = new ApiService();
let lightbox = new SimpleLightbox('.gallery a');
lightbox.on('show.simplelightbox');

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreEl.addEventListener('click', onLoadMore);

function onFormSubmit(e) {
  e.preventDefault();

  refs.loadMoreEl.classList.add('hidden');
  refs.galleryEl.innerHTML = '';

  apiService.querry = e.currentTarget.elements.searchQuery.value.trim();
  apiService.resetPage();
  apiService.fetchPhotos().then(hits => {
    if (hits.length === 0) {
      refs.loadMoreEl.classList.add('hidden');
      return notifyFail();
    }
    notifySuccess();
    renderCards(hits);
    lightbox.refresh();

    refs.loadMoreEl.classList.remove('hidden');
  });
}

function renderCards(hits) {
  const elements = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a href="${largeImageURL}" class="gallery__item">
    <div class="photo-card">
        <img width="340" height="226" src="${webformatURL}" alt="${tags}" loading="lazy" class="gallery__image" />
            <div class="info">
                <p class="info-item">
                    <b>Likes</b>
                    <span>${likes}</span>
                </p>
                <p class="info-item">
                    <b>Views</b>
                    <span>${views}</span>
                </p>
                <p class="info-item">
                    <b>Comments</b>
                    <span>${comments}</span>
                </p>
                <p class="info-item">
                    <b>Downloads</b>
                    <span>${downloads}</span>
                </p>
            </div>
    </div>
</a>`;
      }
    )
    .join('');
  refs.galleryEl.insertAdjacentHTML('beforeend', elements);
}

function onLoadMore() {
  apiService.fetchPhotos().then(hits => {
    if (hits.length === 0) {
      refs.loadMoreEl.classList.add('hidden');
      return Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    }

    renderCards(hits);
    lightbox.refresh();
  });
}

function notifyFail() {
  return Notify.failure(
    `Sorry, there are no images matching your search ${apiService.querry}. Please try again.`
  );
}
function notifySuccess() {
  return Notify.success(`Hooray! We found ${apiService.totalHits} images.`);
}
