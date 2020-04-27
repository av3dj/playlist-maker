import * as React from 'react';
import Icon from 'react-native-vector-icons/Entypo'
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, Image, TextInput, FlatList, Picker } from 'react-native';

import { connect } from 'react-redux';
import RNPickerSelect from 'react-native-picker-select';

import types from '../constants/Types';

import PlaylistScreen from './PlaylistScreen';

import SongItem from './SongItem';

// Dimensions Stuff
const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;

const options = [2, 3, 4, 5, 6, 7, 8, 9, 10]
const optionsItems = options.map((item)=>{return {label: item.toString(), value: item}})

const handleInput = (song, artist) => {
    let incomplete = song === "" || artist === "";

    if (incomplete) {
        alert('Please make sure to fill Song Name and Artist Name');
    } else {
        // alert('Adding ... ' + song + ' by ' + artist);
    }
    
    return incomplete;
}

var refresh = false;

function MainScreen(props) {

    const [songName, setSongName] = React.useState("");
    const [artistName, setArtistName] = React.useState("");
    const [createPlaylist, setCreatePlaylist] = React.useState(false);
    const [start, setStart] = React.useState(false);
    const [numClusters, setNumClusters] = React.useState(2);

    const [mainMenu, setMainMenu] = React.useState(true);
    const [importLiked, setImportLiked] = React.useState(false);

    const [numDownloaded, setNumDownloaded] = React.useState(0);
    const [totalLeft, setTotalLeft] = React.useState(0);


    if (createPlaylist) {
        if (!start){
            return (
                <View style={{...styles.container, justifyContent: 'space-evenly'}}>
                    <View >
                    <Text style={{color: 'white', fontFamily: 'future-medium', fontSize: 30, paddingBottom: '10%'}}>Number of Playlists: </Text>
                        <RNPickerSelect
                            style={{flex:1}}
                            onValueChange={ (item, index) => setNumClusters(parseInt(item))}
                            items={optionsItems}
                            placeholder={{label: 'Select number of Playlists ...', value: null}}
                            textInputProps={{color: 'grey', fontSize: 25, aligSelf: 'center'}}
                        />
                        </View>
                    <TouchableOpacity onPress={()=>{setStart(true)}}>
                        <View style={styles.button}>
                            <Text style={{flex: 0.4, color: 'black', fontFamily: 'future-medium', fontSize: 20}}>Create Playlists</Text>
                        </View>
                    </TouchableOpacity> 
                </View>
            );
        }
        return (
          <PlaylistScreen exportPlaylists={(playlists) => {setCreatePlaylist(false);props.exportPlaylists(playlists)}} numClusters={numClusters} list={props.list}/>  
        );
    }

    if (mainMenu) {
        return (
            <View style={{...styles.container, justifyContent: 'space-evenly'}}>
                <TouchableOpacity onPress={()=>{setMainMenu(false);}}>
                    <View style={styles.button}>
                        <Text style={{flex: 0.5, color: 'black', fontFamily: 'future-medium', fontSize: 20}}>Add Songs</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{setImportLiked(true); setMainMenu(false); props.importTracks(()=>{setImportLiked(false)}, (num)=>{setNumDownloaded(num)}, (num)=>{setTotalLeft(num)})}}>
                    <View style={styles.button}>
                        <Text style={{flex: 0.5, color: 'black', fontFamily: 'future-medium', fontSize: 20}}>Import Liked Songs</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{props.clearTracks(); setMainMenu(false)}}>
                    <View style={styles.button}>
                        <Text style={{flex: 0.5, color: 'black', fontFamily: 'future-medium', fontSize: 20}}>Clear Songs</Text>
                    </View>
                </TouchableOpacity> 
            </View>
        );
    }

    if (!mainMenu && importLiked) {
        return (
            <View style={{...styles.container, justifyContent: 'space-evenly'}}>
                <Text style={{flex: 0.4, color: 'white', fontFamily: 'future-medium', fontSize: 30}}>Importing Liked Songs ...</Text>
                <Text style={{color: 'white', fontFamily: 'future-medium', fontSize: 30}}>{numDownloaded}/{totalLeft}</Text>
            </View>
        );
    }

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
                    <View style={{height: WINDOW_HEIGHT*0.01}}/>
                </View>
                <TouchableOpacity onPress={()=>{
                    if (handleInput(songName, artistName)) {
                        return;
                    }
                    props.addSong(songName, artistName);
                    setSongName("");setArtistName("");
                }}>
                    <Icon style={{paddingTop: 10}} size={WINDOW_HEIGHT*0.05} name="circle-with-plus"/>
                </TouchableOpacity>
            </View>
            <View style={styles.list}>

                {props.list.length === 0 ? 
                    <View style={{flex: 1, justifyContent: 'space-around', alignItems: "center"}}>
                    <Text style={{fontSize: 30, fontFamily: 'future-bold', color: 'white', textAlign: 'center'}}>Search for a track above to add to the playlist generator!</Text> 
                    <TouchableOpacity onPress={()=>{setMainMenu(true)}}>
                        <View style={styles.button}>
                            <Text style={{flex: 0.4, color: 'black', fontFamily: 'future-medium', fontSize: 20}}>Go back</Text>
                        </View>
                    </TouchableOpacity>
                    </View>
                    : 
                    <View style={{flex: 1, justifyContent: 'space-evenly', alignItems: 'center'}}>
                    <FlatList
                        style={{width: '100%', height: '100%'}}
                        data={props.list}
                        extraData={props.update}
                        renderItem={({ item }) => <SongItem track={item} onDelete={(id)=>props.removeSong(id)}/>}
                        keyExtractor={(item) => item.id}
                    />
                    <TouchableOpacity onPress={()=>{setMainMenu(true)}}>
                        <View style={styles.button}>
                            <Text style={{flex: 0.4, color: 'black', fontFamily: 'future-medium', fontSize: 20}}>Go back</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{setCreatePlaylist(true)}}>
                        <View style={styles.button}>
                            <Text style={{flex: 0.4, color: 'black', fontFamily: 'future-medium', fontSize: 20}}>Create Playlists</Text>
                        </View>
                    </TouchableOpacity>
                    </View>
                }

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
        flex: 0.14,
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
        
    },

    list: {
        flex: 0.85,
        justifyContent: 'center',
        alignItems: 'center'
    },

    button: {
        backgroundColor: 'white',
        borderRadius: WINDOW_WIDTH/15,
        width: WINDOW_WIDTH*0.75,
        height: WINDOW_HEIGHT/14,
        justifyContent: 'center',
        alignItems: 'center',
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
                    refresh = !refresh;
                }
            )

        } catch (err) {
            console.log("ERROR: " + err);
        }
    }
}

