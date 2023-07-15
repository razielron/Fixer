import { PrismaClient } from '@prisma/client';
import { PhotoModel } from '../models/dbModels.js';
import { Prisma as PrismaTypes } from '@prisma/client';

const prisma = new PrismaClient();

class PhotoRepository {
    public async getPhotoById(photoId: string): Promise<PhotoModel> {
        try {
            let where = { id: photoId };
            let photo: PhotoModel = await prisma.photo.findFirst({ where });
            return photo;
        }
        catch(error: any) {
            console.log({error});
            throw error;
        }
    }

    public async getPhotosByIssueId(issueId: string): Promise<PhotoModel[]> {
        try {
            let where = { issueId: issueId };
            let photos: PhotoModel[] = await prisma.photo.findMany({ where });
            return photos;
        }
        catch(error: any) {
            console.log({error});
            throw error;
        }
    }

    public async createPhotos(photos: PhotoModel[]): Promise<PhotoModel[]> {
        let photoInputModel : (PrismaTypes.PhotoCreateInput | null)[] = photos.map(x => this.getPhotoCreateInput(x));
        
        if (!photoInputModel) {
            throw new Error("Cnnot create Photos. The given photos array is not type of PhotoCreateInput[]");
        }

        try {
            let data = photoInputModel.filter(x => x != null) as PrismaTypes.PhotoCreateInput[];
            let createPhotosPromise: Promise<PhotoModel>[] = data.map(x => prisma.photo.create({ data: x }));
            let createdPhotos: PhotoModel[] = await Promise.all(createPhotosPromise);
            return createdPhotos;
        }
        catch (error: unknown) {
            console.log({error});
            throw error;
        }
    }

    public async updatePhoto(photo: PhotoModel): Promise<PhotoModel> {
        if (!photo?.id) {
            throw new Error("Missing id to update photo");
        }

        try {
            let where = { id: photo.id };
            let data: PrismaTypes.PhotoUncheckedUpdateInput = photo;
            let updatedPhoto: PhotoModel = await prisma.photo.update({ where, data });

            return updatedPhoto;
        }
        catch (error: unknown) {
            console.log({error});
            throw error;
        }
    }

    public async deletePhoto(id: string): Promise<PhotoModel> {
        try {
            let where = { id };
            let deletedPhoto = prisma.photo.delete({ where });

            return deletedPhoto;
        }
        catch (error: unknown) {
            console.log({error});
            throw error;
        }
    }

    private getPhotoCreateInput(photo: PhotoModel): PrismaTypes.PhotoCreateInput | null {
        if(!photo?.url
            || (!photo?.userId && !photo?.issueId && !photo?.postId)) {
            return null;
        }

        let photoCreateInput: PrismaTypes.PhotoCreateInput = {
            url: photo.url
        }

        if(photo?.userId) {
            return {
                ...photoCreateInput,
                user: {
                    connect: { id: photo.userId }
                }
            }
        }

        if(photo?.issueId) {
            return {
                ...photoCreateInput,
                issue: {
                    connect: { id: photo.issueId }
                }
            }
        }

        if(photo?.postId) {
            return {
                ...photoCreateInput,
                post: {
                    connect: { id: photo.postId }
                }
            }
        }

        return null;
    }
}

let photoRepository: PhotoRepository = new PhotoRepository();

export {
    photoRepository
}