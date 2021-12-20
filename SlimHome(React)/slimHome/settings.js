import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as theme from './theme';

export default {
  'server':{
    name: 'Server',
    icon: ({size, color, ...props}) => (
      <MaterialCommunityIcons name="server-security" size={size} color={color} {...props} />
    ),
  },
  'settings':{
    name: 'Settings',
    icon: ({size, color, ...props}) => (
      <MaterialIcons name="settings" size={size} color={color} {...props} />
    ),
  },
  'power':{
    name: 'Power',
    icon: ({size, color, ...props}) => (
      <MaterialCommunityIcons
        size={size || theme.sizes.font}
        color={color || theme.colors.gray2}
        name="power"
        {...props}
      />
    ),
  },
  'light': {
    name: 'Light',
    icon: ({size, color, ...props}) => (
      <MaterialCommunityIcons
        size={size || theme.sizes.font}
        color={color || theme.colors.gray2}
        name="lightbulb-on-outline"
        {...props}
      />
    ),
  },
  'ac': {
    name: 'AC',
    icon: ({size, color, ...props}) => (
      <MaterialCommunityIcons
        size={size || theme.sizes.font}
        color={color || theme.colors.accent}
        name="air-conditioner"
        {...props}
      />
    ),
  },
  'temperature': {
    name: 'Temperature',
    icon: ({size, color, ...props}) => (
      <MaterialCommunityIcons
        size={size || theme.sizes.font}
        color={color || theme.colors.accent}
        name="temperature-celsius"
        {...props}
      />
    ),
  },
  'fan': {
    name: 'Fan',
    icon: ({size, color, ...props}) => (
      <MaterialCommunityIcons
        size={size || theme.sizes.font}
        color={color || theme.colors.accent}
        name="fan"
        {...props}
      />
    ),
  },
  'wi-fi': {
    name: 'Wi-Fi',
    icon: ({size, color, ...props}) => (
      <MaterialCommunityIcons
        size={size || theme.sizes.font}
        color={color || theme.colors.accent}
        name="restart"
        {...props}
      />
    ),
  },
  'electricity': {
    name: 'Electricity',
    icon: ({size, color, ...props}) => (
      <MaterialIcons
        size={size || theme.sizes.font}
        color={color || theme.colors.accent}
        name="power"
        {...props}
      />
    ),
  },
};