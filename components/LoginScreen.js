import * as React from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';

import { connect } from 'react-redux';

// Font Stuff
import * as Font from 'expo-font';

// Dimensions Stuff
const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;

const SPOTIFY_ICON_PATH = '../assets/icons/spotify-icons-logos/icons/01_RGB/02_PNG/Spotify_Icon_RGB_Black.png';

import types from '../constants/Types';

export default function LoginScreen() {

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
            <TouchableOpacity onPress={()=>alert('Logging In')}>
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