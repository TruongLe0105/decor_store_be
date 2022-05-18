const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
const Product = require("../models/Product");

const controllerProduct = {};
controllerProduct.addProductByAdmin = catchAsync(async (req, res, next) => {
    const { name, categories, description, imageUrl, price } = req.body;
    const product = await Product.create({
        name,
        categories,
        description,
        imageUrl,
        price
    })
    return sendResponse(res, 200, true, product, null, "Add product successful")
})

controllerProduct.getListProduct = catchAsync(async (req, res, next) => {
    let { limit, page, ...filter } = { ...req.query };

    // console.log("name", ...filter)

    limit = parseInt(limit) || 5;
    page = parseInt(page) || 1;

    let filterConditions = [{ isDeleted: false }];

    let allow = ["name", "categories"]
    allow.forEach((field) => {
        if (filter[field] !== undefined) {
            filterConditions.push({
                [field]: { $regex: filter[field], $options: "i" },
            });
        }
    })
    const filterCrireria = filterConditions.length
        ? { $and: filterConditions }
        : {};

    const count = await Product.countDocuments(filterCrireria);
    const totalPage = Math.ceil(count / limit);
    const offset = limit * (page - 1);

    let products = await Product.find(filterCrireria)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);

    return sendResponse(res, 200, true, { products, count, totalPage }, null, "Get list products successful");
})

controllerProduct.getSingleProductById = catchAsync(async (req, res, next) => {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
        throw new AppError(404, "Product not found", "Get single product error")
    }
    return sendResponse(res, 200, true, product, null, "Get single product successful");
})
controllerProduct.updateProductByAdmin = catchAsync(async (req, res, next) => {
    const { productId } = req.params;
    const body = req.body;
    const product = await Product.findById(productId);
    if (!product) {
        throw new AppError(404, "Product not found", "Update product error")
    };

    const allow = ["name", "categories", "description", "imageUrl", "price"];
    allow.forEach(field => {
        if (body[field] !== undefined) {
            product[field] = body[field]
        }
    });
    await product.save();

    return sendResponse(res, 200, true, { product }, null, "Update product successful")
})
controllerProduct.deleteProductByAdmin = catchAsync(async (req, res, next) => {
    const { productId } = req.params;
    const product = await Product.findOneAndUpdate({ _id: productId }, { isDeleted: true })
    if (!product) {
        throw new AppError(404, "Product not found", "Delete product error")
    }

    return sendResponse(res, 200, true, {}, null, "Delete product successful")
})

module.exports = controllerProduct;