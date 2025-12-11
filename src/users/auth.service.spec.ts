import { Test } from "@nestjs/testing";
import { User } from "./users.entity";
import { UsersService } from "./users.service";
import { AuthService } from "./auth.service";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe('AuthService', () => {

    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;


    beforeEach(async () => {
        const users: User[] = [];
        fakeUsersService = {
            find: (email: string) => {
                const filteredUsers = users.filter(user => user.email === email);
                return Promise.resolve(filteredUsers);
            },
            create: (email: string, password: string) => {
                const user = { id: Math.floor(Math.random() * 9999), email, password } as User;
                users.push(user);
                return Promise.resolve(user);
            }
        };
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ]
        }).compile();
        service = module.get(AuthService);
    });

    it('can create a auth service instance', async () => {

        expect(service).toBeDefined();
    });
    it('can create a new user with a salted and hashed password', async () => {
        const user = await service.signup('test@test.com', 'mypassword');
        expect(user.password).not.toEqual('mypassword');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
        expect(service).toBeDefined();
    });
    it('throws an error if user signs up with email that is in use', async () => {
        await service.signup('test@test.com', 'mypassword');
        await expect(service.signup('test@test.com', 'mypassword')).rejects.toThrow(BadRequestException);
    });
    it('throws if signin is called with an unused email', async () => {
        await expect(service.signin('test@test.com', 'mypassword')).rejects.toThrow(NotFoundException);
    });
    it('throws if an invalid password is provided', async () => {
        await service.signup('test@test.com', 'mypassword');
        await expect(service.signin('test@test.com', 'mypassword1')).rejects.toThrow(BadRequestException);
    });
    it('returns a user if correct password is provided', async () => {
        await service.signup('test@test.com', 'mypassword');
        const user = await service.signin('test@test.com', 'mypassword');
        expect(user).toBeDefined();
    });
});