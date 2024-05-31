

//handler function to wrap each route.
module.exports = {
    asyncHandler: (cd) => {
        return async (req, res, next) => {
            try {
                await cd(req, res, next);
            } catch (error) {
                //forward error to the globasl error handler
                next(error);
            }
        };
    }
};