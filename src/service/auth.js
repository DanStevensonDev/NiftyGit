import firebase from '../config/firebase-config'

const socialMediaAuth = () => {
    return firebase.auth().signInWithPopup(new firebase.auth.GithubAuthProvider())
        .then((res) => {
            return res
    })
}

export default socialMediaAuth