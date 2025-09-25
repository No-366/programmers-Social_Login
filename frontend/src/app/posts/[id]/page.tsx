"use client";

import { fetchApi } from "@/lib/client";
import { PostCommentDto, PostDto } from "@/type/post";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function PostCommentListItem({
  postComment,
  postCommentState,
}: {
  postComment: PostCommentDto;
  postCommentState: ReturnType<typeof usePostComments>;
}) {
  const { modifyPostComment, toggleModifyMode, modifyMode, deletePostComment } =
    postCommentState;

  const handleModifySubmit = (e: any) => {
    e.preventDefault();
    const form = e.target;
    const contentInput = form.content;
    const contentValue = contentInput.value;

    modifyPostComment(postComment.id, contentValue);
  };

  return (
    <li key={postComment.id} className="flex gap-2 items-center">
      <span>{postComment.id} : </span>
      {modifyMode && (
        <form className="flex gap-2" onSubmit={handleModifySubmit}>
          <input
            type="text"
            name="content"
            defaultValue={postComment.content}
            className="border-2 p-2 rounded"
          />
          <button className="border-2 p-2 rounded" type="submit">
            저장
          </button>
        </form>
      )}
      {!modifyMode && <span>{postComment.content}</span>}
      <button className="border-2 p-2 rounded" onClick={toggleModifyMode}>
        {modifyMode ? "수정취소" : "수정"}
      </button>
      <button
        className="border-2 p-2 rounded"
        onClick={() => {
          deletePostComment(postComment.id);
        }}
      >
        삭제
      </button>
    </li>
  );
}

function PostCommentWrite({
  postId,
  postCommentsState,
}: {
  postId: number;
  postCommentsState: ReturnType<typeof usePostComments>;
}) {
  const { writePostComment } = postCommentsState;

  const handleAddPostComment = (e: any) => {
    const form = e.target;
    const contentInput = form.content;
    const contentValue = contentInput.value;

    if (contentValue.length === 0) {
      alert("내용을 입력해주세요.");
      contentInput.focus();
      return;
    }

    if (contentValue.length < 2) {
      alert("내용은 2자 이상 입력해주세요.");
      contentInput.focus();
      return;
    }

    writePostComment(contentValue);
  };

  return (
    <>
      <h2>댓글 작성</h2>
      <form className="flex gap-2 items-center" onSubmit={handleAddPostComment}>
        <textarea
          rows={5}
          name="content"
          className="border-2 p-2 rounded"
          maxLength={100}
        />
        <button type="submit" className="border-2 p-2 rounded">
          저장
        </button>
      </form>
    </>
  );
}

function PostCommentList({
  postId,
  postCommentsState,
}: {
  postId: number;
  postCommentsState: ReturnType<typeof usePostComments>;
}) {
  const { postComments, deletePostComment, onModifySuccess } =
    postCommentsState;

  return (
    <>
      <h2 className="p-2">댓글 목록</h2>
      {postComments === null && <div>Loading...</div>}

      <div className="flex flex-col gap-2">
        {postComments !== null && postComments.length === 0 && (
          <div>댓글이 없습니다.</div>
        )}

        {postComments !== null && postComments.length > 0 && (
          <ul className="flex flex-col gap-2">
            {postComments.map((postComment) => (
              <PostCommentListItem
                key={postComment.id}
                postComment={postComment}
                postCommentState={postCommentsState}
              />
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

function PostCommentWriteAndList({
  post,
  postCommentsState,
}: {
  post: PostDto;
  postCommentsState: ReturnType<typeof usePostComments>;
}) {
  return (
    <>
      <PostCommentWrite
        postId={post.id}
        postCommentsState={postCommentsState}
      />

      <PostCommentList postId={post.id} postCommentsState={postCommentsState} />
    </>
  );
}

function usePost(postId: number) {
  const [post, setPost] = useState<PostDto | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchApi(`/api/v1/posts/${postId}`)
      .then(setPost)
      .catch((err) => {
        alert(err);
        router.replace("/posts");
      });
  }, []);

  const deletePost = (id: number) => {
    fetchApi(`/api/v1/posts/${id}`, {
      method: "DELETE",
    }).then((data) => {
      alert(data.msg);
      router.replace("/posts");
    });
  };

  return { post, deletePost };
}

function usePostComments(postId: number) {
  const [postComments, setPostComments] = useState<PostCommentDto[] | null>(
    null
  );
  const [modifyMode, setModifyMode] = useState(false);

  useEffect(() => {
    fetchApi(`/api/v1/posts/${postId}/comments`).then(setPostComments);
  }, []);

  const deletePostComment = (commentId: number) => {
    fetchApi(`/api/v1/posts/${postId}/comments/${commentId}`, {
      method: "DELETE",
    }).then((data) => {
      alert(data.msg);

      if (postComments === null) return;

      // 리렌더링을 위한 댓글 배열 교체 필요
      setPostComments(
        postComments.filter((postComment) => postComment.id !== commentId)
      );
    });
  };

  const writePostComment = (contentValue: string) => {
    fetchApi(`/api/v1/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ content: contentValue }),
    }).then((data) => {
      alert(data.msg);

      if (postComments === null) return;
      setPostComments([...postComments, data.data.commentDto]);
    });
  };

  const modifyPostComment = (commentId: number, contentValue: string) => {
    fetchApi(`/api/v1/posts/${postId}/comments/${commentId}`, {
      method: "PUT",
      body: JSON.stringify({ content: contentValue }),
    }).then((data) => {
      alert(data.msg);
      toggleModifyMode();
      onModifySuccess(commentId, contentValue);
    });
  };

  const toggleModifyMode = () => {
    setModifyMode(!modifyMode);
  };

  const onModifySuccess = (id: number, contentValue: string) => {
    if (postComments === null) return;

    setPostComments(
      postComments.map((postComment) =>
        postComment.id === id
          ? { ...postComment, content: contentValue }
          : postComment
      )
    );
  };

  return {
    postComments,
    setPostComments,
    deletePostComment,
    onModifySuccess,
    writePostComment,
    modifyPostComment,
    toggleModifyMode,
    modifyMode,
  };
}

function PostInfo({
  post,
  postState,
}: {
  post: PostDto;
  postState: ReturnType<typeof usePost>;
}) {
  const { deletePost } = postState;

  return (
    <>
      <h1 className="p-2">글 상세 보기</h1>

      <div>
        <div>번호 : {post.id}</div>
        <div>제목 : {post.title}</div>
        <div>내용 : {post.content}</div>
      </div>

      <div className="flex gap-4">
        <Link className="border-2 p-2 rounded" href={`/posts/${post.id}/edit`}>
          수정
        </Link>
        <button
          className="border-2 p-2 rounded"
          onClick={() => {
            deletePost(post.id);
          }}
        >
          삭제
        </button>
      </div>
    </>
  );
}

export default function Home() {
  const { id: postIdStr } = useParams();
  const postId = Number(postIdStr);
  const postState = usePost(postId);
  const postCommentsState = usePostComments(postId);
  const { post } = postState;

  if (post === null) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <PostInfo post={post} postState={postState} />
      <PostCommentWriteAndList
        post={post}
        postCommentsState={postCommentsState}
      />
    </>
  );
}
