const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
const Product = require("../models/Product");


// NOT DONE. MISS ADMIN
const controllerProduct = {};
controllerProduct.addProductByAdmin = catchAsync(async (req, res, next) => {
    const { name, category, description, image, price } = req.body;
    const product = await Product.create({
        name,
        category,
        description,
        image,
        price
    })
    return sendResponse(res, 200, true, product, null, "Add product successful")
})

controllerProduct.getListProduct = catchAsync(async (req, res, next) => {
    let { limit, page, sort_by, ...filter } = req.query;
    limit = limit || 10;
    page = page || 1;

    let filterCondition = [];
    const allow = ["name", "collections", "price", "amountBuyer", "updatedAt"]
    allow.forEach(field => {
        if (filter[field] !== undefined) {
            filterCondition.push({
                [field]: { $regex: filter[field], $options: "i" },
            });
        }
    });

    const filterCriteria = filterCondition.length ? { $and: filterCondition } : {};

    const count = await Product.countDocuments(filterCriteria);
    const totalPage = Math.ceil(count / limit);
    const offset = limit * (page - 1);

    const products = await Product.find(filterCriteria)
        .sort({ createAt: -1 })
        .skip(offset)
        .limit(limit)

    return sendResponse(res, 200, true, { products, count, totalPage }, null, "Get list products successful")
})

controllerProduct.getSingleProductById = catchAsync(async (req, res, next) => {
    const { productId } = req.params
    const product = await Product.findById(productId)
    if (!product) {
        throw new AppError(404, "Product not found", "Get single product error")
    }
    return sendResponse(res, 200, true, product, null, "Get single product successful")
})
controllerProduct.updateProductByAdmin = catchAsync(async (req, res, next) => {

})
controllerProduct.deleteProductByAdmin = catchAsync(async (req, res, next) => {

})

module.exports = controllerProduct;