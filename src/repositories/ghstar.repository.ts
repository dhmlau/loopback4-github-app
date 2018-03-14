import { DefaultCrudRepository, DataSourceType } from "@loopback/repository";
import {GHStars} from "../models";
import {inject} from '@loopback/core';

export class GHStarRepository extends DefaultCrudRepository<GHStars, typeof GHStars.prototype.id> 
{
    constructor(@inject('datasources.db') protected datasource: DataSourceType) {
        super(GHStars, datasource);
    }
}