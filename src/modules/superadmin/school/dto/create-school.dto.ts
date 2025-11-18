
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsUrl,
  IsHexColor,
  MinLength,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { SchoolPlan, SchoolStatus, BillingCycle } from './school.enums';

export class CreateSchoolDto {
  @ApiProperty({
    description: 'The name of the school.',
    example: 'Greenwood High',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The domain for the school.',
    example: 'greenwood',
  })
  @IsString()
  @IsNotEmpty()
  domain: string;

  @ApiProperty({
    description: 'URL for the school logo.',
    example: 'https://example.com/logo.png',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @ApiProperty({
    description: 'URL for the school favicon.',
    example: 'https://example.com/favicon.ico',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  faviconUrl?: string;

  @ApiProperty({
    description: 'Primary color for the school theme.',
    example: '#4CAF50',
    required: false,
  })
  @IsOptional()
  @IsHexColor()
  primaryColor?: string;

  @ApiProperty({
    description: 'Secondary color for the school theme.',
    example: '#8BC34A',
    required: false,
  })
  @IsOptional()
  @IsHexColor()
  secondaryColor?: string;

  @ApiProperty({
    description: "Contact person's name.",
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  contactName?: string;

  @ApiProperty({
    description: "Contact person's email.",
    example: 'contact@greenwood.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiProperty({
    description: "Contact person's phone number.",
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiProperty({
    description: 'Address of the school.',
    example: '123 Education Lane',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'City where the school is located.',
    example: 'Springfield',
    required: false,
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    description: 'State or province where the school is located.',
    example: 'Illinois',
    required: false,
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({
    description: 'Postal code for the school address.',
    example: '62704',
    required: false,
  })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiProperty({
    description: 'Country where the school is located.',
    example: 'USA',
    required: false,
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({
    description: 'The email for the school admin account.',
    example: 'admin@greenwood.com',
  })
  @IsEmail()
  adminEmail: string;

  @ApiProperty({
    description: 'The password for the school admin account.',
    example: 'strongPassword123',
  })
  @IsString()
  @MinLength(8)
  adminPassword: string;

  @ApiProperty({
    description: 'The subscription plan for the school.',
    enum: SchoolPlan,
    example: SchoolPlan.FREE,
    required: false,
  })
  @IsOptional()
  @IsEnum(SchoolPlan)
  plan?: SchoolPlan;

  @ApiProperty({
    description: 'The current status of the school.',
    enum: SchoolStatus,
    example: SchoolStatus.TRIAL,
    required: false,
  })
  @IsOptional()
  @IsEnum(SchoolStatus)
  status?: SchoolStatus;

  @ApiProperty({
    description: 'The billing cycle for the school subscription.',
    enum: BillingCycle,
    example: BillingCycle.MONTHLY,
    required: false,
  })
  @IsOptional()
  @IsEnum(BillingCycle)
  billingCycle?: BillingCycle;

  @ApiProperty({
    description: 'Enable or disable the students module.',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  allowStudentsModule?: boolean;

  @ApiProperty({
    description: 'Enable or disable the teachers module.',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  allowTeachersModule?: boolean;

  @ApiProperty({
    description: 'Enable or disable the parent module.',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  allowParentModule?: boolean;

  @ApiProperty({
    description: 'Enable or disable the fee module.',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  allowFeeModule?: boolean;

  @ApiProperty({
    description: 'Enable or disable the attendance module.',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  allowAttendanceModule?: boolean;

  @ApiProperty({
    description: 'Enable or disable the exams module.',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  allowExamsModule?: boolean;

  @ApiProperty({
    description: 'Enable or disable the time table module.',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  allowTimeTableModule?: boolean;

  @ApiProperty({
    description: 'Enable or disable the communication module.',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  allowCommunicationModule?: boolean;

  @ApiProperty({
    description: 'Enable or disable the reports module.',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  allowReportsModule?: boolean;

  @ApiProperty({
    description: 'Enable or disable the settings module.',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  allowSettingsModule?: boolean;

  @ApiProperty({
    description: 'Enable or disable the user management module.',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  allowUserManagementModule?: boolean;
}
