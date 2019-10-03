/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';

import {Header, Colors} from 'react-native/Libraries/NewAppScreen';

import {API, graphqlOperation} from 'aws-amplify';
import {ApiGatewayManagementApi} from 'aws-sdk/clients/all';
import uuid from 'uuid/v4';

import {listRestaurants} from './src/graphql/queries';
import {createRestaurant} from './src/graphql/mutations';
import {onCreateRestaurant} from './src/graphql/subscriptions';

const CLIENTID = uuid();

class App extends React.Component {
  state = {
    name: '',
    description: '',
    city: '',
    restaurants: [],
  };

  subscription = {};

  componentDidMount() {
    this.subscription = API.graphql(
      graphqlOperation(onCreateRestaurant),
    ).subscribe({
      next: eventData => {
        console.log('eventData', eventData);
        const restaurant = eventData.value.data.onCreateRestaurant;
        if (CLIENTID === restaurant.clientId) return;
        const restaurants = [...this.state.restaurants, restaurant];
        this.setState({restaurants});
      },
    });
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  createRestaurant = async () => {
    const {name, description, city} = this.state;
    const restaurant = {
      name,
      description,
      city,
      clientId: CLIENTID,
    };

    const updatedRestaurantArray = [...this.state.restaurants, restaurant];
    this.setState({
      restaurants: updatedRestaurantArray,
      name: '',
      description: '',
      city: '',
    });

    try {
      await API.graphql(
        graphqlOperation(createRestaurant, {
          input: restaurant,
        }),
      );
      console.log('item created');
    } catch (err) {
      console.log('error creating restaurant...', err);
    }
  };

  onChange = (key, value) => {
    this.setState({[key]: value});
  };

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <Header />
            {this.state.restaurants.map((restaurant, index) => (
              <View key={index}>
                <Text>{restaurant.name}</Text>
                <Text>{restaurant.description}</Text>
                <Text>{restaurant.city}</Text>
              </View>
            ))}
            {global.HermesInternal == null ? null : (
              <View style={styles.engine}>
                <Text style={styles.footer}>Engine: Hermes</Text>
              </View>
            )}
            <TextInput
              onChangeText={v => this.onChange('name', v)}
              value={this.state.name}
              style={{height: 50, margin: 5, backgroundColor: '#ddd'}}
            />
            <TextInput
              onChangeText={v => this.onChange('description', v)}
              value={this.state.description}
              style={{height: 50, margin: 5, backgroundColor: '#ddd'}}
            />
            <TextInput
              onChangeText={v => this.onChange('city', v)}
              value={this.state.city}
              style={{height: 50, margin: 5, backgroundColor: '#ddd'}}
            />
            <Button onPress={this.createRestaurant} title="Create Restaurant" />
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});

export default App;
