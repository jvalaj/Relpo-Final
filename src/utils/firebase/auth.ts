import fire from "./firebase";
import 'firebase/auth';

export async function signUpWithEmailAndPassword(email:string,password:string){
    await fire.auth().createUserWithEmailAndPassword(email,password);
}
export async function signInWithEmailAndPassword(email:string,password:string){
    await fire.auth().signInWithEmailAndPassword(email,password);
}
export async function signOut() {
    await fire.auth().signOut();
}