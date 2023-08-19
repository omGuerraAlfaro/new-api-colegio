// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { JwtModule } from '@nestjs/jwt';

// import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';
// import { Users } from 'src/models/user.entity';
// import { JwtStrategy } from './jwt.strategy';
// import { ConfigService, ConfigModule } from '@nestjs/config';
// import { Roles } from 'src/models/roles.entity';


// @Module({
//   imports: [
//     TypeOrmModule.forFeature([Users, Roles]),
//     JwtModule.registerAsync({
//       imports: [ConfigModule],
//       useFactory: async (configService: ConfigService) => ({
//         secret: configService.get('JWT_SECRET'),
//         signOptions: {
//           expiresIn: '4h',
//         },
//       }),
//       inject: [ConfigService],
//     }),
//   ],
//   controllers: [AuthController],
//   providers: [AuthService, JwtStrategy, ConfigService],
// })
// export class AuthModule { }
