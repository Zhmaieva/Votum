import React, { useState, useEffect } from 'react';
import { TextInput, View, StyleSheet, ActivityIndicator, Text, FlatList, Image, SafeAreaView } from 'react-native';
//import filter from "lodash.filter";

const API_ENDPOINT = 'https://randomuser.me/api/?results=30';

const AwesomeSearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [data, setData] = useState([]);
    const [fullData, setFullData] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = (query) => {
        setSearchQuery(query);
        // Add your search logic here, such as filtering a list based on the search text
        const formattedQuery = query.toLowerCase();
        const filteredData = filter(fullData, (user) => {
            return contains (user, formattedQuery);
        });
        setData(filteredData);
    };

    const contains = ({name, email}, query) => {
        const {first, last} = name;

        if (
            first.includes(query) ||
            last.includes(query) ||
            email.includes(query)
        ) {
            return true;
        }
        return false;
    }

    useEffect(()=>{
        setIsLoading(true);
        fetchData(API_ENDPOINT);
    }, []);

    const fetchData = async(url) => {
        try {
            const response = await fetch(url);
            const json = await response.json();
            setData(json.results);
            console.log(json.results);
            setFullData(json.results);
            setIsLoading(false);
        }catch(error) {
            setError(error);
            console.log(error);
        }
    }

    if(isLoading) {
        return (
            <View>
                {/*<ActivityIndicator size={36} color='green' />*/}
            </View>
        );
    }
    if(error) {
        return (
            <View>
                <Text>Error in fetching data... Please check your Internet connection</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.containerMain}>
            <TextInput
                placeholder="Search..."
                value={searchQuery}
                clearButtonMode='always'
                autoCapitalize='none'
                autoCorrect={false}
                onChangeText={(query)=>handleSearch(query)}
                style={styles.searchStyle}
            />
            <FlatList
                data={data}
                keyExtractor={(item) => item.login.username}
                renderItem={({item})=> (
                    <View style={styles.itemContainer}>
                        <Image source={{uri: item.picture.thumbnail}} style={styles.image} />
                        <View>
                            <Text style={styles.textName}>{item.name.first} {item.name.last}</Text>
                            <Text style={styles.textEmail}>{item.email}</Text>
                        </View>
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

export default AwesomeSearch;

const styles = StyleSheet.create({
    containerMain: {
        //flex: 1,
        marginTop: 5
    },
    searchStyle: {
        height: 40,
        backgroundColor: 'gold',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderWidth: 2,
        borderColor: 'black'
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        marginTop: 10
    },
    image: {
        height: 50,
        width: 50,
        borderRadius: 25
    },
    textName: {
        fontSize: 14,
        marginLeft: 10,
        fontWeight: '600'
    },
    textEmail: {
        fontSize: 12,
        marginLeft: 10,
        color: 'grey'
    }
})