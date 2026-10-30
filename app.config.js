module.exports = ({config}) => {
 const variant = process.env.EXPO_PUBLIC_APP_VARIANT || 'management';
 if (!['management','guest','vendor'].includes(variant)) throw new Error('Unknown VayHaven app variant');
 const guest = variant === 'guest';
 const vendor = variant === 'vendor';
 const colors = {management:'#07348f',guest:'#157e82',vendor:'#c45b16'};
 const icon = './assets/icon-'+variant+'.png';
 const projectId = vendor ? (process.env.EAS_PROJECT_ID_VENDOR || 'b50c4a69-2685-4c1c-a9ba-12299f53eaa5') : process.env[guest ? 'EAS_PROJECT_ID_GUEST' : 'EAS_PROJECT_ID_MANAGEMENT'] || (guest ? '8be41244-d0e4-4cd6-87ab-3d609388596d' : 'a37f4684-12e6-4eb2-857b-d91a04e1a5e6');
 return {...config, plugins:[...(config.plugins||[]).filter(p=>(Array.isArray(p)?p[0]:p)!=='expo-sharing'),'expo-sharing'], name: vendor ? 'VayHaven Vendor' : guest ? 'VayHaven Guest' : 'VayHaven Management', icon, backgroundColor:colors[variant], slug: 'vayhaven-'+variant,
 owner:process.env.EAS_OWNER || 'studioflowiq-team', scheme:'vayhaven-'+variant,
 ios:{...config.ios,bundleIdentifier:'com.vayhaven.'+variant},
 android:{...config.android,package:'com.vayhaven.'+variant,adaptiveIcon:{foregroundImage:icon,backgroundColor:colors[variant]}},
 extra:{...config.extra,appVariant:variant,...(projectId?{eas:{projectId}}:{})}};
};
