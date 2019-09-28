/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {API, graphqlOperation} from 'aws-amplify';
import {listRestaurants} from './src/graphql/queries';
import {ApiGatewayManagementApi} from 'aws-sdk/clients/all';

class App extends React.Component {
  state = {
    restaurants: [],
  };
  async componentDidMount() {
    try {
      const restaurantData = await API.graphql(
        graphqlOperation(listRestaurants),
      );
      console.log('restaurantData: ', restaurantData);
      this.setState({
        restaurants: restaurantData.data.listRestaurants.items,
      });
    } catch (err) {
      console.log('error fetching restaurants...', err);
    }
  }

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            {this.state.restaurants.map((restaurant, index) => (
              <View key={index}>
                <Text>{restaurant.name}</Text>
                <Text>{restaurant.description}</Text>
                <Text>{restaurant.city}</Text>
              </View>
            ))}
            <Header />
            {global.HermesInternal == null ? null : (
              <View style={styles.engine}>
                <Text style={styles.footer}>Engine: Hermes</Text>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
