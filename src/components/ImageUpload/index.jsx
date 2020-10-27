import React, { useState } from 'react'
import { Input, Button, LinearProgress, Typography } from '@material-ui/core'
import { db, storage } from '../../firebase'
import firebase from 'firebase'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box';
import './ImageUpload.css'


function LinearProgressWithLabel(props) {
    return (
      <Box display="flex" alignItems="center">
        <Box width="100%" mr={1}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box minWidth={35}>
          <Typography variant="body2" color="textSecondary">{`${Math.round(
            props.value,
          )}%`}</Typography>
        </Box>
      </Box>
    )
}

const useStyles = makeStyles({
    root: {
      width: '100%',
    },
})


function ImageUpload({ username }) {

    const classes = useStyles()

    const [caption, setCaption] = useState('')
    const [image, setImage] = useState(null)
    const [progress, setProgress] = useState(0)

    const handleImage = (e) => {
        if(e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }


    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image)
        uploadTask.on('state_changed', (snapshot) => {
            //progress bar function
            const progressBarVal = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            )
            setProgress(progressBarVal)
        }, (error) => {
            //error function
            console.log(error)
            alert(error.message)
        }, () => {
            //adding entry to the database
            storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then((url) => {
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imgUrl: url,
                        username: username
                    })
                })

            setProgress(0)
            setCaption('')
            setImage(null)
        })
    }

    return (
        <div className="imageUpload__container">
            <div className={classes.root}>
                <LinearProgressWithLabel value={progress} />
            </div>
            <Input 
                type="text"
                placeholder="Enter a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
            />
            <Input 
                type="file"
                onChange={handleImage}
            />
            <Button 
                onClick={handleUpload}
                disabled={!image || !caption}
            >
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload
