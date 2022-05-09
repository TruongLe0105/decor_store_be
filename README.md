# Decor Store:

## Requires

- Able to use Mongoose and MongoDB
- Able to use express request object. Must include the use of body, params, and query
- Able to apply to Send Response helper
- Able to apply Error Handling
- Able to apply the JWT authentication process
- Able to apply Bcrypt

- Minimum 2 main entities (For example Post in Codercomm is the main entity, User is also the main entity while Comment, Reaction, Friend are not)
- Minimum 2 sub-entities 
- At least 1 set of CRUD for each entity
- User information must not be deleted once entered
- Minimum 1 user role (For example Public vs Login or Admin vs Customer). More  roles and features that are related to different roles will be rewarded with extra marks.
- API response must have a reasonable HTTP status code, message, and data or error
- All GET routes that return a list must have pagination, limit, search, and sort options enabled for front end
- While using express-validator is not a requirement. You are required to have reasonable protection to all the routes from bad requests.

## Features

### User authentication and managing account (UserFlow)
- User can create account with email and password(firstName, lastName).(Create) ✅
- User can login with email and password registered. ✅
    1. User can login with gmail or facebook. ❌
- Owner can see own user's information.(Read) ✅
    1. Admin can see profile of users. ❌
    2. Admin can deactivate user's account by id. ❌
- Owner can update own account profile.(Update) ✅
- Owner can change password. 
- Owner can deactivate own user's account(Delete). ✅

### Managing Cart (CartFlow)
- Authentication user can add a product to Cart. (Create) 
- Authentication user can see a list products in Cart. (Read)  
- Authentication user can update amount products in Cart. (Update) 
- Authentication user can delete products in cart. (Delete) 
- Authentication user can delete cart. (Delete) 

### Managing Order (OrderFlow)
- Owner can create a order with products (Create) ❌
- Owner can see list orders, filter by all, pending, awaiting fulfillment, awaiting shipment, completed and declined  (Read) ❌
- Owner can cancel orders to update orders (Update) ❌
- Owner can cancel order with condition orders aren't delivering (Delete) ❌

### Managing products (productFlow)
- Admin can add products. ❌
- User can see list products.  (fe)✅
- User can find products by name. ✅
<!-- - User can add a product to Cart. (fe) -->
- User can filter products by collections and sort products by price, newest, oldest in collections. ❌ sort product by .sort({})
- User can see information of a products by id. ✅
- Admin can update products ❌
- Admin can delete products ❌

### CRUD comment and reaction for product (InteractionFlow)
- Authentication user can create a comment( post a comment) to a product. ❌
- Authentication user can see list comment in a product. ❌
- Author of comment can update this comment. ❌
- Author of comment can delete this comment. ❌
- Authentication user can make a reaction to a product. ❌
- Authentication user can make a reaction to a comment. ❌



<!-- Question for mention Minh:
    - 1 Cart chưá 1 product được không?
    - Vậy lúc tạo order là mình dùng array gộp các cart lại đúng k?
    
 -->