import * as React from 'react';
import { Text, View, StyleSheet, TextInput } from 'react-native';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import * as SecureStore from 'expo-secure-store';

import Home from './components/Home';
import LoginScreen from './components/LoginScreen';

import types from './constants/Types';
import secret from './constants/Secret';

const KEY_TOKEN = "token";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";

const initialState = {
  songName: "",
  artistName: "",
  albumArtURL: "",
  info: null,
  help: false,
  accessToken: "",
  refreshToken: ""
}

let getToken = async () => {
  return await SecureStore.getItemAsync(KEY_TOKEN);
}

let trackFeatures = null;

const reducer = (state = initialState, action) => {
  let url = "";
  let trackID = "";
  let features = null;
  switch (action.type) {

    case types.LOGIN:
      loggedIn = true;
      console.log("loggedIn: " + loggedIn)
      return { ...initialState, accessToken: action.accessToken, refreshToken: action.refreshToken}
    
    // case types.UPDATE_SONG: 
    //   return {songName: action.songName, artistName: state.artistName, albumArtURL: state.albumArtURL, info: trackFeatures, help: initialState.help, token: _token}
    
    // case types.UPDATE_ARTIST:
    //   return {songName: state.songName, artistName: action.artistName, albumArtURL: state.albumArtURL, info: trackFeatures, help: initialState.help, token: _token}
    
    // case types.ANALYZE:
    //   return {songName: action.songName, artistName: action.artistName, albumArtURL: action.albumArtURL, info: action.features, help: initialState.help, token: _token}

    // case types.CLEAR:
    //   return {songName: initialState.songName, artistName: initialState.artistName, albumArtURL: initialState.albumArtURL, help: initialState.help, info: initialState.info, token: _token}
    
    // case types.TOGGLE_HELP:
    //   console.log(types.TOGGLE_HELP + " " + state.songName)
    //   return {songName: state.songName, artistName: state.artistName, albumArtURL: state.albumArtURL, info: state.features, help: !state.help, token: _token}

    default:
      return state;
  }
}

const store = createStore(reducer, applyMiddleware(thunk));

let loggedIn = false;


export default function App() {

  const [login, setLogin] = React.useState(false);

  function handleLogin() {
    console.log("Handling Login");
    setLogin(true);
  }

  if(login) {
    return (
    <View>
      <Text style={{fontSize: 50}}>Logged In</Text>
    </View>
    );
  }

  return (
    <Provider store={store}>
      <LoginScreen handler={()=>{handleLogin()}}/>
    </Provider>
  );
}
