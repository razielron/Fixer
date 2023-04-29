import React, { useState, useEffect } from 'react';
import Issue from './Issue';
import Spinner from './Spinner';
import { getCookie } from 'cookies-next';
import { IssueModel } from '@/src/models/issueModel.js';
import ApiResponseModel from '@/src/models/apiModel';

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
      title: 'title',
      body: 'body',
      createdAt: new Date(),
    };

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/issue', {headers})
      .then(res => res.json())
      .then((response: ApiResponseModel<IssueModel[]>) => {
        let data = response?.data;
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