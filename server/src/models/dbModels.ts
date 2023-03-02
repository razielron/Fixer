import type {
        User as user,
        Post as post,
        Issue as issue,
        Comment as comment,
        Review as review,
        Product as product,
        Order as order
    }
from '@prisma/client'

//type User = Partial<user>
type Nullable<T> = T | null;

type User = Partial<user> | null;
type Post = Partial<post> | null;
type Issue = Partial<issue> | null;
type Comment = Partial<comment> | null;
type Review = Partial<review> | null;
type Product = Partial<product> | null;
type Order = Partial<order> | null;

class UserNotNull implements Partial<user> {}
class PostNotNull implements Partial<post> {}
class IssueNotNull implements Partial<issue> {}
class CommentNotNull implements Partial<comment> {}
class ReviewNotNull implements Partial<review> {}
class ProductNotNull implements Partial<product> {}
class OrderNotNull implements Partial<order> {}

export {
    User,
    Post,
    Issue,
    Comment,
    Review,
    Product,
    Order
}