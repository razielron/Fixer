import type {
        User,
        Post,
        Issue,
        Comment,
        Review,
        PriceOffer,
        Product,
        Order
    }
from '@prisma/client'
import { Prisma as PrismaTypes } from '@prisma/client';

//type User = Partial<user>
type Nullable<T> = T | null;

type UserModel = Partial<User> | null | PrismaTypes.UserCreateInput;
type PostModel = Partial<Post> | null;
type IssueModel = Partial<Issue> | null;
type CommentModel = Partial<Comment> | null;
type ReviewModel = Partial<Review> | null;
type PriceOfferModel = Partial<PriceOffer> | null;
type ProductModel = Partial<Product> | null;
type OrderModel = Partial<Order> | null;

export {
    UserModel,
    PostModel,
    IssueModel,
    CommentModel,
    ReviewModel,
    PriceOfferModel,
    ProductModel,
    OrderModel
}