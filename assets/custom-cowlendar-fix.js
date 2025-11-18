/**
 * Custom JavaScript to remove duplicate Floor Plan dropdown
 * This script removes the duplicate variant-selects element that appears when clicking the Reservar ahora button
 */
(function() {
  // Function to remove duplicate variant-selects
  function removeDuplicateVariantSelects() {
    // Get all variant-selects elements
    const variantSelects = document.querySelectorAll('variant-selects');
    
    // If there's more than one variant-selects, keep only the first one
    if (variantSelects.length > 1) {
      // Keep track of which variant-selects to remove
      const toRemove = [];
      
      // Check each variant-selects
      variantSelects.forEach(function(el) {
        // If it's inside or after a cowlendar element, mark it for removal
        if (el.closest('[data-cowlendar-form="true"]') || 
            el.previousElementSibling && (
              el.previousElementSibling.classList.contains('cowlendar-btn') || 
              el.previousElementSibling.hasAttribute('data-cowlendar-form')
            )) {
          toRemove.push(el);
        }
        
        // If it has specific data attributes, mark it for removal
        if (el.getAttribute('data-url') === '/products/rio-danubio-vista-hermosa-cuernavaca' ||
            el.getAttribute('data-section') === 'template--15190205497393__main' ||
            el.getAttribute('data-section') === 'template--15190114795569__main') {
          toRemove.push(el);
        }
      });
      
      // Remove the marked elements
      toRemove.forEach(function(el) {
        el.parentNode.removeChild(el);
      });
    }
  }
  
  // Run the function when the DOM is fully loaded
  document.addEventListener('DOMContentLoaded', removeDuplicateVariantSelects);
  
  // Also run the function when the cowlendar button is clicked
  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('cowlendar-btn') || 
        event.target.closest('.cowlendar-btn')) {
      // Wait a short time for any DOM changes to complete
      setTimeout(removeDuplicateVariantSelects, 100);
    }
  });
  
  // Create a MutationObserver to watch for DOM changes
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length) {
        // Check if any of the added nodes are variant-selects
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i];
          if (node.nodeName === 'VARIANT-SELECTS' || 
              (node.nodeType === 1 && node.querySelector('variant-selects'))) {
            // If a variant-selects was added, run our function
            setTimeout(removeDuplicateVariantSelects, 100);
            break;
          }
        }
      }
    });
  });
  
  // Start observing the document body for DOM changes
  observer.observe(document.body, { childList: true, subtree: true });
})();