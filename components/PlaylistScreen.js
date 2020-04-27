import * as React from 'react';
import Icon from 'react-native-vector-icons/Entypo'
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, Image, TextInput, SectionList } from 'react-native';

import { connect } from 'react-redux';

const kmeans = require('ml-kmeans')
const similarity = require('compute-cosine-similarity');

import types from '../constants/Types';

import SongItem from './SongItem';

// Dimensions Stuff
const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;

const extractData = async (trackList) => {

    const keys = ['acousticness', 'danceability', 'energy', 
                'instrumentalness', 'liveness', 'loudness', 
                'mode', 'speechiness', 'tempo', 'time_signature', 
                'valence'
                ];
           
    return await trackList.map(
        ( item ) => {
            let arr = []
            keys.forEach((key) => {arr.push(item[key])});
            return arr;
        }
    );
    
}

export default function PlaylistScreen(props) {

    const [results, setResults] = React.useState([]);

    const cluster = async () => {

        let vectors = await extractData(props.list);
        // let init = 'kmeans++'
        // let init = 'random'
        let init = 'mostDistant'
        let func = similarity
        let ans = kmeans(vectors, props.numClusters, { initialization: init });

        clusters = []

        console.log(ans)

        ans.centroids.forEach((item, index) => {clusters.push({title: `Playlist #${index+1}`, data:[], key: index.toString()})})
        ans.clusters.forEach((item, index)=>{clusters[item].data.push(props.list[index])})

        return clusters;
    }

    React.useEffect(() => {
        (async function yo() {
            if (results.length === 0) {
                let playlists = await cluster();
                setResults(playlists);
            }
        })();
    }, []);

    if (results.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={{color: 'white', textAlign: 'center', fontSize: 50}}>Calculating ...</Text>
            </View>
        );
    }

    console.log(results)
    return (
        <View style={styles.container}>
            <SectionList 
                sections={results}
                keyExtractor={(item)=>{return item.id}}
                renderItem={({ item }) => <SongItem noButtons={true} track={item}/>}
                renderSectionHeader={ ( {section: { title }} ) => {return (
                    <View style={{
                        backgroundColor: 'white',
                        borderRadius: WINDOW_WIDTH/15,
                        width: WINDOW_WIDTH*0.75,
                        height: WINDOW_HEIGHT/14,
                        justifyContent: 'center',
                        alignSelf: 'center',
                    }}
                    >
                        <Text style={{fontSize: 30, fontFamily: 'future-bold', color: 'black', textAlign: 'center'}}>{title}</Text> 
                    </View>
                )}}
            />
            <TouchableOpacity onPress={() => {props.exportPlaylists(results)}}>
                <View style={{
                        backgroundColor: 'white',
                        borderRadius: WINDOW_WIDTH/15,
                        width: WINDOW_WIDTH*0.75,
                        height: WINDOW_HEIGHT/14,
                        justifyContent: 'center',
                        alignSelf: 'center',
                    }}
                    >
                    <Text style={{fontSize: 20, fontFamily: 'future-bold', color: 'black', textAlign: 'center'}}>Export Playlists</Text> 
                </View>
            </TouchableOpacity>
        </View>

    );

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        paddingTop: WINDOW_HEIGHT*0.05,
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