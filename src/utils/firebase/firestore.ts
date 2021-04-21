import 'firebase/firestore';
import RideInterface from '../../interface/ride_interface';
import UserInterface, { defaultUser } from '../../interface/user_interface';
import fire from './firebase';

export async function createUserDocument(userProps:any) {
    return await fire.firestore().collection('users').add({...defaultUser,...userProps});
}

export async function getUserDocument(email:UserInterface['email']) {
    const data=await fire.firestore().collection('users').where('email','==',email).get();
    if(data&&!data.empty&&data.docs.length===1&&data.docs[0].exists){
        return data.docs[0];
    } else return null;
}

export async function addRide({name,ridersCount,city,lat,long,uuid,host,participants,imageURL}:RideInterface) {
    console.log(host)
    return await fire.firestore().collection('rides').add({name,ridersCount,city,lat,long,uuid,host,participants,imageURL});
    
}
export async function getUserByUID(uid:string) {
    const data= await fire.firestore().collection('users').doc(uid).get();
    if(data.exists)return {...data.data(),uuid:data.id}
    else return null;
    
}
export async function addRideToUser(user:UserInterface,rideID:RideInterface['uuid'],isHost:boolean) {
    return await fire.firestore().collection('users').doc(user.uuid).update(isHost?{ridesHosted:[...user.ridesHosted,rideID]}:{ridesJoined:[...user.ridesJoined,rideID]})
}
export async function addUserToRide(user:UserInterface,ride:RideInterface) {
    const id=(await fire.firestore().collection('rides').where('uuid','==',ride.uuid).get()).docs[0].id;
    if(ride.participants.includes(user.uuid))return;
    return await fire.firestore().collection('rides').doc(id).update({participants:[...ride.participants,user.uuid]})
}
export async function removeUserFromRide(userID:string,ride:RideInterface) {
    const id=(await fire.firestore().collection('rides').where('uuid','==',ride.uuid).get()).docs[0].id;
    if(!ride.participants.includes(userID))return;
    return await fire.firestore().collection('rides').doc(id).update({participants:ride.participants.filter(p=>p!==userID)})
}
export async function getRideByUID(uid:RideInterface['uuid']) {
    const data= await fire.firestore().collection('rides').where('uuid','==',uid).get();
    if(data&&!data.empty&&data.docs.length===1&&data.docs[0].exists){
        return data.docs[0];
    } else return null;
}