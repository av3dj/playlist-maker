import * as React from 'react';
import { Text, View, StyleSheet, TextInput } from 'react-native';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import * as testTracks from './constants/Test';
import thunk from 'redux-thunk';

import * as SecureStore from 'expo-secure-store';

import LoginScreen from './components/LoginScreen';
import MainScreen from './components/MainScreen';

import types from './constants/Types';
import secret from './constants/Secret';

const KEY_TOKEN = "token";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";

const initialState = {
  list: [],
  // list: testTracks.default,
  updateToggle: false,
  
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

  let trackID = "";
  let features = null;
  let newList = [];

  switch (action.type) {

    case types.LOGIN:
      loggedIn = true;
      console.log("loggedIn: " + loggedIn)
      return { ...initialState, accessToken: action.accessToken, refreshToken: action.refreshToken}

    case types.ADD_SONG:

      state.list.push(action.data);
      newList = state.list;

      return { ...state, list: newList, updateToggle: !state.updateToggle}
    
    case types.REMOVE_SONG:
      newList = state.list.filter(
        (track) => {
          return track.id !== action.id
        }
      );

      return {...state, list: newList, updateToggle: !state.updateToggle}
    
    case types.EXPORT_PLAYLISTS:
      return {...initialState, accessToken: state.accessToken, refreshToken: state.refreshToken}

    case types.IMPORT_TRACKS:
      console.log('import tracks' + ' tracks: ' + action.tracks.length)
      return {...state, list: action.tracks}

    case types.CLEAR_TRACKS:
      return {...state, list: []}

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
      <Provider store={store}>
        <MainScreen />
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <LoginScreen handler={()=>{handleLogin()}}/>
    </Provider>
  );
}
