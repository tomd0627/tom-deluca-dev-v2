/**
 * Modern form validation module using Constraint Validation API
 * Follows HTML5 and WCAG accessibility standards
 */

const VALIDATION_RULES = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },
  name: {
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s'-]+$/,
    message: 'Please enter a valid name (letters, spaces, hyphens, and apostrophes only)',
  },
  message: {
    minLength: 10,
    maxLength: 5000,
    message: 'Message must be between 10 and 5000 characters',
  },
};

/**
 * Validate a single field using native Constraint Validation API
 * @param {HTMLInputElement|HTMLTextAreaElement} field - The form field to validate
 * @returns {boolean} - Whether the field is valid
 */
const validateField = (field) => {
  const fieldName = field.name;
  const fieldValue = field.value.trim();
  const errorElement = document.getElementById(`${field.id}-error`);

  // Clear previous errors
  field.setAttribute('aria-invalid', 'false');
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.setAttribute('role', 'alert');
  }

  // Check if field is empty (required validation)
  if (field.hasAttribute('required') && !fieldValue) {
    const errorMsg = 'This field is required';
    setFieldError(field, errorMsg, errorElement);
    return false;
  }

  // If field is not required and empty, it's valid
  if (!field.hasAttribute('required') && !fieldValue) {
    return true;
  }

  // Apply field-specific validation rules
  const rules = VALIDATION_RULES[fieldName];
  if (rules) {
    // Check minLength
    if (rules.minLength && fieldValue.length < rules.minLength) {
      const errorMsg = `Must be at least ${rules.minLength} characters`;
      setFieldError(field, errorMsg, errorElement);
      return false;
    }

    // Check maxLength
    if (rules.maxLength && fieldValue.length > rules.maxLength) {
      const errorMsg = `Must not exceed ${rules.maxLength} characters`;
      setFieldError(field, errorMsg, errorElement);
      return false;
    }

    // Check pattern
    if (rules.pattern && !rules.pattern.test(fieldValue)) {
      setFieldError(field, rules.message, errorElement);
      return false;
    }
  }

  // Use native email validation if it's an email field
  if (field.type === 'email') {
    if (!field.validity.valid) {
      setFieldError(field, 'Please enter a valid email address', errorElement);
      return false;
    }
  }

  return true;
};

/**
 * Set error state on a field and display error message
 * @param {HTMLInputElement|HTMLTextAreaElement} field - The form field
 * @param {string} errorMessage - The error message to display
 * @param {HTMLElement|null} errorElement - The element where error message will be displayed
 */
const setFieldError = (field, errorMessage, errorElement) => {
  field.setAttribute('aria-invalid', 'true');
  if (errorElement) {
    errorElement.textContent = errorMessage;
  }
};

/**
 * Validate entire form
 * @param {HTMLFormElement} form - The form element to validate
 * @returns {boolean} - Whether the entire form is valid
 */
const validateForm = (form) => {
  const fields = form.querySelectorAll('input, textarea');
  let isFormValid = true;

  fields.forEach((field) => {
    // Skip honeypot field
    if (field.type === 'text' && field.name === 'name-bot') {
      return;
    }
    if (!validateField(field)) {
      isFormValid = false;
    }
  });

  return isFormValid;
};

/**
 * Initialize form validation
 * Attaches validation listeners to form fields and handles form submission
 * @param {string} formSelector - CSS selector for the form
 */
export const initializeFormValidation = (formSelector = '.form') => {
  const form = document.querySelector(formSelector);
  if (!form) {
    return;
  }

  // Get all form fields except honeypot
  const fields = form.querySelectorAll('input:not([name="name-bot"]), textarea');

  // Real-time validation on blur
  fields.forEach((field) => {
    field.addEventListener('blur', () => {
      validateField(field);
    });

    // Clear error message on input
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') {
        const errorElement = document.getElementById(`${field.id}-error`);
        if (errorElement && field.value.trim()) {
          // Re-validate as user types
          validateField(field);
        }
      }
    });
  });

  // Handle form submission
  form.addEventListener('submit', (e) => {
    if (!validateForm(form)) {
      e.preventDefault();
      // Focus on first invalid field
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) {
        firstInvalid.focus();
      }
    }
  });
};
