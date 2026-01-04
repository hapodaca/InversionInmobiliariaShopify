document.addEventListener('DOMContentLoaded', () => {
  const sortBySelect = document.querySelector('facet-sort-by select');

  if (!sortBySelect) {
    console.log('No se encontró el select de ordenamiento');
    return;
  }

  console.log('Select de ordenamiento encontrado. Valor actual:', sortBySelect.value);

  sortBySelect.addEventListener('change', (event) => {
    const sortBy = event.target.value;
    console.log('=== SORT CAMBIADO ===');
    console.log('Nuevo valor seleccionado:', sortBy);
    console.log('Valor del option:', event.target.selectedOptions[0].text);

    // Construir URL limpia
    const currentUrl = new URL(window.location.href);
    const newUrl = new URL(window.location.pathname, window.location.origin);

    // Preservar búsqueda
    const searchQuery = currentUrl.searchParams.get('q');
    if (searchQuery) {
      newUrl.searchParams.set('q', searchQuery);
      newUrl.searchParams.set('options[prefix]', 'last');
    }

    // IMPORTANTE: Agregar sort_by
    newUrl.searchParams.set('sort_by', sortBy);
    console.log('sort_by configurado a:', sortBy);

    // Preservar filtros
    for (let [key, value] of currentUrl.searchParams.entries()) {
      if (key.startsWith('filter.') || key === 'page') {
        newUrl.searchParams.set(key, value);
      }
    }

    // Section ID para fetch
    const isSearchPage = window.location.pathname.includes('/search');
    const sectionId = isSearchPage ? 'main-search' : 'main-collection';
    newUrl.searchParams.set('section_id', sectionId);

    console.log('URL completa para fetch:', newUrl.toString());

    // Mostrar loading
    const loadingOverlay = document.querySelector('.collection-loading-overlay');
    if (loadingOverlay) loadingOverlay.classList.add('active');

    fetch(newUrl.toString())
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.text();
      })
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Actualizar grid
        const newGrid = doc.querySelector('#product-grid');
        const currentGrid = document.querySelector('#product-grid');

        if (newGrid && currentGrid) {
          currentGrid.innerHTML = newGrid.innerHTML;
          console.log('✓ Grid actualizado');
        } else {
          console.error('✗ No se encontró el grid');
        }

        // Actualizar contador
        const newCount = doc.querySelector('.ProductCountDesktop');
        const currentCount = document.querySelector('.ProductCountDesktop');
        if (newCount && currentCount) {
          currentCount.innerHTML = newCount.innerHTML;
        }

        // Actualizar select para reflejar el orden correcto
        const newSelect = doc.querySelector('facet-sort-by select');
        if (newSelect) {
          sortBySelect.innerHTML = newSelect.innerHTML;
          sortBySelect.value = sortBy;
          console.log('✓ Select actualizado a:', sortBy);
        }

        // Ocultar loading
        if (loadingOverlay) loadingOverlay.classList.remove('active');

        // Actualizar URL (sin section_id)
        newUrl.searchParams.delete('section_id');
        window.history.replaceState({}, '', newUrl.toString());

        console.log('✓ Sort aplicado:', sortBy);
        console.log('URL final:', newUrl.toString());
      })
      .catch(err => {
        console.error('✗ Error en fetch:', err);
        if (loadingOverlay) loadingOverlay.classList.remove('active');

        // Fallback: recargar página
        console.log('Recargando página como fallback...');
        newUrl.searchParams.delete('section_id');
        window.location.href = newUrl.toString();
      });
  });
});