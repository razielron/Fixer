import type {
        User,
        Post,
        Issue,
        Comment,
        Review,
        Product,
        Order
    }
from '@prisma/client'
import { Prisma as PrismaTypes } from '@prisma/client';

//type User = Partial<user>
type Nullable<T> = T | null;

type UserModel = Partial<User> | null | PrismaTypes.UserCreateInput;
type PostModel = Partial<Post> | null | PrismaTypes.PostCreateInput;
type IssueModel = Partial<Issue> | null;
type CommentModel = Partial<Comment> | null;
type ReviewModel = Partial<Review> | null;
type ProductModel = Partial<Product> | null;
type OrderModel = Partial<Order> | null;

class UserNotNull implements Partial<User> {}
class PostNotNull implements Partial<Post> {}
class IssueNotNull implements Partial<Issue> {}
class CommentNotNull implements Partial<Comment> {}
class ReviewNotNull implements Partial<Review> {}
class ProductNotNull implements Partial<Product> {}
class OrderNotNull implements Partial<Order> {}

export {
    UserModel,
    PostModel,
    IssueModel,
    CommentModel,
    ReviewModel,
    ProductModel,
    OrderModel
}