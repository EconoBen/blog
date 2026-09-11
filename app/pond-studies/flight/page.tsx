import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {FlightStudy} from './FlightStudy';
export const metadata:Metadata={title:'Flight study',robots:{index:false,follow:false}};
export default function Page(){
  if(process.env.VERCEL_ENV==='production')notFound();
  return <FlightStudy/>;
}
