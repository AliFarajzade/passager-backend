export type TTour = {
    slug: string
    secretTour: boolean
    rating: number
    averageRating: number
    ratingsQuantity: number
    maxGroupSize: number
    duration: number
    price: number
    images: string[]
    name: string
    difficulty: string
    summary: string
    description: string
    coverImage: string
    createdAt: Date
    startDates: Date[]
}
