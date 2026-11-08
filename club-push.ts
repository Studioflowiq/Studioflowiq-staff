import {Platform} from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import {APP_ORIGIN,navigationTarget} from './navigation';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner:true, shouldShowList:true, shouldPlaySound:true, shouldSetBadge:false
  })
});

export function clubPushRequest(url:string,data:string):string|null {
  if(navigationTarget(url)!=='internal'||new URL(url).pathname!=='/member'||data.length>1024)return null;
  try {
    const message=JSON.parse(data);
    return message?.action==='enableClubPush'&&typeof message.scope==='string'&&message.scope.length<=240 ? message.scope : null;
  } catch { return null; }
}

export async function registerClubPush() {
  if(Platform.OS==='android')await Notifications.setNotificationChannelAsync('club-announcements',{
    name:'Club announcements',importance:Notifications.AndroidImportance.HIGH
  });
  const current=await Notifications.getPermissionsAsync();
  const permission=current.granted?current:await Notifications.requestPermissionsAsync();
  if(!permission.granted)throw Error('Allow Volleza notifications in your phone’s Settings, then try again.');
  const projectId=Constants.easConfig?.projectId ?? Constants.expoConfig?.extra?.eas?.projectId;
  if(!projectId)throw Error('This build is missing the Volleza push configuration.');
  return (await Notifications.getExpoPushTokenAsync({projectId})).data;
}

export function clubPushLink(response:Notifications.NotificationResponse) {
  const data=response.notification.request.content.data;
  if(response.actionIdentifier!==Notifications.DEFAULT_ACTION_IDENTIFIER||data?.kind!=='club-announcement'||
     typeof data.id!=='string'||!/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/.test(data.id))return null;
  return APP_ORIGIN+'/member?view=inbox&notice='+data.id;
}
