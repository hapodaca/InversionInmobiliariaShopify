document.addEventListener('DOMContentLoaded', () => {
  const sortBySelect = document.querySelector('facet-sort-by select');

  if (!sortBySelect) return;

  sortBySelect.addEventListener('change', (event) => {
    const form = event.target.form;
    const url = new URL(window.location.href);
    const sortBy = event.target.value;

    url.searchParams.set('sort_by', sortBy);
    url.searchParams.set('section_id', 'main-collection'); // Cambia si usas otro ID

    // Mostrar loading overlay
    document.querySelector('.collection-loading-overlay')?.classList.add('active');

    fetch(url.toString())
      .then(response => response.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Reemplazar el grid
        const newGrid = doc.querySelector('#product-grid');
        const currentGrid = document.querySelector('#product-grid');

        if (newGrid && currentGrid) {
          currentGrid.innerHTML = newGrid.innerHTML;
        }

        // Reemplazar filtros activos si los tienes
        const newFilters = doc.querySelector('[data-facets-active]');
        const currentFilters = document.querySelector('[data-facets-active]');
        if (newFilters && currentFilters) {
          currentFilters.innerHTML = newFilters.innerHTML;
        }

        // Quitar loading
        document.querySelector('.collection-loading-overlay')?.classList.remove('active');

        // Opcional: actualizar la URL sin recargar
        // Remueve section_id antes de actualizar la URL visible
            url.searchParams.delete('section_id');
            window.history.replaceState({}, '', url.pathname + '?' + url.searchParams.toString());
      })
      .catch(err => {
        console.error('Error al aplicar sort_by:', err);
        document.querySelector('.collection-loading-overlay')?.classList.remove('active');
      });
  });
});