const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
const Product = require("../models/Product");

const controllerProduct = {};

controllerProduct.addProductToList = catchAsync(async (req, res, next) => {
    const { name, price, imageUrl, quantity, categories, description } = req.body;
    let product = await Product.find({ name });
    if (product.length) {
        throw new AppError(500, "Sản phẩm không đặt trùng tên", "Add product error")
    }
    product = await Product.create({
        name,
        categories,
        price,
        imageUrl,
        quantity,
        description
    });

    return sendResponse(res, 200, true, { product }, null, "Add product successful!")
});

controllerProduct.getListProduct = catchAsync(async (req, res, next) => {
    let { limit, page, sortBy, ...filter } = req.query;
    limit = parseInt(limit) || 20;
    page = parseInt(page) || 1;

    let sort;
    if (sortBy === "price_decrease") {
        sort = { price: -1 }
    } else if (sortBy === "price_ascending") {
        sort = { price: 1 }
    } else if (sortBy === "oldest") {
        sort = { updatedAt: 1 }
    } else {
        sort = { updatedAt: -1 }
    }

    let filterConditions = [{ isDeleted: false }];

    const allow = ["name", "categories"];
    allow.forEach((field) => {
        if (filter[field] !== undefined) {
            filterConditions.push({
                [field]: { $regex: filter[field], $options: "i" },
            });
        }
    });

    const filterCrireria = filterConditions.length
        ? { $and: filterConditions }
        : {};


    const count = await Product.countDocuments(filterCrireria);
    const totalPage = Math.ceil(count / limit);
    const offset = limit * (page - 1);

    const products = await Product.find(filterCrireria)
        .sort(sort)
        .skip(offset)
        .limit(limit);

    return sendResponse(res, 200, true, { products, count, totalPage }, null, "Get list products successful");
});

controllerProduct.getSingleProductById = catchAsync(async (req, res, next) => {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
        throw new AppError(404, "Product not found", "Get single product error")
    }
    return sendResponse(res, 200, true, product, null, "Get single product successful");
});

controllerProduct.updateProductByAdmin = catchAsync(async (req, res, next) => {
    const { productId } = req.params;
    const body = req.body;
    const product = await Product.findById(productId);
    if (!product) {
        throw new AppError(404, "Product not found", "Update product error")
    };

    const allow = ["name", "categories", "description", "imageUrl", "price", "quantity"];
    allow.forEach(field => {
        if (body[field] !== undefined) {
            product[field] = body[field]
        }
    });
    await product.save();

    // const products = await Product.find({ isDeleted: false })

    return sendResponse(res, 200, true, { product }, null, "Update product successful")
});

controllerProduct.deleteProductByAdmin = catchAsync(async (req, res, next) => {
    const { productId } = req.params;
    const product = await Product.findOneAndDelete({ _id: productId })
    if (!product) {
        throw new AppError(404, "Product not found", "Delete product error")
    }

    const products = await Product.find({ isDeleted: false })

    return sendResponse(res, 200, true, { products }, null, "Delete product successful")
})

module.exports = controllerProduct;