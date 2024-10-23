const customError = (status = 500, message = "Internal Server Error") => {
  const newError = new Error();
  newError.message = message;
  newError.status = status;
  return newError;
};

module.exports = {
  customError,
};
