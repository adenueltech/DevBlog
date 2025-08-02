import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from './user.service';
import { PrismaService } from './prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: 'your_jwt_secret', // Change this to a secure value in production
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, UserService, PrismaService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
