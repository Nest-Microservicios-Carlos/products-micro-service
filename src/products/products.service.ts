import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');
  onModuleInit() {
    this.$connect();
    this.logger.log('PrismaClient connected');
  }
  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const totalPages = await this.product.count({ where: { available: true } });
    const lastPage = Math.ceil(totalPages / (paginationDto.limit ?? 0));
    return {
      data: await this.product.findMany({
        skip: ((paginationDto.page ?? 1) - 1) * (paginationDto.limit ?? 0),
        take: paginationDto.limit,
        where: { available: true },
      }),
      meta: {
        page: paginationDto.page,
        totalItems: totalPages,
        lastPage,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: {
        id,
      },
    });
    if (!product) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Product with id ${id} not found`,
      });
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: __, ...data } = updateProductDto;
    await this.findOne(id);
    return this.product.update({
      where: {
        id,
      },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    /* return this.product.delete({
      where: {
        id,
      },
    }); */
    const product = this.product.update({
      where: {
        id,
      },
      data: {
        available: false,
      },
    });
    return product;
  }
}
