import UserInterface from "./user_interface";

export default interface RideInterface{
    name:string;
    ridersCount:number;
    city:string;
    lat:number;
    long:number;
    uuid:string;
    host:string;
    participants:string[];
    imageURL:string;
}
export interface RideWithDistance extends RideInterface {
    distance: number;
    user:UserInterface;

  }