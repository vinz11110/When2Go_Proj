async function createTrips(recommendations, userId, month, vacationType){
    const trips = await.Promise.all(
        recommendations.map(
            async recommendation => {
                const trip = trip.create({
                    user: userId,
                    destination: recommendation.city
                    startDate
                })
            }
        )
    )
}