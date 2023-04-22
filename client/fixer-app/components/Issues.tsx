import React, { useState, useEffect } from 'react';
import Issue from './Issue';
import Spinner from './Spinner';
import { issueClient } from '@/pages/api/issueClient';
import { IssueModel } from '../src/models/issueModel.js';
import { getCookie } from 'cookies-next';

export default function Issues() {
  const token : string = getCookie('jwt_auth')?.toString() || '';
  const s3 = {imageUrl: '', userAvatar: ''};
  const [allIssues, setAllIssues] = useState<IssueModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const post: IssueModel = {
      id: 'id',
      autherId: 'razId',
      //autherName: 'raz',
      title: 'title',
      body: 'body',
      createdAt: new Date(),
    };

  useEffect(() => {
    issueClient.getIssueByProfession('ELECTRICIAN', token)
      .then((issuesResponse) => {
        setIsLoading(false);
        setAllIssues(issuesResponse.data || [post, post]);
      })
      .catch((err) => {
        console.error({err});
      });
  }, []);

  return (
    <div>
      {isLoading
        ? (<Spinner></Spinner>)
        : allIssues.map((issue : IssueModel) => (
          <Issue
            key={issue.id}
            createdBy={issue.autherId}
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