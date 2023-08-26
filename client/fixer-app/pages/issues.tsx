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
import Search from '@/components/Search';
import { Profession } from "@/src/enums/profession";

export default function Issues() {
  const options = Object.values(Profession);
  const token : string = getCookie('jwt_auth')?.toString() || '';
  const headers = {Authorization: `Bearer ${token}`};
  const s3 = {imageUrl: '', userAvatar: ''};
  const [allIssues, setAllIssues] = useState<IssueModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [priceOfferView, setPriceOfferView] = useState(false);
  const [issueView, setIssueView] = useState(false);
  const [issueData, setIssueData] = useState<CardModel>({});
  const [titleFilter, setTitleFilter] = useState<string>(''); 
  const [selectedProfession, setSelectedProfession] = useState<string>(options[0]);

  let handleSearch = (search: string) => {
    setTitleFilter(search);
  }

  let performSelect = async (profession: string) => {
    setSelectedProfession(profession);
    let data = await getIssueByProfessionAsync(profession);
    setAllIssues(data);
  }

  let getIssueByProfessionAsync = async (profession: string) => {
    let response = await fetch(`/api/issue?profession=${profession.toUpperCase()}`, {headers});
    let resJson = await response.json() as ApiResponseModel<IssueModel[]>;
    let data = resJson?.data?.sort((x, y) => {
      let firstDate: number = x?.createdAt ? (new Date(x.createdAt)).getTime() : Date.now();
      let secondDate: number = y?.createdAt ? (new Date(y.createdAt)).getTime() : Date.now();
      return secondDate - firstDate;
    });

    return data ?? [];
  }

  useEffect(() => {
    setIsLoading(true);
    getIssueByProfessionAsync(options[0])
      .then((data: IssueModel[]) => {
        setIsLoading(false);
        setAllIssues(data);
      });
  }, []);

  let getComments = async (issueId: string) => {
    let response = await fetch(`/api/comment?issueId=${issueId}`, {headers});
    let resJson = await response.json() as ApiResponseModel<CommentModel[]>;
    let data = resJson?.data?.sort((x, y) => { 
        let firstDate: number = x?.createdAt ? (new Date(x.createdAt)).getTime() : Date.now();
        let secondDate: number = y?.createdAt ? (new Date(y.createdAt)).getTime() : Date.now();
        return secondDate - firstDate;
    });

    return data ?? [];
  };

  let getPriceOffers = async (issueId: string) => {
    let response = await fetch(`/api/priceOffer?issueId=${issueId}`, {headers});
    let resJson = await response.json() as ApiResponseModel<PriceOfferModel[]>;
    let data = resJson?.data?.sort((x, y) => { 
        let firstDate: number = x?.createdAt ? (new Date(x.createdAt)).getTime() : Date.now();
        let secondDate: number = y?.createdAt ? (new Date(y.createdAt)).getTime() : Date.now();
        return secondDate - firstDate;
    });

    return data ?? [];
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

    return resJson;
  };

  let createPriceOffer = async (priceOffer: PriceOfferModel, autherId: string, cardId: string) => {
    priceOffer.issueId = cardId;
    priceOffer.autherId = autherId;
    let response = await fetch('/api/priceOffer', {method: 'POST', headers, body: JSON.stringify(priceOffer)});
    let resJson = await response.json() as PriceOfferModel;

    return resJson;
  };

  async function handleNewIssue(issue: IssueModel) {
    let data = await getIssueByProfessionAsync(selectedProfession);
    setAllIssues(data);
  }

  let openCardView = (card: CardModel) => {
    setIssueData(card);
    setIssueView(true);
  }
  
  let openPriceOfferView = (card: CardModel) => {
    setIssueData(card);
    setPriceOfferView(true);
  }

  let closeCardView = () => {
    setIssueView(false);
    setPriceOfferView(false);
  }

  return (
    <>
      <Navbar></Navbar>
      <Search
          key="1"
          defaultSearch={titleFilter}
          performSearch={handleSearch}
          options={options}
          performSelect={performSelect}
          inputPlaceHolder='Issue title...'
      />
      <IssueModal handleNewIssue={handleNewIssue}></IssueModal>
      {issueView && (<CardModal cardData={issueData} getComments={getComments} createComment={createComment} hideModal={closeCardView}></CardModal>)}
      {priceOfferView && (<PriceOfferModal cardData={issueData} getPriceOffers={getPriceOffers} createpriceOffer={createPriceOffer} hideModal={closeCardView} ></PriceOfferModal>)}
      
      <div>
        {isLoading
          ? (<Spinner></Spinner>)
          : allIssues
            .filter(issue => issue.title?.toLowerCase().includes(titleFilter.toLowerCase()))
            .map((issue : IssueModel) => (
              <Card key={issue.id} cardData={convertIssueToCard(issue)} openCardView={openCardView} openPriceOfferView={openPriceOfferView} isModalOpen={true} ></Card>
            ))
        }
      </div>
    </>
  );
}