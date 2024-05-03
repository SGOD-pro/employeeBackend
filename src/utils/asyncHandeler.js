const asyncHandler = (handelerFunction) => {
    return (req, res, next) => {
        Promise.resolve(handelerFunction(req, res, next)).catch(err => { next(err) })
    }
}

export {asyncHandler}