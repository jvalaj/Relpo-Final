import UserInterface from "./user_interface";

export default interface RideInterface{
    name:string;
    ridersCount:number;
    city:string;
    uuid:string;
    desc:string;
    host:string;
    participants:string[];
}
export interface RideWithDistance extends RideInterface {
    user:UserInterface;

  }