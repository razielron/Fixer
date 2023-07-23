import React, { useState, useEffect } from 'react';
import { getCookie } from 'cookies-next';
import { IssueModel } from '@/src/models/issueModel.js';
import { ApiResponseModel } from '@/src/models/apiModel';
import IssueModal from "@/components/IssueModal";
import Card from "@/components/Card";
import { CardModel } from '@/src/models/CardModel';
import Spinner from '@/components/Spinner';
import CardModal from '@/components/CardModal';
import { CommentModel } from '@/src/models/commentModel';
import Navbar from "@/components/Navbar";
import { PriceOfferModel } from '@/src/models/priceOfferModel';
import PriceOfferModal from '@/components/PriceOfferModal';

export default function Issues() {
  const token : string = getCookie('jwt_auth')?.toString() || '';
  const headers = {Authorization: `Bearer ${token}`};
  const s3 = {imageUrl: '', userAvatar: ''};
  const [allIssues, setAllIssues] = useState<IssueModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [priceOfferView, setPriceOfferView] = useState(false);
  const [issueView, setIssueView] = useState(false);
  const [issueData, setIssueData] = useState<CardModel>({});


  let commentModel = {
    body: 'raz & omer = <3'
  };

  let priceOfferModel = {
    price: 75,
    body: 'ani aci zol sheyes basok'
  };

  const post: IssueModel = {
      id: 'id',
      autherId: 'razId',
      autherName: 'raz',
      title: 'A washing machine gets the clothes dirty',
      body: 'After running the machine, the clothes come out with black stains',
      createdAt: new Date(),
  };

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/issue', {headers})
      .then(res => res.json())
      .then((response: ApiResponseModel<IssueModel[]>) => {
        let data = response?.data?.sort((x, y) => { 
          let firstDate: number = x?.createdAt ? (new Date(x.createdAt)).getTime() : Date.now();
          let secondDate: number = y?.createdAt ? (new Date(y.createdAt)).getTime() : Date.now();
          return secondDate - firstDate;
        });
        if(!data?.length) {
          data = [post, post];
        }
        console.log({data});
        setIsLoading(false);
        setAllIssues(data);
      })
  }, []);

  let getComments = async (issueId: string) => {
    let response = await fetch(`/api/comment?issueId=${issueId}`, {headers});
    let resJson = await response.json() as ApiResponseModel<CommentModel[]>;
    console.log({commentDataJson: resJson});
    let data = resJson?.data?.sort((x, y) => { 
        let firstDate: number = x?.createdAt ? (new Date(x.createdAt)).getTime() : Date.now();
        let secondDate: number = y?.createdAt ? (new Date(y.createdAt)).getTime() : Date.now();
        return secondDate - firstDate;
    });
    console.log({commentData: data});
    if(!data?.length) {
        data = [commentModel, commentModel];
    }
    return data;
  };

  let getPriceOffers = async (issueId: string) => {
    let response = await fetch(`/api/priceOffer?issueId=${issueId}`, {headers});
    let resJson = await response.json() as ApiResponseModel<PriceOfferModel[]>;
    console.log({priceOfferDataJson: resJson});
    let data = resJson?.data?.sort((x, y) => { 
        let firstDate: number = x?.createdAt ? (new Date(x.createdAt)).getTime() : Date.now();
        let secondDate: number = y?.createdAt ? (new Date(y.createdAt)).getTime() : Date.now();
        return secondDate - firstDate;
    });
    console.log({priceOfferData: data});
    if(!data?.length) {
        data = [priceOfferModel, priceOfferModel];
    }
    return data;
  };

  let convertIssueToCard = (issue: IssueModel) => {
    let card: CardModel = {
      ...issue,
      imageUrls: issue.photoUrl ? [issue.photoUrl] : null,
    };
    return card;
  }

  let createComment = async (comment: CommentModel, autherId: string, cardId: string) => {
    comment.issueId = cardId;
    comment.autherId = autherId;
    let response = await fetch('/api/comment', {method: 'POST', headers, body: JSON.stringify(comment)});
    let resJson = await response.json() as CommentModel;
    console.log({resJson});
    return resJson;
  };

  let createPriceOffer = async (priceOffer: PriceOfferModel, autherId: string, cardId: string) => {
    priceOffer.issueId = cardId;
    priceOffer.autherId = autherId;
    let response = await fetch('/api/priceOffer', {method: 'POST', headers, body: JSON.stringify(priceOffer)});
    let resJson = await response.json() as PriceOfferModel;
    console.log({resJson});
    window.location.reload();
    return resJson;
  };

  function handleNewIssue(issue: IssueModel) {
    issue.id = Math.floor(Math.random() * 100000).toString();
    issue.createdAt = new Date();
    setAllIssues([issue, ...allIssues]);
    //TODO: fix this hack
    window.location.reload();
  }

  let openCardView = (card: CardModel) => {
    setIssueData(card);
    setIssueView(true);
    console.log({card})
  }
  let openPriceOfferView = (card: CardModel) => {
    setIssueData(card);
    setPriceOfferView(true);
    console.log({card})
  }

  let closeCardView = () => {
    setIssueView(false);
    setPriceOfferView(false);
  }

  return (
    <>
      <Navbar></Navbar>
      <IssueModal handleNewIssue={handleNewIssue}></IssueModal>
      {issueView && (<CardModal cardData={issueData} getComments={getComments} createComment={createComment} hideModal={closeCardView}></CardModal>)}
      {priceOfferView && (<PriceOfferModal cardData={issueData} getPriceOffers={getPriceOffers} createpriceOffer={createPriceOffer} hideModal={closeCardView} ></PriceOfferModal>)}
      
      <div>
        <div className="text-center mb-4 text-4xl font-extrabold leading-none tracking-tight text-yellow-500 md:text-5xl lg:text-6xl dark:text-white">Issues </div>
        {isLoading
          ? (<Spinner></Spinner>)
          : allIssues.map((issue : IssueModel) => (
              <Card cardData={convertIssueToCard(issue)} openCardView={openCardView} openPriceOfferView={openPriceOfferView} isModalOpen={true} ></Card>
            ))
        }
      </div>
    </>
  );
}