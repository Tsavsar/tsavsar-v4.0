var l=Object.defineProperty;var r=(t,e)=>l(t,"name",{value:e,configurable:!0});import{c,A as p,aT as m}from"./index-D6U2DrAI.js";import{u}from"./useMutation-CMSbL2UU.js";import{A as h}from"./api-keys-Dln6qZI3.js";import{C as g}from"./virtual-machines-Bcxa57VF.js";function A({apiKey:t,clusterName:e,selfHostedURL:a}){const n=a?` \\
  --set global.backendURL=${a} \\
  --set global.remoteWriteURL=${a}`:"";return`# Add the CostGraph Helm repository
helm repo add costgraph https://charts.costgraph.ai
helm repo update

# Install the operator
helm install costgraph-operator costgraph/costgraph-operator \\
  --namespace costgraph \\
  --create-namespace \\
  --set global.clusterName=${e} \\
  --set global.apiKey=${t}${n}`}r(A,"buildHelmInstallCommand");function S(t){const e=r(a=>a.toString().padStart(2,"0"),"pad");return`${t.getFullYear()}${e(t.getMonth()+1)}${e(t.getDate())}-${e(t.getHours())}${e(t.getMinutes())}`}r(S,"installTokenStamp");const d=1;function k(){const t=c.c(1);let e;return t[0]===Symbol.for("react.memo_cache_sentinel")?(e={mutationFn:_},t[0]=e):e=t[0],u(e)}r(k,"useCreateInstallToken");async function _(t){const{name:e,priceId:a,product:n,tenantId:s}=t,i=`${e}-${f()}`,o=await h.createInstallToken({costgraph_product:n,name:i,tags:a?{[g]:a}:void 0,tenant_id:s,ttl_hours:d});if(o.error)throw new p(o.error,o.status);if(!o.data?.raw_api_key)throw new Error("Server did not return an install key");return o.data.raw_api_key}r(_,"_temp");function f(){return m().slice(0,8)}r(f,"randomSuffix");export{A as b,S as i,k as u};
