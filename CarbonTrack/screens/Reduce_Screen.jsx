import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import axios from 'axios';
import WebView from 'react-native-webview';

function  ReduceScreen({}){

    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    // Function to fetch tips/articles from Google Custom Search API
    const fetchArticles = async () => {
        try {
            const API_KEY = 'AIzaSyDee4LXB_QyZp2lI5QAx_EFKJ1xlvNEtlQ'; // Replace with your API key
            const SEARCH_ENGINE_ID = '73cc8f35802a34a6a'; // Replace with your search engine ID
            const query = 'how to reduce carbon footprint'; // Your search query

            const response = await axios.get(
                `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${query}`
            );

            setArticles(response.data.items); // Storing the fetched articles
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.head}>
                <Text style={styles.mainhead}>Ways to reduce</Text>
                <Text style={styles.mainhead2}>Carbon Footprint</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#C1FF1C" />
            ) : (
                <ScrollView>
                    {articles.map((article, index) => (
                        <TouchableOpacity key={index} style={styles.cardone} onPress={() => Linking.openURL(article.link)}>
                            <Text style={styles.cardparagrap}>
                                {article.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
            
        </View>
    )
}

export default ReduceScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#007541',
      alignItems: 'center',
    },
    head: {
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20
    },
    mainhead: {
        fontSize: 43,
        fontWeight: '500',
        color: 'white'
    },
    mainhead2: {
        marginTop: -10,
        fontSize: 43,
        fontWeight: '500',
        color: 'white'
    },
    cardone: {
        backgroundColor: '#3AA345',
        marginRight: 27,
        borderRadius: 10,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 15,
        paddingRight: 15,
        flexDirection: 'row',
        marginLeft: 27,
        height: 94,
        marginBottom: 20
    },
    cardparagrap: {
        fontSize: 30,
        color: '#C1FF1C'
    },
});