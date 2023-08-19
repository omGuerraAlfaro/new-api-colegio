// import { InjectRepository } from "@nestjs/typeorm";
// import { Repository } from "typeorm";
// import { JwtService } from "@nestjs/jwt";
// import { compare, hash } from "bcrypt";
// import { v4 as uuidv4 } from 'uuid';

// import { Users } from "../../models/user.entity";
// import { Roles } from "src/models/roles.entity";

// import { LoginDto, RegisterDto } from "src/dto/login.dto";
// import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

// @Injectable()
// export class AuthService {
//   constructor(
//     @InjectRepository(Users)
//     private userRepository: Repository<Users>,
//     @InjectRepository(Roles)
//     private roleRepository: Repository<Roles>,
//     private jwtAuthService: JwtService,
//   ) { }

//   async register(userObject: RegisterDto) {
//     const { password, name_user, email_user, roles } = userObject;
//     const plainToHash = await hash(password, 10);
//     try {
//       const userExist = await this.userRepository.findOne({
//         relations: ['roles'],
//         where: { name_user: userObject.name_user },
//       });
//       if (!userExist) {
//         const user = new Users();
//         user.name_user = name_user;
//         user.password = plainToHash;
//         user.email_user = email_user;
//         user.roles = [];

//         if (roles && Array.isArray(roles)) {
//           for (const rol of roles) {
//             try {
//               const roleEntity = await this.roleRepository.findOne({ where: { id_role: rol.id } });
//               user.roles.push(roleEntity);
//             } catch (error) {
//               // controlar error si no existe rol
//             }
//           }
//         }

//         await this.userRepository.save(user);

//         return {
//           body: userObject,
//           message: 'User Created',
//         };
//       } else {
//         throw new HttpException('USERNAME_ALREADY_EXIST', HttpStatus.FORBIDDEN);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }




//   async login(userObject: LoginDto) {
//     const { name_user, password } = userObject;
//     const user = await this.userRepository.findOne({
//       where: { name_user },
//       relations: {
//         roles: true,
//       },
//     });
//     if (!user) throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
//     const chkPassword = await compare(password, user.password);
//     if (!chkPassword)
//       throw new HttpException('PASSWORD_INCORRECT', HttpStatus.FORBIDDEN);
//     const payload = { name_user: userObject.name_user };
//     const token = this.jwtAuthService.sign(payload);
//     return {
//       user,
//       token,
//     };
//   }
// }
