import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Ad } from '../database/models/ad.model';
import { User } from '../database/models/user.model';
import { Category } from '../database/models/category.model';
import { CreateAdDto } from './dto/create-ad.dto';

@Injectable()
export class AdsService {
  constructor(@InjectModel(Ad) private adModel: typeof Ad) {}

  async findAll(query: {
    search?: string;
    categoryId?: number;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
    attributes?: Record<string, string | string[]>;
  }) {
    const { search, categoryId, city, minPrice, maxPrice, page = 1, limit = 20, attributes } = query;
    const where: any = { status: 'active' };

    if (search) where.title = { [Op.iLike]: `%${search}%` };
    if (categoryId) where.categoryId = categoryId;
    if (city) where.city = { [Op.iLike]: `%${city}%` };
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }

    // JSONB attribute filtering: each key=value uses @> containment
    // Multi-select (array value) uses OR across values
    if (attributes && Object.keys(attributes).length > 0) {
      const attrConditions: any[] = [];
      for (const [key, value] of Object.entries(attributes)) {
        if (!value || (Array.isArray(value) && value.length === 0)) continue;
        if (Array.isArray(value)) {
          // OR across selected multi-select values
          attrConditions.push({
            [Op.or]: value.map((v) => ({
              attributes: { [Op.contains]: { [key]: v } },
            })),
          });
        } else {
          attrConditions.push({ attributes: { [Op.contains]: { [key]: value } } });
        }
      }
      if (attrConditions.length > 0) {
        where[Op.and] = [...(where[Op.and] ?? []), ...attrConditions];
      }
    }

    const { rows, count } = await this.adModel.findAndCountAll({
      where,
      include: [
        { model: User, attributes: ['id', 'name', 'city', 'avatar'] },
        { model: Category, attributes: ['id', 'name', 'slug'] },
      ],
      limit,
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']],
    });

    return { data: rows, total: count, page, limit };
  }

  async findOne(id: number) {
    const ad = await this.adModel.findByPk(id, {
      include: [
        { model: User, attributes: ['id', 'name', 'phone', 'city', 'avatar'] },
        { model: Category },
      ],
    });
    if (!ad) throw new NotFoundException('Ad not found');
    await ad.increment('views');
    return ad;
  }

  async create(userId: number, dto: CreateAdDto) {
    return this.adModel.create({ ...dto, userId } as any);
  }

  async update(id: number, userId: number, data: Partial<Ad>) {
    const ad = await this.adModel.findByPk(id);
    if (!ad) throw new NotFoundException('Ad not found');
    if (ad.userId !== userId) throw new ForbiddenException();
    return ad.update(data);
  }

  async remove(id: number, userId: number) {
    const ad = await this.adModel.findByPk(id);
    if (!ad) throw new NotFoundException('Ad not found');
    if (ad.userId !== userId) throw new ForbiddenException();
    await ad.destroy();
  }

  findByUser(userId: number) {
    return this.adModel.findAll({
      where: { userId },
      include: [{ model: Category, attributes: ['id', 'name', 'slug'] }],
      order: [['createdAt', 'DESC']],
    });
  }
}
