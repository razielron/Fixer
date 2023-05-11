import React, { useState, useEffect } from 'react';
import Issue from './Issue';
import Spinner from './Spinner';
import { getCookie } from 'cookies-next';
import { IssueModel } from '@/src/models/issueModel.js';
import ApiResponseModel from '@/src/models/apiModel';
import IssueModal from "@/components/IssueModal";


export default function Issues() {
  const token : string = getCookie('jwt_auth')?.toString() || '';
  const headers = {Authorization: `Bearer ${token}`};
  const s3 = {imageUrl: '', userAvatar: ''};
  const [allIssues, setAllIssues] = useState<IssueModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
        console.log({response})
        if(!data?.length) {
          data = [post, post];
        }
        console.log({data});
        setIsLoading(false);
        setAllIssues(data);
      })
  }, []);

  return (
    <div>
      <div className="text-center text-5xl">Issues </div>
      {isLoading
        ? (<Spinner></Spinner>)
        : allIssues.map((issue : IssueModel) => (
          <Issue
            key={issue.id}
            createdBy={issue.autherName}
            title={issue.title}
            body={issue.body}
            timestamp={issue.createdAt}
            imageUrl={s3.imageUrl}
            userAvatar={s3.userAvatar}
          />))
      }
    </div>
  );
}