
import * as React from 'react';
import { Text, View, StyleSheet, TextInput, Button, Image, KeyboardAvoidingView, Platform } from 'react-native';

import types from '../constants/Types';

import { connect } from 'react-redux';

const SPOTIFY_SEARCH_URL = "https://api.spotify.com/v1/search";
const SPOTIFY_TRACK_FEATURES_URL = "https://api.spotify.com/v1/audio-features/";

function Home(props) {
  if (props.features === null) {
    return ( // IOS -> PADDING
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios"? "padding" : "height"}>
        <View style={{flex: 0.25}}/>
        <Text style={styles.header}> Song Analyzer </Text>
        <Text style={styles.subHeader}> Powered by Spotify </Text>
        <View style={styles.inputView}>
          <TextInput style={styles.input} placeholder="What is the song's name?" value={props.songName} onChangeText={(text)=>props.updateSong(text)} placeholderTextColor={"white"}/>
          <View style={{flex:0.1}}/>
          <TextInput style={styles.input} placeholder="What is the artist's name?" value={props.artistName} onChangeText={(text)=>props.updateArtist(text)} placeholderTextColor={"white"}/>
          <Button style={styles.button} title="Analyze" onPress={()=>props.analyze()} color={"#1DB954"}/>
        </View>
      </KeyboardAvoidingView>
    );
  } else {
    if (props.help){
      console.log(props.features)
      return (
        <View style = {styles.container}>
          <Text style={styles.headerSong} >What Do These Numbers Mean?</Text>
          
          <View style={{flex:1, paddingBottom: '50%'}}>
          <Text style = {styles.features}> Danceability: Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 is least danceable and 1.0 is most danceable </Text>
          <Text style = {styles.features}> Acousticness: A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 1.0 represents high confidence the track is acoustic. </Text>
          <Text style = {styles.features}> Energy: Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale.  </Text>
          <Text style = {styles.features}> Instrumentalness: Predicts whether a track contains no vocals. “Ooh” and “aah” sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly “vocal”. The closer the instrumentalness value is to 1.0, the greater likelihood the track contains no vocal content.  </Text>
          <Text style = {styles.features}> Tempo:  	The overall estimated tempo of a track in beats per minute (BPM). </Text>
          <Text style = {styles.features}> Loudness:  	The overall loudness of a track in decibels (dB). </Text>
          </View>
          
          <Button style = {styles.button} title="Go Back" onPress={()=>props.analyze()} color={"#1DB954"}/>
        </View>
      );
    } else {
      return (
        <View style = {styles.container}>
          <Text style={styles.headerSong} >{props.songName}</Text>
          <Text style={styles.headerArtist} >{props.artistName}</Text>
          <Image style={styles.album} source={{uri: props.albumURL}}/>
          <Text style = {styles.features}> Danceability: {props.features.danceability} </Text>
          <Text style = {styles.features}> Acousticness: {props.features.acousticness} </Text>
          <Text style = {styles.features}> Energy: {props.features.energy} </Text>
          <Text style = {styles.features}> Instrumentalness: {props.features.instrumentalness} </Text>
          <Text style = {styles.features}> Tempo: {props.features.tempo} </Text>
          <Text style = {styles.features}> Loudness: {props.features.loudness} </Text>
          <View style={{flex:0.1}}/>
          <Button style = {styles.button} title="Analyze Another Song" onPress={()=>props.clear()} color={"#1DB954"}/>
          <Button style={styles.button} title="What Do These Numbers Mean?" onPress={()=>props.toggleHelp()} color={"#1DB954"}/>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'black',
  },

  header: {
    flex: 0.12,
    // flex: 1,
    // marginTop: '50%',
    fontSize: 35,
    color: "#1DB954"
  },

  subHeader: {
    flex: 0.15,
    // flex: 1,
    // marginTop: '50%',
    fontSize: 15,
    color: "#1DB954"
  },

  features: {
    // flex: 0.10,
    marginTop: '5%',
    fontSize: 15,
    color: "white"
  },

  inputView: {
    flex: 0.2,
    justifyContent: "space-between"
    // flex: 1
  },

  input: {
    flex: 1,
    height: 20,
    fontSize: 18,
    // fontWeight: 'bold',
    color: 'white',
    paddingLeft: 10,
    minHeight: '3%'
  },

  album: {
    // flex: 1,
    height: 160,
    width: 160
  },

  headerSong: {
    flex: 0.25,
    marginTop: '5%',
    fontSize: 35,
    color: "#1DB954"
  },

  headerArtist: {
    flex: 0.2,
    // marginTop: '50%',
    fontSize: 20,
    color: "#1DB954"
  },

  button: {
    flex: 1,
    marginTop: "10%"
  }

});

function getFeatures() {
  return function (dispatch, getState) {

    const { token, songName, artistName } = getState();

    let url = SPOTIFY_SEARCH_URL + `?q=${songName.split(' ').join('+')}+${artistName.split(' ').join('+')}&type=track&limit=1`;

    let realArtistName = "";
    let realSongName = "";
    let albumURL = "";

    fetch(url, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': "Bearer " + token
            }
          }).then((response)=>response.json()).then((json)=>{
            if (json.tracks.items.length === 0) {
              alert('No Results try again!')
              throw Error('No Results')
            } else {
              let trackID = json.tracks.items[0].id
              realSongName = json.tracks.items[0].name
              realArtistName = json.tracks.items[0].artists[0].name
              albumURL = json.tracks.items[0].album.images[0].url
              url = SPOTIFY_TRACK_FEATURES_URL + `${trackID}`;
              return fetch(url, {
                method: 'GET',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Authorization': 'Bearer ' + token
                }
              })
            }
          }).then((response)=>{return response.json()})
          .then((features)=>dispatch({type: types.ANALYZE, artistName: realArtistName, songName: realSongName, albumArtURL: albumURL, features: features}))
          .catch((error)=>console.log(error));
  }
}

function mapStateToProps(state) {
  return {
    songName: state.songName,
    artistName: state.artistName,
    features: state.info,
    albumURL: state.albumArtURL,
    help: state.help
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateSong: (v) => dispatch({ type: types.UPDATE_SONG, songName: v }),
    updateArtist: (v) => dispatch({ type: types.UPDATE_ARTIST, artistName: v }),
    analyze: () => dispatch(getFeatures()),
    clear: () => dispatch({ type: types.CLEAR }),
    toggleHelp: () => dispatch({ type: types.TOGGLE_HELP })
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);