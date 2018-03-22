import {Entity, property, model, DateType} from '@loopback/repository';
import {getJsonSchema, JsonDefinition} from '@loopback/repository-json-schema';

// Following the example in 
// https://github.com/strongloop/loopback-next/blob/master/packages/example-getting-started/src/models/todo.model.ts
// and
// https://strongloop.com/strongblog/loopback-4-json-schema-generation/
@model()
export class GHStars extends Entity {
    /*
     * making the id as generated
     */
    @property({
        id: true,
    })
    id?: number;

    @property({
        required: true,
    })
    org: string;

    @property({
        required: true,
    })
    repo: string;

    @property({
        required: true,
    })
    stars: number;

    @property({
        required: false,
        type: 'string',
        format: 'date'
    })
    countdate: Date;
};

export const GHStarsSchema = getJsonSchema(GHStars);