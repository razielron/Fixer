import React, { useContext } from 'react';
import Issue from './Issue';
import { issueClient } from '@/pages/api/issueClient';
import { IssueModel, GetIssuesResponse } from '../src/models/issueModel.js';

async function Issues() {
  const issuesResponse: GetIssuesResponse = await issueClient.getIssueByProfession('ELECTRICIAN');
  const allIssues : IssueModel[] = issuesResponse.data || [];
  const s3 = {imageUrl: '', userAvatar: ''};
  return (
    <div>
      {allIssues.map((issue) => (
        <Issue
          key={issue.id}
          createdBy={issue.autherId}
          title={issue.title}
          body={issue.body}
          timestamp={issue.createdAt}
          imageUrl={s3.imageUrl}
          userAvatar={s3.userAvatar}
        />
      ))}
    </div>
  );
}

export default Issues;