import React, { useState, useEffect } from 'react'
import './Post.css'
import Avatar from '@material-ui/core/Avatar'
import { db } from '../../firebase'
import firebase from 'firebase'



function Post({ postId, userLoggedIn, username, imgUrl, caption}) {

    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')

    useEffect(() => {
        let unsubscribe
        if(postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()))
                })
        }
        return () => {
            unsubscribe()
        }
    }, [postId])

    const handleCommentPost = (e) => {
        e.preventDefault()

        db
          .collection("posts")
          .doc(postId)
          .collection("comments")
          .add({
            username: userLoggedIn.displayName,
            text: comment,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          })

          setComment('')
    }

    return (
        <div className="post">
            <div className="post__header">
                <Avatar 
                    src="data:image/png;base64,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"
                    alt="avatar"
                    className="post__avatar"
                />
                <h3>{username}</h3>
            </div>

            <img 
                src={imgUrl}
                alt="dog"
                className="post__image"
            />
            
            <h4 className="post__text">
                <strong>{username}: </strong>{caption}
            </h4>

            <div className="post__comments">
                {
                    comments.map((comment) => (
                        <p>
                            <strong>{comment.username}: </strong>{comment.text}
                        </p>
                    ))
                }
            </div>

            {
                userLoggedIn && (
                    <form className="post__addCommentForm">
                        <input 
                            type="text"
                            placeholder="add a comment..."
                            value={comment}
                            className="post__commentInput"
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <button 
                            type="submit"
                            className="post__commentBtn"
                            disabled={!comment}
                            onClick={handleCommentPost}
                        >
                            Post
                        </button>
                    </form>
                ) 
            }
        </div>
    )
}

export default Post
