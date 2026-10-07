'use client';
import {createContext,useContext,useLayoutEffect,useMemo,useState} from 'react';
import {selectLocale,translations,type Locale,type InvitationCopy} from '../lib/i18n';
type Value={locale:Locale;copy:InvitationCopy};
const Context=createContext<Value|null>(null);
export function LocaleProvider({initialLocale,children}:{initialLocale:Locale;children:React.ReactNode}){
 const [locale,setLocale]=useState(initialLocale);
 useLayoutEffect(()=>{
  const override=new URLSearchParams(location.search).get('lang');
  const next=override==='en'||override==='tr'?override:selectLocale([navigator.language]);
  if(next!==initialLocale)setLocale(next);
 },[initialLocale]);
 useLayoutEffect(()=>{document.documentElement.lang=locale;document.documentElement.dir='ltr';},[locale]);
 const value=useMemo(()=>({locale,copy:translations[locale]}),[locale]);
 return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useLocale(){const value=useContext(Context);if(!value)throw Error('Locale provider missing');return value;}
