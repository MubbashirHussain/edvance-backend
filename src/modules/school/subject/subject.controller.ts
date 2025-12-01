import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { SubjectResponseDto } from './dto/subject-response.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/enums/user-role.enum';

@ApiTags('School Subjects')
@ApiBearerAuth()
@Controller('school/subjects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post()
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new subject' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Subject created successfully',
    type: SubjectResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Subject with this code already exists in the school',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input',
  })
  create(
    @Body() createSubjectDto: CreateSubjectDto,
  ): Promise<SubjectResponseDto> {
    return this.subjectService.create(createSubjectDto);
  }

  @Get()
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF, UserRole.SCHOOL_TEACHER)
  @ApiOperation({ summary: 'Get all subjects for a school' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of subjects',
    type: [SubjectResponseDto],
  })
  findAll(@Query('schoolId') schoolId: string): Promise<SubjectResponseDto[]> {
    if (!schoolId) {
      throw new BadRequestException('schoolId query parameter is required');
    }
    return this.subjectService.findAll(schoolId);
  }

  @Get(':id')
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF, UserRole.SCHOOL_TEACHER)
  @ApiOperation({ summary: 'Get a subject by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Subject found',
    type: SubjectResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Subject not found',
  })
  findOne(@Param('id') id: string): Promise<SubjectResponseDto> {
    return this.subjectService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF)
  @ApiOperation({ summary: 'Update a subject' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Subject updated successfully',
    type: SubjectResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Subject not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Subject with this code already exists in the school',
  })
  update(
    @Param('id') id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ): Promise<SubjectResponseDto> {
    return this.subjectService.update(id, updateSubjectDto);
  }

  @Delete(':id')
  @Roles(UserRole.SCHOOL_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a subject' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Subject deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Subject not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description:
      'Cannot delete subject as it is assigned to one or more classes',
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.subjectService.remove(id);
  }
}
