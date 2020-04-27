import * as React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, Image, TextInput, FlatList } from 'react-native';

const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;

export default function SongItem(props) {

    if (props.noButtons) {
        return(
        <View style={{flex: 1, width: WINDOW_WIDTH*.99, justifyContent: 'space-between', flexDirection: 'row', paddingTop: '7.5%', paddingBottom: '7.5%'}}>
        <View style={{flex: 0.5, justifyContent: 'space-evenly', flexDirection: 'column'}}>
            <View style={{}}>
                <Text style={{fontSize: 35, fontFamily: 'future-bold', color: 'white', alignSelf: 'flex-start', paddingBottom: '5%'}}>{props.track.songName}</Text>
                <Text style={{fontSize: 20, fontFamily: 'sfpt-semibold', color: 'white'}}>{props.track.artistName}</Text>
            </View>
        </View>
        <Image style={{flex: 0.5, height: WINDOW_WIDTH/2, width: WINDOW_WIDTH/2}} source={{uri: props.track.albumArtURL}}/>
    </View>
); 
    }

    return (
        <View style={{flex: 1, width: WINDOW_WIDTH*.99, justifyContent: 'space-between', flexDirection: 'row', paddingTop: '7.5%', paddingBottom: '7.5%'}}>
            <View style={{flex: 0.5, justifyContent: 'space-evenly', flexDirection: 'column'}}>
                <View style={{}}>
                    <Text style={{fontSize: 25, fontFamily: 'future-bold', color: 'white', alignSelf: 'flex-start', paddingBottom: '5%'}}>{props.track.songName}</Text>
                    <Text style={{fontSize: 15, fontFamily: 'sfpt-semibold', color: 'white'}}>{props.track.artistName}</Text>
                </View>
                <View style={{justifyContent:'space-evenly', flexDirection: 'row', alignContent: 'center', paddingRight: '18%'}}>
                    {/* <Icon style={{color: 'white', borderRadius: 13, borderColor: 'white', borderWidth: 1}} size={25} name="information-variant"/> */}
                    <TouchableOpacity onPress={()=>{props.onDelete(props.track.id)}}>
                        <Icon style={{color: 'white', borderRadius: 13, borderColor: 'white', borderWidth: 1}} size={25} name="delete"/>
                    </TouchableOpacity>
                </View>
            </View>
            <Image style={{flex: 0.5, height: WINDOW_WIDTH/2, width: WINDOW_WIDTH/2}} source={{uri: props.track.albumArtURL}}/>
        </View>
    ); 
}