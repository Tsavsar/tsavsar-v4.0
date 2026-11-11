var rt=Object.defineProperty;var L=(t,r)=>rt(t,"name",{value:r,configurable:!0});import{p as nt}from"./chunk-JWPE2WC7-BLDOIr9b.js";import{Q as T,I as G,b4 as it,g as ot,s as st,a as lt,b as ct,o as ut,n as dt,_ as g,l as I,c as gt,A as pt,E as ht,a0 as ft,d as mt,p as vt,B as xt}from"./mermaid-canvas-D4kXLZ-3.js";import{p as St}from"./cynefin-VYW2F7L2-DCXMujG3.js";import"./transform-ySJ1oe8J.js";import{d as q}from"./arc-BKtgzgsT.js";import{o as yt}from"./ordinal-CzvP-XYS.js";import"./index-D6U2DrAI.js";import"./init-GRbUuopv.js";function wt(t,r){return r<t?-1:r>t?1:r>=t?0:NaN}L(wt,"descending");function At(t){return t}L(At,"identity");function Ct(){var t=At,r=wt,y=null,b=T(0),l=T(G),p=T(0);function i(e){var n,s=(e=it(e)).length,h,w,$=0,f=new Array(s),o=new Array(s),D=+b.apply(this,arguments),z=Math.min(G,Math.max(-G,l.apply(this,arguments)-D)),k,W=Math.min(Math.abs(z)/s,p.apply(this,arguments)),u=W*(z<0?-1:1),A;for(n=0;n<s;++n)(A=o[f[n]=n]=+t(e[n],n,e))>0&&($+=A);for(r!=null?f.sort(function(M,m){return r(o[M],o[m])}):y!=null&&f.sort(function(M,m){return y(e[M],e[m])}),n=0,w=$?(z-s*u)/$:0;n<s;++n,D=k)h=f[n],A=o[h],k=D+(A>0?A*w:0)+u,o[h]={data:e[h],index:n,value:A,startAngle:D,endAngle:k,padAngle:W};return o}return L(i,"pie"),i.value=function(e){return arguments.length?(t=typeof e=="function"?e:T(+e),i):t},i.sortValues=function(e){return arguments.length?(r=e,y=null,i):r},i.sort=function(e){return arguments.length?(y=e,r=null,i):y},i.startAngle=function(e){return arguments.length?(b=typeof e=="function"?e:T(+e),i):b},i.endAngle=function(e){return arguments.length?(l=typeof e=="function"?e:T(+e),i):l},i.padAngle=function(e){return arguments.length?(p=typeof e=="function"?e:T(+e),i):p},i}L(Ct,"d3pie");var $t=xt.pie,V={sections:new Map,showData:!1},H=V.sections,U=V.showData,Dt=structuredClone($t),Tt=g(()=>structuredClone(Dt),"getConfig"),bt=g(()=>{H=new Map,U=V.showData,vt()},"clear"),kt=g(({label:t,value:r})=>{if(r<0)throw new Error(`"${t}" has invalid value: ${r}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);H.has(t)||(H.set(t,r),I.debug(`added new section: ${t}, with value: ${r}`))},"addSection"),Et=g(()=>H,"getSections"),zt=g(t=>{U=t},"setShowData"),Mt=g(()=>U,"getShowData"),J={getConfig:Tt,clear:bt,setDiagramTitle:dt,getDiagramTitle:ut,setAccTitle:ct,getAccTitle:lt,setAccDescription:st,getAccDescription:ot,addSection:kt,getSections:Et,setShowData:zt,getShowData:Mt},Rt=g((t,r)=>{nt(t,r),r.setShowData(t.showData),t.sections.map(r.addSection)},"populateDb"),Lt={parse:g(async t=>{const r=await St("pie",t);I.debug(r),Rt(r,J)},"parse")},Wt=g(t=>`
  .pieCircle{
    stroke: ${t.pieStrokeColor};
    stroke-width : ${t.pieStrokeWidth};
    opacity : ${t.pieOpacity};
  }
  .pieCircle.highlighted{
    scale: 1.05;
    opacity: 1;
  }
  .pieCircle.highlightedOnHover:hover{
    transition-duration: 250ms;
    scale: 1.05;
    opacity: 1;
  }
  .pieOuterCircle{
    stroke: ${t.pieOuterStrokeColor};
    stroke-width: ${t.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${t.pieTitleTextSize};
    fill: ${t.pieTitleTextColor};
    font-family: ${t.fontFamily};
  }
  .slice {
    font-family: ${t.fontFamily};
    fill: ${t.pieSectionTextColor};
    font-size:${t.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${t.pieLegendTextColor};
    font-family: ${t.fontFamily};
    font-size: ${t.pieLegendTextSize};
  }
`,"getStyles"),_t=Wt,Ft=g(t=>{const r=[...t.values()].reduce((l,p)=>l+p,0),y=[...t.entries()].map(([l,p])=>({label:l,value:p})).filter(l=>l.value/r*100>=1);return Ct().value(l=>l.value).sort(null)(y)},"createPieArcs"),Ht=g((t,r,y,b)=>{I.debug(`rendering pie chart
`+t);const l=b.db,p=gt(),i=pt(l.getConfig(),p.pie),e=40,n=18,s=4,h=450,w=h,$=ht(r),f=$.append("g");f.attr("transform","translate("+w/2+","+h/2+")");const{themeVariables:o}=p;let[D]=ft(o.pieOuterStrokeWidth);D??=2;const z=i.legendPosition,k=i.textPosition,W=i.donutHole>0&&i.donutHole<=.9?i.donutHole:0,u=Math.min(w,h)/2-e,A=q().innerRadius(W*u).outerRadius(u),M=q().innerRadius(u*k).outerRadius(u*k),m=f.append("g");m.append("circle").attr("cx",0).attr("cy",0).attr("r",u+D/2).attr("class","pieOuterCircle");const _=l.getSections(),K=Ft(_),Y=[o.pie1,o.pie2,o.pie3,o.pie4,o.pie5,o.pie6,o.pie7,o.pie8,o.pie9,o.pie10,o.pie11,o.pie12];let N=0;_.forEach(a=>{N+=a});const j=K.filter(a=>(a.data.value/N*100).toFixed(0)!=="0"),O=yt(Y).domain([..._.keys()]);m.selectAll("mySlices").data(j).enter().append("path").attr("d",A).attr("fill",a=>O(a.data.label)).attr("class",a=>{let c="pieCircle";return i.highlightSlice==="hover"?c+=" highlightedOnHover":i.highlightSlice===a.data.label&&(c+=" highlighted"),c}),m.selectAll("mySlices").data(j).enter().append("text").text(a=>(a.data.value/N*100).toFixed(0)+"%").attr("transform",a=>"translate("+M.centroid(a)+")").style("text-anchor","middle").attr("class","slice");const tt=f.append("text").text(l.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText"),R=[..._.entries()].map(([a,c])=>({label:a,value:c})),C=f.selectAll(".legend").data(R).enter().append("g").attr("class","legend");C.append("rect").attr("width",n).attr("height",n).style("fill",a=>O(a.label)).style("stroke",a=>O(a.label)),C.append("text").attr("x",n+s).attr("y",n-s).text(a=>l.getShowData()?`${a.label} [${a.value}]`:a.label);const E=Math.max(...C.selectAll("text").nodes().map(a=>a?.getBoundingClientRect().width??0));let F=h,P=w+e;const d=n+s,B=R.length*d;switch(z){case"center":C.attr("transform",(a,c)=>{const v=d*R.length/2,x=-E/2-(n+s),S=c*d-v;return"translate("+x+","+S+")"});break;case"top":F+=B,C.attr("transform",(a,c)=>{const v=u,x=-E/2-(n+s),S=c*d-v;return`translate(${x}, ${S})`}),m.attr("transform",()=>`translate(0, ${B+d})`);break;case"bottom":F+=B,C.attr("transform",(a,c)=>{const v=-u-d,x=-E/2-(n+s),S=c*d-v;return"translate("+x+","+S+")"});break;case"left":P+=n+s+E,C.attr("transform",(a,c)=>{const v=d*R.length/2,x=-u-(n+s),S=c*d-v;return"translate("+x+","+S+")"}),m.attr("transform",()=>`translate(${E+n+s}, 0)`);break;default:P+=n+s+E,C.attr("transform",(a,c)=>{const v=d*R.length/2,x=12*n,S=c*d-v;return"translate("+x+","+S+")"});break}const Q=tt.node()?.getBoundingClientRect().width??0,et=w/2-Q/2,at=w/2+Q/2,X=Math.min(0,et),Z=Math.max(P,at)-X;$.attr("viewBox",`${X} 0 ${Z} ${F}`),mt($,F,Z,i.useMaxWidth)},"draw"),Nt={draw:Ht},Zt={parser:Lt,db:J,renderer:Nt,styles:_t};export{Zt as diagram};
