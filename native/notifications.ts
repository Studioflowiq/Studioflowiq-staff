import {Alert,Linking,Platform} from 'react-native';
import * as Notifications from 'expo-notifications';
Notifications.setNotificationHandler({handleNotification:async()=>({shouldShowBanner:true,shouldShowList:true,shouldPlaySound:true,shouldSetBadge:false})});
export async function enableAlerts(api:any,projectId:string){if(Platform.OS==='android')await Notifications.setNotificationChannelAsync('bookings',{name:'Studio bookings',importance:Notifications.AndroidImportance.DEFAULT});let p=await Notifications.getPermissionsAsync();if(!p.granted)p=await Notifications.requestPermissionsAsync();if(!p.granted){Alert.alert('Notifications are off','You can enable notifications in Settings.',[{text:'Later'},{text:'Open Settings',onPress:()=>void Linking.openSettings()}]);return ''}const token=(await Notifications.getExpoPushTokenAsync({projectId})).data;await api('/api/mobile/push',{action:'register',token});return token;}
export {Notifications};
