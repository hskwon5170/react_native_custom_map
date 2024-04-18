import React from 'react';
import {StyleSheet} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import useAuth from '../../hooks/queries/useAuth';

function MapHomeScreen() {
  const {logoutMutation} = useAuth();
  return <MapView style={styles.container} provider={PROVIDER_GOOGLE} showsUserLocation followsUserLocation showsMyLocationButton={true} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MapHomeScreen;
