import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Text,
  Dimensions,
  Animated,
  Button,
} from 'react-native';
import ApolloClient from 'apollo-boost';
import {gql} from 'apollo-boost';
import LinearGradient from 'react-native-linear-gradient';

//Dimentions
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const HomeScreen = () => {
  //Animations
  const leftToRight = useState(new Animated.ValueXY({x: -500, y: 0}))[0];
  const zoomInOut = useState(new Animated.Value(0.75))[0];

  //State
  const [filmList, setFilmList] = useState([]);

  const callAnimations = () => {
    Animated.timing(leftToRight, {
      toValue: {x: 0, y: 0},
      duration: 5000,
      useNativeDriver: false,
    }).start();
  };

  const zoomInFunc = () => {
    Animated.timing(zoomInOut, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const zoomOutFunc = () => {
    Animated.timing(zoomInOut, {
      toValue: 0.5,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const getFilmData = () => {
    const client = new ApolloClient({
      uri: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
    });
    client
      .query({
        query: gql`
          query Root {
            allFilms {
              films {
                producers
                releaseDate
                title
                edited
                episodeID
                director
              }
            }
          }
        `,
      })
      .then(result => {
        setFilmList(result.data.allFilms.films);
        console.log(JSON.stringify(result, null, '  '));
        callAnimations();
      });
  };

  const renderItem = ({item, index}) => {
    return (
      <Animated.View style={leftToRight.getLayout()}>
        <View
          style={{
            width: '90%',
            marginTop: 8,
            flex: 1,
            flexDirection: 'row',
            borderWidth: 1,
            borderRadius: 16,
            justifyContent: 'center',
          }}>
          {/* Image View */}
          <View
            style={{
              flex: 0.2,
              borderWidth: 1,
              borderRadius: 16,
            }}>
            <View style={{flex: 0.9}}>
              <Animated.Image
                source={{uri: 'https://reactnative.dev/img/tiny_logo.png'}}
                style={{
                  height: windowHeight / 4,
                  padding: 4,
                  transform: [{scale: zoomInOut}],
                }}
                resizeMode="contain"
              />
            </View>
            <View
              style={{
                justifyContent: 'space-around',
                flex: 0.1,
                flexDirection: 'row',
                padding: 4,
              }}>
              <Button
                title="+"
                onPress={() => {
                  zoomInFunc();
                }}
              />
              <Button
                title="-"
                onPress={() => {
                  zoomOutFunc();
                }}
              />
            </View>
          </View>
          {/* Info View */}
          <View
            style={{flex: 0.8, padding: 8, justifyContent: 'space-between'}}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              {'Title : '}
              <Text
                style={{
                  fontSize: 14,
                }}>{`${item.title}`}</Text>
            </Text>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              {'Episode : '}
              <Text
                style={{
                  fontSize: 14,
                }}>{`${item.episodeID}`}</Text>
            </Text>

            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              {'Release Date : '}
              <Text
                style={{
                  fontSize: 14,
                }}>{`${item.releaseDate}`}</Text>
            </Text>

            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              {'Director : '}
              <Text
                style={{
                  fontSize: 14,
                }}>{`${item.director}`}</Text>
            </Text>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              {'Producers : '}{' '}
            </Text>
            {item.producers &&
              item.producers.map(prodName => {
                return (
                  <Text
                    style={{
                      fontSize: 14,
                    }}>{`${prodName}`}</Text>
                );
              })}
          </View>
        </View>
      </Animated.View>
    );
  };
  useEffect(() => {
    getFilmData();
  }, []);
  return (
    <View style={styles.main}>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={['#4c669f', '#3b5998', '#FFFFFF']}
        style={styles.linearGradient}>
        <FlatList
          contentContainerStyle={{paddingTop: 40, paddingBottom: 40}}
          data={filmList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          maxToRenderPerBatch={100}
          updateCellsBatchingPeriod={1000}
        />
      </LinearGradient>
    </View>
  );
};
const styles = StyleSheet.create({
  main: {
    flex: 1,
    margin: 8,
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
});

export default HomeScreen;
