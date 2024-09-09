import axios from "axios";
import { UserGetRespons2 } from "../models/userGetRespons2";

const HOST: string = "https://dummyjson.com/users";
export class userService {
  async getAlluser() {
    const response = await axios.get(
      HOST + "?limit=0&select=firstName,lastName,email,phone,address"
    );
    const data:UserGetRespons2 = response.data.users;
    return data;
  }

  async getFilteruser(id:number) {
    const response = await axios.get(
      HOST + "/filter?key=id&value="+id
    );
    const data: UserGetRespons2 = response.data.users;
    return data;
  }

  async getUserbynameEmail(data: string) {
    console.log(data);
    const response = await axios.get(
      HOST +
        "/search?q=" +
        data +
        "&limit=0&select=firstName,lastName,email,phone,address"
    );
    const papers: UserGetRespons2 = response.data.users;
    return papers;
  }

  async getUserbyId(data: number) {
    try {
      const response = await axios.get(HOST + "/" + data);
        const papers: UserGetRespons2 = response.data;
        return papers;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
    }
  }

  async addUser(body: { id: number; firstName: string; lastName: string; email: string }) {
    const response = await axios.post(
      HOST+"/add" ,body);
    const data: UserGetRespons2 = response.data;
    return data;
  }

  async editUser(userId: number, updatedData: Partial<UserGetRespons2>) {
    const response = await axios.put(
      HOST+"/"+userId ,updatedData);
    const data:UserGetRespons2  = response.data;
    return data;
  }

  
  async deleteUser(id:number) {
    const response = await axios.delete(
      HOST+"/"+id );
    const data = response.status;
    return data;
  }

}
