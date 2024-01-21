import { Injectable } from '@pihe-core/common';
import { MongoClientService } from '@pihe-core/mongo-client';

@Injectable()
export class ExampleMongoService {
  constructor(private mongoClientService: MongoClientService) {}
}
