import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from 'react-apollo';
import AppNavigator from './navigation/AppNavigator';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'https://graphql-server-node-js-103.herokuapp.com/graphql',
  }),
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  loadResourcesAsync = async () => {
    await Promise.all([
      Asset.loadAsync({
        back_icon: require('./assets/images/back.png'),
        rounded_square_icon: require('./assets/images/icon.png'),
        menu_icon: require('./assets/images/menu.png'),
        more_icon: require('./assets/images/more.png'),
        robot_dev: require('./assets/images/robot-dev.png'),
        robot_prod: require('./assets/images/robot-prod.png'),
        splash_screen: require('./assets/images/splash.png'),
      }),
      Font.loadAsync({
        Eczar_ExtraBold: require('./assets/fonts/Eczar-ExtraBold.ttf'),
        SpaceMono_Regular: require('./assets/fonts/SpaceMono-Regular.ttf'),
        WorkSans_Black: require('./assets/fonts/WorkSans-Black.otf'),
        WorkSans_Bold: require('./assets/fonts/WorkSans-Bold.otf'),
        WorkSans_ExtraBold: require('./assets/fonts/WorkSans-ExtraBold.otf'),
        WorkSans_ExtraLight: require('./assets/fonts/WorkSans-ExtraLight.otf'),
        WorkSans_Hairline: require('./assets/fonts/WorkSans-Hairline.otf'),
        WorkSans_Light: require('./assets/fonts/WorkSans-Light.otf'),
        WorkSans_Medium: require('./assets/fonts/WorkSans-Medium.otf'),
        WorkSans_Regular: require('./assets/fonts/WorkSans-Regular.otf'),
        WorkSans_SemiBold: require('./assets/fonts/WorkSans-SemiBold.otf'),
        WorkSans_Thin: require('./assets/fonts/WorkSans-Thin.otf'),
      }),
    ]);
  };

  handleLoadingError = (error) => {
    console.warn(error);
  };

  handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

  render() {
    const { isLoadingComplete } = this.state;
    const { skipLoadingScreen } = this.props;
    if (!isLoadingComplete && !skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this.loadResourcesAsync}
          onError={this.handleLoadingError}
          onFinish={this.handleFinishLoading}
        />
      );
    }
    return (
      <ApolloProvider client={client}>
        <View style={styles.container}>
          <AppNavigator />
        </View>
      </ApolloProvider>
    );
  }
}
