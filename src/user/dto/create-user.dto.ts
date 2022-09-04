import {IsEmail, Length} from "class-validator";

export class CreateUserDto {
    @Length(3)
    fullName: string;

    @IsEmail(undefined, {message: "Неверная почта"})
    email: string;

    @Length(6, 32, {message: "Password should be min 6 elements"})
    password?: string;
}
