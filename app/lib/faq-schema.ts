import type {FaqItem} from "./site-content";
export function faqStructuredData(items:FaqItem[]){return {"@context":"https://schema.org","@type":"FAQPage",mainEntity:items.map(item=>({"@type":"Question",name:item.q,acceptedAnswer:{"@type":"Answer",text:item.a}}))};}
export function safeSchemaJson(value:unknown){return JSON.stringify(value).replace(/</g,"\\u003c");}
