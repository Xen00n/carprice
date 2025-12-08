import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
    constructor(private usersService: UsersService, private authService: AuthService) { }
    @Post('signup')
    async createUser(@Body() body: CreateUserDto) {
        this.authService.signup(body.email, body.password);
    }
    @Post('signin')
    async signinUser(@Body() body: CreateUserDto) {
        return this.authService.signin(body.email, body.password);
    }
    @Get('/:id')
    async findUser(@Param('id') id: string) {
        const user = await this.usersService.findOne(parseInt(id));
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }
    @Get()
    async findAllUsers(@Query("email") email: string) {
        return await this.usersService.find(email);
    }
    @Patch('/:id')
    async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return await this.usersService.update(parseInt(id), body);
    }
    @Delete('/:id')
    async removeUser(@Param('id') id: string) {
        return await this.usersService.remove(parseInt(id));
    }

}
