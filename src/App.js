import './App.css';
import Post from './components/Post';
import { useState, useEffect } from 'react'
import { db, auth } from './firebase'
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './components/ImageUpload';
import instagramPlusIcon from './assets/instagram-plus-icon.png'



function getModalStyle() {
  const top = 50
  const left = 50
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {

  const classes = useStyles()
  const [modalStyle] = useState(getModalStyle)

  const [isOpenSignUp, setIsOpenSignUp] = useState(false)
  const [isOpenLogin, setIsOpenLogin] = useState(false)
  const [isOpenUpload, setIsOpenUpload] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])


  useEffect(() => {
    //following will also return a function to remove the listner
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser) {
        //if user is logged in
        setUser(authUser)
        console.log(user)
      }else {
        //if user is logged out
        setUser(null)
      }
    })

    return () => {
      unsubscribe()   //removing the onAuthStateChanged() listner
    }
  }, [user])

  useEffect(() => {
    db
      .collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        setPosts(snapshot.docs.map((doc) => (
          {
            id: doc.id, 
            post: doc.data()
          }
        )))
      })
  }, [])


  const handleSignUp = (e) => {
    e.preventDefault()
    
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return (
          authUser.user.updateProfile({
            displayName: username
          })
        )
      })
      .catch((error) => alert(error.message))

    setIsOpenSignUp(false)
  }
  

  const handleLogin = (e) => {
    e.preventDefault()

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))

    setIsOpenLogin(false)
  }

  return (
    <div className="app">
      
      <Modal
        open={isOpenSignUp}
        onClose={() => setIsOpenSignUp(false)}
      >
         <div style={modalStyle} className={classes.paper}>
          <form className="app__signUpForm">
            <center>
                <img
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="instagram-logo"
                className="app__headerImage"
                />
            </center>
            <Input 
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input 
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={handleSignUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={isOpenLogin}
        onClose={() => setIsOpenLogin(false)}
      >
         <div style={modalStyle} className={classes.paper}>
          <form className="app__signUpForm">
            <center>
                <img
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="instagram-logo"
                className="app__headerImage"
                />
            </center>
            <Input 
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={handleLogin}>Login</Button>
          </form>
        </div>
      </Modal>


      <Modal
        open={isOpenUpload}
        onClose={() => setIsOpenUpload(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <ImageUpload username={user?.displayName} setIsOpenUpload={setIsOpenUpload} />
        </div>
      </Modal>

      <div className="app__header">
        <img
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="instagram-logo"
          className="app__headerImage"
        />
        {
          user ? (
            <div className="app__userButtonsContainer">
              <Button onClick={() => auth.signOut()}>Logout</Button>
              <Button onClick={() => setIsOpenUpload(true)}>
                <img
                  src={instagramPlusIcon}
                  alt="upload-post-icon"
                  className="app__uploadIcon"
                />
              </Button>
            </div>
          ) : (
            <div className="app__userButtonsContainer">
              <Button onClick={() => setIsOpenLogin(true)}>Login</Button>
              <Button onClick={() => setIsOpenSignUp(true)}>Sign Up</Button>
            </div>
          )
        }
      </div>

      <div className="app__postsContainer">
        {
          posts.map(({id, post}) => {
            return (
              <Post key={id} userLoggedIn={user} postId={id} {...post} />
            )
          })
        }
      </div>
    
    </div>
  );
}

export default App;
