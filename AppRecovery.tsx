import React from 'react';
import {Pressable,SafeAreaView,ScrollView,StyleSheet,Text,View} from 'react-native';
export default class AppRecovery extends React.Component<React.PropsWithChildren,{error:Error|null;generation:number}>{
 state={error:null as Error|null,generation:0};
 static getDerivedStateFromError(error:Error){return{error}}
 render(){const{error,generation}=this.state;if(!error)return <React.Fragment key={generation}>{this.props.children}</React.Fragment>;
 return <SafeAreaView style={s.root}><ScrollView contentContainerStyle={s.body}><Text style={s.brand}>AV8 FLY</Text><Text style={s.title}>Let’s reopen your flight workspace.</Text><Text style={s.text}>A screen could not load. Your saved flight is kept on this device. Retry below, or share the diagnostic message through TestFlight feedback.</Text><View style={s.diagnostic}><Text selectable style={s.detail}>{String(error.message||error).slice(0,1500)}</Text></View><Pressable accessibilityRole="button" style={s.button} onPress={()=>this.setState({error:null,generation:generation+1})}><Text style={s.buttonText}>Retry workspace</Text></Pressable></ScrollView></SafeAreaView>;
 }
}
const s=StyleSheet.create({root:{flex:1,backgroundColor:'#091929'},body:{padding:24,flexGrow:1,justifyContent:'center'},brand:{fontSize:22,fontWeight:'800',color:'#fff',marginBottom:32},title:{fontSize:25,fontWeight:'600',color:'#fff',marginBottom:16},text:{fontSize:15,lineHeight:23,color:'#bed2df'},diagnostic:{padding:15,backgroundColor:'#142d41',borderRadius:8,marginVertical:22},detail:{fontSize:12,lineHeight:19,color:'#c4dfef'},button:{padding:16,borderRadius:10,backgroundColor:'#69c7ff',alignItems:'center'},buttonText:{fontSize:15,fontWeight:'700',color:'#091929'}});
