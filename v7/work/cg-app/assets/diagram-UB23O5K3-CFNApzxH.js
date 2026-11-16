var _=Object.defineProperty;var $=(e,t)=>_(e,"name",{value:t,configurable:!0});import{p as E}from"./chunk-JWPE2WC7-BLDOIr9b.js";import{s as F,g as D,o as P,n as z,a as G,b as B,_ as c,E as V,p as W,A as C,y as b,B as H,l as A,V as j,d as U}from"./mermaid-canvas-D4kXLZ-3.js";import{p as X}from"./cynefin-VYW2F7L2-DCXMujG3.js";import"./index-D6U2DrAI.js";import"./transform-ySJ1oe8J.js";var x={showLegend:!0,ticks:5,max:null,min:0,graticule:"circle"},w=32,M={axes:[],curves:[],options:x},m=structuredClone(M),K=H.radar,N=c(()=>C({...K,...b().radar}),"getConfig"),L=c(()=>m.axes,"getAxes"),Y=c(()=>m.curves,"getCurves"),Z=c(()=>m.options,"getOptions"),q=c(e=>{m.axes=e.map(t=>({name:t.name,label:t.label??t.name}))},"setAxes"),J=c(e=>{m.curves=e.map(t=>({name:t.name,label:t.label??t.name,entries:Q(t.entries)}))},"setCurves"),Q=c(e=>{if(e[0].axis==null)return e.map(a=>a.value);const t=L();if(t.length===0)throw new Error("Axes must be populated before curves for reference entries");return t.map(a=>{const r=e.find(s=>s.axis?.$refText===a.name);if(r===void 0)throw new Error("Missing entry for axis "+a.label);return r.value})},"computeCurveEntries"),tt=c(e=>{const t=e.reduce((a,r)=>(a[r.name]=r,a),{});m.options={showLegend:t.showLegend?.value??x.showLegend,ticks:t.ticks?.value??x.ticks,max:t.max?.value??x.max,min:t.min?.value??x.min,graticule:t.graticule?.value??x.graticule},m.options.ticks>w&&(A.warn(`Radar diagram ticks (${m.options.ticks}) exceeds maximum allowed (${w}). Using ${w} instead.`),m.options.ticks=w)},"setOptions"),et=c(()=>{W(),m=structuredClone(M)},"clear"),f={getAxes:L,getCurves:Y,getOptions:Z,setAxes:q,setCurves:J,setOptions:tt,getConfig:N,clear:et,setAccTitle:B,getAccTitle:G,setDiagramTitle:z,getDiagramTitle:P,getAccDescription:D,setAccDescription:F},at=c(e=>{E(e,f);const{axes:t,curves:a,options:r}=e;f.setAxes(t),f.setCurves(a),f.setOptions(r)},"populate"),rt={parse:c(async e=>{const t=await X("radar",e);A.debug(t),at(t)},"parse")},st=c((e,t,a,r)=>{const s=r.db,i=s.getAxes(),l=s.getCurves(),n=s.getOptions(),o=s.getConfig(),d=s.getDiagramTitle(),p=V(t),u=nt(p,o),g=n.max??Math.max(...l.map(y=>Math.max(...y.entries))),h=n.min,v=Math.min(o.width,o.height)/2;ot(u,i,v,n.ticks,n.graticule),it(u,i,v,o),T(u,i,l,h,g,n.graticule,o),O(u,l,n.showLegend,o),u.append("text").attr("class","radarTitle").text(d).attr("x",0).attr("y",-o.height/2-o.marginTop)},"draw"),nt=c((e,t)=>{const a=t.width+t.marginLeft+t.marginRight,r=t.height+t.marginTop+t.marginBottom,s={x:t.marginLeft+t.width/2,y:t.marginTop+t.height/2};return U(e,r,a,t.useMaxWidth??!0),e.attr("viewBox",`0 0 ${a} ${r}`).attr("overflow","visible"),e.append("g").attr("transform",`translate(${s.x}, ${s.y})`)},"drawFrame"),ot=c((e,t,a,r,s)=>{if(s==="circle")for(let i=0;i<r;i++){const l=a*(i+1)/r;e.append("circle").attr("r",l).attr("class","radarGraticule")}else if(s==="polygon"){const i=t.length;for(let l=0;l<r;l++){const n=a*(l+1)/r,o=t.map((d,p)=>{const u=2*p*Math.PI/i-Math.PI/2,g=n*Math.cos(u),h=n*Math.sin(u);return`${g},${h}`}).join(" ");e.append("polygon").attr("points",o).attr("class","radarGraticule")}}},"drawGraticule"),it=c((e,t,a,r)=>{const s=t.length;for(let i=0;i<s;i++){const l=t[i].label,n=2*i*Math.PI/s-Math.PI/2,o=Math.cos(n),d=Math.sin(n);e.append("line").attr("x1",0).attr("y1",0).attr("x2",a*r.axisScaleFactor*o).attr("y2",a*r.axisScaleFactor*d).attr("class","radarAxisLine");const p=o>.01?"start":o<-.01?"end":"middle",u=d>.01?"hanging":d<-.01?"auto":"central",g=4;e.append("text").text(l).attr("x",a*r.axisLabelFactor*o+g*o).attr("y",a*r.axisLabelFactor*d+g*d).attr("text-anchor",p).attr("dominant-baseline",u).attr("class","radarAxisLabel")}},"drawAxes");function T(e,t,a,r,s,i,l){const n=t.length,o=Math.min(l.width,l.height)/2;a.forEach((d,p)=>{if(d.entries.length!==n)return;const u=d.entries.map((g,h)=>{const v=2*Math.PI*h/n-Math.PI/2,y=S(g,r,s,o),R=y*Math.cos(v),I=y*Math.sin(v);return{x:R,y:I}});i==="circle"?e.append("path").attr("d",k(u,l.curveTension)).attr("class",`radarCurve-${p}`):i==="polygon"&&e.append("polygon").attr("points",u.map(g=>`${g.x},${g.y}`).join(" ")).attr("class",`radarCurve-${p}`)})}$(T,"drawCurves");c(T,"drawCurves");function S(e,t,a,r){const s=Math.min(Math.max(e,t),a);return r*(s-t)/(a-t)}$(S,"relativeRadius");c(S,"relativeRadius");function k(e,t){const a=e.length;let r=`M${e[0].x},${e[0].y}`;for(let s=0;s<a;s++){const i=e[(s-1+a)%a],l=e[s],n=e[(s+1)%a],o=e[(s+2)%a],d={x:l.x+(n.x-i.x)*t,y:l.y+(n.y-i.y)*t},p={x:n.x-(o.x-l.x)*t,y:n.y-(o.y-l.y)*t};r+=` C${d.x},${d.y} ${p.x},${p.y} ${n.x},${n.y}`}return`${r} Z`}$(k,"closedRoundCurve");c(k,"closedRoundCurve");function O(e,t,a,r){if(!a)return;const s=(r.width/2+r.marginRight)*3/4,i=-(r.height/2+r.marginTop)*3/4,l=20;t.forEach((n,o)=>{const d=e.append("g").attr("transform",`translate(${s}, ${i+o*l})`);d.append("rect").attr("width",12).attr("height",12).attr("class",`radarLegendBox-${o}`),d.append("text").attr("x",16).attr("y",0).attr("class","radarLegendText").text(n.label)})}$(O,"drawLegend");c(O,"drawLegend");var lt={draw:st},ct=c((e,t)=>{let a="";for(let r=0;r<e.THEME_COLOR_LIMIT;r++){const s=e[`cScale${r}`];a+=`
		.radarCurve-${r} {
			color: ${s};
			fill: ${s};
			fill-opacity: ${t.curveOpacity};
			stroke: ${s};
			stroke-width: ${t.curveStrokeWidth};
		}
		.radarLegendBox-${r} {
			fill: ${s};
			fill-opacity: ${t.curveOpacity};
			stroke: ${s};
		}
		`}return a},"genIndexStyles"),dt=c(e=>{const t=j(),a=b(),r=C(t,a.themeVariables),s=C(r.radar,e);return{themeVariables:r,radarOptions:s}},"buildRadarStyleOptions"),ut=c(({radar:e}={})=>{const{themeVariables:t,radarOptions:a}=dt(e);return`
	.radarTitle {
		font-size: ${t.fontSize};
		color: ${t.titleColor};
		dominant-baseline: hanging;
		text-anchor: middle;
	}
	.radarAxisLine {
		stroke: ${a.axisColor};
		stroke-width: ${a.axisStrokeWidth};
	}
	.radarAxisLabel {
		font-size: ${a.axisLabelFontSize}px;
		color: ${a.axisColor};
	}
	.radarGraticule {
		fill: ${a.graticuleColor};
		fill-opacity: ${a.graticuleOpacity};
		stroke: ${a.graticuleColor};
		stroke-width: ${a.graticuleStrokeWidth};
	}
	.radarLegendText {
		text-anchor: start;
		font-size: ${a.legendFontSize}px;
		dominant-baseline: hanging;
	}
	${ct(t,a)}
	`},"styles"),$t={parser:rt,db:f,renderer:lt,styles:ut};export{$t as diagram};