const createPlaylists = (playlists) => {
    return async function (dispatch, getState) {
        const { accessToken } = getState();

        try {
            const SPOTIFY_PROFILE_URL = 'https://api.spotify.com/v1/me';

            fetch(SPOTIFY_PROFILE_URL,{
              headers: {
                  'Authorization': `Bearer ${accessToken}`
              }  
            }).then(
                (response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        console.log(JSON.stringify(response))
                        throw Error("STATUS: PROFILE " + response.status)
                    }
                }
            ).then(
                (json) => {
                    let userID = json.id
                    console.log(json.id)
                    const SPOTIFY_CREATE_PLAYLIST_URL = `https://api.spotify.com/v1/users/${userID}/playlists`;
                    return Promise.all(playlists.map(playlist => 
                            fetch(SPOTIFY_CREATE_PLAYLIST_URL, {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Bearer ${accessToken}`,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({name: playlist.title, description: 'Created with playlist-maker'})
                            }).then((response) => {
                                if (response.ok) {
                                    return response.json();
                                }
                                console.log(JSON.stringify(response.headers))
                                throw Error(`STATUS: CREATE ${response.status} ${JSON.stringify(response)}`)
                            }).then((parsed) => {
                                console.log(JSON.stringify(parsed))
                                const SPOTIFY_POPULATE_PLAYLIST_URL = `https://api.spotify.com/v1/playlists/${parsed.id}/tracks`
                                let playlist_uris = playlist.data.map( (item) => {
                                    return item.uri
                                })
                                return fetch(SPOTIFY_POPULATE_PLAYLIST_URL, {
                                    method: 'POST',
                                    headers: {
                                        'Authorization': `Bearer ${accessToken}`,
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        uris: playlist_uris,

                                    })
                                })
                            }).then((response) => {
                                if (!response.ok){
                                    console.log(JSON.stringify(response))
                                    throw Error(`STATUS POPULATE ${response.status} ${JSON.stringify(response)}`)
                                }
                            })
                        ))
                }
            ).then(()=>{ dispatch({type: types.EXPORT_PLAYLISTS})})

        } catch (err) {
            console.log('ERROR: ' + err)
        }
    }
}

