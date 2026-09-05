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