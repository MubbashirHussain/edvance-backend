import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  ParseUUIDPipe,
  HttpStatus,
  HttpCode,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { ClassResponseDto } from './dto/class-response.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { JwtAuthGuard } from '../../../common/services/token.service';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/enums/user-role.enum';

@ApiTags('Classes')
@ApiBearerAuth()
@Controller('school/classes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post()
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new class' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Class created successfully',
    type: ClassResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Class with this code already exists',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'School or teacher not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input',
  })
  async createClass(
    @Body() createClassDto: CreateClassDto,
  ): Promise<ClassResponseDto> {
    return this.classService.createClass(createClassDto);
  }

  @Get()
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all classes' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Classes found',
    type: [ClassResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Classes not found',
  })
  async getAllClasses(): Promise<ClassResponseDto[]> {
    return this.classService.getAllClasses();
  }

  @Patch(':id')
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a class' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Class updated successfully',
    type: ClassResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Class not found',
  })
  async updateClass(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClassDto: UpdateClassDto,
  ): Promise<ClassResponseDto> {
    return this.classService.updateClass(id, updateClassDto);
  }

  @Get(':id')
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get class by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Class found',
    type: ClassResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Class not found',
  })
  async getClass(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ClassResponseDto> {
    return this.classService.getClassById(id);
  }
}
