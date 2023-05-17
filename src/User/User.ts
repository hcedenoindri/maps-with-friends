import Female2 from "../assets/svg/svg/Female2";
import Male1 from "../assets/svg/svg/Male1";

export const types = {
  Male1: "Male1",
  Male2: "Male2",
  Female2: "Female2",
  Female1: "Female1",
};

// stores user data
export interface UserI {
  username: string;
  avatarImg: string;
  points: number;
  friends: any;
}
class User implements UserI {
  username: string;
  avatarImg: string;
  points: number;
  friends: any;
  constructor(
    username: string,
    avatarImg: string,
    points: number,
    friends: any
  ) {
    this.username = username;
    this.avatarImg = avatarImg;
    this.points = points;
    this.friends = friends;
  }
}

export const dummyUser = new User("8===D", types.Male1, 0, []);

export default User;
