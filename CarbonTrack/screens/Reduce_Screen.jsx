import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Modal, Button, Linking } from 'react-native';
import axios from 'axios';
import WebView from 'react-native-webview';

function  ReduceScreen({}){

    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
    const [selectedArticleUrl, setSelectedArticleUrl] = useState(null); // URL of the selected article

    // Function to fetch tips/articles from Google Custom Search API
    const fetchArticles = async () => {
        try {
            const API_KEY = 'AIzaSyDee4LXB_QyZp2lI5QAx_EFKJ1xlvNEtlQ'; // Replace with your API key
            const SEARCH_ENGINE_ID = '73cc8f35802a34a6a'; // Replace with your search engine ID
            const query = 'The best ways to reduce your carbon footprint'; // Your search query

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

    const openModal = (url) => {
        setSelectedArticleUrl(url);
        setModalVisible(true); // Show the modal
    };

    const closeModal = () => {
        setModalVisible(false); // Hide the modal
        setSelectedArticleUrl(null); // Reset the selected URL
    };

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
                        <TouchableOpacity key={index} style={styles.cardone} onPress={() => openModal(article.link)}>
                            <Text style={styles.cardparagrap}>
                                {article.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
            
            {/* Modal for displaying the article */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                onRequestClose={closeModal}
                transparent={true} // Makes background transparent
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <WebView 
                            source={{ uri: selectedArticleUrl }} 
                            startInLoadingState={true} 
                        />
                        <Button title="Close" onPress={closeModal} />
                    </View>
                </View>
            </Modal>
            
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
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#58BB44',
        borderRadius: 10,
        padding: 10,
        width: '100%',
        height: '90%',
    },
});