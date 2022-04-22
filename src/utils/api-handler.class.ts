/* eslint-disable */
import type { ParsedQs } from 'qs'
import { Query } from 'mongoose'

export default class APIFeatures {
    constructor(
        public query: Query<any[], any, Record<string, any>, any>,
        private queryString: Record<
            string,
            string | ParsedQs | string[] | ParsedQs[] | undefined
        >
    ) {}

    filter(this: APIFeatures) {
        // Filtering
        let queryObj = { ...this.queryString }
        const filterFields = ['sort', 'limit', 'page', 'fields']
        filterFields.forEach(field => delete queryObj[field])

        // Complex Filtering
        const queryStr = JSON.stringify(queryObj)
        queryObj = JSON.parse(
            queryStr.replace(/\b(lt|lte|gt|gte)\b/g, match => `$${match}`)
        )

        this.query = this.query.find(queryObj)

        return this
    }

    sort(this: APIFeatures) {
        // Sorting
        let { sort: sortStr } = this.queryString
        if (sortStr) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            sortStr = sortStr.replace(/(,)/g, ' ')
            this.query = this.query.sort(sortStr)
        }
        return this
    }

    fields(this: APIFeatures) {
        // Fields
        let { fields: fieldsStr } = this.queryString
        if (fieldsStr) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            fieldsStr = fieldsStr.replace(/(,)/g, ' ')
            this.query = this.query.select(fieldsStr)
        } else {
            this.query = this.query.select('-__v')
        }
        return this
    }

    pagination(this: APIFeatures) {
        // Pagination
        const { page, limit } = this.queryString

        const pageNumber = page ? +page : 1
        const limitValue = limit ? +limit : 5

        this.query = this.query
            .skip((pageNumber - 1) * limitValue)
            .limit(limitValue)

        return this
    }
}
