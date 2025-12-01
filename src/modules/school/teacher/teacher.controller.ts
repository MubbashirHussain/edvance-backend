import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TeacherService } from './teacher.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { TeacherFilterDto } from './dto/teacher-filter.dto';
import { TeacherResponseDto } from './dto/teacher-response.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/enums/user-role.enum';

@ApiTags('School Teachers')
@ApiBearerAuth()
@Controller('school/teachers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post()
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new teacher' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Teacher created successfully',
    type: TeacherResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Teacher with this email already exists',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input',
  })
  create(@Body() createDto: CreateTeacherDto) {
    return this.teacherService.create(createDto);
  }

  @Get()
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF, UserRole.SCHOOL_TEACHER)
  @ApiOperation({ summary: 'Get all teachers for a school' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of teachers',
    type: [TeacherResponseDto],
  })
  findAll(
    @Query('schoolId') schoolId: string,
    @Query() filter: TeacherFilterDto,
  ) {
    return this.teacherService.findAll(schoolId, filter);
  }

  @Get(':id')
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF, UserRole.SCHOOL_TEACHER)
  @ApiOperation({ summary: 'Get a teacher by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Teacher found',
    type: TeacherResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Teacher not found',
  })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('schoolId') schoolId: string,
  ) {
    return this.teacherService.findOne(id, schoolId);
  }

  @Patch(':id')
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF)
  @ApiOperation({ summary: 'Update a teacher' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Teacher updated successfully',
    type: TeacherResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Teacher not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email already in use',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('schoolId') schoolId: string,
    @Body() updateDto: UpdateTeacherDto,
  ) {
    return this.teacherService.update(id, schoolId, updateDto);
  }

  @Delete(':id')
  @Roles(UserRole.SCHOOL_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a teacher' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Teacher deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Teacher not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Cannot delete teacher assigned to classes',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('schoolId') schoolId: string,
  ): Promise<void> {
    await this.teacherService.remove(id, schoolId);
  }
}
