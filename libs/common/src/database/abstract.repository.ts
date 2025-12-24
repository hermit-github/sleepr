import { Logger, NotFoundException } from '@nestjs/common';
import { AbstractDocument } from './abstract.schema';
import { Model, Types, QueryFilter, UpdateQuery } from 'mongoose';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createdDocument.save()).toJSON() as unknown as TDocument;
  }

  async findOne(filter: QueryFilter<TDocument>): Promise<TDocument | null> {
    const document = await this.model.findOne(filter).lean<TDocument>(true);
    if (!document) {
      this.logger.warn(
        `Document not found with filter: ${JSON.stringify(filter)}`,
      );
      throw new NotFoundException('Document not found');
    }
    return document;
  }

  async findOneAndUpdate(
    filter: QueryFilter<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model
      .findOneAndUpdate(filter, update, { new: true })
      .lean<TDocument>(true);
    if (!document) {
      this.logger.warn(
        `Document not found for update with filter: ${JSON.stringify(filter)}`,
      );
      throw new NotFoundException('Document not found for update');
    }
    return document;
  }

  async find(filter: QueryFilter<TDocument>): Promise<TDocument[]> {
    return this.model.find(filter).lean<TDocument[]>(true);
  }

  async findOneAndDelete(filter: QueryFilter<TDocument>): Promise<TDocument> {
    const document = await this.model
      .findOneAndDelete(filter)
      .lean<TDocument>(true);
    if (!document) {
      this.logger.warn(
        `Document not found for deletion with filter: ${JSON.stringify(filter)}`,
      );
      throw new NotFoundException('Document not found for deletion');
    }
    return document;
  }
}
