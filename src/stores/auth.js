import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const googleProfile = ref(null);
  const facebookProfile = ref(null);
  const accessToken = ref(null);
  const expiresIn = ref(null);
  const provider = ref(null);

  const setAuthData = (newProvider, token, tokenExpiresIn) => {
    provider.value = newProvider
    accessToken.value = token
    expiresIn.value = tokenExpiresIn
    localStorage.setItem('auth_provider', newProvider)
    localStorage.setItem('access_token', token)
  }

  const setGoogleProfile = (userData) => {
    googleProfile.value = userData;
    localStorage.setItem('googleProfile', JSON.stringify(userData));
  }
  
  const setFacebookProfile = (userData) => {
    facebookProfile.value = userData;
    localStorage.setItem('facebookProfile', JSON.stringify(userData));
  }

  const initGoogleSDK = () => {
    if (!window.google) return;

    const handelLoginSuccess = (response) => {
      const { credential: token } = response;
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      const { exp, name, email, picture } = payload;
      const expired = new Date(exp * 1000);
      // setAuthData('google', token, expired);
      setGoogleProfile({
        name,
        email,
        picture
      })
    };
    
    google.accounts.id.initialize({
      client_id:"614251307749-gqa8m691boqts478a3iailp7pu58h8de.apps.googleusercontent.com",
      callback: handelLoginSuccess
    });
  };

  const loadFacebookSDK = () => {
    return new Promise((resolve) => {
      if (window.FB) {
        resolve()
        return
      }

      window.fbAsyncInit = function() {
        FB.init({
          appId: '1100936564855030',
          cookie: true,
          xfbml: true,
          version: 'v21.0'
        })
        FB.AppEvents.logPageView()
        resolve()
      }

      const script = document.createElement('script')
      script.id = 'facebook-jssdk'
      script.src = "https://connect.facebook.net/en_US/sdk.js"
      document.head.appendChild(script)
    })
  }

  const loginWithFacebook = () => {

    return new Promise((resolve, reject) => {
      FB.login(
        response => {
          if (response.status === 'connected') {
            const { accessToken: token, expiresIn: expiry, userID } = response.authResponse;
            // setAuthData('facebook', token, expiry)
            fetchFacebookProfile(userID)
              .then(() => {
                resolve(response.authResponse);
              })
              .catch(err => {
                reject(err)
              })
          } else {
            reject(new Error('Facebook login failed'))
          }
        }
      )
    })
  }

  const fetchFacebookProfile = async (userID) => {
    const response = await new Promise((resolve) => {
      FB.api(
        `/${userID}`,
        { fields: 'id,name,email,picture.width(200).height(200)' },
        resolve
      )
    })

    setFacebookProfile({
      id: response.id,
      name: response.name,
      email: response.email,
      picture: response.picture?.data?.url
    })
  }

  return {
    googleProfile,
    facebookProfile,
    accessToken,
    provider,
    initGoogleSDK,
    loadFacebookSDK,
    loginWithFacebook,
  }
}, {
  persist: true
})