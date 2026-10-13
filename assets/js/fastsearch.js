// Copy of PaperMod's assets/js/fastsearch.js, changed to follow the Pras' Labs design system (Search section).
// Hugo prefers a file in the site's assets/ over the theme's, so this replaces the theme copy.
// Changes, each marked "Pras' Labs" below:
//   1. The input is the Nav field. The results page has no search box of its own (layouts/search.html).
//   2. The query comes from ?q= in the URL (the Nav form is a GET form), so a result page can be linked and
//      reached with Back. Nothing searches while typing: Enter submits the form.
//   3. Escape does not clear anything. The Nav field's own handler (layouts/partials/header.html) only blurs.
//   4. The field is not focused on load, so the Nav links are not clipped when the page opens.
//   5. Results are PostCard rows (title, excerpt, date, read time, tags) instead of PaperMod's title-only list.
//      The extra fields come from layouts/index.json.
import * as params from '@params';

const resList = document.getElementById('searchResults');
// Pras' Labs: the Nav field is the only search field.
const sInput = document.querySelector('.pl-nav .pl-field');

let fuse;
let currentElement = null;
let firstResult = null;
let lastResult = null;

const defaultFuseOptions = {
    distance: 100,
    threshold: 0.4,
    ignoreLocation: true,
    keys: ['title', 'permalink', 'summary', 'content']
};

const buildFuseOptions = () => {
    if (!params.fuseOpts) {
        return defaultFuseOptions;
    }

    return {
        isCaseSensitive: params.fuseOpts.iscasesensitive ?? false,
        includeScore: params.fuseOpts.includescore ?? false,
        includeMatches: params.fuseOpts.includematches ?? false,
        minMatchCharLength: params.fuseOpts.minmatchcharlength ?? 1,
        shouldSort: params.fuseOpts.shouldsort ?? true,
        findAllMatches: params.fuseOpts.findallmatches ?? false,
        keys: params.fuseOpts.keys ?? defaultFuseOptions.keys,
        location: params.fuseOpts.location ?? 0,
        threshold: params.fuseOpts.threshold ?? defaultFuseOptions.threshold,
        distance: params.fuseOpts.distance ?? defaultFuseOptions.distance,
        ignoreLocation: params.fuseOpts.ignorelocation ?? defaultFuseOptions.ignoreLocation
    };
};

const reset = () => {
    currentElement = null;
    firstResult = null;
    lastResult = null;
    resList.innerHTML = '';
    sInput.value = '';
    sInput.focus();
};

const setActiveResult = (element) => {
    document.querySelectorAll('.focus').forEach((item) => item.classList.remove('focus'));

    if (!element) {
        return;
    }

    element.focus();
    element.closest('li')?.classList.add('focus');
    currentElement = element;
};

const renderResults = (results) => {
    if (!Array.isArray(results) || results.length === 0) {
        resList.innerHTML = '';
        firstResult = lastResult = currentElement = null;
        return;
    }

    const fragment = document.createDocumentFragment();

    for (const result of results) {
        // Pras' Labs: a PostCard row, the same markup as layouts/partials/pl-post-row.html. The whole row is one
        // link (the title link covers the row in CSS). Text is set with textContent, never as HTML.
        const item = result.item;
        const li = document.createElement('li');
        const article = document.createElement('article');
        article.className = 'pl-post';

        const h2 = document.createElement('h2');
        h2.className = 'pl-post-title';
        const link = document.createElement('a');
        link.className = 'pl-post-link';
        link.href = item.permalink;
        link.textContent = item.title;
        h2.appendChild(link);
        article.appendChild(h2);

        if (item.excerpt) {
            const p = document.createElement('p');
            p.className = 'pl-post-excerpt';
            p.textContent = item.excerpt;
            article.appendChild(p);
        }

        const dateText = [item.date, item.readtime].filter(Boolean).join(' · ');
        const tags = Array.isArray(item.tags) ? item.tags : [];
        if (dateText || tags.length) {
            const meta = document.createElement('div');
            meta.className = 'pl-post-meta';
            if (dateText) {
                const d = document.createElement('span');
                d.className = 'pl-post-date';
                d.textContent = dateText;
                meta.appendChild(d);
            }
            for (const tag of tags) {
                const t = document.createElement('span');
                t.className = 'pl-post-tag';
                t.textContent = '#' + tag;
                meta.appendChild(t);
            }
            article.appendChild(meta);
        }

        li.appendChild(article);
        fragment.appendChild(li);
    }

    resList.innerHTML = '';
    resList.appendChild(fragment);
    firstResult = resList.firstElementChild;
    lastResult = resList.lastElementChild;
};

const performSearch = () => {
    if (!fuse) {
        return;
    }

    const query = sInput.value.trim();
    if (!query) {
        renderResults([]);
        return;
    }

    const searchOptions = params.fuseOpts?.limit ? { limit: params.fuseOpts.limit } : undefined;
    const results = searchOptions ? fuse.search(query, searchOptions) : fuse.search(query);
    renderResults(results);
};

const initSearch = async () => {
    if (!sInput || !resList) {
        return;
    }

    try {
        const response = await fetch('../index.json');
        if (!response.ok) {
            throw new Error(`Search index load failed: ${response.status}`);
        }

        const data = await response.json();
        if (data) {
            fuse = new Fuse(data, buildFuseOptions());
        }

        // Pras' Labs: the Nav search field submits to /search/?q=..., so run that query once the index is ready.
        const initialQuery = new URLSearchParams(window.location.search).get('q');
        if (initialQuery) {
            sInput.value = initialQuery;
            performSearch();
        }
    } catch (error) {
        console.error(error);
    }
};

window.addEventListener('load', initSearch);

sInput?.addEventListener('search', () => {
    if (!sInput.value) {
        reset();
    }
});

document.addEventListener('keydown', (event) => {
    const { key } = event;
    const active = document.activeElement;
    // Pras' Labs: the field or a result. Escape is not handled here.
    const isInSearchBox = active === sInput || resList.contains(active);

    if (!firstResult || !isInSearchBox) {
        return;
    }

    if (key === 'ArrowDown') {
        event.preventDefault();

        if (active === sInput) {
            setActiveResult(firstResult.querySelector('.pl-post-link'));
        } else if (active?.closest('li') !== lastResult) {
            setActiveResult(active?.closest('li')?.nextElementSibling?.querySelector('.pl-post-link'));
        }
    } else if (key === 'ArrowUp') {
        event.preventDefault();

        if (active?.closest('li') === firstResult) {
            setActiveResult(sInput);
        } else if (active !== sInput) {
            setActiveResult(active?.closest('li')?.previousElementSibling?.querySelector('.pl-post-link'));
        }
    } else if (key === 'ArrowRight') {
        if (active?.matches?.('.pl-post-link')) {
            active.click();
        }
    }
});
