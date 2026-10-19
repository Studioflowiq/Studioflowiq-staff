import React from 'react';
import {Pressable,View} from 'react-native';
import {Copy,Card,Button,layout,useTheme} from './ui';
import {studioOverview} from './dashboard.mjs';
export function StudioOverview({data,today,onNavigate,onOpen}:any){
 const t=useTheme(),permissions:string[]=data.permissions||[],can=(p:string)=>permissions.includes(p);
 const metrics=studioOverview(data.records||[],data.bookings||[],permissions,today);
 return <><Copy accessibilityRole="header" style={[layout.heading,{marginBottom:14}]}>Studio overview</Copy>
 <View style={{flexDirection:'row',flexWrap:'wrap',gap:12}}>{metrics.map(metric=><View key={metric.key} style={{flexGrow:1,flexBasis:145}}><Pressable accessibilityRole={metric.target?'button':undefined} accessibilityLabel={metric.title+', '+metric.value+', '+metric.detail} disabled={!metric.target} onPress={()=>metric.target==='reports'?onOpen('reports'):onNavigate(metric.target)}><Card style={{marginBottom:0,minHeight:140}}><Copy muted>{metric.title}</Copy><Copy style={{fontSize:27,lineHeight:35,fontWeight:'700',color:t.accent}}>{metric.value}</Copy><Copy muted style={{fontSize:12}}>{metric.detail}</Copy></Card></Pressable></View>)}</View>
 <Card style={{marginTop:16}}><Copy accessibilityRole="header" style={layout.heading}>Studio tools</Copy>
 {can('edit_members')&&<Button title="Add member" secondary onPress={()=>onOpen('record',{kind:'member'})}/>}
 {can('edit_schedule')&&<Button title="Create class" secondary onPress={()=>onOpen('record',{kind:'class'})}/>}
 {can('view_retail')&&<Button title="Retail & membership checkout" secondary onPress={()=>onOpen('store')}/>}
 {can('view_reports')&&<Button title="Reports & reconciliation" secondary onPress={()=>onOpen('reports')}/>}
 {can('edit_memberships')&&<Button title="Membership plans" secondary onPress={()=>onOpen('catalog','plan')}/>}
 <Button title="Open workspace" secondary onPress={()=>onNavigate('more')}/>
 </Card></>;
}
