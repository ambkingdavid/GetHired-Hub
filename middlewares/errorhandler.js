const errorHandler = (err, req, res, next) => {
  console.log(err);
   const defaultErrors = {
    statusCode: 500,
    message: 'Server Error',
   }

   //validation error for missing fields
   if (err.name === 'ValidationError') {
    console.log('check')
    defaultErrors.statusCode = 400;
    defaultErrors.message = Object.values(err.errors).map((item) => item.message).join(',');
   }

   //duplicate key error
   if (err.code && err.code === 11000) {
    defaultErrors.statusCode = 400;
    defaultErrors.message = `${Object.keys(err.keyValue)} must be unique`;
   }

   res.status(defaultErrors.statusCode).send({ message: defaultErrors.message });
};

export default errorHandler;
