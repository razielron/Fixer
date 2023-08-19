import axios from 'axios';
import path from 'path';
import { PriceOfferModel } from '../models/priceOfferModel.js';
import {ApiResponseModel} from '@/src/models/apiModel';

const baseUrl = `${process.env.SERVER_URL}:${process.env.SERVER_PORT}`;
const getByIdEndpoint: string = '/priceOffer/';
const getByIssueIdEndpoint: string = '/priceOffer/issue/';
const createEndpoint: string = '/priceOffer/create/';
const updateEndpoint: string = '/priceOffer/update/';
const deleteEndpoint: string = '/priceOffer/';

let headers = { Accept: 'application/json', Authorization: '', 'Content-Type': 'application/json' };

class PriceOfferClient {

    public async getPriceOfferById(priceOfferId: string, token: string) : Promise<ApiResponseModel<PriceOfferModel>> {
        try {
            let getPriceOfferBaseUrl: URL = new URL(getByIdEndpoint, baseUrl);
            let getPriceOfferUrl : URL = new URL (priceOfferId, getPriceOfferBaseUrl);
            headers.Authorization = token;
            const {data} = await axios.get(getPriceOfferUrl.toString(), {headers});
            
            return data;
        }
        catch(error: unknown) {
            let errorMessage = `Internal error when trying to get priceOffer ${priceOfferId}`;
            console.log({error});
            const response: ApiResponseModel<PriceOfferModel> = {
                error: errorMessage
            }

            return response;
        }
    }

    public async getPriceOfferByIssueId(issueId: string, token: string) : Promise<ApiResponseModel<PriceOfferModel[]>> {
        try {
            let getPriceOfferBaseUrl: URL = new URL(getByIssueIdEndpoint, baseUrl);
            let getPriceOfferUrl : URL = new URL (issueId, getPriceOfferBaseUrl);
            headers.Authorization = token;
            const { data } = await axios.get(getPriceOfferUrl.toString(), {headers});

            return data;
        }
        catch(error: unknown) {
            let errorMessage = `Internal error when trying to get priceOffer by issueId ${issueId}`;
            console.log({error});
            const response: ApiResponseModel<PriceOfferModel[]> = {
                error: errorMessage
            }
            
            return response;
        }
    }

    public async createPriceOffer(priceOffer: PriceOfferModel, token: string) : Promise<ApiResponseModel<PriceOfferModel>> {
        try {
            let createPriceOfferUrl: URL = new URL(createEndpoint, baseUrl);
            headers.Authorization = token;
            const { data } = await axios.post(createPriceOfferUrl.toString(), priceOffer, {headers});
            
            return data;
        }
        catch(error: unknown) {
            let errorMessage = `Internal error when trying to create priceOffer`;
            console.log({error});
            const response: ApiResponseModel<PriceOfferModel> = {
                error: errorMessage
            }

            return response;
        }
    }

    public async updatePriceOffer(priceOffer: PriceOfferModel, token: string) : Promise<ApiResponseModel<PriceOfferModel>> {
        try {
            if(!priceOffer.id) throw "missing priceOffer id";
            let updatePriceOfferUrl: string = path.join(baseUrl, updateEndpoint, priceOffer.id);
            headers.Authorization = token;
            const { data } = await axios.put(updatePriceOfferUrl, {data: priceOffer}, {headers});
            
            return data;
        }
        catch(error: unknown) {
            let errorMessage = `Internal error when trying to update priceOffer: ${priceOffer.id}`;
            console.log({error});
            const response: ApiResponseModel<PriceOfferModel> = {
                error: errorMessage
            }

            return response;
        }
    }

    public async deletePriceOffer(priceOfferId: string, token: string) : Promise<ApiResponseModel<PriceOfferModel>> {
        try {
            let deletePriceOfferUrl: string = path.join(baseUrl, deleteEndpoint, priceOfferId);
            headers.Authorization = token;
            const { data } = await axios.delete(deletePriceOfferUrl, {headers});

            return data;
        }
        catch(error: unknown) {
            let errorMessage = `Internal error when trying to delete priceOffer: ${priceOfferId}`;
            console.log({error});
            const response: ApiResponseModel<PriceOfferModel> = {
                error: errorMessage
            }

            return response;
        }
    }
}

let priceOfferClient : PriceOfferClient = new PriceOfferClient();

export {
    priceOfferClient
}