const importTracks = (completeHandler, downloadedHandler, totalHandler) => {

    return async function (dispatch, getState) {
        const GET_TRACKS_URL = 'https://api.spotify.com/v1/me/tracks/';
        const { accessToken } = getState();
        let maxTracks = 0;
        let tracksArray = [];

        const fetchTracks = (i) => {
            let numFetch = maxTracks - i > 50 ? 50 : maxTracks - i;
            console.log(`?limit=${numFetch}&offset=${i}`)
            return fetch(GET_TRACKS_URL + `?limit=${numFetch}&offset=${i}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
            }).then(
                (response) => {
                    if (response.ok) {
                        return response.json()
                    } else {
                        console.log(JSON.stringify(response))
                        throw Error('STATUS: ' + response.status)
                    }
            }).then(
                (json) => {
                    let tracks = json.items;
                    
                    return Promise.all(tracks.map(
                        (track) => {
                            let trackID = track.track.id
                            let realSongName = track.track.name
                            let realArtistName = track.track.artists[0].name
                            let albumURL = track.track.album.images[0].url

                            let url = `https://api.spotify.com/v1/audio-features/${trackID}`
                            
                            fetch(url, {
                                method: 'GET',
                                headers: {
                                    Accept: 'application/json',
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    'Authorization': 'Bearer ' + accessToken
                                }
                            }).then( 
                                (response) => {
                                    if (response.ok) {
                                        return response.json()
                                    } else {
                                        console.log(JSON.stringify(response))
                                        throw Error('STATUS: ' + response.status)
                                    }
                                }
                            ).then(
                                (json) => {
                                    let data = {...json, artistName: realArtistName, songName: realSongName, albumArtURL: albumURL}
                                    tracksArray.push(data);
                                    downloadedHandler(tracksArray.length);
                                }
                            )
                        }
                        )).then(()=>{
                            let next_i = i + numFetch;
                            console.log('i: ' + i + ' next_i: ' + next_i + ' maxTracks: ' + maxTracks);
                            if (next_i < maxTracks) {
                                return fetchTracks(next_i)
                            }
                        })
                }
            )
        }

        try {
            fetch(GET_TRACKS_URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }).then(
                (response) => {
                    if (response.ok) {
                        return response.json()
                    } else {
                        console.log(JSON.stringify(response))
                        throw Error('STATUS: ' + response.status)
                    }
            }).then(
                (json) => {
                    maxTracks = json.total > 150 ? 150 : maxTracks;
                    // maxTracks = 150
                    totalHandler(maxTracks);
                    return fetchTracks(0);
                }
            ).then(() => {
                dispatch({type: types.IMPORT_TRACKS, tracks: tracksArray})
                completeHandler();
            })
        } catch (err) {
            console.log("ERROR: " + err)
        }
        
    }

}

function mapStateToProps(state) {
    return {
        list: state.list,
        update: state.updateToggle
    };
}
  
function mapDispatchToProps(dispatch) {
    return {
        addSong: (songName, artistName) => dispatch(getData(songName, artistName)),
        removeSong: (id) => dispatch({type: types.REMOVE_SONG, id: id}),
        exportPlaylists: (playlists) => dispatch(createPlaylists(playlists)),
        importTracks: (completeHandler, downloadedHandler, totalHandler) => dispatch(importTracks(completeHandler, downloadedHandler, totalHandler)),
        clearTracks: () => dispatch({type: types.CLEAR_TRACKS})
    };
}

function mergeProps(stateProps, dispatchProps, ownProps) {
    return {...stateProps, ...dispatchProps, ...ownProps};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(MainScreen);