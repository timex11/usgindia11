import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InstitutionsModule {}

@Injectable()
export class InstitutionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.university.findMany({
      include: {
        colleges: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.university.findUnique({
      where: { id },
      include: {
        colleges: true,
        departments: true,
      },
    });
  }

  async getPendingVerifications(collegeId: string): Promise<unknown[]> {
    const data = await this.prisma.profile.findMany({
      where: {
        collegeId: collegeId,
        isVerified: false,
      },
    });
    return data;
  }

  async verifySearch(name: string): Promise<unknown> {
    const institution = await this.prisma.university.findFirst({
      where: {
        name: {
          contains: name,
        },
      },
    });

    return institution;
  }

  async updateVerificationStatus(
    userId: string,
    status: 'approved' | 'rejected',
  ): Promise<unknown> {
    const data = await this.prisma.profile.update({
      where: {
        id: userId,
      },
      data: {
        isVerified: status === 'approved',
      },
    });
    return data;
  }

  async bulkVerify(
    userIds: string[],
    status: 'approved' | 'rejected',
  ): Promise<unknown> {
    const data = await this.prisma.profile.updateMany({
      where: {
        id: {
          in: userIds,
        },
      },
      data: {
        isVerified: status === 'approved',
      },
    });
    return data;
  }

  async verifyStudent(studentId: string, collegeId: string): Promise<unknown> {
    const data = await this.prisma.profile.update({
      where: {
        id: studentId,
        collegeId: collegeId,
      },
      data: {
        isVerified: true,
      },
    });
    return data;
  }
}
