import { Body, Controller, Post, Get, Patch, Delete, Param, Query, UseGuards, Request, HttpStatus, HttpCode, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentFilterDto } from './dto/student-filter.dto';
import { PaginationParamsDto } from '../../../common/dto/pagination-params.dto';
import { CustomJwtGuard } from '../../../common/guards/custom-jwt.guard';
import { PrismaService } from '../../../common/prisma/prisma.service';

@ApiTags('school/student')
@Controller('school/student')
@UseGuards(CustomJwtGuard)
@ApiBearerAuth()
export class StudentController {
    constructor(
        private readonly studentService: StudentService,
        private readonly prisma: PrismaService,
    ) { }

    @Post('create')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new student with parents' })
    @ApiResponse({ status: 201, description: 'Student successfully created' })
    async create(@Request() req, @Body() createStudentDto: CreateStudentDto) {
        const schoolId = await this.getSchoolId(req.user.userId);
        return this.studentService.createStudent(schoolId, createStudentDto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get all students with pagination and filtering' })
    @ApiResponse({ status: 200, description: 'List of students' })
    async findAll(
        @Request() req,
        @Query() pagination: PaginationParamsDto,
        @Query() filter: StudentFilterDto,
    ) {
        const schoolId = await this.getSchoolId(req.user.userId);
        return this.studentService.findAll(schoolId, pagination, filter);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get a student by ID' })
    @ApiResponse({ status: 200, description: 'Student details' })
    async findOne(@Request() req, @Param('id') id: string) {

        const schoolId = await this.getSchoolId(req.user.userId);
        if (id.startsWith('ST')) {
            return this.studentService.findByStudentId(schoolId, id);
        }
        return this.studentService.findOne(schoolId, id);
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update a student' })
    @ApiResponse({ status: 200, description: 'Student updated successfully' })
    async update(
        @Request() req,
        @Param('id') id: string,
        @Body() updateStudentDto: UpdateStudentDto,
    ) {
        const schoolId = await this.getSchoolId(req.user.userId);
        return this.studentService.update(schoolId, id, updateStudentDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete a student' })
    @ApiResponse({ status: 200, description: 'Student deleted successfully' })
    async remove(@Request() req, @Param('id') id: string) {
        const schoolId = await this.getSchoolId(req.user.userId);
        return this.studentService.remove(schoolId, id);
    }

    private async getSchoolId(userId: string): Promise<string> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { schoolId: true },
        });

        if (!user || !user.schoolId) {
            throw new ForbiddenException('User is not associated with any school');
        }

        return user.schoolId;
    }
}
