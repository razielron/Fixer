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
import Search from '@/components/Search';
import ChatModal from '@/components/ChatModal';

export default function Posts() {
  const token : string = getCookie('jwt_auth')?.toString() || '';
  const headers = {Authorization: `Bearer ${token}`};
  const s3 = {imageUrl: '', userAvatar: ''};
  const [allPosts, setAllPosts] = useState<PostModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [postView, setPostView] = useState(false);
  const [postData, setPostData] = useState<CardModel>({});
  const [titleFilter, setTitleFilter] = useState<string>(''); 

  let handleSearch = (search: string) => {
    setTitleFilter(search);
  }

  let getPosts = async (): Promise<PostModel[]> => {
    let response = await fetch('/api/post', {headers});
    let resJson = await response.json() as ApiResponseModel<PostModel[]>;
    let data = resJson?.data?.sort((x, y) => {
      let firstDate: number = x?.createdAt ? (new Date(x.createdAt)).getTime() : Date.now();
      let secondDate: number = y?.createdAt ? (new Date(y.createdAt)).getTime() : Date.now();
      return secondDate - firstDate;
    });

    return data ?? [];
  }

  useEffect(() => {
    setIsLoading(true);
    getPosts().then((data: PostModel[]) => {
        setIsLoading(false);
        if(data.length) {
          setAllPosts(data);
        }
      });
  }, []);

  let getComments = async (postId: string) => {
    let response = await fetch(`/api/comment?postId=${postId}`, {headers});
    let resJson = await response.json() as ApiResponseModel<CommentModel[]>;
    let data = resJson?.data?.sort((x, y) => { 
        let firstDate: number = x?.createdAt ? (new Date(x.createdAt)).getTime() : Date.now();
        let secondDate: number = y?.createdAt ? (new Date(y.createdAt)).getTime() : Date.now();
        return secondDate - firstDate;
    });

    return data ?? [];
  };

  let convertPostToCard = (post: PostModel) => {
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
    return resJson;
  };

  let handleNewPost = async (post: PostModel) => {
    let data = await getPosts();
    if(data.length) {
      setAllPosts(data);
    }
  }

  let openCardView = (card: CardModel) => {
    setPostData(card);
    setPostView(true);
  }

  let closeCardView = () => {
    setPostView(false);
  }

  return (
    <>
      <Navbar></Navbar>
      <Search
          key="1"
          defaultSearch={titleFilter}
          performSearch={handleSearch}
          inputPlaceHolder='Post title...'
      />
      <ChatModal/>
      <PostModal handleNewPost={handleNewPost}></PostModal>
      {postView && (<CardModal cardData={postData} getComments={getComments} createComment={createComment} hideModal={closeCardView}></CardModal>)}
      
      <div>
        {isLoading
          ? (<Spinner></Spinner>)
          : allPosts
            .filter((post: PostModel) => post?.title?.toLowerCase().includes(titleFilter.toLowerCase()))
            .map((post : PostModel) => (
              <Card key={post.id} cardData={convertPostToCard(post)} openCardView={openCardView} isModalOpen={true} isPostView={true}></Card>
            ))
        }
      </div>
    </>
  );
}