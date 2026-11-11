var gt=Object.defineProperty;var z=(t,e)=>gt(t,"name",{value:e,configurable:!0});import{p as $t}from"./chunk-JWPE2WC7-BLDOIr9b.js";import{s as bt,g as wt,o as Ct,n as vt,a as Dt,b as kt,_ as s,l as X,E as At,d as Tt,p as Bt,A as Q,y as Z,B as St,V as rt}from"./mermaid-canvas-D4kXLZ-3.js";import{p as Mt}from"./cynefin-VYW2F7L2-DCXMujG3.js";import"./index-D6U2DrAI.js";import"./transform-ySJ1oe8J.js";var st=s(()=>({domains:new Map,transitions:[]}),"createDefaultData"),G=st(),zt=s(()=>G.domains,"getDomains"),Lt=s(()=>G.transitions,"getTransitions"),Nt=s(t=>{if(t)for(const e of t){const n=e.domain,a=(e.items??[]).map(c=>({label:c.label}));G.domains.set(n,{name:n,items:a})}},"setDomains"),Pt=s(t=>{t&&(G.transitions=t.filter(e=>e.from===e.to?(X.warn(`Cynefin: self-loop transition on domain "${e.from}" is not meaningful and will be skipped.`),!1):!0).map(e=>({from:e.from,to:e.to,label:e.label||void 0})))},"setTransitions"),It=s(()=>Q({...St.cynefin,...Z().cynefin}),"getConfig"),Wt=s(()=>{Bt(),G=st()},"clear"),O={getDomains:zt,getTransitions:Lt,setDomains:Nt,setTransitions:Pt,getConfig:It,clear:Wt,setAccTitle:kt,getAccTitle:Dt,setDiagramTitle:vt,getDiagramTitle:Ct,getAccDescription:wt,setAccDescription:bt},Rt=s(t=>{$t(t,O),O.setDomains(t.domains),O.setTransitions(t.transitions)},"populate"),Vt={parse:s(async t=>{const e=await Mt("cynefin",t);X.debug(e),Rt(e)},"parse")};function H(t){let e=t+1831565813|0;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}z(H,"seededRandom");s(H,"seededRandom");function it(t){let e=0;for(let n=0;n<t.length;n++){const a=t.charCodeAt(n);e=(e<<5)-e+a,e|=0}return e}z(it,"hashString");s(it,"hashString");function ct(t,e){return typeof t=="number"&&Number.isFinite(t)&&t!==0?t:it(e)}z(ct,"resolveSeed");s(ct,"resolveSeed");function lt(t,e,n,a){const c=t/2,m=a??t*.015,v=7,R=e/v,d=[];for(let o=0;o<=v;o++){const p=H(n+o*17)*m*2-m;d.push({x:c+p,y:o*R})}let D=`M${d[0].x},${d[0].y}`;for(let o=0;o<d.length-1;o++){const p=d[o],i=d[o+1],f=(p.y+i.y)/2,b=o%2===0?1:-1,h=m*1.5*b*H(n+o*31+7),V=p.x+h,_=f,E=i.x-h;D+=` C${V},${_} ${E},${f} ${i.x},${i.y}`}return D}z(lt,"generateFoldPath");s(lt,"generateFoldPath");function dt(t,e,n,a){const c=e/2,m=a??e*.015,v=7,R=t/v,d=[];for(let o=0;o<=v;o++){const p=H(n+o*23)*m*2-m;d.push({x:o*R,y:c+p})}let D=`M${d[0].x},${d[0].y}`;for(let o=0;o<d.length-1;o++){const p=d[o],i=d[o+1],f=(p.x+i.x)/2,b=o%2===0?1:-1,h=m*1.5*b*H(n+o*37+11),V=f,_=p.y+h,E=f,L=i.y-h;D+=` C${V},${_} ${E},${L} ${i.x},${i.y}`}return D}z(dt,"generateHorizontalBoundary");s(dt,"generateHorizontalBoundary");function ft(t,e){const n=t/2,a=e*.5,c=e,m=t*.03;return[`M${n},${a}`,`C${n+m},${a+(c-a)*.2}`,`${n-m*1.5},${a+(c-a)*.55}`,`${n+m*.5},${a+(c-a)*.75}`,`C${n-m},${a+(c-a)*.85}`,`${n+m*.3},${a+(c-a)*.95}`,`${n},${c}`].join(" ")}z(ft,"generateCliffPath");s(ft,"generateCliffPath");function mt(t,e,n,a){return[`M${t-n},${e}`,`A${n},${a} 0 1,1 ${t+n},${e}`,`A${n},${a} 0 1,1 ${t-n},${e}`,"Z"].join(" ")}z(mt,"generateConfusionPath");s(mt,"generateConfusionPath");var ot={complex:{model:"Probe → Sense → Respond",practice:"Emergent Practices"},complicated:{model:"Sense → Analyse → Respond",practice:"Good Practices"},clear:{model:"Sense → Categorise → Respond",practice:"Best Practices"},chaotic:{model:"Act → Sense → Respond",practice:"Novel Practices"},confusion:{model:"",practice:"Disorder"}},_t=s((t,e)=>{const n=t/2,a=e/2;return{complex:{cx:n/2,cy:a/2,x:0,y:0,w:n,h:a},complicated:{cx:n+n/2,cy:a/2,x:n,y:0,w:n,h:a},chaotic:{cx:n/2,cy:a+a/2,x:0,y:a,w:n,h:a},clear:{cx:n+n/2,cy:a+a/2,x:n,y:a,w:n,h:a},confusion:{cx:n,cy:a,x:n*.7,y:a*.7,w:n*.6,h:a*.6}}},"getDomainLayouts"),Et=s(()=>{const t=rt(),e=Z();return Q(t,e.themeVariables).cynefin},"getCynefinDomainColors"),U=3,Ft=s((t,e,n,a)=>{const c=a.db,m=c.getDomains(),v=c.getTransitions(),R=c.getDiagramTitle(),d=c.getAccTitle(),D=c.getAccDescription(),o=c.getConfig(),p=Et();X.debug("Rendering Cynefin diagram");const i=o.width,f=o.height,b=o.padding,h=o.showDomainDescriptions,V=o.boundaryAmplitude,_=i+b*2,E=f+b*2,L={complex:p.complexBg,complicated:p.complicatedBg,clear:p.clearBg,chaotic:p.chaoticBg,confusion:p.confusionBg},k=At(e);Tt(k,E,_,o.useMaxWidth??!0),k.attr("viewBox",`0 0 ${_} ${E}`),d&&k.append("title").text(d),D&&k.append("desc").text(D);const A=k.append("g").attr("transform",`translate(${b}, ${b})`),F=_t(i,f),J=ct(o.seed,e),pt=A.append("g").attr("class","cynefin-backgrounds"),j=["complex","complicated","chaotic","clear"];for(const l of j){const r=F[l];pt.append("rect").attr("class","cynefinDomain").attr("x",r.x).attr("y",r.y).attr("width",r.w).attr("height",r.h).attr("fill",L[l]).attr("fill-opacity",.4).attr("stroke","none")}const q=A.append("g").attr("class","cynefin-boundaries");q.append("path").attr("class","cynefinBoundary").attr("d",lt(i,f,J,V)).attr("fill","none"),q.append("path").attr("class","cynefinBoundary").attr("d",dt(i,f,J+100,V)).attr("fill","none"),q.append("path").attr("class","cynefinCliff").attr("d",ft(i,f)).attr("fill","none");const yt=i*.15,ut=f*.15;A.append("path").attr("class","cynefinConfusion").attr("d",mt(i/2,f/2,yt,ut)).attr("fill",L.confusion).attr("fill-opacity",.5);const K=A.append("g").attr("class","cynefin-labels");for(const l of j){const r=F[l];K.append("text").attr("class","cynefinDomainLabel").attr("x",r.cx).attr("y",h?r.cy-30:r.cy).attr("text-anchor","middle").attr("dominant-baseline","middle").text(l.charAt(0).toUpperCase()+l.slice(1))}if(K.append("text").attr("class","cynefinDomainLabel").attr("x",i/2).attr("y",h?f/2-10:f/2).attr("text-anchor","middle").attr("dominant-baseline","middle").text("Confusion"),h){const l=A.append("g").attr("class","cynefin-subtitles");for(const r of j){const u=F[r],y=ot[r];l.append("text").attr("class","cynefinSubtitle").attr("x",u.cx).attr("y",u.cy-10).attr("text-anchor","middle").attr("dominant-baseline","middle").text(y.model),l.append("text").attr("class","cynefinSubtitle").attr("x",u.cx).attr("y",u.cy+5).attr("text-anchor","middle").attr("dominant-baseline","middle").text(y.practice)}l.append("text").attr("class","cynefinSubtitle").attr("x",i/2).attr("y",f/2+8).attr("text-anchor","middle").attr("dominant-baseline","middle").text(ot.confusion.practice)}const tt=A.append("g").attr("class","cynefin-items"),T=26,et=10,ht=["complex","complicated","chaotic","clear","confusion"];for(const l of ht){const r=m.get(l);if(!r||r.items.length===0)continue;const u=F[l],y=l==="confusion";let N=r.items,P=0;y&&r.items.length>U&&(P=r.items.length-U,N=r.items.slice(0,U));let B;if(y){const g=h?22:14;B=u.cy+g}else B=u.cy+(h?25:15);if([...N].forEach((g,S)=>{const w=B+S*(T+4),M=tt.append("g"),I=M.append("text").attr("class","cynefinItemText").attr("x",0).attr("y",T/2).attr("text-anchor","middle").attr("dominant-baseline","central").text(g.label);let $=g.label.length*7;const x=I.node();if(x&&typeof x.getBBox=="function"){const Y=x.getBBox();Y.width>0&&($=Y.width)}const C=$+et*2,W=u.cx-C/2;M.attr("transform",`translate(${W}, ${w})`),M.insert("rect","text").attr("class","cynefinItem").attr("x",0).attr("y",0).attr("width",C).attr("height",T).attr("rx",4).attr("ry",4).attr("fill",L[l]).attr("fill-opacity",.95),I.attr("x",C/2).attr("y",T/2)}),P>0){const g=B+N.length*(T+4),S=`+${P} more`,w=tt.append("g"),M=w.append("text").attr("class","cynefinItemText").attr("x",0).attr("y",T/2).attr("text-anchor","middle").attr("dominant-baseline","central").text(S);let I=S.length*7;const $=M.node();if($&&typeof $.getBBox=="function"){const W=$.getBBox();W.width>0&&(I=W.width)}const x=I+et*2,C=u.cx-x/2;w.attr("transform",`translate(${C}, ${g})`),w.insert("rect","text").attr("class","cynefinItemOverflow").attr("x",0).attr("y",0).attr("width",x).attr("height",T).attr("rx",4).attr("ry",4).attr("fill",L[l]).attr("fill-opacity",.6),M.attr("x",x/2).attr("y",T/2)}}if(v.length>0){const l=k.select("defs").empty()?k.append("defs"):k.select("defs"),r=`cynefin-arrow-${e}`;l.append("marker").attr("id",r).attr("viewBox","0 0 10 10").attr("refX",9).attr("refY",5).attr("markerWidth",6).attr("markerHeight",6).attr("orient","auto-start-reverse").append("path").attr("d","M 0 0 L 10 5 L 0 10 z").attr("class","cynefinArrowHead");const u=A.append("g").attr("class","cynefin-arrows");v.forEach(y=>{const N=F[y.from],P=F[y.to];if(!N||!P)return;if(y.from===y.to){X.warn(`Cynefin renderer: skipping self-loop on domain "${y.from}"`);return}const B=N.cx,g=N.cy,S=P.cx,w=P.cy,M=(B+S)/2,I=(g+w)/2,$=S-B,x=w-g,C=Math.sqrt($*$+x*x),W=C*.15,Y=-x/C,xt=$/C,nt=M+Y*W,at=I+xt*W;u.append("path").attr("class","cynefinArrowLine").attr("d",`M${B},${g} Q${nt},${at} ${S},${w}`).attr("fill","none").attr("marker-end",`url(#${r})`),y.label&&u.append("text").attr("class","cynefinArrowLabel").attr("x",nt).attr("y",at-6).attr("text-anchor","middle").attr("dominant-baseline","auto").text(y.label)})}R&&A.append("text").attr("class","cynefinTitle").attr("x",i/2).attr("y",-b/2).attr("text-anchor","middle").attr("dominant-baseline","middle").text(R)},"draw"),Ht={draw:Ft},Gt=s(()=>{const t=rt(),e=Z();return Q(t,e.themeVariables).cynefin},"getCynefinTheme"),Yt=s(()=>{const t=Gt();return`
	.cynefinDomain {
		stroke: none;
	}
	.cynefinDomainLabel {
		font-size: ${t.domainFontSize}px;
		font-weight: bold;
		fill: ${t.labelColor};
	}
	.cynefinSubtitle {
		font-size: ${t.itemFontSize-1}px;
		fill: ${t.textColor};
		font-style: italic;
	}
	.cynefinItem {
		fill-opacity: 0.95;
		stroke: ${t.boundaryColor};
		stroke-width: 1;
	}
	.cynefinItemText {
		font-size: ${t.itemFontSize}px;
		fill: ${t.textColor};
	}
	.cynefinItemOverflow {
		fill-opacity: 0.6;
		stroke: ${t.boundaryColor};
		stroke-width: 1;
		stroke-dasharray: 3 2;
	}
	.cynefinBoundary {
		stroke: ${t.boundaryColor};
		stroke-width: ${t.boundaryWidth};
		stroke-dasharray: 6 3;
	}
	.cynefinCliff {
		stroke: ${t.cliffColor};
		stroke-width: ${t.cliffWidth};
	}
	.cynefinConfusion {
		stroke: ${t.boundaryColor};
		stroke-width: 1.5;
		stroke-dasharray: 4 2;
	}
	.cynefinArrowLine {
		stroke: ${t.arrowColor};
		stroke-width: ${t.arrowWidth};
		fill: none;
	}
	.cynefinArrowHead {
		fill: ${t.arrowColor};
		stroke: none;
	}
	.cynefinArrowLabel {
		font-size: ${t.itemFontSize-1}px;
		fill: ${t.textColor};
	}
	.cynefinTitle {
		font-size: ${t.domainFontSize+2}px;
		font-weight: bold;
		fill: ${t.labelColor};
	}
	`},"styles"),Ot=Yt,Jt={parser:Vt,db:O,renderer:Ht,styles:Ot};export{Jt as diagram};
