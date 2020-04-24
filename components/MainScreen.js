import * as React from 'react';
import Icon from 'react-native-vector-icons/Entypo'
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, Image, TextInput } from 'react-native';

import { connect } from 'react-redux';

import types from '../constants/Types';

// Dimensions Stuff
const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;

const handleInput = (song, artist) => {
    let incomplete = song === "" || artist === "";

    if (incomplete) {
        alert('Please make sure to fill Song Name and Artist Name');
    } else {
        alert('Adding ... ' + song + ' by ' + artist);
    }
}

function MainScreen(props) {

    const [songName, setSongName] = React.useState("");
    const [artistName, setArtistName] = React.useState("");

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{flex: 0.7, flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center'}}>
                    <TextInput
                        style={styles.input}
                        placeholder=" Song Name" 
                        value={songName}
                        onChangeText={(text)=>setSongName(text)}
                        placeholderTextColor={"#343434"}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder=" Artist Name" 
                        value={artistName}
                        onChangeText={(text)=>setArtistName(text)}
                        placeholderTextColor={"#343434"}
                    />
                </View>
                <TouchableOpacity onPress={()=>{handleInput(songName, artistName);props.addSong(songName, artistName);setSongName("");setArtistName("");}}>
                    <Icon style={{paddingTop: 10}} size={WINDOW_HEIGHT*0.05} name="circle-with-plus"/>
                </TouchableOpacity>
            </View>
        </View>
    );

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    header: {
        flex: 0.15,
        backgroundColor: 'white',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        alignItems: 'center',
        width: WINDOW_WIDTH
    },

    input: {
        // flex: 0.3,
        height: WINDOW_HEIGHT*0.05,
        width: WINDOW_WIDTH*0.6,
        borderColor: 'black',
        borderBottomWidth: 1,
        fontFamily: 'sfpt-semibold'
        
    }

})

const getData = (songName, artistName) => {
    return async function (dispatch, getState) {
        try {

            const { accessToken } = getState();

            let url = "https://api.spotify.com/v1/search" + `?q=${songName.split(' ').join('+')}+${artistName.split(' ').join('+')}&type=track&limit=1`;

            let trackID = "";
            let realArtistName = "";
            let realSongName = "";
            let albumURL = "";

            fetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': "Bearer " + accessToken
                }
            }).then(
                (response) => {
                    if (response.ok){
                        return response.json()
                    } else {
                        throw Error('SEARCH STATUS: ' + response.status)
                    }
                }
            ).then(
                (json) => {
                    if (json.tracks.items.length === 0) {
                        alert('No Results Try Again!')
                        throw Error('No Results')
                    } else {

                        trackID = json.tracks.items[0].id
                        realSongName = json.tracks.items[0].name
                        realArtistName = json.tracks.items[0].artists[0].name
                        albumURL = json.tracks.items[0].album.images[0].url

                        url = `https://api.spotify.com/v1/audio-features/${trackID}`

                        return fetch(url, {
                            method: 'GET',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'Authorization': 'Bearer ' + accessToken
                            }
                        })
                    }
                }
            ).then(
                (response) => {
                    if (response.ok) {
                        return response.json()
                    } else {
                        throw Error('AUDIO FEATURES STATUS: ' + response.status)
                    }
                }
            ).then(
                (json) => {
                    dispatch({type: types.ADD_SONG, data: {...json, artistName: realArtistName, songName: realSongName, albumArtURL: albumURL}})
                }
            )

        } catch (err) {
            console.log("ERROR: " + err);
        }
    }
}
  
function mapDispatchToProps(dispatch) {
    return {
        addSong: (songName, artistName) => dispatch(getData(songName, artistName))
    };
}

function mergeProps(stateProps, dispatchProps, ownProps) {
    return {...stateProps, ...dispatchProps, ...ownProps};
}

export default connect(
    null,
    mapDispatchToProps,
    mergeProps
)(MainScreen);