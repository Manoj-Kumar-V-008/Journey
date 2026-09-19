// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})();


// auto-dismiss after 4 seconds
  const flashToast = document.getElementById("flashToast");
  if (flashToast) {
      setTimeout(() => {
          bootstrap.Alert.getOrCreateInstance(flashToast).close();
      }, 4000);
  }

  const filters = document.querySelectorAll("#filters .filter");
const listingItems = document.querySelectorAll(".listing-item");

filters.forEach(filter => {
    filter.addEventListener("click", () => {
        // 1. Update active state
        filters.forEach(f => f.classList.remove("active"));
        filter.classList.add("active");

        const selectedCategory = filter.getAttribute("data-category");

        // 2. Filter listings
        listingItems.forEach(item => {
            const itemCategory = item.getAttribute("data-category");
            if (selectedCategory === "all" || itemCategory === selectedCategory) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }
        });
    });
});
