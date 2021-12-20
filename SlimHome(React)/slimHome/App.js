import * as React from 'react';
import { StyleSheet, TextInput, View, Button, TouchableOpacity, ScrollView, TouchableHighlight  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import io from 'socket.io-client/dist/socket.io';

import { Block, Text } from './components';
import * as theme from './theme';

import mocks from './settings';

function HomeScreen({ navigation, route }) {
  const LightIcon = mocks['light'].icon;
  const SettingsIcon = mocks['settings'].icon;
  const WifiIcon = mocks['wi-fi'].icon;
  const On_Off = mocks["power"].icon;

  let socket = io("http://entegre.humbldump.com:80", {
    query: {
      device_info: JSON.stringify({
        device_id: "react",
        device_slug: route.params?.esp.slug,
        device_password: route.params?.esp.password,
      }),
    },
  });

  const [userInfo, setUserInfo] = React.useState({ 
    firstName: 'John', lastName: 'Doe',
  });

  const [Kitchen_light, setKitchen_light] = React.useState({active:false});
  const [Bathroom_light, setBathroom_light] = React.useState({active:false});
  const [Livingroom_light, setLivingroom_light] = React.useState({active:false});
  const [Allroom_light, setAllroom_light] = React.useState({active:false});

  socket.on('responseToReact', function(e){
    if(e?.type == "error"){
      console.log(e)
      alert(e.message)
      switch (e?.do) {
        case "opensettings":
          handler.onSettingPress()
          break;
        default:
          break;
      }
    }
  });

  const onLightPress = (light) => {
    if(!route.params?.esp.slug){
      handler.onSettingPress()
      return
    }

    var device= {}

    if(light === "kitchen_light")
    {
      setKitchen_light({active:!Kitchen_light.active});
      device.id = "kitchen_light"
      device.command = !Kitchen_light.active
    }
    else if(light === "bathroom_light")
    {
      setBathroom_light({active:!Bathroom_light.active});
      device.id = "bathroom_light"
      device.command = !Bathroom_light.active
    }
    else if(light === "livingroom_light")
    {
      setLivingroom_light({active:!Livingroom_light.active});
      device.id = "living_room_light"
      device.command = !Livingroom_light.active
    }
    else if(light === "allroom_light"){
      setAllroom_light({active:!Allroom_light.active});
      setKitchen_light({active:!Allroom_light.active});
      setBathroom_light({active:!Allroom_light.active});
      setLivingroom_light({active:!Allroom_light.active});
      device.id = "all_room_lights"
      device.command = !Allroom_light.active
    }
    else if(light === "restart_esp"){
      device.id = "restart_device"
      device.command = 1
    }

    socket.emit("espCommand_receive",{
      command_info: {
        device_id: "react",
        device_slug: route.params?.esp.slug,
        device_password: route.params?.esp.pass,
        home_device_str: device.id,
        home_device_command: device.command
      }
    })
  };

  const handler = {}

  // Open esp settings page bruh
  handler.onSettingPress = () => {
    navigation.navigate({
      name:'CreatePost',
      params: route.params,
      merge: true,
    })
  }

  //start to connect to socket io server
  handler.onConnectPress = () => {
    alert("hi")
  }



  React.useEffect(() => {
    if (route.params?.esp) {
      
    }
  }, [route.params?.esp]);

  return (
    <View style={{ flex: 1, justifyContent: 'flex-start', marginVertical:10, flexDirection:'column' }}>
      
      <View style={styles.main_top_icon_list}>
        <TouchableOpacity onPress={() => onLightPress("restart_esp")} style={styles.main_top_icons}>
          <WifiIcon size={24} color={theme.colors.white}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={handler.onSettingPress} style={styles.main_top_icons}>
          <SettingsIcon size={24} color={theme.colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.light_list_scroll}>
        
        {/* Kitchen Light */}
        <Block style={styles.lisht_list_item}>

          <View style={Kitchen_light.active ? styles.list_light_icon_base_active : styles.list_light_icon_base}>
            <LightIcon size={36} color={Kitchen_light.active ? theme.colors.white : theme.colors.blue}/>
          </View>

          <Text> Kitchen Light </Text>

          <TouchableHighlight style={Kitchen_light.active ? styles.list_light_icon_base_active : styles.list_light_icon_base} onPress={() => onLightPress("kitchen_light")}>
            <On_Off size={36} color={Kitchen_light.active ? theme.colors.white : theme.colors.blue}/>
          </TouchableHighlight>
        </Block>

        {/* Bathroom Light */}
        <Block style={styles.lisht_list_item}>

          <View style={Bathroom_light.active ? styles.list_light_icon_base_active : styles.list_light_icon_base}>
            <LightIcon size={36} color={Bathroom_light.active ? theme.colors.white : theme.colors.blue}/>
          </View>

          <Text> Bathroom Light </Text>

          <TouchableHighlight style={Bathroom_light.active ? styles.list_light_icon_base_active : styles.list_light_icon_base} onPress={() => onLightPress("bathroom_light")}>
            <On_Off size={36} color={Bathroom_light.active ? theme.colors.white : theme.colors.blue}/>
          </TouchableHighlight>
        </Block>

        {/* Bathroom Light */}
        <Block style={styles.lisht_list_item}>

          <View style={Livingroom_light.active ? styles.list_light_icon_base_active : styles.list_light_icon_base}>
            <LightIcon size={36} color={Livingroom_light.active ? theme.colors.white : theme.colors.blue}/>
          </View>

          <Text>Living Room Light</Text>

          <TouchableHighlight style={Livingroom_light.active ? styles.list_light_icon_base_active : styles.list_light_icon_base} onPress={() => onLightPress("livingroom_light")}>
            <On_Off size={36} color={Livingroom_light.active ? theme.colors.white : theme.colors.blue}/>
          </TouchableHighlight>
        </Block>

        {/* All Light */}
        <Block style={styles.lisht_list_item}>

          <View style={Allroom_light.active ? styles.list_light_icon_base_active : styles.list_light_icon_base}>
            <LightIcon size={36} color={Allroom_light.active ? theme.colors.white : theme.colors.blue}/>
          </View>

          <Text>All Room Light</Text>

          <TouchableHighlight style={Allroom_light.active ? styles.list_light_icon_base_active : styles.list_light_icon_base} onPress={() => onLightPress("allroom_light")}>
            <On_Off size={36} color={Allroom_light.active ? theme.colors.white : theme.colors.blue}/>
          </TouchableHighlight>
        </Block>

      </ScrollView>
      
    </View>
  );
}


function settingPage({navigation, route}){
  const [ESPSlug, setESPSlug] = React.useState('');
  const [ESPPass, setESPPass] = React.useState('');
  const ServerIcon = mocks['server'].icon;
  const onPress = () => {
    navigation.navigate({
      name: 'Home',
      params: { esp:{
        slug: ESPSlug,
        pass: ESPPass
      } },
      merge: true,
    });
  };

  
  React.useEffect(() => {
    if (route.params?.esp) {
      setESPSlug(route.params?.esp.slug);
      setESPPass(route.params?.esp.pass);
    }
  }, [route.params?.esp]);

  return(
    <Block flex={1} style={{paddingTop:10,backgroundColor:theme.colors.white}}>

      <Block center middle>
        <Block center middle style={{width:136, height:136, borderRadius:136/2, backgroundColor:theme.colors.gray2,}}>
          <ServerIcon size={96} color={theme.colors.blue}/>  
        </Block>
      </Block>

      <Block middle style={{ paddingLeft:10, paddingRight:10, marginBottom:20, marginTop: 40 }}>
        <TextInput
          placeholder='ESP Slug'
          style={{ height: 56, padding: 10,marginBottom:5, borderWidth:1,borderColor:theme.colors.gray2, alignSelf: 'stretch',borderRadius:10 }}
          value={ESPSlug}
          onChangeText={setESPSlug}
        />
        <TextInput
          placeholder='ESP Password'
          secureTextEntry={true}
          style={{ height: 56, padding: 10,marginBottom:5, borderWidth:1,borderColor:theme.colors.gray2, alignSelf: 'stretch',borderRadius:10 }}
          value={ESPPass}
          onChangeText={setESPPass}
        />
      </Block>

      <Block>
        <TouchableOpacity style={{ padding:10,backgroundColor:theme.colors.blue }} onPress={onPress}>
            <Text style={{fontWeight: '500'}} center color="white">Save Settings</Text>
        </TouchableOpacity>
      </Block>
    </Block>
    
  )
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Block flex={1} column>
      

      <NavigationContainer>
        
        <Stack.Navigator mode="modal">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="CreatePost" component={settingPage} />
        </Stack.Navigator>
      </NavigationContainer>
      
      <Text size={12} weight='200' color={theme.colors.gray2}>SlimHome V1.0.2 HumblDump</Text>
    </Block>
  );
}



const styles = StyleSheet.create({
  light_list_scroll: { backgroundColor: theme.colors.gray2 },
  lisht_list_item: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  list_light_icon_base: {
    width: 64,
    height: 64,
    borderRadius: 64 / 2,
    backgroundColor: theme.colors.gray2,
    justifyContent: "center",
    alignItems: "center",
  },
  list_light_icon_base_active: {
    width: 64,
    height: 64,
    borderRadius: 64 / 2,
    backgroundColor: theme.colors.blue,
    justifyContent: "center",
    alignItems: "center",
  },

  main_top_icons: {
    width: 30,
    height: 30,
    backgroundColor: theme.colors.blue,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    marginHorizontal: 5,
  },

  main_top_icon_list: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray,
  },
});