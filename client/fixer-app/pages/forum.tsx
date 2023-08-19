import React, { useState, useEffect } from 'react';
import { getCookie } from 'cookies-next';
import { PostModel } from '@/src/models/postModel.js';
import { ApiResponseModel } from '@/src/models/apiModel';
import PostModal from "@/components/PostModal";
import Card from "@/components/Card";
import { CardModel } from '@/src/models/CardModel';
import Spinner from '@/components/Spinner';
import CardModal from '@/components/CardModal';
import { CommentModel } from '@/src/models/commentModel';
import Navbar from "@/components/Navbar";

export default function Posts() {
  const token : string = getCookie('jwt_auth')?.toString() || '';
  const headers = {Authorization: `Bearer ${token}`};
  const s3 = {imageUrl: '', userAvatar: ''};
  const [allPosts, setAllPosts] = useState<PostModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [postView, setPostView] = useState(false);
  const [postData, setPostData] = useState<CardModel>({});

  let commentModel = {
    body: 'raz & omer = <3'
  };

  const post: PostModel = {
      id: 'id',
      autherId: 'razId',
      autherName: 'raz',
      title: 'shower renovation',
      body: 'I want to renovate the shower at home. Does anyone know a professional?',
      createdAt: new Date(),
  };


  useEffect(() => {
    setIsLoading(true);
    fetch('/api/post', {headers})
      .then(res => res.json())
      .then((response: ApiResponseModel<PostModel[]>) => {
        console.log({response})
        let data = response?.data?.sort((x, y) => { 
          let firstDate: number = x?.createdAt ? (new Date(x.createdAt)).getTime() : Date.now();
          let secondDate: number = y?.createdAt ? (new Date(y.createdAt)).getTime() : Date.now();
          return secondDate - firstDate;
        });
        console.log({data});

        if(!data?.length) {
          data = [post, post];
        }
        console.log({data});
        setIsLoading(false);
        setAllPosts(data);
      })
  }, []);

  let getComments = async (postId: string) => {
    let response = await fetch(`/api/comment?postId=${postId}`, {headers});
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



  let convertPostToCard = (post: PostModel) => {
    console.log({post})
    let card: CardModel = {
      ...post,
      imageUrls: post.photoUrl ? [post.photoUrl] : null,
    };
    return card;
  }

  let createComment = async (comment: CommentModel, autherId: string, cardId: string) => {
    comment.postId = cardId;
    comment.autherId = autherId;
    let response = await fetch('/api/comment', {method: 'POST', headers, body: JSON.stringify(comment)});
    let resJson = await response.json() as CommentModel;
    console.log({resJson});
    return resJson;
  };



  function handleNewPost(post: PostModel) {
    post.id = Math.floor(Math.random() * 100000).toString();
    post.createdAt = new Date();
    setAllPosts([post, ...allPosts]);
    //TODO: fix this hack
    window.location.reload();
  }

  let openCardView = (card: CardModel) => {
    setPostData(card);
    setPostView(true);
    console.log({card})
  }


  let closeCardView = () => {
    setPostView(false);
  }

  return (
    <>
      <Navbar></Navbar>
      <PostModal handleNewPost={handleNewPost}></PostModal>
      {postView && (<CardModal cardData={postData} getComments={getComments} createComment={createComment} hideModal={closeCardView}></CardModal>)}
      
      <div>
        <div className="text-center mb-4 text-4xl font-extrabold leading-none tracking-tight text-yellow-500 md:text-5xl lg:text-6xl dark:text-white">Posts</div>
        {isLoading
          ? (<Spinner></Spinner>)
          : allPosts.map((post : PostModel) => (
              <Card cardData={convertPostToCard(post)} openCardView={openCardView} isModalOpen={true} isPostView={true}></Card>
            ))
        }
      </div>
    </>
  );
}