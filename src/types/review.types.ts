import { TTour } from './tour.types'
import { TUser } from './user.types'

export type TReview = {
    review: string
    rating: number
    user: TUser
    tour: TTour
}
