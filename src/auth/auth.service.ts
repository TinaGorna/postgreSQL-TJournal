import {Injectable} from "@nestjs/common";
import {UserService} from "../user/user.service";

@Injectable()
export class AuthService {
    constructor(private usersService: UserService) {
    }

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByCond({
            email,
            password,
        });
        if (user && user.password === password) {
            const {password, ...result} = user;
            return result;
        }
        return null;
    }
}
