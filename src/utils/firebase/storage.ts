import fire from "./firebase";
import 'firebase/storage';
export const uploadButtonImage=async (user:any,file:any)=>{
    const ref=fire.storage().ref(`${user.email}/buttonImage/${file.name}`);
    await ref.put(file);
    return await ref.getDownloadURL();
}