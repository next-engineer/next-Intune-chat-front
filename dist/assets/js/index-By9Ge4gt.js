import{c as t}from"./button-00Ju-9bM.js";import{a as e,A as n}from"./error.api-B9wQa4Rf.js";import{A as r}from"./endPoint.constants-C9KNCxVz.js";
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const a=t("EllipsisVertical",[["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["circle",{cx:"12",cy:"5",r:"1",key:"gxeob9"}],["circle",{cx:"12",cy:"19",r:"1",key:"lyex9k"}]]),i=t("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]),s={getChatList:async()=>{try{const t=await e.get(r.CHAT.LIST);return(t.data||[]).map(l)}catch(t){throw n.handle(t)}},getChatRoom:async t=>{try{const n=(await e.get(`${r.CHAT.ROOM}/${t}`)).data||{},a=l(n.room);return{room:a,messages:Array.isArray(n.messages)?n.messages.map(c):[]}}catch(a){throw n.handle(a)}},sendMessage:async t=>{try{return c((await e.post(r.CHAT.SEND_MESSAGE,t)).data)}catch(a){throw n.handle(a)}}};
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function o(t){if(t instanceof Date)return t;if("number"==typeof t)return new Date(t);if("string"==typeof t){const e=t.trim();if(/^\d{10,}$/.test(e)){const t=Number(e),n=10===e.length?1e3*t:t;return new Date(n)}return new Date(e)}return new Date}function c(t){return{id:String((null==t?void 0:t.id)??""),content:String((null==t?void 0:t.content)??""),senderId:String((null==t?void 0:t.senderId)??""),senderName:String((null==t?void 0:t.senderName)??""),timestamp:o(null==t?void 0:t.timestamp)}}function l(t){const e={id:String((null==t?void 0:t.id)??""),name:String((null==t?void 0:t.name)??""),participants:Array.isArray(null==t?void 0:t.participants)?t.participants.map(String):[],unreadCount:Number((null==t?void 0:t.unreadCount)??0)};return(null==t?void 0:t.lastMessage)&&(e.lastMessage=c(t.lastMessage)),e}export{a as E,i as S,s as c};
