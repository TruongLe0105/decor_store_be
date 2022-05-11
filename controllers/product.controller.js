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
    let { limit, page, sortBy, ...filter } = req.query;
    limit = limit || 10;
    page = page || 1;

    let filterCondition = [{ isDeleted: false }];
    const allowFilter = ["name", "categories"];

    // let sortCondition = [];
    // const allowSort = ["price", "updateAt"];
    // allowSort.forEach(field =>{
    //     if(sortBy === field) {

    //     }
    // })

    allowFilter.forEach(field => {
        if (filter[field] !== undefined) {
            filterCondition.push({
                [field]: { $regex: filter[field], $options: "i" },
            });
        }
    });

    const filterCriteria = filterCondition.length ? { $and: filterCondition } : {};

    const count = await Product.countDocuments({ filterCriteria });
    const totalPage = Math.ceil(count / limit);
    const offset = limit * (page - 1);

    const products = await Product.find({ filterCriteria })
        .sort({ createAt: -1 })
        .skip(offset)
        .limit(limit)
    console.log(products)

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