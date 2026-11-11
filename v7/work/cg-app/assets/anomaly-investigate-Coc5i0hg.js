var i=Object.defineProperty;var n=(e,t)=>i(e,"name",{value:t,configurable:!0});function o(e,t){if(e.length===0)return"";const a=`Investigate these anomalies: ${e.map(r=>`${r.title} (${r.id})`).join(", ")}`;return t?`${t}

${a}`:a}n(o,"composeInvestigateMessage");function u(e){switch(e){case"critical":return"critical";case"warning":return"warning";case"info":return"info";default:return"neutral"}}n(u,"severityBadgeVariant");export{o as c,u as s};
