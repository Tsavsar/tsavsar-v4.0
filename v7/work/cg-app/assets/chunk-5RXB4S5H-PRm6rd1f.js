var se=Object.defineProperty;var m=(t,e)=>se(t,"name",{value:e,configurable:!0});import{g as ie}from"./chunk-XXDRQBXY-DqMcDt6j.js";import{s as re}from"./chunk-KBJHAD2P-CGtwu7UA.js";import{_ as p,l as k,c as F,v as ae,x as ne,a as oe,b as le,g as ce,s as he,n as ue,o as de,a8 as fe,j as z,p as pe,a4 as Se}from"./mermaid-canvas-DBiMnSjS.js";import{f as ye}from"./chunk-2GRJ4B5K-5iJ8UjP9.js";import{s as Dt}from"./transform-ySJ1oe8J.js";var At=(function(){var t=p(function(M,o,u,a){for(u=u||{},a=M.length;a--;u[M[a]]=o);return u},"o"),e=[1,2],s=[1,3],n=[1,4],r=[2,4],c=[1,9],d=[1,11],S=[1,16],f=[1,17],T=[1,18],E=[1,19],b=[1,33],I=[1,20],v=[1,21],h=[1,22],w=[1,23],N=[1,24],A=[1,26],P=[1,27],x=[1,28],B=[1,29],O=[1,30],K=[1,31],at=[1,32],nt=[1,35],ot=[1,36],lt=[1,37],ct=[1,38],X=[1,34],y=[1,4,5,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,41,45,48,51,52,53,54,57],ht=[1,4,5,14,15,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,39,40,41,45,48,51,52,53,54,57],It=[4,5,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,41,45,48,51,52,53,54,57],Tt={trace:p(m(function(){},"trace"),"trace"),yy:{},symbols_:{error:2,start:3,SPACE:4,NL:5,SD:6,document:7,line:8,statement:9,classDefStatement:10,styleStatement:11,cssClassStatement:12,idStatement:13,DESCR:14,"-->":15,HIDE_EMPTY:16,scale:17,WIDTH:18,COMPOSIT_STATE:19,STRUCT_START:20,STRUCT_STOP:21,STATE_DESCR:22,AS:23,ID:24,FORK:25,JOIN:26,CHOICE:27,CONCURRENT:28,note:29,notePosition:30,NOTE_TEXT:31,direction:32,acc_title:33,acc_title_value:34,acc_descr:35,acc_descr_value:36,acc_descr_multiline_value:37,CLICK:38,STRING:39,HREF:40,classDef:41,CLASSDEF_ID:42,CLASSDEF_STYLEOPTS:43,DEFAULT:44,style:45,STYLE_IDS:46,STYLEDEF_STYLEOPTS:47,class:48,CLASSENTITY_IDS:49,STYLECLASS:50,direction_tb:51,direction_bt:52,direction_rl:53,direction_lr:54,eol:55,";":56,EDGE_STATE:57,STYLE_SEPARATOR:58,left_of:59,right_of:60,$accept:0,$end:1},terminals_:{2:"error",4:"SPACE",5:"NL",6:"SD",14:"DESCR",15:"-->",16:"HIDE_EMPTY",17:"scale",18:"WIDTH",19:"COMPOSIT_STATE",20:"STRUCT_START",21:"STRUCT_STOP",22:"STATE_DESCR",23:"AS",24:"ID",25:"FORK",26:"JOIN",27:"CHOICE",28:"CONCURRENT",29:"note",31:"NOTE_TEXT",33:"acc_title",34:"acc_title_value",35:"acc_descr",36:"acc_descr_value",37:"acc_descr_multiline_value",38:"CLICK",39:"STRING",40:"HREF",41:"classDef",42:"CLASSDEF_ID",43:"CLASSDEF_STYLEOPTS",44:"DEFAULT",45:"style",46:"STYLE_IDS",47:"STYLEDEF_STYLEOPTS",48:"class",49:"CLASSENTITY_IDS",50:"STYLECLASS",51:"direction_tb",52:"direction_bt",53:"direction_rl",54:"direction_lr",56:";",57:"EDGE_STATE",58:"STYLE_SEPARATOR",59:"left_of",60:"right_of"},productions_:[0,[3,2],[3,2],[3,2],[7,0],[7,2],[8,2],[8,1],[8,1],[9,1],[9,1],[9,1],[9,1],[9,2],[9,3],[9,4],[9,1],[9,2],[9,1],[9,4],[9,3],[9,6],[9,1],[9,1],[9,1],[9,1],[9,4],[9,4],[9,1],[9,2],[9,2],[9,1],[9,5],[9,5],[10,3],[10,3],[11,3],[12,3],[32,1],[32,1],[32,1],[32,1],[55,1],[55,1],[13,1],[13,1],[13,3],[13,3],[30,1],[30,1]],performAction:p(m(function(o,u,a,g,_,i,Y){var l=i.length-1;switch(_){case 3:return g.setRootDoc(i[l]),i[l];case 4:this.$=[];break;case 5:i[l]!="nl"&&(i[l-1].push(i[l]),this.$=i[l-1]);break;case 6:case 7:this.$=i[l];break;case 8:this.$="nl";break;case 12:this.$=i[l];break;case 13:const tt=i[l-1];tt.description=g.trimColon(i[l]),this.$=tt;break;case 14:this.$={stmt:"relation",state1:i[l-2],state2:i[l]};break;case 15:const Et=g.trimColon(i[l]);this.$={stmt:"relation",state1:i[l-3],state2:i[l-1],description:Et};break;case 19:this.$={stmt:"state",id:i[l-3],type:"default",description:"",doc:i[l-1]};break;case 20:var G=i[l],J=i[l-2].trim();if(i[l].match(":")){var dt=i[l].split(":");G=dt[0],J=[J,dt[1]]}this.$={stmt:"state",id:G,type:"default",description:J};break;case 21:this.$={stmt:"state",id:i[l-3],type:"default",description:i[l-5],doc:i[l-1]};break;case 22:this.$={stmt:"state",id:i[l],type:"fork"};break;case 23:this.$={stmt:"state",id:i[l],type:"join"};break;case 24:this.$={stmt:"state",id:i[l],type:"choice"};break;case 25:this.$={stmt:"state",id:g.getDividerId(),type:"divider"};break;case 26:this.$={stmt:"state",id:i[l-1].trim(),note:{position:i[l-2].trim(),text:i[l].trim()}};break;case 29:this.$=i[l].trim(),g.setAccTitle(this.$);break;case 30:case 31:this.$=i[l].trim(),g.setAccDescription(this.$);break;case 32:this.$={stmt:"click",id:i[l-3],url:i[l-2],tooltip:i[l-1]};break;case 33:this.$={stmt:"click",id:i[l-3],url:i[l-1],tooltip:""};break;case 34:case 35:this.$={stmt:"classDef",id:i[l-1].trim(),classes:i[l].trim()};break;case 36:this.$={stmt:"style",id:i[l-1].trim(),styleClass:i[l].trim()};break;case 37:this.$={stmt:"applyClass",id:i[l-1].trim(),styleClass:i[l].trim()};break;case 38:g.setDirection("TB"),this.$={stmt:"dir",value:"TB"};break;case 39:g.setDirection("BT"),this.$={stmt:"dir",value:"BT"};break;case 40:g.setDirection("RL"),this.$={stmt:"dir",value:"RL"};break;case 41:g.setDirection("LR"),this.$={stmt:"dir",value:"LR"};break;case 44:case 45:this.$={stmt:"state",id:i[l].trim(),type:"default",description:""};break;case 46:this.$={stmt:"state",id:i[l-2].trim(),classes:[i[l].trim()],type:"default",description:""};break;case 47:this.$={stmt:"state",id:i[l-2].trim(),classes:[i[l].trim()],type:"default",description:""};break}},"anonymous"),"anonymous"),table:[{3:1,4:e,5:s,6:n},{1:[3]},{3:5,4:e,5:s,6:n},{3:6,4:e,5:s,6:n},t([1,4,5,16,17,19,22,24,25,26,27,28,29,33,35,37,38,41,45,48,51,52,53,54,57],r,{7:7}),{1:[2,1]},{1:[2,2]},{1:[2,3],4:c,5:d,8:8,9:10,10:12,11:13,12:14,13:15,16:S,17:f,19:T,22:E,24:b,25:I,26:v,27:h,28:w,29:N,32:25,33:A,35:P,37:x,38:B,41:O,45:K,48:at,51:nt,52:ot,53:lt,54:ct,57:X},t(y,[2,5]),{9:39,10:12,11:13,12:14,13:15,16:S,17:f,19:T,22:E,24:b,25:I,26:v,27:h,28:w,29:N,32:25,33:A,35:P,37:x,38:B,41:O,45:K,48:at,51:nt,52:ot,53:lt,54:ct,57:X},t(y,[2,7]),t(y,[2,8]),t(y,[2,9]),t(y,[2,10]),t(y,[2,11]),t(y,[2,12],{14:[1,40],15:[1,41]}),t(y,[2,16]),{18:[1,42]},t(y,[2,18],{20:[1,43]}),{23:[1,44]},t(y,[2,22]),t(y,[2,23]),t(y,[2,24]),t(y,[2,25]),{30:45,31:[1,46],59:[1,47],60:[1,48]},t(y,[2,28]),{34:[1,49]},{36:[1,50]},t(y,[2,31]),{13:51,24:b,57:X},{42:[1,52],44:[1,53]},{46:[1,54]},{49:[1,55]},t(ht,[2,44],{58:[1,56]}),t(ht,[2,45],{58:[1,57]}),t(y,[2,38]),t(y,[2,39]),t(y,[2,40]),t(y,[2,41]),t(y,[2,6]),t(y,[2,13]),{13:58,24:b,57:X},t(y,[2,17]),t(It,r,{7:59}),{24:[1,60]},{24:[1,61]},{23:[1,62]},{24:[2,48]},{24:[2,49]},t(y,[2,29]),t(y,[2,30]),{39:[1,63],40:[1,64]},{43:[1,65]},{43:[1,66]},{47:[1,67]},{50:[1,68]},{24:[1,69]},{24:[1,70]},t(y,[2,14],{14:[1,71]}),{4:c,5:d,8:8,9:10,10:12,11:13,12:14,13:15,16:S,17:f,19:T,21:[1,72],22:E,24:b,25:I,26:v,27:h,28:w,29:N,32:25,33:A,35:P,37:x,38:B,41:O,45:K,48:at,51:nt,52:ot,53:lt,54:ct,57:X},t(y,[2,20],{20:[1,73]}),{31:[1,74]},{24:[1,75]},{39:[1,76]},{39:[1,77]},t(y,[2,34]),t(y,[2,35]),t(y,[2,36]),t(y,[2,37]),t(ht,[2,46]),t(ht,[2,47]),t(y,[2,15]),t(y,[2,19]),t(It,r,{7:78}),t(y,[2,26]),t(y,[2,27]),{5:[1,79]},{5:[1,80]},{4:c,5:d,8:8,9:10,10:12,11:13,12:14,13:15,16:S,17:f,19:T,21:[1,81],22:E,24:b,25:I,26:v,27:h,28:w,29:N,32:25,33:A,35:P,37:x,38:B,41:O,45:K,48:at,51:nt,52:ot,53:lt,54:ct,57:X},t(y,[2,32]),t(y,[2,33]),t(y,[2,21])],defaultActions:{5:[2,1],6:[2,2],47:[2,48],48:[2,49]},parseError:p(m(function(o,u){if(u.recoverable)this.trace(o);else{var a=new Error(o);throw a.hash=u,a}},"parseError"),"parseError"),parse:p(m(function(o){var u=this,a=[0],g=[],_=[null],i=[],Y=this.table,l="",G=0,J=0,dt=2,tt=1,Et=i.slice.call(arguments,1),D=Object.create(this.lexer),j={yy:{}};for(var _t in this.yy)Object.prototype.hasOwnProperty.call(this.yy,_t)&&(j.yy[_t]=this.yy[_t]);D.setInput(o,j.yy),j.yy.lexer=D,j.yy.parser=this,typeof D.yylloc>"u"&&(D.yylloc={});var mt=D.yylloc;i.push(mt);var te=D.options&&D.options.ranges;typeof j.yy.parseError=="function"?this.parseError=j.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;function ee(R){a.length=a.length-2*R,_.length=_.length-R,i.length=i.length-R}m(ee,"popStack"),p(ee,"popStack");function wt(){var R;return R=g.pop()||D.lex()||tt,typeof R!="number"&&(R instanceof Array&&(g=R,R=g.pop()),R=u.symbols_[R]||R),R}m(wt,"lex"),p(wt,"lex");for(var L,H,$,bt,q={},ft,V,Nt,pt;;){if(H=a[a.length-1],this.defaultActions[H]?$=this.defaultActions[H]:((L===null||typeof L>"u")&&(L=wt()),$=Y[H]&&Y[H][L]),typeof $>"u"||!$.length||!$[0]){var kt="";pt=[];for(ft in Y[H])this.terminals_[ft]&&ft>dt&&pt.push("'"+this.terminals_[ft]+"'");D.showPosition?kt="Parse error on line "+(G+1)+`:
`+D.showPosition()+`
Expecting `+pt.join(", ")+", got '"+(this.terminals_[L]||L)+"'":kt="Parse error on line "+(G+1)+": Unexpected "+(L==tt?"end of input":"'"+(this.terminals_[L]||L)+"'"),this.parseError(kt,{text:D.match,token:this.terminals_[L]||L,line:D.yylineno,loc:mt,expected:pt})}if($[0]instanceof Array&&$.length>1)throw new Error("Parse Error: multiple actions possible at state: "+H+", token: "+L);switch($[0]){case 1:a.push(L),_.push(D.yytext),i.push(D.yylloc),a.push($[1]),L=null,J=D.yyleng,l=D.yytext,G=D.yylineno,mt=D.yylloc;break;case 2:if(V=this.productions_[$[1]][1],q.$=_[_.length-V],q._$={first_line:i[i.length-(V||1)].first_line,last_line:i[i.length-1].last_line,first_column:i[i.length-(V||1)].first_column,last_column:i[i.length-1].last_column},te&&(q._$.range=[i[i.length-(V||1)].range[0],i[i.length-1].range[1]]),bt=this.performAction.apply(q,[l,J,G,j.yy,$[1],_,i].concat(Et)),typeof bt<"u")return bt;V&&(a=a.slice(0,-1*V*2),_=_.slice(0,-1*V),i=i.slice(0,-1*V)),a.push(this.productions_[$[1]][0]),_.push(q.$),i.push(q._$),Nt=Y[a[a.length-2]][a[a.length-1]],a.push(Nt);break;case 3:return!0}}return!0},"parse"),"parse")},Zt=(function(){var M={EOF:1,parseError:p(m(function(u,a){if(this.yy.parser)this.yy.parser.parseError(u,a);else throw new Error(u)},"parseError"),"parseError"),setInput:p(function(o,u){return this.yy=u||this.yy||{},this._input=o,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},"setInput"),input:p(function(){var o=this._input[0];this.yytext+=o,this.yyleng++,this.offset++,this.match+=o,this.matched+=o;var u=o.match(/(?:\r\n?|\n).*/g);return u?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),o},"input"),unput:p(function(o){var u=o.length,a=o.split(/(?:\r\n?|\n)/g);this._input=o+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-u),this.offset-=u;var g=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),a.length-1&&(this.yylineno-=a.length-1);var _=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:a?(a.length===g.length?this.yylloc.first_column:0)+g[g.length-a.length].length-a[0].length:this.yylloc.first_column-u},this.options.ranges&&(this.yylloc.range=[_[0],_[0]+this.yyleng-u]),this.yyleng=this.yytext.length,this},"unput"),more:p(function(){return this._more=!0,this},"more"),reject:p(function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},"reject"),less:p(function(o){this.unput(this.match.slice(o))},"less"),pastInput:p(function(){var o=this.matched.substr(0,this.matched.length-this.match.length);return(o.length>20?"...":"")+o.substr(-20).replace(/\n/g,"")},"pastInput"),upcomingInput:p(function(){var o=this.match;return o.length<20&&(o+=this._input.substr(0,20-o.length)),(o.substr(0,20)+(o.length>20?"...":"")).replace(/\n/g,"")},"upcomingInput"),showPosition:p(function(){var o=this.pastInput(),u=new Array(o.length+1).join("-");return o+this.upcomingInput()+`
`+u+"^"},"showPosition"),test_match:p(function(o,u){var a,g,_;if(this.options.backtrack_lexer&&(_={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(_.yylloc.range=this.yylloc.range.slice(0))),g=o[0].match(/(?:\r\n?|\n).*/g),g&&(this.yylineno+=g.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:g?g[g.length-1].length-g[g.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+o[0].length},this.yytext+=o[0],this.match+=o[0],this.matches=o,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(o[0].length),this.matched+=o[0],a=this.performAction.call(this,this.yy,this,u,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),a)return a;if(this._backtrack){for(var i in _)this[i]=_[i];return!1}return!1},"test_match"),next:p(function(){if(this.done)return this.EOF;this._input||(this.done=!0);var o,u,a,g;this._more||(this.yytext="",this.match="");for(var _=this._currentRules(),i=0;i<_.length;i++)if(a=this._input.match(this.rules[_[i]]),a&&(!u||a[0].length>u[0].length)){if(u=a,g=i,this.options.backtrack_lexer){if(o=this.test_match(a,_[i]),o!==!1)return o;if(this._backtrack){u=!1;continue}else return!1}else if(!this.options.flex)break}return u?(o=this.test_match(u,_[g]),o!==!1?o:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},"next"),lex:p(m(function(){var u=this.next();return u||this.lex()},"lex"),"lex"),begin:p(m(function(u){this.conditionStack.push(u)},"begin"),"begin"),popState:p(m(function(){var u=this.conditionStack.length-1;return u>0?this.conditionStack.pop():this.conditionStack[0]},"popState"),"popState"),_currentRules:p(m(function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},"_currentRules"),"_currentRules"),topState:p(m(function(u){return u=this.conditionStack.length-1-Math.abs(u||0),u>=0?this.conditionStack[u]:"INITIAL"},"topState"),"topState"),pushState:p(m(function(u){this.begin(u)},"pushState"),"pushState"),stateStackSize:p(m(function(){return this.conditionStack.length},"stateStackSize"),"stateStackSize"),options:{"case-insensitive":!0},performAction:p(m(function(u,a,g,_){function i(){const Y=a.yytext.indexOf("%%");if(Y===0)return!1;if(Y>0){const l=a.yytext.slice(0,Y),G=a.yytext.slice(Y);G&&u.lexer.unput(G),a.yytext=l}return!0}switch(m(i,"processId"),p(i,"processId"),g){case 0:return 38;case 1:return 40;case 2:return 39;case 3:return 44;case 4:return 51;case 5:return 52;case 6:return 53;case 7:return 54;case 8:return 5;case 9:break;case 10:break;case 11:break;case 12:break;case 13:return this.pushState("SCALE"),17;case 14:return 18;case 15:this.popState();break;case 16:return this.begin("acc_title"),33;case 17:return this.popState(),"acc_title_value";case 18:return this.begin("acc_descr"),35;case 19:return this.popState(),"acc_descr_value";case 20:this.begin("acc_descr_multiline");break;case 21:this.popState();break;case 22:return"acc_descr_multiline_value";case 23:return this.pushState("CLASSDEF"),41;case 24:return this.popState(),this.pushState("CLASSDEFID"),"DEFAULT_CLASSDEF_ID";case 25:return this.popState(),this.pushState("CLASSDEFID"),42;case 26:return this.popState(),43;case 27:return this.pushState("CLASS"),48;case 28:return this.popState(),this.pushState("CLASS_STYLE"),49;case 29:return this.popState(),50;case 30:return this.pushState("STYLE"),45;case 31:return this.popState(),this.pushState("STYLEDEF_STYLES"),46;case 32:return this.popState(),47;case 33:return this.pushState("SCALE"),17;case 34:return 18;case 35:this.popState();break;case 36:this.pushState("STATE");break;case 37:return this.popState(),a.yytext=a.yytext.slice(0,-8).trim(),25;case 38:return this.popState(),a.yytext=a.yytext.slice(0,-8).trim(),26;case 39:return this.popState(),a.yytext=a.yytext.slice(0,-10).trim(),27;case 40:return this.popState(),a.yytext=a.yytext.slice(0,-8).trim(),25;case 41:return this.popState(),a.yytext=a.yytext.slice(0,-8).trim(),26;case 42:return this.popState(),a.yytext=a.yytext.slice(0,-10).trim(),27;case 43:return 51;case 44:return 52;case 45:return 53;case 46:return 54;case 47:this.pushState("STATE_STRING");break;case 48:return this.pushState("STATE_ID"),"AS";case 49:return i()?(this.popState(),"ID"):void 0;case 50:this.popState();break;case 51:return"STATE_DESCR";case 52:throw new Error('Error: State name must be a single word. Found: "'+a.yytext.trim()+'"');case 53:return 19;case 54:this.popState();break;case 55:return this.popState(),this.pushState("struct"),20;case 56:return this.popState(),21;case 57:break;case 58:return this.begin("NOTE"),29;case 59:return this.popState(),this.pushState("NOTE_ID"),59;case 60:return this.popState(),this.pushState("NOTE_ID"),60;case 61:this.popState(),this.pushState("FLOATING_NOTE");break;case 62:return this.popState(),this.pushState("FLOATING_NOTE_ID"),"AS";case 63:break;case 64:return"NOTE_TEXT";case 65:return i()?(this.popState(),"ID"):void 0;case 66:return i()?(this.popState(),this.pushState("NOTE_TEXT"),24):void 0;case 67:return this.popState(),a.yytext=a.yytext.substr(2).trim(),31;case 68:return this.popState(),a.yytext=a.yytext.slice(0,-8).trim(),31;case 69:return 6;case 70:return 6;case 71:return 16;case 72:return 57;case 73:return i()?24:void 0;case 74:return a.yytext=a.yytext.trim(),14;case 75:return 15;case 76:return 28;case 77:return 58;case 78:return 5;case 79:return"INVALID"}},"anonymous"),"anonymous"),rules:[/^(?:click\b)/i,/^(?:href\b)/i,/^(?:"[^"]*")/i,/^(?:default\b)/i,/^(?:.*direction\s+TB[^\n]*)/i,/^(?:.*direction\s+BT[^\n]*)/i,/^(?:.*direction\s+RL[^\n]*)/i,/^(?:.*direction\s+LR[^\n]*)/i,/^(?:[\n]+)/i,/^(?:[\s]+)/i,/^(?:((?!\n)\s)+)/i,/^(?:#[^\n]*)/i,/^(?:%%(?!\{)[^\n]*)/i,/^(?:scale\s+)/i,/^(?:\d+)/i,/^(?:\s+width\b)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:classDef\s+)/i,/^(?:DEFAULT\s+)/i,/^(?:\w+\s+)/i,/^(?:[^\n]*)/i,/^(?:class\s+)/i,/^(?:(\w+)+((,\s*\w+)*))/i,/^(?:[^\n]*)/i,/^(?:style\s+)/i,/^(?:[\w,]+\s+)/i,/^(?:[^\n]*)/i,/^(?:scale\s+)/i,/^(?:\d+)/i,/^(?:\s+width\b)/i,/^(?:state\s+)/i,/^(?:.*<<fork>>)/i,/^(?:.*<<join>>)/i,/^(?:.*<<choice>>)/i,/^(?:.*\[\[fork\]\])/i,/^(?:.*\[\[join\]\])/i,/^(?:.*\[\[choice\]\])/i,/^(?:.*direction\s+TB[^\n]*)/i,/^(?:.*direction\s+BT[^\n]*)/i,/^(?:.*direction\s+RL[^\n]*)/i,/^(?:.*direction\s+LR[^\n]*)/i,/^(?:["])/i,/^(?:\s*as\s+)/i,/^(?:[^\n\{]*)/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:\w+\s+\w+.*?\{)/i,/^(?:[^\n\s\{]+)/i,/^(?:\n)/i,/^(?:\{)/i,/^(?:\})/i,/^(?:[\n])/i,/^(?:note\s+)/i,/^(?:left of\b)/i,/^(?:right of\b)/i,/^(?:")/i,/^(?:\s*as\s*)/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:[^\n]*)/i,/^(?:\s*[^:\n\s\-]+)/i,/^(?:\s*:[^:\n;]+)/i,/^(?:[\s\S]*?\n\s*end note\b)/i,/^(?:stateDiagram\s+)/i,/^(?:stateDiagram-v2\s+)/i,/^(?:hide empty description\b)/i,/^(?:\[\*\])/i,/^(?:[^:\n\s\-\{]+)/i,/^(?:\s*:(?:[^:\n;]|:[^:\n;])+)/i,/^(?:-->)/i,/^(?:--)/i,/^(?::::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{LINE:{rules:[10,11,12],inclusive:!1},struct:{rules:[10,11,12,23,27,30,36,43,44,45,46,56,57,58,72,73,74,75,76,77],inclusive:!1},FLOATING_NOTE_ID:{rules:[65],inclusive:!1},FLOATING_NOTE:{rules:[62,63,64],inclusive:!1},NOTE_TEXT:{rules:[67,68],inclusive:!1},NOTE_ID:{rules:[66],inclusive:!1},NOTE:{rules:[59,60,61],inclusive:!1},STYLEDEF_STYLEOPTS:{rules:[],inclusive:!1},STYLEDEF_STYLES:{rules:[32],inclusive:!1},STYLE_IDS:{rules:[],inclusive:!1},STYLE:{rules:[31],inclusive:!1},CLASS_STYLE:{rules:[29],inclusive:!1},CLASS:{rules:[28],inclusive:!1},CLASSDEFID:{rules:[26],inclusive:!1},CLASSDEF:{rules:[24,25],inclusive:!1},acc_descr_multiline:{rules:[21,22],inclusive:!1},acc_descr:{rules:[19],inclusive:!1},acc_title:{rules:[17],inclusive:!1},SCALE:{rules:[14,15,34,35],inclusive:!1},ALIAS:{rules:[],inclusive:!1},STATE_ID:{rules:[49],inclusive:!1},STATE_STRING:{rules:[50,51],inclusive:!1},FORK_STATE:{rules:[],inclusive:!1},STATE:{rules:[10,11,12,37,38,39,40,41,42,47,48,52,53,54,55],inclusive:!1},ID:{rules:[10,11,12],inclusive:!1},INITIAL:{rules:[0,1,2,3,4,5,6,7,8,9,11,12,13,16,18,20,23,27,30,33,36,55,58,69,70,71,72,73,74,75,77,78,79],inclusive:!0}}};return M})();Tt.lexer=Zt;function ut(){this.yy={}}return m(ut,"Parser"),p(ut,"Parser"),ut.prototype=Tt,Tt.Parser=ut,new ut})();At.parser=At;var Ke=At,ge="TB",Gt="TB",Ot="dir",Z="state",Q="root",xt="relation",Te="classDef",Ee="style",_e="applyClass",it="default",Vt="divider",Mt="fill:none",Ut="fill: #333",Wt="c",jt="markdown",Ht="normal",vt="rect",Ct="rectWithTitle",me="stateStart",be="stateEnd",Rt="divider",$t="roundedWithTitle",ke="note",De="noteGroup",rt="statediagram",ve="state",Ce=`${rt}-${ve}`,zt="transition",Ae="note",xe="note-edge",Le=`${zt} ${xe}`,Ie=`${rt}-${Ae}`,we="cluster",Ne=`${rt}-${we}`,Oe="cluster-alt",Re=`${rt}-${Oe}`,Kt="parent",Xt="note",$e="state",Lt="----",Fe=`${Lt}${Xt}`,Ft=`${Lt}${Kt}`,Jt=p((t,e=Gt)=>{if(!t.doc)return e;let s=e;for(const n of t.doc)n.stmt==="dir"&&(s=n.value);return s},"getDir"),Pe=p(function(t,e){return e.db.getClasses()},"getClasses"),Be=p(async function(t,e,s,n){k.info("REF0:"),k.info("Drawing state diagram (v2)",e);const{securityLevel:r,state:c,layout:d}=F();n.db.extract(n.db.getRootDocV2());const S=n.db.getData(),f=ie(e,r);S.type=n.type,S.layoutAlgorithm=d,S.nodeSpacing=c?.nodeSpacing||50,S.rankSpacing=c?.rankSpacing||50,F().look==="neo"?S.markers=["barbNeo"]:S.markers=["barb"],S.diagramId=e,await ae(S,f);const E=8;try{(typeof n.db.getLinks=="function"?n.db.getLinks():new Map).forEach((I,v)=>{const h=typeof v=="string"?v:typeof v?.id=="string"?v.id:"",w=S.nodes.find(O=>O.id===h);if(!h){k.warn("⚠️ Invalid or missing stateId from key:",JSON.stringify(v));return}const N=f.node()?.querySelectorAll("g.node, g.rough-node");let A;if(N?.forEach(O=>{const K=O.textContent?.trim();(O.id===w?.domId||K===h)&&(A=O)}),!A){k.warn("⚠️ Could not find node matching text:",h);return}const P=A.parentNode;if(!P){k.warn("⚠️ Node has no parent, cannot wrap:",h);return}const x=document.createElementNS("http://www.w3.org/2000/svg","a"),B=I.url.replace(/^"+|"+$/g,"");if(x.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",B),x.setAttribute("target","_blank"),I.tooltip){const O=I.tooltip.replace(/^"+|"+$/g,"");x.setAttribute("title",O),A.setAttribute("title",O)}P.replaceChild(x,A),x.appendChild(A),k.info("🔗 Wrapped node in <a> tag for:",h,I.url)})}catch(b){k.error("❌ Error injecting clickable links:",b)}ne.insertTitle(f,"statediagramTitleText",c?.titleTopMargin??25,n.db.getDiagramTitle()),re(f,E,rt,c?.useMaxWidth??!0)},"draw"),Xe={getClasses:Pe,draw:Be,getDir:Jt},yt=new Map,U=0;function gt(t="",e=0,s="",n=Lt){const r=s!==null&&s.length>0?`${n}${s}`:"";return`${$e}-${t}${r}-${e}`}m(gt,"stateDomId");p(gt,"stateDomId");var Ye=p((t,e,s,n,r,c,d,S)=>{k.trace("items",e),e.forEach(f=>{switch(f.stmt){case Z:st(t,f,s,n,r,c,d,S);break;case it:st(t,f,s,n,r,c,d,S);break;case xt:{st(t,f.state1,s,n,r,c,d,S),st(t,f.state2,s,n,r,c,d,S);const T=d==="neo",E={id:"edge"+U,start:f.state1.id,end:f.state2.id,arrowhead:"normal",arrowTypeEnd:T?"arrow_barb_neo":"arrow_barb",style:Mt,labelStyle:"",label:z.sanitizeText(f.description??"",F()),arrowheadStyle:Ut,labelpos:Wt,labelType:jt,thickness:Ht,classes:zt,look:d};r.push(E),U++}break}})},"setupDoc"),Pt=p((t,e=Gt)=>{let s=e;if(t.doc)for(const n of t.doc)n.stmt==="dir"&&(s=n.value);return s},"getDir");function et(t,e,s){if(!e.id||e.id==="</join></fork>"||e.id==="</choice>")return;e.cssClasses&&(Array.isArray(e.cssCompiledStyles)||(e.cssCompiledStyles=[]),e.cssClasses.split(" ").forEach(r=>{const c=s.get(r);c&&(e.cssCompiledStyles=[...e.cssCompiledStyles??[],...c.styles])}));const n=t.find(r=>r.id===e.id);n?Object.assign(n,e):t.push(e)}m(et,"insertOrUpdateNode");p(et,"insertOrUpdateNode");function qt(t){return t?.classes?.join(" ")??""}m(qt,"getClassesFromDbInfo");p(qt,"getClassesFromDbInfo");function Qt(t){return t?.styles??[]}m(Qt,"getStylesFromDbInfo");p(Qt,"getStylesFromDbInfo");var st=p((t,e,s,n,r,c,d,S)=>{const f=e.id,T=s.get(f),E=qt(T),b=Qt(T),I=F();if(k.info("dataFetcher parsedItem",e,T,b),f!=="root"){let v=vt;e.start===!0?v=me:e.start===!1&&(v=be),e.type!==it&&(v=e.type),yt.get(f)||yt.set(f,{id:f,shape:v,description:z.sanitizeText(f,I),cssClasses:`${E} ${Ce}`,cssStyles:b});const h=yt.get(f);e.description&&(Array.isArray(h.description)?(h.shape=Ct,h.description.push(e.description)):h.description?.length&&h.description.length>0?(h.shape=Ct,h.description===f?h.description=[e.description]:h.description=[h.description,e.description]):(h.shape=vt,h.description=e.description),h.description=z.sanitizeTextOrArray(h.description,I)),h.description?.length===1&&h.shape===Ct&&(h.type==="group"?h.shape=$t:h.shape=vt),!h.type&&e.doc&&(k.info("Setting cluster for XCX",f,Pt(e)),h.type="group",h.isGroup=!0,h.dir=Pt(e),h.explicitDir=e.doc.some(N=>N.stmt==="dir"),h.shape=e.type===Vt?Rt:$t,h.cssClasses=`${h.cssClasses} ${Ne} ${c?Re:""}`);const w={labelStyle:"",shape:h.shape,label:h.description,cssClasses:h.cssClasses,cssCompiledStyles:[],cssStyles:h.cssStyles,id:f,dir:h.dir,domId:gt(f,U),type:h.type,isGroup:h.type==="group",padding:8,rx:10,ry:10,look:d,labelType:"markdown"};if(w.shape===Rt&&(w.label=""),t&&t.id!=="root"&&(k.trace("Setting node ",f," to be child of its parent ",t.id),w.parentId=t.id),w.centerLabel=!0,e.note){const N={labelStyle:"",shape:ke,label:e.note.text,labelType:"markdown",cssClasses:Ie,cssStyles:[],cssCompiledStyles:[],id:f+Fe+"-"+U,domId:gt(f,U,Xt),type:h.type,isGroup:h.type==="group",padding:I.flowchart?.padding,look:d,position:e.note.position},A=f+Ft,P={labelStyle:"",shape:De,label:e.note.text,cssClasses:h.cssClasses,cssStyles:[],id:f+Ft,domId:gt(f,U,Kt),type:"group",isGroup:!0,padding:16,look:d,position:e.note.position};U++,P.id=A,N.parentId=A,et(n,P,S),et(n,N,S),et(n,w,S);let x=f,B=N.id;e.note.position==="left of"&&(x=N.id,B=f),r.push({id:x+"-"+B,start:x,end:B,arrowhead:"none",arrowTypeEnd:"",style:Mt,labelStyle:"",classes:Le,arrowheadStyle:Ut,labelpos:Wt,labelType:jt,thickness:Ht,look:d})}else et(n,w,S)}e.doc&&(k.trace("Adding nodes children "),Ye(e,e.doc,s,n,r,!c,d,S))},"dataFetcher"),Ge=p(()=>{yt.clear(),U=0},"reset"),C={START_NODE:"[*]",START_TYPE:"start",END_NODE:"[*]",END_TYPE:"end",COLOR_KEYWORD:"color",FILL_KEYWORD:"fill",BG_FILL:"bgFill",STYLECLASS_SEP:","},Bt=p(()=>new Map,"newClassesList"),Yt=p(()=>({relations:[],states:new Map,documents:{}}),"newDoc"),St=p(t=>JSON.parse(JSON.stringify(t)),"clone"),W,Je=(W=class{constructor(e){this.version=e,this.nodes=[],this.edges=[],this.rootDoc=[],this.classes=Bt(),this.documents={root:Yt()},this.currentDocument=this.documents.root,this.startEndCount=0,this.dividerCnt=0,this.links=new Map,this.funs=[],this.getAccTitle=oe,this.setAccTitle=le,this.getAccDescription=ce,this.setAccDescription=he,this.setDiagramTitle=ue,this.getDiagramTitle=de,this.clear(),this.setRootDoc=this.setRootDoc.bind(this),this.getDividerId=this.getDividerId.bind(this),this.setDirection=this.setDirection.bind(this),this.trimColon=this.trimColon.bind(this),this.bindFunctions=this.bindFunctions.bind(this)}extract(e){this.clear(!0);for(const r of Array.isArray(e)?e:e.doc)switch(r.stmt){case Z:this.addState(r.id.trim(),r.type,r.doc,r.description,r.note);break;case xt:this.addRelation(r.state1,r.state2,r.description);break;case Te:this.addStyleClass(r.id.trim(),r.classes);break;case Ee:this.handleStyleDef(r);break;case _e:this.setCssClass(r.id.trim(),r.styleClass);break;case"click":this.addLink(r.id,r.url,r.tooltip);break}const s=this.getStates(),n=F();Ge(),st(void 0,this.getRootDocV2(),s,this.nodes,this.edges,!0,n.look,this.classes);for(const r of this.nodes)if(Array.isArray(r.label)){if(r.description=r.label.slice(1),r.isGroup&&r.description.length>0)throw new Error(`Group nodes can only have label. Remove the additional description for node [${r.id}]`);r.label=r.label[0]}}handleStyleDef(e){const s=e.id.trim().split(","),n=e.styleClass.split(",");for(const r of s){let c=this.getState(r);if(!c){const d=r.trim();this.addState(d),c=this.getState(d)}c&&(c.styles=n.map(d=>d.replace(/;/g,"")?.trim()))}}setRootDoc(e){k.info("Setting root doc",e),this.rootDoc=e,this.version===1?this.extract(e):this.extract(this.getRootDocV2())}docTranslator(e,s,n){if(s.stmt===xt){this.docTranslator(e,s.state1,!0),this.docTranslator(e,s.state2,!1);return}if(s.stmt===Z&&(s.id===C.START_NODE?(s.id=e.id+(n?"_start":"_end"),s.start=n):s.id=s.id.trim()),s.stmt!==Q&&s.stmt!==Z||!s.doc)return;const r=[];let c=[];for(const d of s.doc)if(d.type===Vt){const S=St(d);S.doc=St(c),r.push(S),c=[]}else c.push(d);if(r.length>0&&c.length>0){const d={stmt:Z,id:fe(),type:"divider",doc:St(c)};r.push(St(d)),s.doc=r}s.doc.forEach(d=>this.docTranslator(s,d,!0))}getRootDocV2(){return this.docTranslator({id:Q,stmt:Q},{id:Q,stmt:Q,doc:this.rootDoc},!0),{id:Q,doc:this.rootDoc}}addState(e,s=it,n=void 0,r=void 0,c=void 0,d=void 0,S=void 0,f=void 0){const T=e?.trim();if(!this.currentDocument.states.has(T))k.info("Adding state ",T,r),this.currentDocument.states.set(T,{stmt:Z,id:T,descriptions:[],type:s,doc:n,note:c,classes:[],styles:[],textStyles:[]});else{const E=this.currentDocument.states.get(T);if(!E)throw new Error(`State not found: ${T}`);E.doc||(E.doc=n),E.type||(E.type=s)}if(r&&(k.info("Setting state description",T,r),(Array.isArray(r)?r:[r]).forEach(b=>this.addDescription(T,b.trim()))),c){const E=this.currentDocument.states.get(T);if(!E)throw new Error(`State not found: ${T}`);E.note=c,E.note.text=z.sanitizeText(E.note.text,F())}d&&(k.info("Setting state classes",T,d),(Array.isArray(d)?d:[d]).forEach(b=>this.setCssClass(T,b.trim()))),S&&(k.info("Setting state styles",T,S),(Array.isArray(S)?S:[S]).forEach(b=>this.setStyle(T,b.trim()))),f&&(k.info("Setting state styles",T,S),(Array.isArray(f)?f:[f]).forEach(b=>this.setTextStyle(T,b.trim())))}clear(e){this.nodes=[],this.edges=[],this.funs=[this.setupToolTips.bind(this)],this.documents={root:Yt()},this.currentDocument=this.documents.root,this.startEndCount=0,this.classes=Bt(),e||(this.links=new Map,pe())}getState(e){return this.currentDocument.states.get(e)}getStates(){return this.currentDocument.states}logDocuments(){k.info("Documents = ",this.documents)}getRelations(){return this.currentDocument.relations}addLink(e,s,n){this.links.set(e,{url:s,tooltip:n}),k.warn("Adding link",e,s,n)}getLinks(){return this.links}startIdIfNeeded(e=""){return e===C.START_NODE?(this.startEndCount++,`${C.START_TYPE}${this.startEndCount}`):e}startTypeIfNeeded(e="",s=it){return e===C.START_NODE?C.START_TYPE:s}endIdIfNeeded(e=""){return e===C.END_NODE?(this.startEndCount++,`${C.END_TYPE}${this.startEndCount}`):e}endTypeIfNeeded(e="",s=it){return e===C.END_NODE?C.END_TYPE:s}addRelationObjs(e,s,n=""){const r=this.startIdIfNeeded(e.id.trim()),c=this.startTypeIfNeeded(e.id.trim(),e.type),d=this.startIdIfNeeded(s.id.trim()),S=this.startTypeIfNeeded(s.id.trim(),s.type);this.addState(r,c,e.doc,e.description,e.note,e.classes,e.styles,e.textStyles),this.addState(d,S,s.doc,s.description,s.note,s.classes,s.styles,s.textStyles),this.currentDocument.relations.push({id1:r,id2:d,relationTitle:z.sanitizeText(n,F())})}addRelation(e,s,n){if(typeof e=="object"&&typeof s=="object")this.addRelationObjs(e,s,n);else if(typeof e=="string"&&typeof s=="string"){const r=this.startIdIfNeeded(e.trim()),c=this.startTypeIfNeeded(e),d=this.endIdIfNeeded(s.trim()),S=this.endTypeIfNeeded(s);this.addState(r,c),this.addState(d,S),this.currentDocument.relations.push({id1:r,id2:d,relationTitle:n?z.sanitizeText(n,F()):void 0})}}addDescription(e,s){const n=this.currentDocument.states.get(e),r=s.startsWith(":")?s.replace(":","").trim():s;n?.descriptions?.push(z.sanitizeText(r,F()))}cleanupLabel(e){return e.startsWith(":")?e.slice(2).trim():e.trim()}getDividerId(){return this.dividerCnt++,`divider-id-${this.dividerCnt}`}addStyleClass(e,s=""){this.classes.has(e)||this.classes.set(e,{id:e,styles:[],textStyles:[]});const n=this.classes.get(e);s&&n&&s.split(C.STYLECLASS_SEP).forEach(r=>{const c=r.replace(/([^;]*);/,"$1").trim();if(RegExp(C.COLOR_KEYWORD).exec(r)){const S=c.replace(C.FILL_KEYWORD,C.BG_FILL).replace(C.COLOR_KEYWORD,C.FILL_KEYWORD);n.textStyles.push(S)}n.styles.push(c)})}getClasses(){return this.classes}setupToolTips(e){const s=ye();Dt(e).select("svg").selectAll("g.node, g.rough-node").on("mouseover",c=>{const d=Dt(c.currentTarget),S=d.attr("title");if(S===null)return;const f=c.currentTarget?.getBoundingClientRect();s.transition().duration(200).style("opacity",".9"),s.style("left",window.scrollX+f.left+(f.right-f.left)/2+"px").style("top",window.scrollY+f.bottom+"px"),s.html(Se.sanitize(S)),d.classed("hover",!0)}).on("mouseout",c=>{s.transition().duration(500).style("opacity",0),Dt(c.currentTarget).classed("hover",!1)})}setCssClass(e,s){e.split(",").forEach(n=>{let r=this.getState(n);if(!r){const c=n.trim();this.addState(c),r=this.getState(c)}r?.classes?.push(s)})}setStyle(e,s){this.getState(e)?.styles?.push(s)}setTextStyle(e,s){this.getState(e)?.textStyles?.push(s)}bindFunctions(e){this.funs.forEach(s=>{s(e)})}getDirectionStatement(){return this.rootDoc.find(e=>e.stmt===Ot)}getDirection(){return this.getDirectionStatement()?.value??ge}setDirection(e){const s=this.getDirectionStatement();s?s.value=e:this.rootDoc.unshift({stmt:Ot,value:e})}trimColon(e){return e.startsWith(":")?e.slice(1).trim():e.trim()}getData(){const e=F();return{nodes:this.nodes,edges:this.edges,other:{},config:e,direction:Jt(this.getRootDocV2())}}getConfig(){return F().state}},m(W,"StateDB"),p(W,"StateDB"),W.relationType={AGGREGATION:0,EXTENSION:1,COMPOSITION:2,DEPENDENCY:3},W),Ve=p(t=>`
defs [id$="-barbEnd"] {
    fill: ${t.transitionColor};
    stroke: ${t.transitionColor};
  }
g.stateGroup text {
  fill: ${t.nodeBorder};
  stroke: none;
  font-size: 10px;
}
g.stateGroup text {
  fill: ${t.textColor};
  stroke: none;
  font-size: 10px;

}
g.stateGroup .state-title {
  font-weight: bolder;
  fill: ${t.stateLabelColor};
}

g.stateGroup rect {
  fill: ${t.mainBkg};
  stroke: ${t.nodeBorder};
}

g.stateGroup line {
  stroke: ${t.lineColor};
  stroke-width: ${t.strokeWidth||1};
}

.transition {
  stroke: ${t.transitionColor};
  stroke-width: ${t.strokeWidth||1};
  fill: none;
}

.stateGroup .composit {
  fill: ${t.background};
  border-bottom: 1px
}

.stateGroup .alt-composit {
  fill: #e0e0e0;
  border-bottom: 1px
}

.state-note {
  stroke: ${t.noteBorderColor};
  fill: ${t.noteBkgColor};

  text {
    fill: ${t.noteTextColor};
    stroke: none;
    font-size: 10px;
  }
}

.stateLabel .box {
  stroke: none;
  stroke-width: 0;
  fill: ${t.mainBkg};
  opacity: 0.5;
}

.edgeLabel .label rect {
  fill: ${t.labelBackgroundColor};
  opacity: 0.5;
}
.edgeLabel {
  background-color: ${t.edgeLabelBackground};
  p {
    background-color: ${t.edgeLabelBackground};
  }
  rect {
    opacity: 0.5;
    background-color: ${t.edgeLabelBackground};
    fill: ${t.edgeLabelBackground};
  }
  text-align: center;
}
.edgeLabel .label text {
  fill: ${t.transitionLabelColor||t.tertiaryTextColor};
}
.label div .edgeLabel {
  color: ${t.transitionLabelColor||t.tertiaryTextColor};
}

.stateLabel text {
  fill: ${t.stateLabelColor};
  font-size: 10px;
  font-weight: bold;
}

.node circle.state-start {
  fill: ${t.specialStateColor};
  stroke: ${t.specialStateColor};
}

.node .fork-join {
  fill: ${t.specialStateColor};
  stroke: ${t.specialStateColor};
}

.node circle.state-end {
  fill: ${t.innerEndBackground};
  stroke: ${t.background};
  stroke-width: 1.5
}
.end-state-inner {
  fill: ${t.compositeBackground||t.background};
  // stroke: ${t.background};
  stroke-width: 1.5
}

.node rect {
  fill: ${t.stateBkg||t.mainBkg};
  stroke: ${t.stateBorder||t.nodeBorder};
  stroke-width: ${t.strokeWidth||1}px;
}
.node polygon {
  fill: ${t.mainBkg};
  stroke: ${t.stateBorder||t.nodeBorder};;
  stroke-width: ${t.strokeWidth||1}px;
}
[id$="-barbEnd"] {
  fill: ${t.lineColor};
}

.statediagram-cluster rect {
  fill: ${t.compositeTitleBackground};
  stroke: ${t.stateBorder||t.nodeBorder};
  stroke-width: ${t.strokeWidth||1}px;
}

.cluster-label, .nodeLabel {
  color: ${t.stateLabelColor};
  // line-height: 1;
}

.statediagram-cluster rect.outer {
  rx: 5px;
  ry: 5px;
}
.statediagram-state .divider {
  stroke: ${t.stateBorder||t.nodeBorder};
}

.statediagram-state .title-state {
  rx: 5px;
  ry: 5px;
}
.statediagram-cluster.statediagram-cluster .inner {
  fill: ${t.compositeBackground||t.background};
}
.statediagram-cluster.statediagram-cluster-alt .inner {
  fill: ${t.altBackground?t.altBackground:"#efefef"};
}

.statediagram-cluster .inner {
  rx:0;
  ry:0;
}

.statediagram-state rect.basic {
  rx: 5px;
  ry: 5px;
}
.statediagram-state rect.divider {
  stroke-dasharray: 10,10;
  fill: ${t.altBackground?t.altBackground:"#efefef"};
}

.note-edge {
  stroke-dasharray: 5;
}

.statediagram-note rect {
  fill: ${t.noteBkgColor};
  stroke: ${t.noteBorderColor};
  stroke-width: 1px;
  rx: 0;
  ry: 0;
}
.statediagram-note rect {
  fill: ${t.noteBkgColor};
  stroke: ${t.noteBorderColor};
  stroke-width: 1px;
  rx: 0;
  ry: 0;
}

.statediagram-note text {
  fill: ${t.noteTextColor};
}

.statediagram-note .nodeLabel {
  color: ${t.noteTextColor};
}
.statediagram .edgeLabel {
  color: red; // ${t.noteTextColor};
}

[id$="-dependencyStart"], [id$="-dependencyEnd"] {
  fill: ${t.lineColor};
  stroke: ${t.lineColor};
  stroke-width: ${t.strokeWidth||1};
}

.statediagramTitleText {
  text-anchor: middle;
  font-size: 18px;
  fill: ${t.textColor};
}

[data-look="neo"].statediagram-cluster rect {
  fill: ${t.mainBkg};
  stroke: ${t.useGradient?"url("+t.svgId+"-gradient)":t.stateBorder||t.nodeBorder};
  stroke-width: ${t.strokeWidth??1};
}
[data-look="neo"].statediagram-cluster rect.outer {
  rx: ${t.radius}px;
  ry: ${t.radius}px;
  filter: ${t.dropShadow?t.dropShadow.replace("url(#drop-shadow)",`url(${t.svgId}-drop-shadow)`):"none"}
}
`,"getStyles"),qe=Ve;export{Je as S,Ke as a,Xe as b,qe as s};
