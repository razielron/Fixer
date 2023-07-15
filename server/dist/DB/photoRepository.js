var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
class PhotoRepository {
    getPhotoById(photoId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let where = { id: photoId };
                let photo = yield prisma.photo.findFirst({ where });
                return photo;
            }
            catch (error) {
                console.log({ error });
                throw error;
            }
        });
    }
    getPhotosByIssueId(issueId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let where = { issueId: issueId };
                let photos = yield prisma.photo.findMany({ where });
                return photos;
            }
            catch (error) {
                console.log({ error });
                throw error;
            }
        });
    }
    createPhotos(photos) {
        return __awaiter(this, void 0, void 0, function* () {
            let photoInputModel = photos.map(x => this.getPhotoCreateInput(x));
            if (!photoInputModel) {
                throw new Error("Cnnot create Photos. The given photos array is not type of PhotoCreateInput[]");
            }
            try {
                let data = photoInputModel.filter(x => x != null);
                let createPhotosPromise = data.map(x => prisma.photo.create({ data: x }));
                let createdPhotos = yield Promise.all(createPhotosPromise);
                return createdPhotos;
            }
            catch (error) {
                console.log({ error });
                throw error;
            }
        });
    }
    updatePhoto(photo) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(photo === null || photo === void 0 ? void 0 : photo.id)) {
                throw new Error("Missing id to update photo");
            }
            try {
                let where = { id: photo.id };
                let data = photo;
                let updatedPhoto = yield prisma.photo.update({ where, data });
                return updatedPhoto;
            }
            catch (error) {
                console.log({ error });
                throw error;
            }
        });
    }
    deletePhoto(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let where = { id };
                let deletedPhoto = prisma.photo.delete({ where });
                return deletedPhoto;
            }
            catch (error) {
                console.log({ error });
                throw error;
            }
        });
    }
    getPhotoCreateInput(photo) {
        if (!(photo === null || photo === void 0 ? void 0 : photo.url)
            || (!(photo === null || photo === void 0 ? void 0 : photo.userId) && !(photo === null || photo === void 0 ? void 0 : photo.issueId) && !(photo === null || photo === void 0 ? void 0 : photo.postId))) {
            return null;
        }
        let photoCreateInput = {
            url: photo.url
        };
        if (photo === null || photo === void 0 ? void 0 : photo.userId) {
            return Object.assign(Object.assign({}, photoCreateInput), { user: {
                    connect: { id: photo.userId }
                } });
        }
        if (photo === null || photo === void 0 ? void 0 : photo.issueId) {
            return Object.assign(Object.assign({}, photoCreateInput), { issue: {
                    connect: { id: photo.issueId }
                } });
        }
        if (photo === null || photo === void 0 ? void 0 : photo.postId) {
            return Object.assign(Object.assign({}, photoCreateInput), { post: {
                    connect: { id: photo.postId }
                } });
        }
        return null;
    }
}
let photoRepository = new PhotoRepository();
export { photoRepository };
//# sourceMappingURL=photoRepository.js.map