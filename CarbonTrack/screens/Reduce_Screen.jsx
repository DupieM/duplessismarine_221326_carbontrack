import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Modal, Button, Linking } from 'react-native';
import axios from 'axios';
import WebView from 'react-native-webview';
import { GOOGLE_API_KEY, SEARCH_ENGINE_ID } from '@env';

function ReduceScreen({ route }){

    const [generalArticles, setGeneralArticles] = useState([]);// General Article
    const [specificArticles, setSpecificArticles] = useState([])// Specific Articles
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
    const [selectedArticleUrl, setSelectedArticleUrl] = useState(null); // URL of the selected article
    const [totalEmission, setTotalEmission] = useState(null)

     // Get the data passed from ResultScreen
     const  Emission  = route.params?.Emission || {};
     console.log('Emission Data:', Emission);

     console.log("Data fetched:",Emission.totalEmission);
    
    // Function to fetch tips/articles from Google Custom Search API
    const fetchArticles = async () => {
        try {
            // General carbon footprint reduction tips query (3 articles)
            const generalQuery = 'The best ways to reduce your carbon footprint';
            const generalResponse = await axios.get(
                `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${generalQuery}&num=3`
            );
            setGeneralArticles(generalResponse.data.items); // Storing general articles

            // Specific reduction tips based on totalEmission (7 articles)
            const specificQuery = `How to reduce your carbon footprint by ${Emission.totalEmission} emissions`;
            const specificResponse = await axios.get(
                `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${specificQuery}&num=7`
            );
            setSpecificArticles(specificResponse.data.items); // Storing emission-specific articles

        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setLoading(false); // Set loading to false when done
        }
    };

    // call the fetch articles function
    useEffect(() => {
        fetchArticles();
    }, []);

    // open the model to view the articles
    const openModal = (url) => {
        setSelectedArticleUrl(url);
        setModalVisible(true); // Show the modal
    };

    // closes the model when clicking on the close button
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
                    {/* General Tips Section */}
                    <Text style={styles.sectionHeader}>General Tips to Reduce Your Carbon Footprint</Text>
                    {generalArticles.length === 0 ? (
                        <Text style={styles.noArticlesText}>No general articles found</Text>
                    ) : (
                        generalArticles.map((article, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.cardone}
                                onPress={() => openModal(article.link)}
                            >
                                <Text style={styles.cardparagrap}>{article.title}</Text>
                            </TouchableOpacity>
                        ))
                    )}

                    {/* Emission-specific Tips Section */}
                    <Text style={styles.sectionHeader}>Tips Based on Your Total Emission of {Emission.totalEmission} ton CO2</Text>
                    {specificArticles.length === 0 ? (
                        <Text style={styles.noArticlesText}>No emission-specific articles found</Text>
                    ) : (
                        specificArticles.map((article, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.cardone}
                                onPress={() => openModal(article.link)}
                            >
                                <Text style={styles.cardparagrap}>{article.title}</Text>
                            </TouchableOpacity>
                        ))
                    )}
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
                        <TouchableOpacity style={styles.btn} onPress={closeModal} >
                            <Text style={styles.btn_text}>Close</Text>
                        </TouchableOpacity>
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
        fontSize: 50,
        fontWeight: '200',
        color: 'white',
        fontFamily: 'PatrickHand',
    },
    mainhead2: {
        marginTop: -10,
        fontSize: 50,
        fontWeight: '200',
        color: 'white',
        fontFamily: 'PatrickHand',
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
        height: 96,
        marginBottom: 20,
    },
    cardparagrap: {
        fontSize: 22,
        color: '#C1FF1C',
        alignItems: 'center',
        fontFamily: 'NunitoMedium', 
        lineHeight: 27
    },
    sectionHeader: {
        fontSize: 24,
        color: 'white',
        fontFamily: 'NunitoMedium',
        marginTop: 0,
        marginBottom: 10,
        textAlign: 'center'
    },
    noArticlesText: {
        fontSize: 18,
        color: '#C1FF1C',
        textAlign: 'center',
        marginTop: 20,
        fontFamily: 'NunitoMedium',
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
    btn: {
        backgroundColor: '#60B6FF',
        height: 30,
    },
    btn_text: {
        textAlign: 'center',
        color: '#343436',
        fontSize: 21
    }
});