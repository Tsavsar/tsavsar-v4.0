var W=Object.defineProperty;var o=(e,n)=>W(e,"name",{value:n,configurable:!0});import{R as a,j as d}from"./index-D6U2DrAI.js";import{e as A}from"./bootstrap-8rr27JqB.js";var U="skullet-reveal",J="skullet-pane",h="skullet-loading",$="skullet-ghost",j="skullet-layer",N="skullet-bar",O="skullet-inactive",V="skullet-covered",Z="skullet-own",R="skullet-block",q="skullet-status",S="skullet-xray",g="var(--skullet-base, rgb(128 128 128 / 0.2))",G="var(--skullet-highlight, rgb(255 255 255 / 0.12))",H={shimmer:{slow:4e3,fast:2e3},pulse:{slow:2400,fast:1200}},z=["a","b","code","dd","dt","em","h1","h2","h3","h4","h5","h6","i","label","li","p","small","span","strong","td","th","time"],k=["audio","canvas","embed","iframe","img","input","object","picture","select","svg","textarea","video"],C=k.join(", "),K=z.join(", "),F=`
[${U}] {
  position: relative;
}

skullet-reveal {
  display: block;
}

skullet-reveal[loading]:not(:defined) {
  visibility: hidden;
}

[${J}] {
  display: block;
}

[${h}] {
  position: relative;
  -webkit-user-select: none;
  user-select: none;
  pointer-events: none;
}

[${O}] {
  display: none !important;
}

[${j}] {
  position: absolute;
  inset: 0;
  overflow: visible;
}

[${N}] {
  display: block;
  background-color: ${g};
  background-repeat: no-repeat;
}

/* Containers keep their surface; what they hold is drawn by bones, measured before the first paint */
@scope ([${h}]) to ([${Z}], [${j}]) {
  :scope,
  :scope * {
    color: transparent !important;
    -webkit-text-fill-color: transparent !important;
    text-shadow: none !important;
    text-decoration-color: transparent !important;
  }

  :scope ::placeholder {
    color: transparent !important;
  }

  /* A line to measure in empty text; content only, never a size, or a dot-sized span would grow round it */
  :scope :is(${K}):empty:not(svg *)::before {
    content: "000000";
  }

  /* Leaves are drawn by bones, so their own paint never shows; visibility, as measuring reads it */
  :scope :is(:not(:has(*)), ${C}, [${V}], [${R}]):not(svg *) {
    visibility: hidden !important;
  }

  /* No script to measure: a bar struck through each line of text instead */
  @media (scripting: none) {
    :scope :not(:has(*)):not(svg *) {
      visibility: visible !important;
    }

    :scope,
    :scope * {
      text-decoration: line-through ${g} !important;
      text-decoration-thickness: 0.72em !important;
      text-decoration-skip-ink: none !important;
    }

    :scope :is(${C}, [${R}]):not(svg *) {
      visibility: visible !important;
      background: ${g} !important;
    }

    :scope svg * {
      fill: transparent !important;
      stroke: transparent !important;
    }

    :scope :is(img, video) {
      object-position: -100vw 0;
    }
  }
}

/* Read by screen readers in the skeleton's place, never seen */
[${q}] {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

/* Debug x-ray: the ghost shown through its bones, to see what was measured */
[${S}] [${h}] [${$}],
[${S}] [${h}] [${$}] *:not(svg *) {
  visibility: visible !important;
  color: rgb(255 0 80 / 0.7) !important;
  -webkit-text-fill-color: rgb(255 0 80 / 0.7) !important;
}

/* Lets addStyles see a stylesheet already on the page, from styles.css or a server render */
:root {
  --skullet: 1;
}`,l=null,y=0,E;function Q(){y++,!l&&(E??=!!getComputedStyle(document.documentElement).getPropertyValue("--skullet"),!E&&(l=document.createElement("style"),l.dataset.skullet="true",l.textContent=F,document.head.appendChild(l)))}o(Q,"F$1");function X(){y--,!(y>0||!l)&&(l.remove(),l=null)}o(X,"ce");new Set(k);new Set(z);var Y=o(e=>typeof matchMedia<"u"&&matchMedia(e).matches,"on"),_=o(()=>typeof Element<"u"&&typeof Element.prototype.animate=="function","Je"),ee=o(()=>!_()||Y("(prefers-reduced-motion: reduce)"),"O"),te=o(e=>e.getAnimations?.()??[],"Y"),ne=.7,oe=1280,M=320,ie=2.5,re=.45,se=["shimmer","group-shimmer","pulse","none"];function ae(e){let n=getComputedStyle(e),t=o((s,c,m)=>{let u=n.getPropertyValue(s).trim();return c.includes(u)?u:m},"n"),r=t("--skullet-animation",se,"shimmer"),i=t("--skullet-speed",["slow","fast"],"slow");return{animation:r,duration:H[r==="pulse"?"pulse":"shimmer"][i]}}o(ae,"Se");var w=20,le=Math.sin(w*Math.PI/180),B=Math.cos(w*Math.PI/180),ue=le/B,pe=`${90+w}deg`,f=.85,p=12,P=o(e=>(1-Math.cos(Math.PI*e))/2,"J");function de(e){let n=e*ie,t=o((i,s)=>`color-mix(in srgb, ${G} ${(s*100).toFixed(1)}%, transparent) ${(i*e).toFixed(2)}px`,"n"),r=[];for(let i=0;i<=p;i++)r.push(t(i/p*f,P(i/p)));for(let i=1;i<=p;i++)r.push(t(f+i/p*(1-f),P(1-i/p)));return{width:n/B,image:`repeating-linear-gradient(${pe}, ${r.join(", ")}, transparent ${n.toFixed(2)}px)`}}o(de,"So");function ce(e,n,t=ae(e)){for(let T of te(e))T.cancel();if(e.style.backgroundImage="",e.style.backgroundRepeat="",ee()||typeof e.animate!="function"||t.animation==="none")return;let r={duration:t.duration,iterations:1/0};if(t.animation==="pulse"){e.animate([{opacity:1,easing:"ease-in-out"},{opacity:re,easing:"ease-in-out"},{opacity:1}],r).startTime=0;return}let i=e.getBoundingClientRect(),s=i.left+scrollX,c=t.animation==="group-shimmer"?{left:s,top:i.top,width:i.width,height:i.height}:{left:0,top:0,width:document.documentElement.clientWidth||innerWidth},m=Math.min(Math.max(c.width*.4,80),M),{width:u,image:L}=de(m),x=s-c.left+(i.top-c.top)*ue,D=t.duration*ne/(oe+M);e.style.backgroundImage=L,e.style.backgroundSize=`${u}px 100%`,e.style.backgroundRepeat="repeat-x",e.animate([{backgroundPosition:`${-x}px 0`},{backgroundPosition:`${u-x}px 0`}],{duration:u*D,iterations:1/0}).startTime=0}o(ce,"Z");new Set(k);var I=!1;try{I=!1}catch{I=!1}new WeakSet(typeof document>"u"?[]:document.querySelectorAll(`[${h}]`));var v={height:"1em",width:"60%",radius:"var(--skullet-radius, 0.25em)"},b=o(e=>typeof e=="number"?`${e}px`:e,"yt");function he({height:e=v.height,width:n=v.width,radius:t=v.radius}={}){return{height:b(e),width:b(n),borderRadius:b(t)}}o(he,"$n");function me(e){let n=e.getBoundingClientRect(),t=e.offsetParent??document.documentElement,r=t.getBoundingClientRect();return{top:n.top-r.top-t.clientTop,left:n.left-r.left-t.clientLeft,width:n.width,height:n.height}}o(me,"zn");var ge=a.createContext({});a.createContext(null);var fe=o(()=>a.useContext(ge),"b"),ve=typeof window>"u"?a.useEffect:a.useLayoutEffect,be=o(()=>a.useInsertionEffect(()=>(Q(),X),[]),"h"),ye=Number(a.version.split(".")[0])>=19,ke=o(()=>{let{nonce:e}=fe();return ye?d.jsx("style",{href:"skullet",precedence:"medium",nonce:e,children:F}):null},"E");(class extends a.Component{getSnapshotBeforeUpdate(e){for(let n of this.props.exiting){if(e.exiting.includes(n))continue;let t=this.props.registry.get(n);t&&(t.memory?.save(),t.box=me(t.element))}return null}componentDidUpdate(){}render(){return this.props.children}});var we=o(({height:e,width:n,radius:t,className:r,style:i})=>{let s=a.useRef(null);return be(),ve(()=>{s.current&&ce(s.current)},[]),d.jsxs(d.Fragment,{children:[d.jsx(ke,{}),d.jsx("span",{ref:s,[N]:"",className:r,style:{...he({height:e,width:n,radius:t}),...i}})]})},"we"),xe=Object.defineProperty,$e=o((e,n)=>xe(e,"name",{value:n,configurable:!0}),"t");const je={width:void 0,height:void 0,borderRadius:void 0};function Re({className:e,style:n}){return d.jsx(we,{className:A("rounded-sm",e),style:{...je,...n}})}o(Re,"l");$e(Re,"Skeleton");export{Re as l};
