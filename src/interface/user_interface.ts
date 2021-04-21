export default interface UserInterface{
    name:string;
    email:string;
    phone:number;
    uuid:string;
    ridesJoined:string[];
    ridesHosted:string[];
}
export const defaultUser:UserInterface={
    name:'',
    email:'',
    phone:-1,
    uuid:'',
    ridesJoined:[],
    ridesHosted:[]
}
