export const catchAsyncError = (passedFunction) => (req, res, next) => {
    Promise.resolve(passedFunction(req, res))
      .catch((err) => next(err)); // Pass the caught error to next middleware
  };
  