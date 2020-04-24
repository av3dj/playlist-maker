import * as React from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';

import { connect } from 'react-redux';

// Font Stuff
import * as Font from 'expo-font';

// Dimensions Stuff
const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;

// Auth Stuff
import * as AuthSession from 'expo-auth-session';
console.log(AuthSession.getRedirectUrl());
import secret from '../constants/Secret';
import types from '../constants/Types';
import {decode as atob, encode as btoa} from 'base-64'

const SPOTIFY_ICON_PATH = '../assets/icons/spotify-icons-logos/icons/01_RGB/02_PNG/Spotify_Icon_RGB_Black.png';

function LoginScreen(props) {

    const [dataLoaded, setDataLoaded] = React.useState(false);

    const fetchFonts = () => {
        return Font.loadAsync({
            'future-bold': require('../assets/fonts/Futura-Bold.otf'),
            'future-medium': require('../assets/fonts/Futura-Bold.otf'),
            'sfpt-semibold': require('../assets/fonts/FontsFree-Net-SFProText-Semibold.ttf')
        })
    }

    React.useEffect(()=>{
        const fetchData = async () => {
            // Get fonts
            if (!dataLoaded){
                await fetchFonts();
            }
            setDataLoaded(true);
        }  
        fetchData();
    }, []);

    if(!dataLoaded){
        // Loading resources (fonts, token, etc.)
        return (
            <View style={styles.container}>
            <Text style={{color: 'white', textAlign: 'center', fontSize: 50}}>Loading ...</Text>
        </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={{color: 'white', fontFamily: 'future-bold', textAlign: 'center', fontSize: 50}}>Spotify Playlist Maker</Text>
            <TouchableOpacity onPress={()=>{props.login(()=>{props.handler()})}}>
                <View style={styles.button}>
                    <Text style={{flex: 0.75, color: 'black', fontFamily: 'future-medium', fontSize: 20}}>Login with Spotify</Text><Image style={{height: 30, width: 30}} source={require(SPOTIFY_ICON_PATH)}/>
                </View>
            </TouchableOpacity>
        </View>
    );

}

const styles = StyleSheet.create({

    container: {

        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'space-around',
        alignItems: 'center',

    },

    button: {
        backgroundColor: 'white',
        borderRadius: WINDOW_WIDTH/15,
        width: WINDOW_WIDTH*0.75,
        height: WINDOW_HEIGHT/14,
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row-reverse',
    }

})

const getAuthorizationCode = async () => {

    // TODO: Refine this list later
    const scopesArr = ['user-modify-playback-state','user-read-currently-playing','user-read-playback-state','user-library-modify',
                   'user-library-read','playlist-read-private','playlist-read-collaborative','playlist-modify-public',
                   'playlist-modify-private','user-read-recently-played','user-top-read']; 
    const scopes = scopesArr.join(' ');

    let result = null;
    try {
        const credentials = secret;
        const redirectUrl = AuthSession.getRedirectUrl();
        result = await AuthSession.startAsync({
            authUrl:
                'https://accounts.spotify.com/authorize' +
                '?response_type=code' +
                '&client_id=' +
                credentials.clientID +
                (scopes ? '&scope=' + encodeURIComponent(scopes) : '') + 
                '&redirect_uri=' + 
                encodeURIComponent(redirectUrl),
        })
    } catch (err) {
        console.log(err)
    }

    return result.params.code
}

const login = (handler) => {
    return async function (dispatch, getState) {

        try {
            const authorizationCode = await getAuthorizationCode()
            const credentials = secret;
            const redirectUrl = AuthSession.getRedirectUrl();
            const credsB64 = btoa(`${credentials.clientID}:${credentials.clientSecret}`)

            await fetch(`https://accounts.spotify.com/api/token`, {
                method: 'POST',
                headers: { 
                    // 
                    // Read existing open source implementation
                    // JS Fiddler Packet Capture
                    // Accept: 'application/json',
                    'Authorization': `Basic ${credsB64}`,
                    'content-type': 'application/x-www-form-urlencoded',
                },
                body: `grant_type=authorization_code&code=${authorizationCode}&redirect_uri=${redirectUrl}`
            }).then(
                (response) => {
                    if (!response.ok){
                        console.log(JSON.stringify(response))
                        throw "STATUS: " + response.status;
                    } else {
                        return response.json();
                    }
                }
            ).then(
                (json) => {
                    handler();
                    dispatch({type: types.LOGIN, accessToken: json['access_token'], refreshToken: json['refresh_token']});
                }
            );

        } catch(err) {
            console.log("ERROR: " + err);
        }
    }
}
  
function mapDispatchToProps(dispatch) {
    return {
        login: (handler) => dispatch(login(handler))
    };
}

function mergeProps(stateProps, dispatchProps, ownProps) {
    return {...stateProps, ...dispatchProps, ...ownProps};
}

export default connect(
    null,
    mapDispatchToProps,
    mergeProps
)(LoginScreen);