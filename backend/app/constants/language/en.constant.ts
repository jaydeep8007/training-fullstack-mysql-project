export const msg = {
  common: {
    unexpectedError: "Oops! Something went wrong. Please try again later.",
    unauthorized: "You are not authorized to perform this action.",
    invalidToken: "Session expired or token is invalid. Please log in again.",
    invalidId: "No matching record found for the given ID.",
    fetchSuccess: "Data retrieved successfully.",
    createSuccess: "Record created successfully.",
    updateSuccess: "Record updated successfully.",
    deleteSuccess: "Record deleted successfully.",
    deleteFailed: "Failed to delete the record.",
    notFound: "The requested resource was not found.",
    alreadyExists: "A similar record already exists.",
    invalidInput: "Input validation failed. Please check your data.",
    missingFields: "Some required fields are missing.",
    invalidEmail: "Please provide a valid email address.",
    invalidPhone: "Phone number format is invalid.",
    invalidDate: "Date format is not valid.",
    invalidPassword: "Password does not meet security requirements.",
    passwordMismatch: "Passwords do not match.",
    emailAlreadyExists: "This email is already registered.",
    usernameAlreadyExists: "This username is already taken.",
    requiredAllFields: "Please fill in all required fields.",
  },

  customer: {
    createSuccess: "Customer registered successfully.",
    fetchSuccess: "Customer data fetched successfully.",
    fetchFailed: "Failed to fetch customer data.",
    updateSuccess: "Customer details updated.",
    updateFailed: "Unable to update customer details.",
    deleteSuccess: "Customer removed successfully.",
    deleteFailed: "Failed to remove customer.",
    notFound: "Customer not found.",
    notFoundById: "No customer found with the provided ID.",
    emailAlreadyExists: "A customer with this email already exists.",
  },

  auth: {
    loginSuccess: "Logged in successfully.",
    registerSuccess: "Registration successful. Welcome aboard!",
    logoutSuccess: "Logged out successfully.",
    resetPasswordSuccess: "Your password has been reset.",
    emailNotFound: "No account associated with this email.",
    accountInactive: "Account is currently inactive.",
    invalidPassword: "Incorrect password.",
    passwordMismatch: "Passwords must match.",
    emailRequired: "Email is required.",
    usernameRequired: "Username is required.",
    usernameNotFound: "Username does not exist.",
    usernameAlreadyExists: "This username is already in use.",
    deletedUser: "This account is no longer accessible.",
    resetTokenSent: "A password reset token has been sent to your email.",
    invalidResetToken: "The reset token is invalid or has expired.",
  },

  employee: {
    // ✅ Success Messages
    createSuccess: "Employee created successfully.",
    fetchSuccess: "Employee details fetched successfully.",
    updateSuccess: "Employee record updated.",
    deleteSuccess: "Employee record deleted.",

    // ❌ Not Found / Existence Errors
    notFound: "Employee not found.",
    notFoundById: "No employee found with the provided ID.",
    emailAlreadyExists: "An employee with this email already exists.",
    phoneAlreadyExists: "An employee with this phone number already exists.",

    // ⚠️ Validation Errors (Optional but recommended)
    invalidEmail: "Invalid email format.",
    invalidPhone: "Invalid phone number format.",
    missingFields: "Required employee fields are missing.",
    invalidId: "Invalid employee ID provided.",
  },

  job: {
    // ✅ Success Messages
    createSuccess: "Job posted successfully.",
    fetchSuccess: "Job details fetched successfully.",
    updateSuccess: "Job details updated.",
    deleteSuccess: "Job deleted successfully.",

    // ❌ Error Messages
    notFound: "Job not found.",
    notFoundById: "Job not found with the given ID.", // (Optional, for clarity)
    skuExists: "A job with this SKU already exists.",
  },
  employeeJob: {
    assignSuccess: "Job assigned to employee(s) successfully.",
  },
};
