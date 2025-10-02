import { ObjectId } from 'mongodb';
import type { Document } from 'mongoose';

export interface MockDocument extends Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockModel<T extends MockDocument = any> {
  find(query?: any): Promise<T[]>;
  findOne(query: any): Promise<T | null>;
  findById(id: string): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  updateOne(query: any, update: any): Promise<{ modifiedCount: number }>;
  deleteOne(query: any): Promise<{ deletedCount: number }>;
}

export interface MockDB {
  connect(): Promise<void>;
  getModel<T extends MockDocument>(name: string): MockModel<T>;
}