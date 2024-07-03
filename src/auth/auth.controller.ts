import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin-auth.dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {

  // Constructor 
  constructor( private readonly authService: AuthService ) {}

  // Iniciar sesión
  @Post()
  signIn(@Body() signinDto: SigninDto) {
    return this.authService.signIn(signinDto);
  }
  // Renovar token
  @Get('renew')
  renewToken(@Req() req: Request) {
    return this.authService.renewToken(req);
  }
}
